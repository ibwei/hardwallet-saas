<template>
  <div class="loading">
    <v-overlay v-model="pageLoading" opacity="0.5" :absolute="true">
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        <span class="subtitle-1 mt-4">{{ $t('Loading') }}</span>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['pageLoading'])
  },
  i18n: {
    zhCN: {
      Loading: '正在加载'
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
}
</style>
