import { schedule } from 'node-cron'
import { getDirectories, shellExec, shellLog } from './shell'

const fastify = require('fastify')({
  logger: true
})

const cronExpression = process.env.RESTIC_CRON

if (!cronExpression) {
  fastify.log.error('"RESTIC_CRON" environment variable is not defined!')
  process.exit(1)
}

const start = async () => {
  await shellExec('restic check').catch(async () => {
    await shellExec('restic init').then(shellLog)
  }).then(() => {
    fastify.log.info('Backup repository initialized.')
  })

  schedule(cronExpression, async () => {
    const volumeDirs = getDirectories('/volumes').filter(dir => dir.includes('captain--')).join(' ')
    await shellExec(`restic backup ${volumeDirs}`).then(shellLog)
  });

  await fastify.listen(3000)
  fastify.log.info('Backup server started.')
}

start().catch((err) => {
  fastify.log.error(err)
  process.exit(1)
})