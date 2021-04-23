import createServer from 'fastify'
import { schedule } from 'node-cron'
import { getDirectories, shellExec, shellLog } from './shell'

const server = createServer({
  logger: true,
})

const cronExpression = process.env.RESTIC_CRON

if (!cronExpression) {
  server.log.error('"RESTIC_CRON" environment variable is not defined!')
  process.exit(1)
}

const getCaproverVolumeDirs = () => getDirectories('/volumes').filter(dir => dir.includes('captain--'))

const start = async () => {
  await shellExec('restic check').catch(async () => {
    await shellExec('restic init').then(shellLog)
  }).then(() => {
    server.log.info('Backup repository initialized.')
  })

  schedule(cronExpression, async () => {
    const volumeDirs = getCaproverVolumeDirs().join(' ')
    await shellExec(`restic backup ${volumeDirs}`).then(shellLog)
  })

  await server.listen(3000)
  server.log.info('Backup server started.')
}

start().catch((err) => {
  server.log.error(err)
  process.exit(1)
})