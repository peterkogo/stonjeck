import {type InternationalizedArrayItem} from 'sanity-plugin-internationalized-array'

export default {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: {name?: InternationalizedArrayItem<string>[]}) => {
          const germanTitle = doc.name?.find((item: any) => item.language === 'de')?.value
          const englishTitle = doc.name?.find((item: any) => item.language === 'en')?.value
          return englishTitle || germanTitle || 'untitled'
        },
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'group',
      title: 'Group',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare(selection: {title?: InternationalizedArrayItem<string>[]}) {
      const {title} = selection
      // Get the German version if available, otherwise fall back to English
      const germanTitle = title?.find((item) => item.language === 'de')?.value
      const englishTitle = title?.find((item) => item.language === 'en')?.value
      return {
        title: germanTitle || englishTitle || 'Untitled',
      }
    },
  },
}
