import { CaproverClient } from './caproverClient'
import { shellExec, shellLog } from './shell'
import { SETTINGS } from '../settings'

const VOLUMES_TAG = 'volumes'

const backupVolumes = async (client: CaproverClient) => {
  console.info(`>>> Starting volumes backup...`)
  const activeVolumes = await client.getActiveVolumeNames()
  const volumeDirs = activeVolumes.map((it) => `${SETTINGS.caprover.appVolumePathPrefix}${it}`)

  if (volumeDirs.length) {
    const out = await shellExec(`restic backup --verbose --tag ${VOLUMES_TAG} ${volumeDirs.join(' ')}`)
    shellLog(out)
  }

  console.info(`>>> Volumes backup completed successfully!`)
}

const CONFIG_TAG = 'config'

const backupConfig = async (client: CaproverClient) => {
  console.info(`>>> Starting config backup...`)

  await client.createBackup()

  const findOut = await shellExec(`find ${SETTINGS.caprover.dirPath} -type f -iname "*.tar" -printf "%p\\n" | sort -n | tail -1`)
  shellLog(findOut) // TODO: remove
  const backupTarFile = findOut.stdout
  if (!backupTarFile.length) {
    throw new Error('>>> Could not find any Caprover *.tar file to backup!')
  }

  await shellExec(`mkdir -p ${SETTINGS.caprover.backupDirPath} && rm -rf ${SETTINGS.caprover.backupDirPath}/*`)
  await shellExec(`tar -xf ${backupTarFile} -C ${SETTINGS.caprover.backupDirPath}`)

  const out = await shellExec(`restic backup --verbose --tag ${CONFIG_TAG} ${SETTINGS.caprover.backupDirPath}`)
  shellLog(out)

  console.info(`>>> Config backup completed successfully!`)
}

export async function initializeRepository() {
  console.info('>>> Checking backup repository...')

  await shellExec('restic check').catch(async () => {
    await shellExec('restic init').then(shellLog)
  })

  console.info('>>> Backup repository ready!')
}

export const backup = async (client: CaproverClient) => {
  console.info(`>>> Starting backup...`)

  await backupVolumes(client)
  await backupConfig(client)
  await shellExec('restic check')

  console.info(`>>> Backup finished successfully!`)
}