const fs = require('fs');

function sort(name) {
	// Read the JSON file
	const jsonData = fs.readFileSync(name);
	const data = JSON.parse(jsonData);

	// Sort the data based on a property (e.g., 'name')
	data.sort((a, b) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();

		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});

	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(data, null, 2));

	console.log('Sorting completed!');
}

sort('en.json');
sort('es.json');
sort('ca.json');
