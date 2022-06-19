const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, '..', 'public');

function generateRobotsTxt() {
	console.log('VERCEL_ENV: ', process.env.VERCEL_ENV);
	const isCrawlable = process.env.VERCEL_ENV === 'production';
	// Create a non-crawlable robots.txt in non-production environments
	const sourceFile = path.join(
		publicPath,
		isCrawlable ? 'crawlable.txt' : 'noncrawlable.txt',
	);
	const destFile = path.join(publicPath, 'robots.txt');

	try {
		// Create robots.txt file
		fs.copyFileSync(sourceFile, destFile);
		console.log(
			`Generated a ${
				isCrawlable ? 'crawlable' : 'non-crawlable'
			} public/robots.txt`,
		);
	} catch (error) {
		console.log(`Cannot Generate a public/robots.txt`, error);
	}
}

module.exports = generateRobotsTxt;
