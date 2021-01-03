<template>
  <view>
    <search />
    <!-- tab栏 -->
    <view class="tabs">
      <view
        class="tabs_title"
        v-for="(item, index) in tabs"
        :key="item.id"
        :class="{ active: activeIndex === index }"
        @tap="changeTabsIndex(index)"
        >{{ item.name }}</view
      >
    </view>
    <scroll-view scroll-y class="goods" @scrolltolower="scrolltolowerHandle">
      <block v-for="item in goodsList" :key="item.goods_id">
        <goodsItem :item="item" />
      </block>
      <view class="no_more_tip" v-if="!hasMore">😀我也是有底线的...</view>
    </scroll-view>
  </view>
</template>

<script>
import goodsItem from '@/components/goodsItem/main'
import search from '@/components/search/main'
export default {
  components: {
    goodsItem,
    search,
  },
  data() {
    return {
      tabs: [
        { id: 1, name: '综合' },
        { id: 2, name: '销量' },
        { id: 3, name: '价格' },
      ],
      activeIndex: 0,
      options: {},
      pagenum: 1,
      pagesize: 10,
      goodsList: [],
      hasMore: true,
    }
  },
  onLoad(options) {
    this.options = options
    console.log('页面参数', options)
    this.getGoodsList()
  },
  methods: {
    //下拉刷新的页面回调函数
    async onPullDownRefresh() {
      this.goodsList = []
      this.hasMore = true
      this.pagenum = 1
      await this.getGoodsList()
      // 等上面请求结束后，结束掉下拉刷新的动画效果
      uni.stopPullDownRefresh()
    },

    changeTabsIndex(index) {
      this.activeIndex = index
    },

    scrolltolowerHandle() {
      console.log('滚动触底了')
      this.pagenum += 1
      this.getGoodsList()
    },

    async getGoodsList() {
      if (this.hasMore === false) {
        // uni.showToast({
        //   title: '没有更多数据了...',
        // })
        return
      }
      const { goods } = await this.$https.get('/goods/search', {
        params: {
          ...this.options,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      })
      console.log(goods)
      if (goods.length === 0) {
        this.hasMore = false
        uni.showToast({
          title: '没有更多数据了...',
        })
      } else {
        //赋值更新data中的goods数据，最终更新视图中的列表
        //旧数组和新数组连载一起
        this.goodsList = [...this.goodsList, ...goods]
      }
    },
  },
}
</script>

<style lang="less">
.tabs {
  display: flex;
  justify-content: space-evenly;
  .tabs_title {
    width: 184rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #676767;
    font-size: 30rpx;
    box-sizing: border-box;
  }
  .active {
    color: #3d3d3d;
    border-bottom: 3rpx #ea4350 solid;
    font-weight: 700;
  }
}
.goods {
  padding: 10rpx;
  height: calc(100vh - 100rpx - 88rpx);
  /* #ifdef H5 */
  height: calc(100vh - 100rpx - 88rpx - 44px);
  /* #endif */
}
.no_more_tip {
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
