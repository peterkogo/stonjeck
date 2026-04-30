import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  studioHost: 'stonjeck',
  api: {
    projectId: 'gc428fyp',
    dataset: 'production',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  deployment: {autoUpdates: true, appId: 'ja61innxjmj78wwfs0sp1txv'},
  typegen: {
    schema: 'schema.json',
    path: '../app/src/**/*.{ts,tsx,js,jsx}',
    generates: '../app/src/sanity.types.ts',
    overloadClientMethods: true,
  },
})
