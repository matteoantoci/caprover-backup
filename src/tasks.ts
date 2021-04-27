import { CaproverClient } from './caproverClient'
import { shellExec, shellLog } from './shell'
import { SETTINGS } from './settings'
import cuid from 'cuid'

const VOLUMES_TAG = 'volumes'

const backupVolumes = async (client: CaproverClient, backupId: string) => {
  console.info(`>>> Starting volumes backup...`)
  const activeVolumes = await client.getActiveVolumeNames()
  const volumeDirs = activeVolumes.map((it) => `${SETTINGS.caprover.appVolumePathPrefix}${it}`)

  if (volumeDirs.length) {
    await shellExec(`restic backup --verbose --tag ${VOLUMES_TAG} --tag ${backupId} ${volumeDirs.join(' ')}`).then(shellLog)
  }

  console.info(`>>> Volumes backup completed successfully!`)
}

const CONFIG_TAG = 'config'

const backupConfig = async (client: CaproverClient, backupId: string) => {
  console.info(`>>> Starting config backup...`)

  await client.createBackup()

  const findResult = await shellExec(`find ${SETTINGS.caprover.dirPath} -name "*.tar" | sort -n | tail -1`)
  const backupTarFile = findResult.stdout.trim()
  if (!backupTarFile.length) {
    throw new Error('>>> Could not find any Caprover *.tar file to backup!')
  }

  await shellExec(`mkdir -p ${SETTINGS.caprover.backupDirPath} && rm -rf ${SETTINGS.caprover.backupDirPath}/*`)
  await shellExec(`tar -xf ${backupTarFile} -C ${SETTINGS.caprover.backupDirPath}`)
  await shellExec(`rm -f ${backupTarFile}`)
  await shellExec(`restic backup --verbose --tag ${CONFIG_TAG} --tag ${backupId} ${SETTINGS.caprover.backupDirPath}`).then(shellLog)

  console.info(`>>> Config backup completed successfully!`)
}

export async function initializeRepository() {
  console.info('>>> Checking backup repository...')

  await shellExec('restic check')
    .then(shellLog)
    .catch(async () => {
      await shellExec('restic init').then(shellLog)
    })

  console.info('>>> Backup repository ready!')
}

export const backup = async (client: CaproverClient) => {
  console.info(`>>> Starting backup...`)

  const backupId = cuid()
  await backupVolumes(client, backupId)
  await backupConfig(client, backupId)
  await shellExec('restic check').then(shellLog)

  console.info(`>>> Backup finished successfully!`)
}
