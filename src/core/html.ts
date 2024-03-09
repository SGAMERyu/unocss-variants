import { ELEMENT_NODE, parse, render, walk } from 'ultrahtml'
import { UNO_VARIANTS_RUNTIME } from './constant'

export async function transformIndexHtml(html: string) {
  const parsedHtml = parse(html)

  const tagsAst = parse(`<head><style id=${UNO_VARIANTS_RUNTIME} type="text/css" href="./uno-variants.css"></style></head>`).children[0].children

  let hasHead = false

  await walk(
    parsedHtml,
    (node) => {
      if (node.type === ELEMENT_NODE && node.name === 'head') {
        node.children.unshift(...tagsAst)
        hasHead = true
      }
    },
  )

  if (!hasHead && parsedHtml.children)
    parsedHtml.children.push(...tagsAst)

  return await render(parsedHtml)
}
