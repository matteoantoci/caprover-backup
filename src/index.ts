import { schedule } from 'node-cron'
import { SETTINGS } from '../settings'
import { CaproverClient, createCaproverClient } from './caproverClient'
import { backup, initializeRepository } from './tasks'

const start = async (client: CaproverClient) => {
  console.info(`>>> Starting Caprover backup server...`)
  await initializeRepository()

  console.info(`>>> Scheduling backups at "${SETTINGS.schedule}"...`)
  schedule(SETTINGS.schedule, () => {
    backup(client)
  })

  console.info('>>> Caprover backup server started!')
}

const client = createCaproverClient(SETTINGS.caprover.publicUrl)

start(client).catch((err) => {
  console.error(err)
  process.exit(1)
})
