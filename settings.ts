const getEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (!value || !value.length) throw new Error(`Unable to read "${key}" environment variable!`)
  return value
}

export const SETTINGS = {
  volumesBaseDir: '/volumes',
  caproverBaseUrl: getEnvVariable('CAPROVER_URL'),
  caproverPassword: getEnvVariable('CAPROVER_PASSWORD'),
  schedule: getEnvVariable('VOLUMES_SCHEDULE'), // TODO: rename to SCHEDULE
} as const