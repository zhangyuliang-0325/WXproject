<template>
  <view class="content">
    <swiper class="swiper">
      <swiper-item v-for="item in swiperData" :key="item.goods_id">
        <image :src="item.image_src" mode="" class="swiper_image" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
      swiperData: [],
    }
  },
  onLoad() {
    //发送网络请求用url.request()
    uni.request({
      method: 'GET',
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata', //仅为示例，并非真实接口地址。
      success: (res) => {
        console.log(res.data)
        this.swiperData = res.data.message
      },
    })
  },
  methods: {},
}
</script>

<style lang="less">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.swiper {
  width: 750rpx;
  height: 340rpx;
  .swiper_image {
    width: 750rpx;
    height: 340rpx;
  }
}
.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
