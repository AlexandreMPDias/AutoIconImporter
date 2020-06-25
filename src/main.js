const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'data');

const svgOutputPath = path.join(__dirname, '..', 'out', 'svgValues.ts');

function treatFile(content) {
	const transformations = [
		s => s.split(/\n|\t/).join(''),
		s => s.replace(/.+<path/,''),
		s => s.replace(/"\/>.+/,''),
		s => s.replace(/.+d=/, ""),
		s => s.replace(/"/g,'')
	]
	const cleanContent = transformations.reduce((finalContent, transform) => {
		return transform(finalContent)
	}, content)

	return {
		value: cleanContent,
		type: 'filled'
	}
}

const iconObject = {}

fs.readdirSync(inputPath).forEach((filePath, i) => {
	if(!filePath.match(/\.gitignore/)) {
		const iconKey = filePath.replace(/icon_(.+)\.svg/, '$1').toUpperCase().replace('-', '_');
		// filePath.substring("icon_".length, filePath.length - ".svg".length).toUpperCase().replace('-', '_');

		iconObject[iconKey] = treatFile(fs.readFileSync(path.join(inputPath, filePath)).toString())
	}
})

const iconEntries = Object.entries(iconObject)

iconEntries.forEach(([iconKey, values]) => {
	if(values.value == "") {
		console.log(`Icon [ ${iconKey} ] is mal-formed`)
		console.log(`\tValues:\n${JSON.stringify(values, null, "\t").split("\n").join("\t\t\n")}`)
	}
})

fs.writeFile(svgOutputPath, `const icons = {
${iconEntries.map(([iconKey, values]) => {
	const lines = []
	lines.push(`${iconKey}: {`)
	lines.push(`\tvalue: \`${values.value}\`,`)
	lines.push(`\ttype: '${values.type}'`),
	lines.push(`},\n`)

	return lines.map(a => `\t${a}`).join('\n')
}).join('')}
}`, () => { });
