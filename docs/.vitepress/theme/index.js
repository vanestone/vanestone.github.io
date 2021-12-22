import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    console.log(`🚀 ~ enhanceApp ~ ctx`, ctx)
    // app.component('VueClickAwayExample', VueClickAwayExample)
  },
}
