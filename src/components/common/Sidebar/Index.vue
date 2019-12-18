<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="$store.state.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <MenuItem v-for="item in menus" :key="item.name" :item="item">
            </MenuItem>
        </el-menu>
    </div>
</template>

<script>
/**
 * 需要处理三种情况：
 * 1. 没有children
 * 2. children的长度为1
 * 3. children的长度大于1
 */
const filterMenu = (route) => {
  const children = route.children ? route.children.filter(item => !item.hidden) : []
  if (children.length === 0) {
    return {
      icon: route.meta.icon, name: route.name, title: route.meta.title
    }
  }
  if (children.length === 1) {
    // 单只有一个子菜单的时候，子菜单会被提升并且使用父菜单的icon
    return filterMenu(children[0])
  }
  if (children.length > 1) {
    return {
      icon: route.meta.icon, name: route.name, title: route.meta.title, subs: children.map(filterMenu)
    }
  }
}
export default {
  components: { MenuItem: () => import('./MenuItem.vue') },
  computed: {
    menus () {
      return (this.$store.getters.asyncRoutes || []).filter(({ hidden }) => {
        return !hidden
      }).map(route => {
        return filterMenu(route)
      })
    },
    onRoutes () {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
