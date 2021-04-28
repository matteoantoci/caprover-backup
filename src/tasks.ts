import { CapRoverClient } from './capRoverClient'
import { shellExec, shellLog } from './shell'
import { SETTINGS } from './settings'

const VOLUMES_TAG = 'volumes'

const backupVolumes = async (client: CapRoverClient) => {
  console.info(`ℹ️ Starting volumes backup...`)
  const activeVolumes = await client.getActiveVolumeNames()
  const volumeDirs = activeVolumes.map((it) => `${SETTINGS.capRover.appVolumePathPrefix}${it}`)

  if (volumeDirs.length) {
    await shellExec(`restic backup --verbose --tag ${VOLUMES_TAG} ${volumeDirs.join(' ')}`).then(shellLog)
  }

  console.info(`✅ Volumes backup completed successfully!`)
}

const CONFIG_TAG = 'config'

const backupConfig = async (client: CapRoverClient) => {
  console.info(`ℹ️ Starting config backup...`)

  await client.createBackup()

  const findResult = await shellExec(`find ${SETTINGS.capRover.dirPath} -name "*.tar" | sort -n | tail -1`)
  const backupTarFile = findResult.stdout.trim()
  if (!backupTarFile.length) {
    throw new Error('Could not find any CapRover *.tar file to backup!')
  }

  await shellExec(`mkdir -p ${SETTINGS.capRover.backupDirPath} && rm -rf ${SETTINGS.capRover.backupDirPath}/*`)
  await shellExec(`tar -xf ${backupTarFile} -C ${SETTINGS.capRover.backupDirPath}`)
  await shellExec(`rm -f ${backupTarFile}`)
  await shellExec(`restic backup --verbose --tag ${CONFIG_TAG} ${SETTINGS.capRover.backupDirPath}`).then(shellLog)

  console.info(`✅ Config backup completed successfully!`)
}

export async function initializeRepository() {
  console.info('ℹ️ Preparing backup repository...')

  await shellExec('restic snapshots')
    .catch(async () => {
      await shellExec('restic init').then(shellLog)
    })

  console.info('✅ Backup repository ready!')
}

export const backup = async (client: CapRoverClient) => {
  await backupVolumes(client)
  await backupConfig(client)

  if (SETTINGS.backup.duration) {
    await shellExec(`restic forget --tag ${VOLUMES_TAG},${CONFIG_TAG} --keep-within ${SETTINGS.backup.duration}`).then(
      shellLog
    )
  }

  await shellExec('restic check').then(shellLog)

  console.info(`✅ Backup finished successfully!`)
}
