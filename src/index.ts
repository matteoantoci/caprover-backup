import { schedule } from 'node-cron'
import { SETTINGS } from './settings'
import { CapRoverClient, createCapRoverClient } from './capRoverClient'
import { backup, initializeRepository } from './tasks'

const handleError = async (err: Error) => {
  console.error(err)
  process.exit(1)
}

const start = async (client: CapRoverClient) => {
  console.info(`>>> Starting Caprover backup server...`)
  await initializeRepository()

  const cronExpression = SETTINGS.backup.cron
  console.info(`>>> Scheduling backups at "${cronExpression}"...`)
  schedule(cronExpression, () => {
    backup(client).catch(handleError)
  })

  console.info('>>> Caprover backup server started!')
}

const client = createCapRoverClient(SETTINGS.capRover.publicUrl)
start(client).catch(handleError)
