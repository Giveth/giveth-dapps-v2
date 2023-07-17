const fs = require('fs');

// Read the JSON file
const enJsonData = fs.readFileSync('en.json');
const en = JSON.parse(enJsonData);

const esJsonData = fs.readFileSync('es.json');
const es = JSON.parse(esJsonData);

const caJsonData = fs.readFileSync('ca.json');
const ca = JSON.parse(caJsonData);

function sort(data) {
	// Convert object to array of key-value pairs
	const dataArray = Object.entries(data);

	// Sort the array based on the key
	dataArray.sort((a, b) => {
		const keyA = a[0].toUpperCase();
		const keyB = b[0].toUpperCase();

		if (keyA < keyB) {
			return -1;
		}
		if (keyA > keyB) {
			return 1;
		}
		return 0;
	});

	// Convert the sorted array back to an object
	return Object.fromEntries(dataArray);
}

function addMissingKeys(obj1, obj2) {
	const newObj = { ...obj2 }; // Create a new object to avoid modifying obj2 directly

	for (let key in obj1) {
		if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
			newObj[key] = '';
		}
	}

	return newObj;
}

function save(obj, name) {
	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(obj, null, 2));

	console.log('Saving completed!');
}

const updatedEs = addMissingKeys(en, es);
const updatedCa = addMissingKeys(en, ca);

const sortedEn = sort(en);
const sortedEs = sort(updatedEs);
const sortedCa = sort(updatedCa);

save(sortedEn, 'en.json');
save(sortedEs, 'es.json');
save(sortedCa, 'ca.json');
