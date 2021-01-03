<template>
  <view>
    <block v-if="cartList.length !== 0">
      <view class="cart">
        <view v-for="item in cartList" :key="item.goods_id" class="cart_item">
          <view class="cart_item_check">
            <radio
              @tap="changeItemCheck(item.goods_id)"
              :checked="item.goods_check"
              color="#EB4450"
            />
          </view>
          <view class="cart_item_info">
            <goodsItem :item="item" />
            <view class="count">
              <view class="count_btn" @tap="changeCount(item.goods_id, -1)"
                >-</view
              >
              <view class="count_number">{{ item.goods_count }}</view>
              <view class="count_btn" @tap="changeCount(item.goods_id, 1)"
                >+</view
              >
            </view>
          </view>
        </view>
      </view>
      <!-- 底部结算 -->
      <view class="bottom">
        <label class="bottom_check">
          <radio
            @tap="changeCheckAll"
            class="bottom_check_radio"
            :checked="checkAll"
            color="#EB4450"
          />
          <text class="bottom_check_text">全选</text>
        </label>
        <text class="bottom_total">
          <text class="bottom_total_text">合计：</text>
          <text class="goods_price">{{ totalPrice }}</text>
        </text>
        <view
          class="bottom_btn"
          @tap="goToPay"
          :class="{ disabled: totalCount == 0 }"
          >去结算({{ totalCount }})</view
        >
      </view>
    </block>

    <block v-else>
      <view class="cart_empty">
        购物车为空，快去添加吧~
      </view>
    </block>
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
      cartList: [],
    }
  },
  //计算功能
  computed: {
    //全选状态计算
    checkAll() {
      let checkAll = false
      if (this.cartList.length !== 0) {
        checkAll = this.cartList.every((item) => item.goods_check)
      }
      return checkAll
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
  onShow() {
    const cartList = uni.getStorageSync('cartList') || []
    this.cartList = cartList
    console.log(cartList)
  },
  methods: {
    //改变商品选中状态
    changeItemCheck(goods_id) {
      const index = this.cartList.findIndex(
        (item) => item.goods_id === goods_id
      )
      console.log(index)
      this.cartList[index].goods_check = !this.cartList[index].goods_check
    },
    changeCount(goods_id, number) {
      const index = this.cartList.findIndex(
        (item) => item.goods_id === goods_id
      )
      const count = (this.cartList[index].goods_count += number)
      if (count <= 0) {
        this.cartList.splice(index, 1)
        uni.setStorageSync('cartList', this.cartList)
      }
    },

    //改变全选状态按钮
    changeCheckAll() {
      const checkAll = !this.checkAll
      this.cartList.forEach((item) => (item.goods_check = checkAll))
    },

    //去结算页
    goToPay() {
      if (this.totalCount === 0) {
        uni.showToast({
          title: '你还没有选择商品哟~',
          icon: 'none',
        })
      } else {
        uni.navigateTo({ url: '/pages/pay/main' })
      }
    },
  },
  watch: {
    cartList: {
      //深度监听 cartList变化
      deep: true,
      handler() {
        uni.setStorageSync('cartList', this.cartList)
      },
    },
  },
}
</script>

<style lang="less">
.cart {
  .cart_item {
    display: flex;
    padding: 20rpx 0;
    // 左边选中按钮
    .cart_item_check {
      width: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    // 右边商品信息
    .cart_item_info {
      flex: 1;
      position: relative;
      // 计数器部分
      .count {
        position: absolute;
        right: 20rpx;
        bottom: 20rpx;
        display: flex;
        align-items: center;
        color: #8a8a8a;
        .count_btn {
          width: 32rpx;
          height: 32rpx;
          border-radius: 50%;
          border: 2px solid #ddd;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .count_number {
          // 最小宽度
          min-width: 60rpx;
          color: #666;
          padding: 0 5rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
.bottom {
  padding: 0 20rpx;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  /* #ifdef H5 */
  bottom: 50px;
  /* #endif */
  height: 84rpx;
  border-top: 1rpx solid #ddd;
  background-color: #fff;
  display: flex;
  align-items: center;
  .bottom_check {
    display: flex;
    align-items: center;
    margin-right: 10rpx;
    .bottom_check_radio {
      margin-right: 6rpx;
    }
    .bottom_check_text {
      font-size: 22rpx;
      color: #999;
    }
  }

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
    &.disabled {
      background-color: #666;
    }
  }
}
</style>
