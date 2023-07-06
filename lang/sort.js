const fs = require('fs');

function sort(name) {
	// Read the JSON file
	const jsonData = fs.readFileSync(name);
	const data = JSON.parse(jsonData);

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
	const sortedData = Object.fromEntries(dataArray);

	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(sortedData, null, 2));

	console.log('Sorting completed!');
}

sort('en.json');
sort('es.json');
sort('ca.json');
