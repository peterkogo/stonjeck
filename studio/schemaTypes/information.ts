export default {
  name: 'information',
  title: 'Information',
  type: 'document',
  options: {
    singleton: true,
  },
  fields: [
    {
      name: 'biography',
      title: 'Biography',
      type: 'internationalizedArrayString',
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
