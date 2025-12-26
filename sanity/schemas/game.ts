/**
 * game.ts
 * Sanity Schema: 두뇌 훈련 게임 문서 타입
 */

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'game',
  title: 'Game',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'media', title: 'Media' },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
    // ============================================
    // Basic Info
    // ============================================
    defineField({
      name: 'title',
      title: 'Game Title',
      type: 'string',
      description: 'The name of the game (e.g., "슐테 테이블 Lv.1")',
      group: 'basic',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short description of the game (1-2 sentences)',
      group: 'basic',
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Game category for grouping',
      group: 'basic',
      options: {
        list: [
          { title: 'Speed & Vision (속독 및 시야)', value: 'SPEED' },
          { title: 'Memory (기억력 강화)', value: 'MEMORY' },
          { title: 'Focus & Control (주의력 및 통제)', value: 'FOCUS' },
          { title: 'Logic & Math (논리 및 연산)', value: 'LOGIC' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'number',
      description: 'Game level (1 for basic, 2+ for advanced versions)',
      group: 'basic',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1).max(10),
    }),

    // ============================================
    // Media
    // ============================================
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      description: 'Game thumbnail (recommended: 400x300px, JPEG/WebP)',
      group: 'media',
      options: {
        hotspot: true, // Enable cropping/hotspot
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility',
        },
      ],
    }),
    defineField({
      name: 'gradientFallback',
      title: 'Gradient Fallback',
      type: 'string',
      description: 'Tailwind gradient classes if no thumbnail (e.g., "from-blue-500 to-indigo-500")',
      group: 'media',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name for the game card',
      group: 'media',
      options: {
        list: [
          { title: 'Grid3X3', value: 'Grid3X3' },
          { title: 'LayoutGrid', value: 'LayoutGrid' },
          { title: 'BookOpen', value: 'BookOpen' },
          { title: 'Zap', value: 'Zap' },
          { title: 'Brain', value: 'Brain' },
          { title: 'Grid2X2', value: 'Grid2X2' },
          { title: 'Images', value: 'Images' },
          { title: 'Type', value: 'Type' },
          { title: 'Hash', value: 'Hash' },
          { title: 'Layers', value: 'Layers' },
          { title: 'Search', value: 'Search' },
          { title: 'ArrowUpDown', value: 'ArrowUpDown' },
          { title: 'Palette', value: 'Palette' },
          { title: 'ArrowRight', value: 'ArrowRight' },
          { title: 'Eye', value: 'Eye' },
          { title: 'Calculator', value: 'Calculator' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // ============================================
    // Meta
    // ============================================
    defineField({
      name: 'route',
      title: 'Route Path',
      type: 'string',
      description: 'Frontend route path (e.g., "/game/schulte-table")',
      group: 'meta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isComingSoon',
      title: 'Coming Soon',
      type: 'boolean',
      description: 'Show "Coming Soon" badge and disable the game',
      group: 'meta',
      initialValue: true,
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'number',
      description: 'Difficulty level (1-5 stars)',
      group: 'meta',
      options: {
        list: [
          { title: '1 Star (Very Easy)', value: 1 },
          { title: '2 Stars (Easy)', value: 2 },
          { title: '3 Stars (Medium)', value: 3 },
          { title: '4 Stars (Hard)', value: 4 },
          { title: '5 Stars (Very Hard)', value: 5 },
        ],
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'estimatedTime',
      title: 'Estimated Time',
      type: 'string',
      description: 'Estimated play time (e.g., "3분", "5분")',
      group: 'meta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order within category (lower = first)',
      group: 'meta',
      initialValue: 100,
    }),
  ],

  // Preview configuration
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'thumbnail',
      isComingSoon: 'isComingSoon',
    },
    prepare({ title, subtitle, media, isComingSoon }) {
      const categoryNames: Record<string, string> = {
        SPEED: '속독 및 시야',
        MEMORY: '기억력 강화',
        FOCUS: '주의력 및 통제',
        LOGIC: '논리 및 연산',
      };
      return {
        title: isComingSoon ? `🚧 ${title}` : title,
        subtitle: categoryNames[subtitle] || subtitle,
        media,
      };
    },
  },

  // Ordering
  orderings: [
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
