const getEnvVariable = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`Unable to read "${key}" environment variable!`)
  return value
}

export const SETTINGS = {
  volumesBaseDir: '/volumes',
  caproverBaseUrl: getEnvVariable('CAPROVER_URL'),
  caproverPassword: getEnvVariable('CAPROVER_PASSWORD'),
  volumesSchedule: getEnvVariable('VOLUMES_SCHEDULE'),
} as const