<template>
  <v-row justify="center">
    <v-dialog v-model="c_show" max-width="333" persistent scrollable>
      <v-card>
        <v-card-title>{{ $t('Languages') }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="d_language" column>
            <v-radio label="English" value="en"></v-radio>
            <v-radio label="中文 (简体)" value="zhHans"></v-radio>
            <v-radio label="中文 (繁体)" value="zhHant"></v-radio>
            <v-radio label="한국어" value="ko"></v-radio>
            <v-radio label="日本語" value="ja"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="warning" @click="$store.__s('dialog.language', false)" text>{{ $t('Close') }}</v-btn>
          <v-btn color="primary" @click="saveLanguage()" dark>{{ $t('Save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { loadLanguageAsync } from '@/i18n'
export default {
  data() {
    return {
      d_language: ''
    }
  },
  computed: {
    c_language: vm => vm.$store.__s('app.language'),
    c_show: vm => !vm.$store.__s('app.language') || vm.$store.__s('dialog.language')
  },
  methods: {
    saveLanguage() {
      this.$store.__s('app.language', this.d_language)
      this.$store.__s('dialog.language', false)
      loadLanguageAsync(this.d_language)
    }
  },
  watch: {
    c_show() {
      this.d_language = this.c_language
    }
  }
}
</script>
