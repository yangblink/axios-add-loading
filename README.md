# axios-add-loading

本库通过`axios`的[interceptors](https://github.com/axios/axios#interceptors)帮助你设置ajax请求中的loading

## 安装

```bash
npm i -S axios-add-loading
```

## 语法

```typescript
createAddLoadingInterceptor(
  axios: AxiosInstance,
  options: AxiosAddLoadingOptions
)
```

#### 参数
- `axios`: axios实例
- `options`: object类型参考[参数说明](#参数说明)

## 如何使用

```typescript
import createAddLoadingInterceptor from 'axios-add-loading'
import axios from 'axios'
const instance = axios.create()
const options = {
  showLoading: true,
  delEmpty: true,
  openLoading: () => { /* 打开loading方法 */},
  closeLoading: () => { /* 关闭loading方法 */},
  isResOk: res => { /* 对json进行过滤，返回boolean,满足条件的将会返回，参数为AxiosResponse.data */ },
  onResNotOk: res => { /* 只有设置了isResOk才会生效，对不满足isResOk的请求，将会触发onResNotOk的回掉， 参数为 AxiosResponse.data*/ },
  onResError: e => { /* ajax请求错误触发，如404，500等 */}
}
createAddLoadingInterceptor(instance, options)

instance({
  method: 'get',
  url: 'dir/xxx',
  params: { foo: 'bar' },
  // 这里可覆盖showLoading配置
  showLoading: false,
  // 这里可覆盖delEmpty配置
  delEmpty: false,
})
```

## 参数说明
#### delEmpty: boolean
是否删除 `get` 请求中 params 中为空的字段 `xxx/dir?a=&b=3` => `xxx/dir?b=3`
```javascript
delEmpty: true
```
#### showLoading: boolean
是否显示loading，需结合`openLoading`和`closeLoading`使用
```javascript
showLoading: true
```
#### openLoading: () => void
显示 loading 的方法, 拦截器发起请求前触发
```javascript
openLoading: () => { /* 打开loading方法 */}
```
#### closeLoading: () => void
隐藏 loading 的方法, 拦截器完成请求触发
```javascript
closeLoading: () => { /* 关闭loading方法 */}
```
#### isResOk: res => boolean
大多数情况下[response-schema](https://github.com/axios/axios#response-schema)只需要用到data,本方法主要过滤[response-schema](https://github.com/axios/axios#response-schema)参数res为其中的data,定义规则确定那些返回内容是符合`规则`的,如果未设置，拦截器将会返回[response-schema](https://github.com/axios/axios#response-schema)
```javascript
isResOk: res => res.code === 200
```
#### onResNotOk: res => void
只有设置了 `isResOk` 才会生效，对不符合isResOk的请求进行处理
```javascript
onResNotOk: res => {
  if (res.code === 401) {
    gotoLogin()
  }
}
```
#### onResError: e => void
e为[handling-errors](https://github.com/axios/axios#handling-errors), 对于请求异常的错误处理
```javascript
onResError: e => {
  if (e.response.status === 401) {
    gotoLogin()
  }
}
```
