<template>
  <view>
    <button open-type="getUserInfo" @getuserinfo="getUserInfoHandle">
      获取微信授权
    </button>
  </view>
</template>

<script>
export default {
  onLoad() {},
  methods: {
    async getUserInfoHandle(e) {
      //   console.log(e)
      const { signature, iv, rawData, encryptedData, userInfo } = e.detail
      //   console.log(signature, iv, rawData, ancryptedData)
      uni.setStorageSync('userinfo', userInfo)

      const { code } = (await uni.login())[1]
      //   console.log(code)

      const { token } = await this.$https.post('/users/wxlogin', {
        signature,
        iv,
        rawData,
        encryptedData,
        code,
      })
      if (token) {
        uni.setStorageSync('token', token)
        uni.navigateBack()
      } else {
        uni.showToast({
          title: '出现错误，请重新授权',
          icon: 'none',
        })
      }
    },
  },
}
</script>

<style></style>
