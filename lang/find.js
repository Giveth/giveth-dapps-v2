const fs = require('fs');

// Read the JSON file
const enJsonData = fs.readFileSync('en.json');
const en = JSON.parse(enJsonData);

const esJsonData = fs.readFileSync('es.json');
const es = JSON.parse(esJsonData);

const caJsonData = fs.readFileSync('ca.json');
const ca = JSON.parse(caJsonData);

function findSameKeyValue(obj) {
	const sameKeyValue = {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key) && en[key] === obj[key]) {
			sameKeyValue[key] = obj[key];
		}
	}
	return sameKeyValue;
}

function save(obj, name) {
	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(obj, null, 2));

	console.log('Saving completed!');
}

const ntEs = findSameKeyValue(es);
const ntCa = findSameKeyValue(ca);

save(ntEs, 'nt_es.json');
save(ntCa, 'nt_ca.json');
