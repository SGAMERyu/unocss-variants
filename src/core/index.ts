import { parseSFC } from '@vue-macros/common'

export async function transformStyleTs(code: string, id: string) {
  const sfc = parseSFC(code, id)
  if (!sfc.scriptSetup) return
  const { scriptSetup, getSetupAst, getScriptAst } = sfc
  const setupOffset = scriptSetup.loc.start.offset
  const setupAst = getSetupAst()!
  console.log(setupAst.body!)
  return code
}
