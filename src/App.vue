<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
}
</script>

<style lang="less">
/*每个页面公共css */
@import 'styles/iconfont.less';
.goods_prics {
  color: #ea4350;
  &::before {
    content: '¥';
    font-size: 80%;
    margin-right: 3rpx;
  }
}
</style>
