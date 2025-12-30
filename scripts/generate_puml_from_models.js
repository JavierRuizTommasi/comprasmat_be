const fs = require('fs')
const path = require('path')

function walk(dir) {
    let results = []
    const list = fs.readdirSync(dir)
    list.forEach(file => {
        const fp = path.join(dir, file)
        const stat = fs.statSync(fp)
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fp))
        } else {
            results.push(fp)
        }
    })
    return results
}

function findModelFiles(root) {
    const all = walk(root)
    return all.filter(f => f.endsWith('.model.js'))
}

function extractSchemaBlock(content) {
    const marker = 'new Schema('
    const idx = content.indexOf(marker)
    if (idx === -1) return null
    let i = content.indexOf('(', idx) // start of ( after new Schema
    i = content.indexOf('{', i)
    if (i === -1) return null
    let depth = 0
    let start = i
    let end = -1
    for (let j = i; j < content.length; j++) {
        const ch = content[j]
        if (ch === '{') depth++
        else if (ch === '}') {
            depth--
            if (depth === 0) { end = j; break }
        }
    }
    if (end === -1) return null
    return content.slice(start + 1, end) // inner of top-level braces
}

function splitTopLevelFields(block) {
    // split by commas at top level
    const fields = []
    let curr = ''
    let depth = 0
    for (let i = 0; i < block.length; i++) {
        const ch = block[i]
        if (ch === '{' || ch === '[') depth++
        if (ch === '}' || ch === ']') depth--
        if (ch === ',' && depth === 0) {
            if (curr.trim()) fields.push(curr.trim())
            curr = ''
        } else {
            curr += ch
        }
    }
    if (curr.trim()) fields.push(curr.trim())
    return fields
}

function parseField(fieldStr) {
    // fieldStr like "name: { type: String, required: true }" or "email: String"
    const colon = fieldStr.indexOf(':')
    if (colon === -1) return null
    const rawName = fieldStr.slice(0, colon).trim()
    const name = rawName.replace(/['"`]/g, '')
    let val = fieldStr.slice(colon + 1).trim()
    // remove trailing commas
    if (val.endsWith(',')) val = val.slice(0, -1).trim()

    let type = 'Mixed'
    let ref = null

    // direct types
    const directTypeMatch = val.match(/^([A-Za-z0-9_\.]+)/)
    if (directTypeMatch) {
        const t = directTypeMatch[1]
        if (t === 'String' || t === 'Number' || t === 'Date' || t === 'Boolean') type = t
        else if (t === 'Schema.Types.ObjectId' || t === 'ObjectId') type = 'ObjectId'
        else if (t === 'Array' || t === '[') {
            type = 'Array'
        }
    }

    // look for type: XXX inside object
    const typeProp = val.match(/type\s*:\s*([A-Za-z0-9_\.\[\]]+)/)
    if (typeProp) {
        let tt = typeProp[1]
        if (tt.includes('Schema.Types.ObjectId')) tt = 'ObjectId'
        type = tt.replace(/\[|\]/g, 'Array')
    }

    // look for ref
    const refProp = val.match(/ref\s*:\s*['\"]([A-Za-z0-9_\- ]+)['\"]/)
    if (refProp) ref = refProp[1]

    // arrays with inner object containing type
    const arrayType = val.match(/\[\s*\{([\s\S]*?)\}\s*\]/)
    if (arrayType) {
        const inner = arrayType[1]
        const tmatch = inner.match(/type\s*:\s*([A-Za-z0-9_\.]+)/)
        if (tmatch) {
            let tt = tmatch[1]
            if (tt.includes('Schema.Types.ObjectId')) tt = 'ObjectId'
            type = tt + '[]'
        } else {
            type = 'Array'
        }
        const rmatch = inner.match(/ref\s*:\s*['\"]([A-Za-z0-9_\- ]+)['\"]/)
        if (rmatch) ref = rmatch[1]
    }

    return { name, type, ref }
}

function classNameFromPath(fp) {
    // use directory or filename as class name
    const base = path.basename(fp, '.model.js')
    // try to use folder name if file is index-like
    const dir = path.basename(path.dirname(fp))
    let candidate = base
    if (base.toLowerCase() === 'index' || base.toLowerCase() === 'schema') candidate = dir
    // normalize to PascalCase
    return candidate.split(/[^A-Za-z0-9]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

function generatePUMLForModel(className, fields) {
    let s = `class ${className} {\n`
    fields.forEach(f => {
        const t = f.type || 'Mixed'
        s += `  ${t} ${f.name}` + '\n'
    })
    s += '}\n'
    return s
}

function main() {
    const root = path.resolve(__dirname, '..')
    const modelFiles = findModelFiles(root)
    if (modelFiles.length === 0) {
        console.log('No model files found')
        return
    }

    const outDir = path.join(root, 'docs')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

    const classPUMLs = []

    modelFiles.forEach(f => {
        try {
            const content = fs.readFileSync(f, 'utf8')
            const block = extractSchemaBlock(content)
            if (!block) {
                console.log('No schema block in', f)
                return
            }
            const topFields = splitTopLevelFields(block)
            const parsed = []
            topFields.forEach(tf => {
                const p = parseField(tf)
                if (p) parsed.push(p)
            })

            const className = classNameFromPath(f)
            const pumlBody = generatePUMLForModel(className, parsed)
            const puml = '@startuml\n' + pumlBody + '@enduml\n'
            const outFile = path.join(outDir, `SCHEMA_${className}.puml`)
            fs.writeFileSync(outFile, puml, 'utf8')
            console.log('Wrote', outFile)
            classPUMLs.push({ className, puml })
        } catch (err) {
            console.error('Error parsing', f, err.message)
        }
    })

    // write combined file
    const combined = ['@startuml']
    classPUMLs.forEach(c => combined.push(c.puml.replace(/^@startuml\n|\n@enduml\n?/g, '')))
    combined.push('@enduml')
    const combinedFile = path.join(outDir, 'Schemas_All.puml')
    fs.writeFileSync(combinedFile, combined.join('\n'), 'utf8')
    console.log('Wrote', combinedFile)
    console.log('Done — generated', classPUMLs.length, 'model PUML files')
}

if (require.main === module) main()
