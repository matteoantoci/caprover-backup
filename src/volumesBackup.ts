import { schedule } from 'node-cron'
import { shellExec, shellLog } from './shell'
import { createCaproverClient } from './caproverClient'
import { SETTINGS } from '../settings'

const client = createCaproverClient(SETTINGS.caproverBaseUrl)

const getCaproverVolumeDirs = async () => {
  const activeVolumes = await client.getActiveVolumeNames()
  return activeVolumes.map((it) => `/volumes/captain--${it}`)
}

export const scheduleVolumesBackup = (volumesSchedule: string) => {
  schedule(volumesSchedule, async () => {
    try {
      const volumeDirs = await getCaproverVolumeDirs()
      if (!volumeDirs.length) return

      console.info(`>>> Backing up ${volumeDirs.length} volume(s)...`)
      await shellExec(`restic backup --tag volumes ${volumeDirs.join(' ')}`).then(shellLog)
      await shellExec(`restic snapshots`).then(shellLog)
      console.info(`>>> Done`)
    } catch (e) {
      console.error('>>> Could not backup volumes!')
      console.error(e)
    }
  }).start()

  console.info(`>>> Volumes backup cronjob scheduled at "${volumesSchedule}"`)
}