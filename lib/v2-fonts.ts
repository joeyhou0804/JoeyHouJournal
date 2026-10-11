import localFont from 'next/font/local'

// v2 type system — vendored locally in public/fonts so the fonts never
// depend on a network fetch (next/font/google silently falls back to
// system fonts when its build-time download fails):
//   display EN: Fredoka (rounded, bold, close to the Mario hub feel)
//   body EN:    Nunito (rounded, highly readable)
//   display ZH: ZCOOL KuaiLe (playful)
//   body ZH:    Noto Sans SC (clean, readable)
const fredoka = localFont({
  src: '../public/fonts/Fredoka.ttf',
  weight: '300 700',
  variable: '--font-display-en',
})
const nunito = localFont({
  src: '../public/fonts/Nunito.ttf',
  weight: '200 1000',
  variable: '--font-body-en',
})
const zcoolKuaiLe = localFont({
  src: '../public/fonts/ZCOOLKuaiLe.ttf',
  weight: '400',
  variable: '--font-display-zh',
})
const notoSansSC = localFont({
  src: '../public/fonts/NotoSansSC.ttf',
  weight: '100 900',
  variable: '--font-body-zh',
})

// Class names that set the four --font-* CSS variables on whatever element
// (or document.body, via BodyFonts) carries them. Used by the site
// layout and the admin layout.
export const v2FontVars = `${fredoka.variable} ${nunito.variable} ${zcoolKuaiLe.variable} ${notoSansSC.variable}`
