# Sanity CMS 설정 가이드

Super Learner 프로젝트에 Sanity Headless CMS를 설정하는 방법입니다.

## 1. Sanity 프로젝트 생성

```bash
# 1. Sanity CLI 설치 (전역)
npm install -g @sanity/cli

# 2. Sanity 프로젝트 생성
sanity init

# 선택 옵션:
# - Create new project: Yes
# - Project name: super-learner
# - Use default dataset: Yes (production)
# - Project output path: ./sanity (이미 있는 폴더 선택)
# - Template: Clean project with no predefined schemas
```

## 2. Sanity Studio 실행

```bash
# sanity 폴더로 이동
cd sanity

# 의존성 설치
npm install

# Studio 실행 (http://localhost:3333)
npm run dev
```

## 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# Sanity 설정
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01

# CMS 사용 활성화
VITE_USE_SANITY=true
```

> 프로젝트 ID는 [sanity.io/manage](https://sanity.io/manage)에서 확인할 수 있습니다.

## 4. 기존 데이터 마이그레이션 (선택)

기존 gameData.ts의 데이터를 Sanity로 마이그레이션:

```bash
# 1. Write 토큰 생성
# sanity.io/manage > API > Tokens > Add API Token (Editor 권한)

# 2. 환경 변수 설정
export SANITY_PROJECT_ID=your-project-id
export SANITY_TOKEN=your-write-token
export SANITY_DATASET=production

# 3. 마이그레이션 실행
npx ts-node scripts/migrate-to-sanity.ts
```

## 5. Studio에서 콘텐츠 관리

1. **게임 추가**: Studio에서 "Game" 문서 생성
2. **썸네일 업로드**: 권장 크기 400x280px (JPEG/WebP)
3. **Coming Soon 토글**: isComingSoon 필드로 게임 상태 관리

## 파일 구조

```
super-learner/
├── sanity/                    # Sanity Studio
│   ├── schemas/
│   │   ├── game.ts           # 게임 스키마
│   │   ├── learningTool.ts   # 학습도구 스키마
│   │   └── index.ts
│   ├── sanity.config.ts      # Studio 설정
│   └── package.json
│
├── src/
│   ├── lib/
│   │   ├── sanity.ts         # Sanity Client 설정
│   │   └── gameDataAdapter.ts # 데이터 변환 유틸
│   ├── hooks/
│   │   └── useSanityData.ts  # 데이터 패칭 훅
│   └── components/
│       └── GameCardEnhanced.tsx # CMS 지원 카드
```

## 개발 모드

CMS를 사용하지 않고 로컬 데이터로 개발:

```env
VITE_USE_SANITY=false
```

## 이미지 최적화

Sanity 이미지 URL 빌더 사용:

```tsx
import { urlFor } from '@/lib/sanity';

// 기본 사용
const imageUrl = urlFor(game.thumbnail).url();

// 크기 지정
const optimizedUrl = urlFor(game.thumbnail)
  .width(400)
  .height(280)
  .auto('format')  // WebP 자동 변환
  .url();
```

## GROQ 쿼리 예시

```groq
// 모든 게임 (카테고리별 정렬)
*[_type == "game"] | order(category asc, order asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  category,
  thumbnail,
  isComingSoon
}

// 활성화된 게임만
*[_type == "game" && isComingSoon != true]

// 특정 카테고리
*[_type == "game" && category == "SPEED"]
```

## 트러블슈팅

### CORS 에러
Sanity 대시보드에서 CORS Origin 추가:
- `http://localhost:5173` (개발)
- `https://your-domain.vercel.app` (배포)

### 이미지가 안 보임
1. 이미지가 업로드되었는지 확인
2. `gradientFallback` 필드에 폴백 그라데이션 설정

### 데이터가 안 불러와짐
1. 환경 변수 확인 (`VITE_` 접두사 필수)
2. 프로젝트 ID/데이터셋 확인
3. Sanity Vision에서 쿼리 테스트
