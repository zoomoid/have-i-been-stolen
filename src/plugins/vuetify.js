import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    dark: true,
    themes: {
      dark: {
        primary: "#212121",
        secondary: colors.red.base,
        accent: colors.blue.base,
        error: colors.red.base,
        info: colors.blue.base.base,
        success: colors.green.base,
        warning: colors.amber.base
      },
    },
  },
  icons: {
    iconfont: 'md',
  },
});
