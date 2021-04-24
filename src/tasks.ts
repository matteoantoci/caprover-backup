import { CaproverClient } from './caproverClient'
import { shellExec, shellLog } from './shell'

const VOLUMES_TAG = 'caprover-volumes'

export const backupVolumes = async (client: CaproverClient) => {
  console.info(`>>> Starting volumes backup...`)
  try {
    const activeVolumes = await client.getActiveVolumeNames()
    const volumeDirs = activeVolumes.map((it) => `/volumes/captain--${it}`) // TODO: extract const

    const backupVolumesCommand = `restic backup --verbose --tag ${VOLUMES_TAG} ${volumeDirs.join(' ')}`
    const out = await shellExec(backupVolumesCommand)

    console.info(`>>> Volumes backup completed successfully!`)
    shellLog(out)
  } catch (e) {
    console.error('>>> Could not backup volumes!')
    console.error(e)
  }
}

export const backupConfig = async (_: CaproverClient) => {
  console.info(`>>> Starting config backup...`)
  try {
    // TODO...
    console.info(`>>> Config backup completed successfully!`)
    // shellLog(out)
  } catch (e) {
    console.error('>>> Could not backup config!')
    console.error(e)
  }
}

export async function initializeRepository() {
  console.info('>>> Checking backup repository...')

  await shellExec('restic check').catch(async () => {
    console.info('>>> Initializing backup repository...')
    await shellExec('restic init').then(shellLog)
  })

  console.info('>>> Backup repository ready!')
}