<template>
  <view>
    <!-- 收货地址 -->
    <view @tap="chooseAddressHandle" class="address">
      <text class="address_detail" v-if="JSON.stringify(address) !== '{}'">{{
        addressDetail
      }}</text>
      <text class="address_userinfo" v-if="JSON.stringify(address) !== '{}'"
        >{{ address.userName }} {{ address.telNumber }}</text
      >
      <text v-if="JSON.stringify(address) == '{}'">地址为空，快去添加吧~</text>
    </view>
    <!-- 商品 -->
    <view class="choose">
      <block v-for="item in cartList" :key="item.goods_id">
        <view class="choose_item" v-if="item.goods_check">
          <goodsItem :item="item" />
          <view class="choose_item_count">X{{ item.goods_count }}</view>
        </view>
      </block>
    </view>
    <!-- 支付 -->
    <view class="bottom">
      <text class="bottom_total">
        <text class="bottom_total_text">合计：</text>
        <text class="goods_price">{{ totalPrice }}</text>
      </text>
      <view class="bottom_btn" @tap="payMoney()">去支付({{ totalCount }})</view>
    </view>
  </view>
</template>

<script>
import goodsItem from '@/components/goodsItem/main'
export default {
  components: {
    goodsItem,
  },
  data() {
    return {
      address: {},
      cartList: [],
    }
  },
  onLoad() {
    this.address = uni.getStorageSync('address') || {}
    this.cartList = uni.getStorageSync('cartList') || []
  },
  methods: {
    //收货地址
    chooseAddressHandle() {
      uni.chooseAddress({
        success: (res) => {
          delete res.errMsg
          this.address = res
          uni.setStorageSync('address', res)
        },
      })
    },
    //点击调用微信支付
    payMoney() {
      const token = uni.getStorageSync('token')
      if (!token) {
        //#ifdef MP-WEIXIN
        uni.navigateTo({
          url: '/pages/auth/main',
        })
        //#endif

        //#ifdef H5
        uni.navigateTo({
          url: '/pages/login/main',
        })
        //#endif
      } else {
        this.payMoneyFlow()
      }
    },
    //支付流程
    async payMoneyFlow() {
      const token = uni.getStorageSync('token')
      //   console.log(this.cartList)
      const goods = this.cartList
        .filter((item) => item.goods_check)
        .map((item) => ({
          goods_id: item.goods_id,
          goods_number: item.goods_count,
          goods_price: item.goods_price,
        }))

      try {
        const { order_number } = await this.$https.post(
          '/my/orders/create',
          {
            order_price: this.totalPrice,
            consignee_addr: this.addressDetail,
            goods,
          },
          { headers: { Authorization: token } }
        )
        console.log(order_number)

        //准备预支付参数
        const { pay } = await this.$https.post(
          '/my/orders/req_unifiedorder',
          {
            order_number,
          },
          { headers: { Authorization: token } }
        )
        console.log('预支付订单生成成功', pay)

        //#ifdef MP-WEIXIN
        await wx.requestPayment({ ...pay })
        //   console.log(res)
        //#endif

        //更新订单状态
        const title = await this.$https.post(
          '/my/orders/chkOrder',
          {
            order_number,
          },
          { headers: { Authorization: token } }
        )
        //   console.log( message)
        uni.showToast({
          title,
        })
      } catch (err) {
        uni.showToast({
          title: '支付失败',
          icon: 'none',
        })
      }
    },
  },
  computed: {
    addressDetail() {
      const { provinceName, cityName, countyName, detailInfo } = this.address
      return provinceName + cityName + countyName + detailInfo
    },
    totalPrice() {
      let totalPrice = 0
      //遍历数组每一项
      this.cartList.forEach((item) => {
        if (item.goods_check) {
          totalPrice += item.goods_price * item.goods_count
        }
      })
      //返回计算结果
      return totalPrice
    },
    totalCount() {
      return this.cartList.filter((item) => item.goods_check).length
    },
  },
}
</script>

<style lang="less">
page {
  background-color: #f9f9f9;
  padding: 20rpx;
  box-sizing: border-box;
}
.address {
  height: 188rpx;
  background-color: #fff;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .address_detail {
    font-size: 30rpx;
    color: #111;
    font-weight: 700;
  }
  .address_userinfo {
    font-size: 26rpx;
    color: #434343;
  }
}
.choose {
  background-color: #fff;
  .choose_item {
    position: relative;
    .choose_item_count {
      position: absolute;
      right: 20rpx;
      bottom: 20rpx;
    }
  }
}
.bottom {
  padding: 0 20rpx;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  height: 84rpx;
  border-top: 1rpx solid #ddd;
  background-color: #fff;
  display: flex;
  align-items: center;

  .bottom_total {
    display: flex;
    align-items: center;
    .bottom_total_text {
      font-size: 26rpx;
      color: #333;
      margin-right: 4rpx;
    }

    .goods_price {
      font-size: 28rpx;
    }
  }

  .bottom_btn {
    background-color: #ea4350;
    width: 150rpx;
    height: 52rpx;
    border-radius: 26rpx;
    font-size: 22rpx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 20rpx;
  }
}
</style>
