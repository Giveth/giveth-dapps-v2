const fs = require('fs');
const axios = require('axios');

async function translate(text, language) {
	const apiKey = ''; // Replace with your ChatGPT API key
	const url =
		'https://api.openai.com/v1/engines/text-davinci-003/completions';

	try {
		const response = await axios.post(
			url,
			{
				prompt: `Translate the following English text to ${language}:${text}`,
				max_tokens: 256,
				temperature: 0.3,
				presence_penalty: 0,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);

		const spanishText = response.data.choices[0].text.trim();
		return spanishText;
	} catch (error) {
		console.error('Error translating to Spanish:', error);
	}
}

function save(obj, name) {
	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(obj, null, 2));
}

// const englishText = 'Hello, how are you?\nI am doing great.';
// translate(englishText, 'Spanish');

async function FillSpanishJsonFile() {
	const enJsonData = fs.readFileSync('en.json');
	const en = JSON.parse(enJsonData);

	const esJsonData = fs.readFileSync('es.json');
	const es = JSON.parse(esJsonData);

	// const ctJsonData = fs.readFileSync('ca.json');
	// const ca = JSON.parse(ctJsonData);

	for (const key in es) {
		if (Object.hasOwnProperty.call(es, key)) {
			const value = es[key];
			if (value === '') {
				es[key] = await translate(en[key], 'Spanish');
			}
		}
	}

	save(es, 'es.json');
}

async function FillCatalanJsonFile() {
	const enJsonData = fs.readFileSync('en.json');
	const en = JSON.parse(enJsonData);

	const ctJsonData = fs.readFileSync('ct.json');
	const ct = JSON.parse(ctJsonData);

	for (const key in ct) {
		if (Object.hasOwnProperty.call(ct, key)) {
			const value = ct[key];
			if (value === '') {
				ct[key] = await translate(en[key], 'Catalan');
			}
		}
	}

	save(ct, 'ct.json');
}

FillSpanishJsonFile();
FillCatalanJsonFile();
