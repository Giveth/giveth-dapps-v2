const fs = require('fs');

// Read the JSON file
const caTrJsonData = fs.readFileSync('nt_ca.json');
const ca_tr = JSON.parse(caTrJsonData);

const caJsonData = fs.readFileSync('ca.json');
const ca = JSON.parse(caJsonData);

function importTranslatedKeys() {
	for (let key in ca_tr) {
		if (ca_tr.hasOwnProperty(key)) {
			ca[key] = ca_tr[key];
		}
	}

	return ca;
}

function save(obj, name) {
	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(obj, null, 2));

	console.log('Saving completed!');
}

const imported = importTranslatedKeys();

save(imported, 'ca.json');
