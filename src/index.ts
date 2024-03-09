import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { createGenerator } from '@unocss/core'
import { presetUno } from '@unocss/preset-uno'
import type { Options } from './types'
import { transformStyleTs, unoClassList } from './core'
import { UNO_VIRTUAL_MODULE_ID } from './core/constant'

export const unpluginFactory: UnpluginFactory<Options | undefined> = () => {
  const uno = createGenerator(presetUno())

  async function generateCssCode() {
    console.log(unoClassList)
    const css = await uno.generate(unoClassList)

    return css.getLayer()
  }
  return {
    name: 'unocss-variants',
    enforce: 'pre',
    transformInclude(id) {
      return id.endsWith('vue')
    },
    transform(code, id) {
      return transformStyleTs(code, id)
    },
    vite: {
      resolveId(id) {
        if (id === UNO_VIRTUAL_MODULE_ID)
          return '/__uno.css'
      },
      async load(id) {
        if (id === '/__uno.css') {
          const cssCode = await generateCssCode()
          console.log(cssCode)
          return {
            code: cssCode,
            map: { mappings: '' },
          }
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
