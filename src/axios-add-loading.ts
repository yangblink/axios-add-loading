import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
interface AxiosAddLoadingRequestConfig extends AxiosRequestConfig {
  delEmpty?: boolean,
  showLoading?: boolean,
}
interface AxiosAddLoadingOptions {
  showLoading ?: boolean
  delEmpty ?: boolean
  openLoading ?: () => void
  closeLoading ?: () => void
  isResOk ?: (res: any) => boolean
  onResNotOk ?: (res: any) => any
  onResError ?: (e: any) => any
}
function shouldOpenLoading (isShowLoading: boolean, options: AxiosAddLoadingOptions, count: number): number {
  if (isShowLoading && options.openLoading && options.closeLoading) {
    count++
    if (count === 1) {
      options.openLoading()
    }
  }
  return count
}
function shouldCloseLoading (isShowLoading: boolean, options: AxiosAddLoadingOptions, count: number): number {
  if (isShowLoading && options.openLoading && options.closeLoading) {
    count--
    if (count === 0) {
      options.closeLoading()
    }
  }
  return count
}
function delEmptyFn (obj: any): any {
  for (let p in obj) {
    let v:any = obj[p]
    if (v === '' || v === undefined || v === null) {
      delete obj[p]
    }
    if (typeof v === 'string') {
      v = v.trim()
    }
  }
  return obj
}
export default function createAddLoadingInterceptor (
  instance: AxiosInstance,
  options: AxiosAddLoadingOptions
): AxiosInstance {
  let showLoading = options.showLoading || false
  let delEmpty = options.delEmpty || false
  let count: number = 0
  instance.interceptors.request.use((config: AxiosAddLoadingRequestConfig): AxiosAddLoadingRequestConfig => {
    const isShowLoading = typeof config.showLoading === 'boolean' ? config.showLoading : showLoading
    const isDelEmpty = typeof config.delEmpty === 'boolean' ? config.delEmpty : delEmpty
    count = shouldOpenLoading(isShowLoading, options, count)
    if (isDelEmpty && config.params) {
      config.params = delEmptyFn(config.params)
    }
    return config
  })
  instance.interceptors.response.use((axRes: AxiosResponse): Promise<any>  => {
    const res: any = axRes.data
    const config: AxiosAddLoadingRequestConfig = axRes.config
    const isShowLoading = typeof config.showLoading === 'boolean' ? config.showLoading : showLoading
    count = shouldCloseLoading(isShowLoading, options, count)
    if (options.isResOk) {
      if (options.isResOk(res)) {
        return Promise.resolve(res)
      } else {
        options.onResNotOk && options.onResNotOk(res)
        return Promise.reject(res)
      }
    } else {
      return Promise.resolve(axRes)
    }
  }, (error: any): Promise<any> => {
    const config: AxiosAddLoadingRequestConfig = error.config
    const isShowLoading: boolean = config.showLoading || showLoading || false
    count = shouldCloseLoading(isShowLoading, options, count)
    if (options.onResError) {
      options.onResError(error)
    }
    return Promise.reject(error)
  })
  return instance
}

