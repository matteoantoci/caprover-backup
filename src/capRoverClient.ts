import Constants from 'caprover/src/utils/Constants'
import ApiManager from 'caprover/src/api/ApiManager'

export type CapRoverClient = {
  getActiveVolumeNames: () => Promise<string[]>
  createBackup: () => Promise<void>
  cleanUp: () => Promise<void>
}

type UnusedImages = {
  unusedImages: { id: string }[]
}

export const createCapRoverClient = (appUrl: string): CapRoverClient => {
  const apiManager = new ApiManager(appUrl + Constants.BASE_API_PATH, () => Promise.resolve())
  return {
    getActiveVolumeNames: async () =>
      apiManager.getAllApps().then((apps) =>
        apps.appDefinitions
          .flatMap((it: any) => it.volumes)
          .filter((it: any) => !!it.volumeName)
          .map((it: any) => it.volumeName)
      ),
    createBackup: async () => {
      await apiManager.callApi('/user/system/createbackup', 'POST', {})
    },
    cleanUp: async () => {
      const { unusedImages }: UnusedImages = await apiManager.getUnusedImages(2)
      await apiManager.deleteImages(unusedImages.map(it => it.id))
    },
  }
}
