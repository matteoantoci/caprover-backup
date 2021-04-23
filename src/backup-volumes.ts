import { schedule } from 'node-cron'
import { getDirectories, shellExec, shellLog } from './shell'

const cronExpression = process.env.RESTIC_CRON

if (!cronExpression) {
  console.error('"RESTIC_CRON" environment variable is not defined!')
  process.exit(1)
}

const start = async () => {
  await shellExec('restic check').catch(async () => {
    await shellExec('borg init').then(shellLog)
  }).then(() => {
    console.info('Backup repository initialized.')
  })

  schedule(cronExpression, async () => {
    const volumeDirs = getDirectories('/volumes').filter(dir => dir.includes('captain--')).join(' ')
    await shellExec(`restic backup ${volumeDirs}`).then(shellLog)
  });

  console.info('Backup server started.')
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})