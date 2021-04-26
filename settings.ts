const getEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (!value || !value.length) throw new Error(`Unable to read "${key}" environment variable!`)
  return value
}

export const SETTINGS = {
  schedule: getEnvVariable('SCHEDULE'),
  caprover: {
    publicUrl: getEnvVariable('CAPROVER_URL'),
    password: getEnvVariable('CAPROVER_PASSWORD'),
    dirPath: '/captain',
    backupDirPath: '/home/caprover-config',
    appVolumePathPrefix: '/volumes/captain--',
  },
} as const