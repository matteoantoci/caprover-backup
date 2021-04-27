import { schedule } from 'node-cron'
import { SETTINGS } from './settings'
import { CapRoverClient, createCapRoverClient } from './capRoverClient'
import { backup, initializeRepository } from './tasks'

const handleError = (err: Error) => {
  console.error(err)
  process.exit(1)
}

const start = async (client: CapRoverClient) => {
  console.info(`>>> Starting Caprover backup server...`)
  await initializeRepository()

  console.info(`>>> Scheduling backups at "${SETTINGS.schedule}"...`)
  schedule(SETTINGS.schedule, () => {
    backup(client).catch(handleError)
  })

  console.info('>>> Caprover backup server started!')
}

const client = createCapRoverClient(SETTINGS.caprover.publicUrl)
start(client).catch(handleError)
