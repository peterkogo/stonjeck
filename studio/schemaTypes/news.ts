export default {
  name: 'news',
  title: 'News',
  type: 'document',
  options: {
    singleton: true,
  },
  preview: {
    prepare() {
      return {title: 'news'}
    },
  },
  fields: [
    {
      name: 'works',
      title: 'Works',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'work'}]}],
    },
    {
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'exhibitions'}]}],
    },
  ],
}
