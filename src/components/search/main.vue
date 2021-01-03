<template>
  <view class="search">
    <view class="search_in">
      <icon type="search" size="30rpx" color="#ccc" class="search_in_icon" />
      <text>搜索</text>
    </view>
  </view>
</template>

<script>
export default {}
</script>

<style lang="less">
.search {
  padding: 10rpx 25rpx;
  background-color: #eb4450;
  .search_in {
    height: 80rpx;
    background-color: #fff;
    color: #666;
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5rpx;
    .search_in_icon {
      margin-right: 5rpx;
    }
  }
}
</style>
