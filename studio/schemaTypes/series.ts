export default {
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: {title?: Array<{_key: string; value: string}>}) => {
          const germanTitle = doc.title?.find((item: any) => item._key === 'de')?.value
          const englishTitle = doc.title?.find((item: any) => item._key === 'en')?.value
          return germanTitle || englishTitle || 'untitled'
        },
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      rows: 4,
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule: any) => Rule.required().integer().positive(),
    },
    {
      name: 'works',
      title: 'Works',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'work'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
    },
    prepare(selection: any) {
      const {title, subtitle} = selection
      // Get the German version if available, otherwise fall back to English
      const germanTitle = title?.find((item: any) => item._key === 'de')?.value
      const englishTitle = title?.find((item: any) => item._key === 'en')?.value
      return {
        title: germanTitle || englishTitle || 'Untitled',
        subtitle: subtitle,
      }
    },
  },
}
