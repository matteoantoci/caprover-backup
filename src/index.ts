import { schedule } from 'node-cron'
import exitHook from 'async-exit-hook'
import { SETTINGS } from './settings'
import { CapRoverClient, createCapRoverClient } from './capRoverClient'
import { backup, initializeRepository } from './tasks'

const handleExit = (callback: () => void) => {
  console.info('>>> Exiting...')
  callback()
}

const handleError = (err: Error, callback: () => void) => {
  console.error('>>> An unexpected error occurred!', err.stack)
  handleExit(callback)
}

exitHook(handleExit)
exitHook.uncaughtExceptionHandler(handleError)
exitHook.unhandledRejectionHandler(handleError)

const gracefulExit = (err: Error) =>
  handleError(err, () => {
    process.exit(1)
  })

const start = async (client: CapRoverClient) => {
  console.info(`>>> Starting Caprover backup server...`)
  await initializeRepository()

  const cronExpression = SETTINGS.backup.cron
  console.info(`>>> Scheduling backups at "${cronExpression}"...`)
  schedule(cronExpression, () => {
    backup(client).catch(gracefulExit)
  })

  console.info('>>> Caprover backup server started!')
}

const client = createCapRoverClient(SETTINGS.capRover.publicUrl)
start(client).catch(gracefulExit)
