/**
 * sanity.config.ts
 * Sanity Studio 설정 파일
 *
 * Sanity Studio를 실행하려면:
 * 1. sanity 폴더로 이동: cd sanity
 * 2. 스튜디오 실행: npx sanity dev
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'Super Learner CMS',

  projectId: '8xz5ndzn',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(), // GROQ 쿼리 테스트용
  ],

  schema: {
    types: schemaTypes,
  },
});
