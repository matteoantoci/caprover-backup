import createServer from 'fastify'
import { schedule } from 'node-cron'
import { getDirectories, shellExec, shellLog } from './shell'

const server = createServer()

const volumesSchedule = process.env.VOLUMES_SCHEDULE
if (!volumesSchedule) {
  console.error('"VOLUMES_SCHEDULE" environment variable is not defined!')
  process.exit(1)
}

const getCaproverVolumeDirs = () => getDirectories('/volumes').filter((dir) => dir.includes('captain--'))

const start = async () => {
  await shellExec('restic check')
    .catch(async () => {
      console.info('>>> Initializing backup repository...')
      await shellExec('restic init').then(shellLog)
    })
    .then(() => {
      console.info('>>> Backup repository initialized')
    })

  schedule(volumesSchedule, async () => {
    const volumeDirs = getCaproverVolumeDirs()
    if (!volumeDirs.length) return

    console.info(`>>> Backing up ${volumeDirs.length} volume(s)...`)
    await shellExec(`restic backup ${volumeDirs.join(' ')}`).then(shellLog)
    console.info(`>>> Done`)
  }).start()
  console.info(`>>> Volumes backup cronjob scheduled at "${volumesSchedule}"`)

  await server.listen(3000)
  console.info('>>> Backup server started... Enjoy =)')
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
