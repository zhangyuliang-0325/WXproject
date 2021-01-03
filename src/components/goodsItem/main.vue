<template>
  <navigator
    class="goods_item"
    :url="'/pages/goods_detail/main?goods_id=' + item.goods_id"
  >
    <image class="goods_item_image" :src="item.goods_small_logo" />
    <view class="goods_item_info">
      <view class="goods_item_title">{{ item.goods_name }}</view>
      <view class="goods_item_price">{{ item.goods_price }}</view>
    </view>
  </navigator>
</template>

<script>
export default {
  props: ['item'],
}
</script>

<style lang="less">
.goods_item {
  display: flex;
  padding: 10rpx;
  .goods_item_image {
    width: 191rpx;
    height: 191rpx;
    background-color: #ccc;
  }

  .goods_item_info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 20rpx;
    font-size: 24rpx;
    .goods_item_title {
      // 超出两行变成省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      // 英文数字强制换行
      word-break: break-all;
    }

    .goods_item_price {
      color: #ea4350;
      &::before {
        content: '¥';
        font-size: 80%;
        margin-right: 3rpx;
      }
    }
  }
}
</style>
