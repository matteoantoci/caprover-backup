import { exec } from 'child_process'

type ShellOutput = {
  stdout: string
  stderr: string
}

export const shellExec = (command: string): Promise<ShellOutput> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      resolve({ stdout, stderr })
    })
  })
}

export const shellLog = (output: ShellOutput) => {
  console.log(output.stdout)
  console.log(output.stderr)
}
