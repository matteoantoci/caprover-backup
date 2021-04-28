import { schedule } from 'node-cron'
import { SETTINGS } from './settings'
import { CapRoverClient, createCapRoverClient } from './capRoverClient'
import { backup, initializeRepository } from './tasks'

const exit = (err: Error) => {
  console.error('>>> An unexpected error occurred!', err.stack)
  process.exit(1)
}

const startCronJob = (client: CapRoverClient) => {
  const cronExpression = SETTINGS.backup.cron
  schedule(cronExpression, () => {
    backup(client).catch(exit)
  })
  console.info(`>>> "${cronExpression}" cron started`)
}

const start = async () => {
  console.info(`>>> Starting Caprover backup server...`)

  await initializeRepository()

  startCronJob(createCapRoverClient(SETTINGS.capRover.publicUrl))

  console.info('>>> Caprover backup server started!')
}

start().catch(exit)
