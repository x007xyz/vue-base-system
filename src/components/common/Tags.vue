<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item,index) in tagsList"
        :class="{'active': isActive(item.path)}"
        :key="index"
      >
        <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
        <span class="tags-li-icon" @click="closeTags(item.path)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      // tagsList: []
    }
  },
  computed: {
    showTags () {
      return this.tagsList.length > 0
    },
    ...mapState(['tagsList'])
  },
  methods: {
    ...mapMutations(['setTagsList', 'closeTag']),
    isActive (path) {
      return path === this.$route.fullPath
    },
    // 关闭单个标签
    closeTags (path) {
      const index = this.tagsList.findIndex(tag => tag.path === path)
      this.closeTag(path)
      const item = this.tagsList[index] || this.tagsList[index - 1]
      if (item) {
        this.$router.push(item.path)
      } else {
        this.$router.push('/')
      }
    },
    // 关闭全部标签
    closeAll () {
      this.setTagsList([])
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther () {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.fullPath
      })
      this.setTagsList(curItem)
    },
    // 设置标签
    setTags (route) {
      const tagsList = [...this.tagsList]
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath
      })
      if (!isExist) {
        if (this.tagsList.length >= 8) {
          tagsList.shift()
        }
        tagsList.push({
          title: route.meta.title,
          path: route.fullPath
          /**
           * 获取组件名，然后在Layout使用keep-alive缓存，但是缓存会有问题
           * 同一个页面数据不会更新，而是保持缓存的数据
           * */
          // name: route.matched[1].components.default.name
        })
        this.setTagsList(tagsList)
      }
    },
    handleTags (command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    }
  },
  watch: {
    $route (newValue, oldValue) {
      this.setTags(newValue)
    }
  },
  created () {
    this.setTags(this.$route)
  }
}
</script>

<style>
.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
