<template>
  <view>
      <navigator class="go_back" open-type="navigateBack">回</navigator>
    <swiper
      class="swiper"
      :indicator-dots="true"
      :autoplay="true"
      indicator-active-color="#ea4350"
    >
      <swiper-item class="swiper-item uni-bg-red"
          v-for="item in pics"
          :key="item.pics_id">
        <image :src="item.pics_big" @tap="previewImageHandle(item.pics_big)"  class="swiper-item">
      </swiper-item>
    </swiper>
    <view class="info">
        <view class="info_head">
            <view class="info_head_price goods_prics">{{goods_price}}</view>
                <view class="info_head_icongroup">
                  <!-- #ifdef MP-WEIXIN -->
                    <view class="iconfont icon-fenxiang">
                      <button class="open_type_button" open-type="share">分享</button>
                    </view>
                    <!-- #endif -->
                    <view class="iconfont icon-shoucang"></view>
                </view>
            </view>
            <view class="info_name">
                {{goods_name}}
            </view>
        </view>
        <view class="divider"></view>
        <view class="introduce_title">图文详情</view>
        <view class="introduce_main">
          <rich-text :nodes="goods_introduce"></rich-text>
        </view>
        <!-- 底部栏 -->
        <view class="bottom">
          <!-- #ifdef MP-WEIXIN -->
          <view class="iconfont icon-kefubeifen">联系客服 <button class="open_type_button" open-type="contact">联系客服</button></view>
          <!-- #endif -->
          <view class="iconfont icon-gouwuche">购物车</view>
          <view class="bottom_btn" @tap="addToCart">加入购物车</view>
          <view class="bottom_btn">立即购买</view>
        </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      options: {},
      pics: [],
      goods_name:'',
      goods_price:'',
      goods_introduce:'',
      goods_small_logo:''
    }
  },
  onLoad(options) {
    console.log(options)
    this.options = options
    this.getGoodsDetail()
  },
  methods: {

    //加入购物车模块
    addToCart(){
      const cartList = uni.getStorageSync('cartList') || [];
      const index = cartList.findIndex(item=>item.goods_id===this.options.goods_id)
      if(index===-1){
        const goodsObj={
          goods_id:this.options.goods_id,
          goods_small_logo:this.goods_small_logo,
          goods_name:this.goods_name,
          goods_price:this.goods_price,
          goods_count:1,  //初始化商品数量为1
          goods_check:true
        }
        //把商品对象添加到数组中
        cartList.push(goodsObj)
      }else{
        cartList[index].goods_count+=1;
        cartList[index].goods_check=true; //添加选择状态
      }

      uni.setStorageSync('cartList', cartList)

      uni.showToast({
        title: '加入成功',
        duration: 1000,
        mask:true
      });
    },

    async getGoodsDetail() {
      const res = await this.$https.get('/goods/detail', {
        params: { goods_id:this.options.goods_id},
      })
      let { pics,goods_price,goods_name,goods_introduce,goods_small_logo} = res
      this.pics = pics
      this.goods_name=goods_name
      this.goods_price=goods_price
      this.goods_small_logo=goods_small_logo
      
      //获取系统信息
      const {system} =uni.getSystemInfoSync();
      console.log('systemInfo',system)
      if(system.includes('iOS')){
        // console.log('当前为ios系统，不能识别webp图片，需要全部替换成jpg图片地址')
        goods_introduce = goods_introduce.replace(/webp/g,'jpg')
      }

      this.goods_introduce =goods_introduce.replace(/<img/g,'<img class="rich_image"')
      console.log(res)
    },

    //预览图片
    previewImageHandle(img){
        //把原本数组的结构映射成符合小程序接口的程序
        const urls = this.pics.map(item=>item.pics_big)
        // console.log(img)
        //调用原生微信的全屏预览图片功能
        uni.previewImage({
            urls,img
        });
    }
  },
}
</script>

<style lang="less">
    .swiper,
    .swiper-item{
        width: 750rpx;
        height: 750rpx;
    }
    .go_back{
        width: 80rpx;
        height: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 50rpx;
        top: 50rpx;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        z-index: 10;
    }
    .info{
        padding: 10rpx 30rpx;
        .info_head{
            padding: 10rpx 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .info_head_price{
               font-size: 38rpx;
            }
            .info_head_icongroup{
                display: flex;
                 .iconfont{
                    color:#898989;
					          font-size: 45rpx;
                    margin: 0 10rpx;
                }
            }
        }
        .info_name{
            font-size: 30rpx;
            word-break: break-all;
        }
    }
    .iconfont {
      position: relative;
      overflow: hidden;
    }
    .open_type_button{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
    }
    .divider{
      height: 20rpx;
      background-color: #f0f0f0;
    }
    .introduce{
      .introduce_title{
        height: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .introduce_main{
        // font-size: 0;
      }
    }
    /deep/ .rich_image{
      vertical-align:middle;
    }

    .bottom{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 94rpx;
      background-color: #fff;
      border-top: 1rpx solid #ddd;
      display: flex;
      align-items: center;
      padding: 0 10rpx;
      .iconfont{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 20rpx;
        &::before{
          font-size: 40rpx;
        }
      }
      .bottom_btn{
        width: 196rpx;
        height: 60rpx;
        color: #fff;
        border-radius: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        background-color: #FCAA23;
        margin: 0 10rpx;
        &:last-child{
          background-color: #EA4350;
        }
      }
    }
</style>
