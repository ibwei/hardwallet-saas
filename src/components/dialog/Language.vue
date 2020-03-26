<template>
  <v-row justify="center">
    <v-dialog v-if="c_show" :value="true" max-width="333" persistent scrollable>
      <v-card>
        <v-card-title>{{ $t('Languages') }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="d_language" column>
            <v-radio label="English" value="enUS"></v-radio>
            <v-radio label="中文 (简体)" value="zhCN"></v-radio>
            <v-radio label="中文 (繁体)" value="zhTW"></v-radio>
            <v-radio label="한국어" value="ko"></v-radio>
            <v-radio label="日本語" value="ja"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="warning" @click="c_show = false" text>{{ $t('Close') }}</v-btn>
          <v-btn color="primary" @click="lang()" dark>{{ $t('Save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { setLang } from '@/i18n'
import { TranslateTable } from '../../plugins/vuetify'

export default {
  data: () => ({
    d_language: ''
  }),
  computed: {
    c_language: vm => vm.$store.__s('app.language'),
    c_show: {
      get() {
        return this.$store.__s('dialog.language')
      },
      set(val) {
        this.$store.__s('dialog.language', val)
      }
    }
  },
  watch: {
    c_show(val) {
      if (val) this.d_language = this.c_language
    }
  },
  methods: {
    lang() {
      setLang(this.d_language)
      this.setVuetifyLang(TranslateTable[this.d_language])
      this.c_show = false
    },
    setVuetifyLang(language) {
      this.$vuetify.lang.current = language
    }
  },
  i18n: {
    messages: {
      zhCN: {
        Languages: '语言'
      }
    }
  }
}
</script>
