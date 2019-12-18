<template>
  <div class="menu-item">
    <template v-if="item.subs">
      <el-submenu :index="item.name" :key="item.name">
        <template slot="title">
          <i v-if="item.icon" :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </template>
        <MenuItem v-for="subItem in item.subs" :key="subItem.index" :item="subItem"></MenuItem>
      </el-submenu>
    </template>
    <template v-else>
      <el-menu-item :index="item.name" :key="item.name" :route="{ name: item.name }">
        <i v-if="item.icon" :class="item.icon"></i>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
export default {
  components: { MenuItem: () => import('./MenuItem.vue') },
  name: 'MenuItem',
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="css">
/* 因为使用了div包含了组件导致原有的样式不生效，需要手动添加样式 */
.el-menu--collapse>.menu-item>.el-menu-item span, .el-menu--collapse>.menu-item>.el-submenu>.el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}
</style>
