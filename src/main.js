const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'data');

const svgOutputPath = path.join(__dirname, '..', 'output', 'svgValues.ts');
const keysOutPutPath = path.join(__dirname, '..', 'output', 'svgKeys.ts');

const svgValueExtractor = new RegExp(/^.+\sd="(.+)" style=.+$/);

function treatFile(content) {
	const svgContent = content.replace(svgValueExtractor, "$1");
	return `{
		value: \`${svgContent}\`,
		type: 'filled'
	},
	`
}

const keys = [];

const files = fs.readdirSync(inputPath).map((filePath, i) => {
	const fileName = filePath.substring("icon_".length, filePath.length - ".svg".length).toUpperCase().replace('-', '_');
	keys.push(fileName);
	return `${fileName}: ${treatFile(fs.readFileSync(path.join(inputPath, filePath)).toString())}`
})

fs.writeFile(svgOutputPath, `export default {
	${files.join("")}
}`, () => { });

`export type IconKeys =`

fs.writeFile(keysOutPutPath, `export type IconKeys = ${keys.map((key, i) => {
	if (i == 0) return `'${key}'`;
	return ` | '${key}'`;
}).join("")}`, () => { })

console.log(files.join(""))