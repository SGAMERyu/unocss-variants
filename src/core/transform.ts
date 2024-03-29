import { parseSFC } from '@vue-macros/common'
import { walkAST } from 'ast-walker-scope'
import type { Program } from '@babel/types'
import MagicString from 'magic-string'
import { DEFINE_UNO_CSS_VARIANT } from '../utils'

export const unoClassList: Set<string> = new Set()

export async function transformStyleTs(code: string, id: string) {
  const sfc = parseSFC(code, id)
  if (!sfc.scriptSetup)
    return
  const { getSetupAst, scriptSetup } = sfc
  const setupAst = getSetupAst()!
  const setupOffset = scriptSetup.loc.start.offset

  const argumentNode = getUnoCssArguments(setupAst)
  const [start, end] = getUnoCssLoc(setupAst)
  const baseRuleRecord = getUnoCssBase(argumentNode!)
  collectUnoClass(setupAst)
  const s = new MagicString(code)
  s.overwrite(start! + setupOffset, end! + setupOffset, `() => [${transformString(baseRuleRecord!.base)}]`)
  return s.toString()
}

async function collectUnoClass(ast: Program) {
  const argumentNode = getUnoCssArguments(ast)
  const baseRuleRecord = getUnoCssBase(argumentNode!)
  baseRuleRecord.base.split(' ').forEach((rule) => {
    unoClassList.add(rule)
  })
}

function getUnoCssArguments(program: Program) {
  let argumentNode = null
  walkAST(program, {
    enter(node) {
      if (node.type === 'CallExpression' && (node.callee as any).name === DEFINE_UNO_CSS_VARIANT)
        argumentNode = node.arguments[0]
    },
  })
  return argumentNode
}

function getUnoCssBase(program: Program): { base: string } {
  let targetObject = {
    base: '',
  }
  walkAST(program, {
    enter(node) {
      if (node.type === 'ObjectExpression') {
        targetObject = node.properties.reduce((acc, prop: any) => {
          acc[prop.key.name] = prop.value.value
          return acc
        }, {} as any)
      }
    },
  })
  return targetObject
}

function getUnoCssLoc(program: Program) {
  let start, end
  walkAST(program, {
    enter(node) {
      if (node.type === 'CallExpression') {
        start = node.start
        end = node.end
      }
    },
  })
  return [start, end]
}

function transformString(input: string) {
  const output = input.split(' ').map((item: string) => `'${item}'`).join(',')
  return output
}
