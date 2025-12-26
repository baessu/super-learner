/**
 * PhaseIndicator.tsx
 * 드롭 세트 모드의 Sprint/Normal 상태 표시
 */

import { motion } from 'framer-motion';
import { Zap, Wind } from 'lucide-react';
import type { DropSetPhase } from '../types';
import { THEME } from '../constants';

interface PhaseIndicatorProps {
  phase: DropSetPhase;
}

export function PhaseIndicator({ phase }: PhaseIndicatorProps) {
  const isSprint = phase === 'sprint';

  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm"
      animate={{
        backgroundColor: isSprint ? THEME.sprint : THEME.normal,
        scale: isSprint ? [1, 1.05, 1] : 1,
      }}
      transition={{
        backgroundColor: { duration: 0.3 },
        scale: { repeat: isSprint ? Infinity : 0, duration: 0.5 },
      }}
    >
      {isSprint ? (
        <>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
          <span>SPRINT</span>
        </>
      ) : (
        <>
          <Wind className="w-4 h-4" />
          <span>NORMAL</span>
        </>
      )}
    </motion.div>
  );
}
