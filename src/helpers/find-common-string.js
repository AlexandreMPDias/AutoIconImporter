const split = (str, reverse = false) => {
	const s = str.split('');
	return reverse ? s.reverse() : s;
};

const asPair = (str1, str2, reverse = false) => {
	const s1 = split(str1, reverse);
	return split(str2, reverse).map((char, index) => {
		return [s1[index], char];
	});
};

function findCommonPrefix(str1, str2) {
	let matching = true;
	const pairs = asPair(str1, str2).filter(([a, b]) => {
		matching = matching && a === b;
		return matching;
	});
	return pairs.map(([a]) => a).join('');
}

function findCommonSuffix(str1, str2) {
	let matching = true;
	const pairs = asPair(str1, str2, true).filter(([a, b]) => {
		matching = matching && a === b;
		return matching;
	});
	return pairs
		.map(([a]) => a)
		.reverse()
		.join('');
}

module.exports = { findCommonPrefix, findCommonSuffix };
