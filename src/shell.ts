import { exec } from 'child_process'

type ShellOutput = {
  stdout: string
  stderr: string
}

export const shellExec = (command: string): Promise<ShellOutput> =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => (error ? reject(error) : resolve({ stdout, stderr })))
  })

export const shellLog = ({ stdout, stderr }: ShellOutput) => {
  if (stdout.length) console.log(stdout)
  if (stderr.length) console.error(stderr)
}
