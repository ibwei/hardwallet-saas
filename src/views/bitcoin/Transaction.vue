<template>
  <div>
    <v-row justify="center">
      <v-col cols="3">
        <div class="">
          <span class="body-2">余额</span>
          <div><span class="title pr-2">0</span><span class="body-2 grey--text">BTC</span></div>
        </div>
      </v-col>
      <v-col cols="3">
        <div class="">
          <span class="body-2">兑换</span>
          <div><span class="title pr-2">0</span><span class="body-2 grey--text">CNY</span></div>
        </div>
      </v-col>
      <v-col cols="3">
        <div class="">
          <span class="body-2">汇率</span>
          <div><span class="title pr-2">0</span><span class="body-2 grey--text">CNY/BTC</span></div>
        </div>
      </v-col>
      <v-col cols="3">
        <div>
          <span class="body-2">刷新</span>
        </div>
        <i class="title icon">&#xe9ef;</i>
      </v-col>
    </v-row>
    <v-divider class="mt-3" />
  </div>
</template>

<script>
export default {
  name: 'Transaction'
}
</script>

<style lang="scss" scoped></style>
