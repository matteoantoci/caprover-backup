import Constants from 'caprover/src/utils/Constants'
import ApiManager from 'caprover/src/api/ApiManager'

type CaproverClient = {
  getActiveVolumeNames: () => Promise<string[]>
}

export const createCaproverClient = (appUrl: string): CaproverClient => {
  const apiManager = new ApiManager(appUrl + Constants.BASE_API_PATH, () => Promise.resolve())
  return {
    getActiveVolumeNames: async () => {
      // await apiManager.getAllNodes().then(console.log)
      return apiManager.getAllApps().then((apps) =>
        apps.appDefinitions
          .flatMap((it: any) => it.volumes)
          .filter((it: any) => !!it.volumeName)
          .map((it: any) => it.volumeName)
      )
    },
  }
}
