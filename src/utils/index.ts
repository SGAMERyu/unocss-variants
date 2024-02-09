import type { CallExpression, Node, Statement } from '@babel/types'
import { isCallOf } from '@vue-macros/common'

export const DEFINE_UNO_CSS_VARIANT = 'defineUnoCssVariant'

export function filterDefineUnoCssVariant(stmts: Statement[]) {
  return stmts.map((raw: Node) => {
    let node = raw
    if (raw.type === 'CallExpression')
      node = raw.expression
    return isCallOf(node, DEFINE_UNO_CSS_VARIANT) ? node : undefined
  }).filter((node): node is CallExpression => !!node)
}
