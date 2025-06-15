export default {
  name: 'medium',
  title: 'Medium',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare(selection: any) {
      const {title} = selection
      // Get the German version if available, otherwise fall back to English
      const germanTitle = title?.find((item: any) => item._key === 'de')?.value
      const englishTitle = title?.find((item: any) => item._key === 'en')?.value
      return {
        title: germanTitle || englishTitle || 'Untitled',
      }
    },
  },
}
