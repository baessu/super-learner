/**
 * useGameStore.ts
 * 전역 게임 상태를 관리하는 Zustand 스토어
 * - 총 점수, 현재 게임 상태, 게임 세션 정보 등을 관리
 * - 게임 플레이 히스토리 저장
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// 게임 상태 타입 정의
type GameStatus = 'idle' | 'playing' | 'paused' | 'finished';

interface GameSession {
  gameId: string;
  score: number;
  startedAt: Date | null;
  finishedAt: Date | null;
}

// 게임 히스토리 항목 타입
export interface GameHistoryEntry {
  id: string; // 고유 ID
  gameId: string;
  score: number;
  playedAt: string; // ISO 문자열 (Date는 직렬화 문제)
}

interface GameState {
  // 상태
  totalScore: number;
  bestScores: Record<string, number>; // 게임별 최고 기록
  gameHistory: GameHistoryEntry[]; // 게임 플레이 히스토리
  currentGameId: string | null;
  gameStatus: GameStatus;
  currentSession: GameSession | null;

  // 액션
  setCurrentGame: (gameId: string) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  finishGame: (score: number) => void;
  addScore: (points: number) => void;
  resetSession: () => void;
  resetAllProgress: () => void;
  getBestScore: (gameId: string) => number | null;
  clearHistory: () => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        totalScore: 0,
        bestScores: {},
        gameHistory: [],
        currentGameId: null,
        gameStatus: 'idle',
        currentSession: null,

        // 현재 게임 설정
        setCurrentGame: (gameId: string) => {
          set({
            currentGameId: gameId,
            gameStatus: 'idle',
            currentSession: {
              gameId,
              score: 0,
              startedAt: null,
              finishedAt: null,
            },
          });
        },

        // 게임 시작
        startGame: () => {
          const { currentSession } = get();
          if (!currentSession) return;

          set({
            gameStatus: 'playing',
            currentSession: {
              ...currentSession,
              startedAt: new Date(),
            },
          });
        },

        // 게임 일시정지
        pauseGame: () => {
          set({ gameStatus: 'paused' });
        },

        // 게임 재개
        resumeGame: () => {
          set({ gameStatus: 'playing' });
        },

        // 게임 종료 및 점수 반영
        finishGame: (score: number) => {
          const { currentSession, totalScore, bestScores, gameHistory } = get();
          if (!currentSession) return;

          const gameId = currentSession.gameId;
          const currentBest = bestScores[gameId] ?? 0;
          const newBestScores = {
            ...bestScores,
            [gameId]: Math.max(currentBest, score),
          };

          // 히스토리에 추가 (최대 50개 유지)
          const newEntry: GameHistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            gameId,
            score,
            playedAt: new Date().toISOString(),
          };
          const newHistory = [newEntry, ...gameHistory].slice(0, 50);

          set({
            gameStatus: 'finished',
            totalScore: totalScore + score,
            bestScores: newBestScores,
            gameHistory: newHistory,
            currentSession: {
              ...currentSession,
              score,
              finishedAt: new Date(),
            },
          });
        },

        // 점수 추가 (게임 중 실시간 점수 업데이트용)
        addScore: (points: number) => {
          const { currentSession } = get();
          if (!currentSession) return;

          set({
            currentSession: {
              ...currentSession,
              score: currentSession.score + points,
            },
          });
        },

        // 현재 세션 초기화
        resetSession: () => {
          set({
            currentGameId: null,
            gameStatus: 'idle',
            currentSession: null,
          });
        },

        // 전체 진행상황 초기화
        resetAllProgress: () => {
          set({
            totalScore: 0,
            bestScores: {},
            gameHistory: [],
            currentGameId: null,
            gameStatus: 'idle',
            currentSession: null,
          });
        },

        // 히스토리만 초기화
        clearHistory: () => {
          set({
            totalScore: 0,
            gameHistory: [],
          });
        },

        // 특정 게임의 최고 기록 조회
        getBestScore: (gameId: string) => {
          const { bestScores } = get();
          return bestScores[gameId] ?? null;
        },
      }),
      {
        name: 'super-learner-storage', // localStorage 키
        partialize: (state) => ({
          totalScore: state.totalScore,
          bestScores: state.bestScores,
          gameHistory: state.gameHistory, // 히스토리 영구 저장
        }),
      }
    ),
    { name: 'GameStore' }
  )
);
