import { MagicSFC } from 'sfc-composer/vue'
import { parse } from 'vue/compiler-sfc'

export async function transformStyleTs(code: string) {
  const sfc = new MagicSFC(code, { parser: parse })
  await sfc.parse()
  const currentStyle = sfc.styles[0]
  console.log(sfc.styles[0])
  currentStyle.remove(currentStyle.loc.start.line, currentStyle.loc.end.line)
  const newCode = sfc.getTransformResult()
  console.log(newCode.code)
  return code
}
