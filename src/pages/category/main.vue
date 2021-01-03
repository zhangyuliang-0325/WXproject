<template>
  <!-- block空标签 -->
  <view>
    <search />
    <view class="cate">
      <scroll-view scroll-y class="cate_left">
        <view
          class="cate_left_item"
          v-for="(item, index) in cateLeft"
          :key="item.id"
          :class="{ active: activeIndex === index }"
          @tap="changeTabsIndex(index)"
          >{{ item.name }}</view
        >
      </scroll-view>
      <scroll-view scroll-y class="cate_right">
        <block v-for="item in cateRight" :key="item.cat_id">
          <view class="cate_right_title" v-if="item.children">{{
            item.cat_name
          }}</view>
          <view class="cate_right_list">
            <navigator
              :url="'/pages/goods_list/main?cid=' + item2.cat_id"
              v-for="item2 in item.children"
              :key="item2.cat_id"
              class="cate_right_item"
            >
              <image class="cate_right_item_image" :src="item2.cat_icon" />
              <text class="cate_right_item_text">{{ item2.cat_name }}</text>
            </navigator>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import search from '@/components/search/main'
//声明变量，用来存分类数据
let cateAll = []
export default {
  components: {
    search,
  },
  data() {
    return {
      cateLeft: [],
      cateRight: [],
      activeIndex: 0,
    }
  },
  onLoad() {
    // this.getcategories()
    cateAll = uni.getStorageSync('cateAll')

    if (!cateAll) {
      this.getcategories()
    } else {
      const nowTime = new Date()
      const endTime = uni.getStorageSync('cateAllEndTime')
      if (nowTime > endTime) {
        this.getcategories()
      } else {
        this.cateLeft = cateAll.map((item) => ({
          id: item.cat_id,
          name: item.cat_name,
        }))
        this.cateRight = cateAll[0].children
      }
    }
  },
  methods: {
    async getcategories() {
      cateAll = await this.$https.get('/categories')
      this.cateLeft = cateAll.map((item) => ({
        id: item.cat_id,
        name: item.cat_name,
      }))
      this.cateRight = cateAll[0].children
      uni.setStorageSync('cateAll', cateAll)
      const cateAllEndTime = +new Date() + 1 * 60 * 1000
      uni.setStorageSync(' cateAllEndTime', cateAllEndTime)
    },
    changeTabsIndex(index) {
      this.activeIndex = index
      //清空属猪，间接让滚动条初始化
      this.cateRight = []
      setTimeout(() => {
        this.cateRight = cateAll[index].children
      }, 20)
    },
  },
}
</script>

<style lang="less">
.cate {
  display: flex;
  .cate_left {
    width: 182rpx;
    // 视口总高度 - 搜索框高度 = 滚动容器高度
    height: calc(100vh - 100rpx);
    /* #ifdef H5 */
    //浏览器端:视口总高度-搜索框高度-头部导航高-底部tabBar高 = 滚动容器高度
    height: calc(100vh - 100rpx - 44px - 50px);
    /* #endif */
    .cate_left_item {
      font-size: 28rpx;
      height: 80rpx;
      line-height: 80rpx;
      display: flex;
      justify-content: center;
      align-self: start;
    }
    .active {
      position: relative;
      color: #ea4350;
      font-weight: 700;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 5rpx;
        top: 20rpx;
        bottom: 20rpx;
        background-color: #ea4350;
      }
    }
  }
  .cate_right {
    flex: 1;
    // 视口总高度 - 搜索框高度 = 滚动容器高度
    height: calc(100vh - 100rpx);
    .cate_right_title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      &::before,
      &::after {
        content: '/';
        color: #999;
        margin: 0 5rpx;
      }
    }
    .cate_right_list {
      display: flex;
      flex-wrap: wrap;
      .cate_right_item {
        width: 33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20rpx 0;
        .cate_right_item_image {
          width: 120rpx;
          height: 120rpx;
        }
        .cate_right_item_text {
          font-size: 22rpx;
        }
      }
    }
    /* #ifdef H5 */
    //浏览器端:视口总高度-搜索框高度-头部导航高-底部tabBar高 = 滚动容器高度
    height: calc(100vh - 100rpx - 44px - 50px);
    /* #endif */
  }
}
</style>
