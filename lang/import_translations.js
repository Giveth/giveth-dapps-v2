const fs = require('fs');

// Read the JSON file
const esTrJsonData = fs.readFileSync('nt_es.json');
const es_tr = JSON.parse(esTrJsonData);

const esJsonData = fs.readFileSync('es.json');
const es = JSON.parse(esJsonData);

function importTranslatedKeys() {
	for (let key in es_tr) {
		if (es_tr.hasOwnProperty(key)) {
			es[key] = es_tr[key];
		}
	}

	return es;
}

function save(obj, name) {
	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(obj, null, 2));

	console.log('Saving completed!');
}

const imported = importTranslatedKeys();

save(imported, 'es.json');
