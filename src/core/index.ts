import { parseSFC } from '@vue-macros/common'
import { walkAST } from 'ast-walker-scope'
import type { Program } from '@babel/types'
import { DEFINE_UNO_CSS_VARIANT, filterDefineUnoCssVariant } from '../utils'

export async function transformStyleTs(code: string, id: string) {
  const sfc = parseSFC(code, id)
  if (!sfc.scriptSetup) return
  const { scriptSetup, getSetupAst } = sfc
  const setupOffset = scriptSetup.loc.start.offset
  const setupAst = getSetupAst()!

  const nodes = filterDefineUnoCssVariant(setupAst!.body)
  if (nodes.length === 0)
    return
  else if (nodes.length > 1)
    throw new SyntaxError(`duplicate ${DEFINE_UNO_CSS_VARIANT}() call`)

  const setupBindings = getUnoCssArguments(setupAst)
  console.log(setupBindings)
  return code
}

function getUnoCssArguments(program: Program) {
  let targetObject = null
  walkAST(program, {
    enter(node) {
      if (node.type === 'CallExpression' && node.callee.name === DEFINE_UNO_CSS_VARIANT)
      targetObject = node.arguments[0]
    },
  })
  return targetObject
}
