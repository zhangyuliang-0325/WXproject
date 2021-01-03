<template>
  <view>
    <search />
    <swiper
      class="swiper"
      indicator-dots
      indicator-active-color="#EA4350"
      autoplay
      circular
      :interval="2500"
      indicator-color="rgba(255,255,255,.5)"
    >
      <swiper-item v-for="item in swiperData" :key="item.goods_id">
        <image :src="item.image_src" mode="" class="swiper_image" />
      </swiper-item>
    </swiper>
    <!-- 入口导航 -->
    <view class="entry">
      <navigator
        v-for="item in entryData"
        :key="item.name"
        class="entry_item"
        :open-type="item.open_type"
        :url="item.navigator_url"
      >
        <image :src="item.image_src" class="entry_item_image" />
      </navigator>
    </view>
    <!-- 楼层 -->
    <view class="floor" v-for="(item, index) in floorData" :key="index">
      <view class="floor_title">
        <image :src="item.floor_title.image_src" class="floor_title_image" />
      </view>
      <!-- 图片处理成统计，方便后期列表渲染 -->
      <view class="floor_list">
        <navigator
          v-for="item2 in item.product_list"
          :key="item2.name"
          :url="item2.open_type"
          class="floor_list_item"
          :open-type="item2.open_type"
        >
          <image
            :src="item2.image_src"
            class="floor_list_image"
            :style="'width:' + item2.image_width + 'rpx'"
          />
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
import search from '@/components/search/main'
export default {
  components: {
    search,
  },
  data() {
    return {
      swiperData: [],
      entryData: [],
      floorData: [],
    }
  },
  onLoad() {
    this.getSwiperData()
    this.getEntryData()
    this.getFloorData()
  },
  methods: {
    //发送网络请求用url.request()
    async getSwiperData() {
      //v1.0版 发送请求
      // uni.request({
      //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata', //仅为示例，并非真实接口地址。
      //   success: (res) => {
      //     const { meta, message } = res.data
      //     if (meta.status === 200) {
      //       this.swiperData = message
      //     } else {
      //       console.log('请求失败')
      //     }
      //   },
      // })

      //v2.0版 化简请求地址
      // this.$https.get('/home/swiperdata').then((res) => {
      //   const { meta, message } = res.data
      //   if (meta.status === 200) {
      //     this.swiperData = message
      //   } else {
      //     console.log('请求失败')
      //   }
      // })

      //v3.0版 返回值已经通过响应拦截器处理时，可用直接使用到数据，通过await 获取到数据直接赋值即可
      this.swiperData = await this.$https.get('/home/swiperdata')
    },

    async getEntryData() {
      this.entryData = await this.$https.get('/home/catitems')
    },

    async getFloorData() {
      this.floorData = await this.$https.get('/home/floordata')
    },
  },
}
</script>

<style lang="less">
.swiper {
  width: 750rpx;
  height: 340rpx;
  .swiper_image {
    width: 750rpx;
    height: 340rpx;
  }
}
.entry {
  display: flex;
  padding: 10rpx 0;
  // justify-content: space-around;
  justify-content: space-evenly;
  .entry_item {
    // flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
    .entry_item_image {
      width: 128rpx;
      height: 140rpx;
    }
  }
}

.floor {
  .floor_title {
    .floor_title_image {
      height: 60rpx;
    }
  }

  .floor_list {
    overflow: hidden;
    .floor_list_item {
      // 浮动实现环绕效果
      float: left;
      &:nth-child(1) image {
        height: 386rpx;
      }
    }
    .floor_list_image {
      display: block;
      width: 232rpx;
      height: 188rpx;
      margin-left: 14rpx;
      margin-bottom: 10rpx;
    }
  }
}
</style>
