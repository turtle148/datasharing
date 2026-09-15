// Turns the single-file build into a body fragment the Artifact tool can publish:
// no doctype, <html>, <head> or <body> — those are added at publish time.
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('dist-artifact/artifact.html', 'utf8')

const title = src.match(/<title>(.*?)<\/title>/s)[1]
const style = src.match(/<style[^>]*>[\s\S]*?<\/style>/)[0].replace(/ (rel|crossorigin)(="[^"]*")?/g, '')
const scripts = src.match(/<script type="module"[^>]*>[\s\S]*?<\/script>/g)
if (scripts.length !== 1) throw new Error(`expected one module script, found ${scripts.length}`)
const script = scripts[0].replace(' crossorigin', '')

writeFileSync(
  'dist-artifact/otiara.html',
  `<title>${title}</title>\n${style}\n<div id="root"></div>\n${script}\n`,
)
console.log('wrote dist-artifact/otiara.html')
