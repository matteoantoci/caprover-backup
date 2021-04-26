const getEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (!value || !value.length) throw new Error(`Unable to read "${key}" environment variable!`)
  return value
}

export const SETTINGS = {
  env: {
    caproverBaseUrl: getEnvVariable('CAPROVER_URL'),
    caproverPassword: getEnvVariable('CAPROVER_PASSWORD'),
    schedule: getEnvVariable('SCHEDULE'),
  },
  caprover: {
    dirPath: '/caprover',
    backupDirPath: '/home/caprover-config',
    appVolumePathPrefix: '/volumes/captain--',
  },
} as const