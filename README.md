> 根据登录状态和用户的角色设置路由拦截是控制台的基本功能，本文主要是对这部分内容的总结，阅读这篇文章之后，你可以构建一个基本功能完整的控制台。

# 路由守卫

## 登录状态的处理
用户未登录时，拦截用户的所有路由，跳转登录页面，而在登录之后，用户不应该再进入登录页面，将页面重定向到首页
```javascript
Const whiteList = [‘/login’] // 使用白名单放置不登录也可以访问的页面，现在只有登录页
router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === ‘/login’) {
      next({ path: ‘/‘ })
    } else {
      next()
    }
  } else {
    if (whiteList) {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next('/login')
      }
    }
  }
})
```
![未登录拦截路由](https://user-gold-cdn.xitu.io/2019/12/19/16f1c0984c27c98f?w=1014&h=756&f=png&s=322874)
## 用户角色的处理
一般我们项目中不但要根据用户的登录状态限制路由，也存在根据用户角色限制路由的场景。
首先要在路由的meta中设置roles属性，roles设置为进入路由需要的用户角色，然后再在路由跳转时，添加用户角色的处理逻辑：
```javascript
const needRoles = to.meta && to.meta.roles && to.meta.roles.length > 0
  if (needRoles) {
    const hasRoles = store.state.user.roles.some(role => to.meta.roles.includes(role))
    if (hasRoles) {
      next()
    } else {
      next('/403')
    }
  } else {
    next()
  }
```
![](https://user-gold-cdn.xitu.io/2019/12/19/16f1c2dc57a04bc7?w=1014&h=746&f=png&s=319777)

# 菜单栏实现
不同角色的用户登录控制台，因为角色拥有的权限不同我们应该展示给用户不同的菜单，在实现路由守卫的时候，我们在路由的meta上通过设置roles属性限制了不同角色的权限，这个权限的限制与菜单栏的显示权限的限制应该是一致的。所以我们可以使用路由和获取的用户角色来生成菜单栏菜单。
```javascript
/**
 * 根据路由meta.role确定是否当前用户拥有访问权限
 * @roles 用户拥有角色
 * @route 待判定路由
 */
function hasPermission (roles, route) {
  // 如果当前路由有roles字段则需判断用户访问权限
  if (route.meta && route.meta.roles) {
    // 若用户拥有的角色中有被包含在待判定路由角色表中的则拥有访问权
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 没有设置roles则无需判定即可访问
    return true
  }
}

/**
 * 递归过滤AsyncRoutes路由表
 * @routes 待过滤路由表，首次传入的就是AsyncRoutes
 * @roles 用户拥有角色
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    // 复制一份
    const tmp = { ...route }
    // 如果用户有访问权则加入结果路由表
    if (hasPermission(roles, tmp)) {
      // 如果存在子路由则递归过滤之
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

filterAsyncRoutes(asyncRoutes, state.roles)
```
我们使用roles过滤生成新的路由后会发现，生成的路由直接作为菜单项还是存在一些问题，例如数据详情页面往往是不在菜单栏中展示的，所以过滤后的路由直接作为菜单项依旧不是很合适，所以需要再进行处理，通过路由的hidden属性再次进行过滤。
```javascript
const filterMenu = (route) => {
  const children = route.children ? route.children.filter(item => !item.hidden) : []
  if (children.length === 0) {
    return {
      icon: route.meta.icon, name: route.name, title: route.meta.title
    }
  }
  if (children.length === 1) {
    // 单只有一个子菜单的时候，子菜单会被提升
    return filterMenu(children[0])
  }
  if (children.length > 1) {
    return {
      icon: route.meta.icon, name: route.name, title: route.meta.title, subs: children.map(filterMenu)
    }
  }
}
```
# 请求处理
发送请求也是项目中必不可少的的功能，在项目中我们通常使用axios来发送请求，针对请求我们在请求发送之前和接受请求时进行处理。
```javascript
http.interceptors.request.use(
  config => {
    config.headers['token'] = getToken()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject(response)
    }
    // 处理状态码
    const data = response.data
    if (data.code === 10000) {
      // setToken(cookies)
      return data
    }
    // 1006为用户未登录
    if (data.code === 10006) {
      MessageBox.alert('登录状态异常，请重新登录', '确认登录信息', {
        confirmButtonText: '重新登录',
        type: 'warning',
        callback: () => {
          removeToken()
          router.replace({ name: 'login' })
        }
      })
      return Promise.reject(new Error(data))
    }
    // 其他错误码，提示信息并返回信息
    Message({
      message: data,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(new Error(data))
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
```
这里主要是对返回的结果进行处理，根据不同的错误类型进行分类处理，比较要代表性的是登录状态失效的处理，和其他错误不同，登录失效会直接让用户进入登录页面。
# 其他
1. 菜单栏的收起与展开：在store的state中添加collapse进行控制，在Header组件中根据页面宽度进行collapse的初始设置。
```javascript
if (document.body.clientWidth < 980) {
  this.$store.commit('changeCollapse', true)
}
```
2. 标签页的控制：标签页的标签页列表也放到store中，这样用户在页面里需要关闭标签页时，就可以调用方法进行关闭了。
