import { defineConfig, presetIcons, presetUno } from 'unocss';
export default defineConfig({
  shortcuts: {
    'flex-jac': 'flex justify-center items-center',
    'flex-jasc': 'flex flex-justify-between items-center',
    'flex-aic': 'flex items-center',
    hover: 'op-70 hover:op-100 cursor-pointer transition-opacity'
  },
  presets: [
    presetUno(),
    presetIcons({
      autoInstall: false,
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        width: '1.2em',
        height: '1.2em'
      },
      collections: {}
    })
  ],
  safelist: []
});
