import { schedule } from 'node-cron'
import { SETTINGS } from './settings'
import { CapRoverClient, createCapRoverClient } from './capRoverClient'
import { backup, initializeRepository } from './tasks'
import { shellExec, shellLog } from './shell'

const exit = async (err: Error) => {
  console.error('❌ An unexpected error occurred!', err.stack)

  console.info('ℹ️  Exiting...')
  await shellExec('restic unlock')
    .then(shellLog)
    .catch((err) => {
      console.error('❌ Cannot remove repository locks', err.stack)
    })

  process.exit(1)
}

const startCronJob = (client: CapRoverClient) => {
  const cronExpression = SETTINGS.backup.cron
  schedule(cronExpression, () => {
    backup(client).catch(exit)
  })
  console.info(`✅ "${cronExpression}" cron started!`)
}

const start = async () => {
  console.info(`ℹ️ Starting CapRover backup server...`)

  await initializeRepository()

  startCronJob(createCapRoverClient(SETTINGS.capRover.publicUrl))

  console.info('✅ CapRover backup server started!')
}

start().catch(exit)
