import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {singletonTools} from 'sanity-plugin-singleton-tools'
import {schemaTypes} from './schemaTypes'

// Extend the Sanity types to include the singleton option
declare module 'sanity' {
  interface BaseSchemaTypeOptions {
    singleton?: boolean
  }
}

export default defineConfig({
  name: 'default',
  title: 'stonjeck',

  projectId: 'gc428fyp',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    singletonTools(),
    internationalizedArray({
      languages: [
        {id: 'en', title: 'English'},
        {id: 'de', title: 'Deutsch'},
      ],
      fieldTypes: ['string', 'text'],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
