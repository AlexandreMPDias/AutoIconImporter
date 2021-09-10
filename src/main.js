const fs = require('fs');
const path = require('path');
const { findCommonPrefix, findCommonSuffix } = require('./helpers/find-common-string');

const inputPath = path.join(__dirname, '..', 'data');

const svgOutputPath = path.join(__dirname, '..', 'out', 'svgValues.ts');

function treatFile(content) {
	// const transformations = [
	// 	s => s.split(/\n|\t/).join(''),
	// 	s => s.replace(/.+<path/, ''),
	// 	s => s.replace(/"\/>.+/, ''),
	// 	s => s.replace(/.+d=/, ''),
	// 	s => s.replace(/"/g, ''),
	// ];
	// const cleanContent = transformations.reduce((finalContent, transform) => {
	// 	return transform(finalContent);
	// }, content);

	const cleanContent = content.replace(/\n+/g, '').replace(/(.+path\sd=")(.+?)(".+)/, '$2');
	return {
		value: cleanContent,
		type: 'filled',
	};
}

const iconObject = {};

const files = fs.readdirSync(inputPath).filter(filePath => !filePath.match(/\.gitignore/));

const common = files.slice(1).reduce(
	(c, file) => ({
		prefix: findCommonPrefix(c.prefix, file),
		suffix: findCommonSuffix(c.suffix, file),
	}),
	{ prefix: files[0], suffix: files[0] }
);

files.forEach(filePath => {
	const cleanKey = filePath.toUpperCase().replace(/-/g, '_');
	const iconKey = cleanKey.slice(common.prefix.length).slice(0, -common.suffix.length);

	console.log(iconKey);
	iconObject[iconKey] = treatFile(fs.readFileSync(path.join(inputPath, filePath)).toString());
});

const iconEntries = Object.entries(iconObject);

iconEntries.forEach(([iconKey, values]) => {
	if (values.value === '') {
		console.log(`Icon [ ${iconKey} ] is mal-formed`);
		console.log(`\tValues:\n${JSON.stringify(values, null, '\t').split('\n').join('\t\t\n')}`);
	}
});

fs.writeFile(
	svgOutputPath,
	`const icons = {
${iconEntries
	.map(([iconKey, values]) => {
		const lines = [];
		lines.push(`${iconKey}: {`);
		lines.push(`\tvalue: \`${values.value}\`,`);
		lines.push(`\ttype: '${values.type}'`), lines.push(`},\n`);

		return lines.map(a => `\t${a}`).join('\n');
	})
	.join('')}
}`,
	() => {}
);
