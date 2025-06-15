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
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      startDate: 'startDate',
      venueName: 'venue.name',
      media: 'photos.0',
    },
    prepare(selection: any) {
      const {title, type, startDate, venueName, media} = selection
      // Get the German version if available, otherwise fall back to English
      const germanTitle = title?.find((item: any) => item._key === 'de')?.value
      const englishTitle = title?.find((item: any) => item._key === 'en')?.value
      const germanVenueName = venueName?.find((item: any) => item._key === 'de')?.value
      const englishVenueName = venueName?.find((item: any) => item._key === 'en')?.value

      const displayTitle = germanTitle || englishTitle || 'Untitled'
      const displayVenue = germanVenueName || englishVenueName || ''
      const displayType = type === 'solo' ? 'Solo' : 'Group'
      const displayDate = startDate ? new Date(startDate).getFullYear() : ''

      return {
        title: displayTitle,
        subtitle:
          `${displayType} Exhibition ${displayDate ? `(${displayDate})` : ''} ${displayVenue ? `at ${displayVenue}` : ''}`.trim(),
        media: media,
      }
    },
  },
}
