export default {
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    {
      name: 'hidden',
      title: 'Hide',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
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
        source: (doc: {title?: Array<{_key: string; language: string; value: string}>}) => {
          const germanTitle = doc.title?.find((item: any) => item.language === 'de')?.value
          const englishTitle = doc.title?.find((item: any) => item.language === 'en')?.value
          return germanTitle || englishTitle || 'untitled'
        },
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'medium',
      title: 'Medium',
      type: 'reference',
      to: [{type: 'medium'}],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'e.g., "100x170 cm" or "24x36 inches"',
      validation: (Rule: any) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Date, Newest',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Date, Oldest',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image',
    },
    prepare(selection: any) {
      const {title, subtitle, media} = selection
      // Get the German version if available, otherwise fall back to English
      const germanTitle = title?.find((item: any) => item.language === 'de')?.value
      const englishTitle = title?.find((item: any) => item.language === 'en')?.value
      return {
        title: germanTitle || englishTitle || 'Untitled',
        subtitle: subtitle,
        media: media,
      }
    },
  },
}
