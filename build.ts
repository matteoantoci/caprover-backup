import { build } from 'estrella'
import { SETTINGS } from './settings'

const ENV_VARIABLES = Object.entries({
  ...process.env,
  NODE_ENV: 'production',
  REACT_APP_DEFAULT_PASSWORD: SETTINGS.caproverPassword,
}).reduce((acc, [k, v]) => ({ ...acc, [`process.env.${k}`]: JSON.stringify(v) }), {})

const generateBuild = async () => {
  await build({
    entry: 'src/backup.ts',
    outfile: 'src/backup.js',
    define: ENV_VARIABLES,
    target: 'node14',
    platform: 'node',
    sourcemap: true,
    bundle: true,
    tslint: 'off',
  })
}

generateBuild().catch((e) => {
  console.error(e)
  process.exit(1)
})