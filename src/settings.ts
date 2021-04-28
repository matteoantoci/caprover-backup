const getOptionalEnvVariable = (key: string): string | null => {
  const value = process.env[key]
  if (!value || !value.length) return null
  return value
}

const getRequiredEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (!value || !value.length) throw new Error(`Unable to read "${key}" required env variable!`)
  return value
}

export const SETTINGS = {
  backup: {
    cron: getRequiredEnvVariable('BACKUP_CRON'),
    duration: getOptionalEnvVariable('BACKUP_DURATION'),
  },
  capRover: {
    publicUrl: getRequiredEnvVariable('CAP_ROVER_URL'),
    password: getRequiredEnvVariable('CAP_ROVER_PASSWORD'),
    dirPath: '/captain',
    backupDirPath: '/home/cap-rover-config',
    appVolumePathPrefix: '/volumes/captain--',
  },
} as const