export default {
  name: 'exhibitions',
  title: 'Exhibitions',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Exhibition Type',
      type: 'string',
      options: {
        list: [
          {title: 'Solo Exhibition', value: 'solo'},
          {title: 'Group Exhibition', value: 'group'},
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: {title?: string}) => doc.title,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required().min(Rule.valueOfField('startDate')),
    },
    {
      name: 'venue',
      title: 'Venue',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Venue Name',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          rows: 3,
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'location',
          title: 'Location',
          type: 'geopoint',
          rows: 3,
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'internationalizedArrayString',
              description: 'Important for accessibility and SEO',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'internationalizedArrayString',
            },
          ],
        },
      ],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      rows: 4,
    },
  ],
  preview: {
    select: {
      title: 'title',
      venueName: 'venue.name',
      media: 'photos.0',
    },
    prepare(selection: any) {
      const {title, venueName} = selection

      return {
        title,
        subtitle: venueName,
      }
    },
  },
}
