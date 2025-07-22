export default {
  name: 'information',
  title: 'Information',
  type: 'document',
  options: {
    singleton: true,
  },
  fields: [
    {
      name: 'titleImage',
      title: 'Title Image',
      type: 'reference',
      to: [{type: 'work'}],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'biography',
      title: 'Biography',
      type: 'internationalizedArrayText',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'impressum',
      title: 'Impressum',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
