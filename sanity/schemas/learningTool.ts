/**
 * learningTool.ts
 * Sanity Schema: 학습 도구 문서 타입
 */

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'learningTool',
  title: 'Learning Tool',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tool Title',
      type: 'string',
      description: 'The name of the tool (e.g., "기억술 변환기")',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
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
      description: 'Short description of the tool',
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      description: 'Tool thumbnail (recommended: 400x300px)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'gradientFallback',
      title: 'Gradient Fallback',
      type: 'string',
      description: 'Tailwind gradient classes if no thumbnail',
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji Icon',
      type: 'string',
      description: 'Emoji to display on the card',
      validation: (Rule) => Rule.required().max(4),
    }),
    defineField({
      name: 'route',
      title: 'Route Path',
      type: 'string',
      description: 'Frontend route path (e.g., "/tools/major-system")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isComingSoon',
      title: 'Coming Soon',
      type: 'boolean',
      description: 'Show "Coming Soon" badge',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in the list (lower = first)',
      initialValue: 100,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'thumbnail',
      emoji: 'emoji',
      isComingSoon: 'isComingSoon',
    },
    prepare({ title, subtitle, media, emoji, isComingSoon }) {
      return {
        title: isComingSoon ? `🚧 ${emoji} ${title}` : `${emoji} ${title}`,
        subtitle,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Order',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
