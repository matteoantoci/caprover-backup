import createServer from 'fastify'
import { shellExec, shellLog } from './shell'
import { scheduleVolumesBackup } from './volumesBackup'
import { SETTINGS } from '../settings'

const server = createServer()

async function initializeRepository() {
  await shellExec('restic check')
    .catch(async () => {
      console.info('>>> Initializing backup repository...')
      await shellExec('restic init').then(shellLog)
    })
    .then(() => {
      console.info('>>> Backup repository initialized')
    })
}

const start = async () => {
  console.info('>>> Starting Caprover backup server...')
  await initializeRepository()
  await scheduleVolumesBackup(SETTINGS.volumesSchedule)
  await server.listen(3000)
  console.info('>>> Backup server started... Enjoy =)')
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
