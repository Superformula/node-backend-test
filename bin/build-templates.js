const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const replacements = {
	'{{DOCS_RELEASE_BUCKET}}': process.env.DOCS_RELEASE_BUCKET,
	'{{LAMBDAS_RELEASE_BUCKET}}': process.env.LAMBDAS_RELEASE_BUCKET
};

/**
 * Read in each .template from the templates directory.
 * Then rewrite all replacements with the appropriate value.
 * Save rewritten .template files to dist/templates directory.
 */
readdir(path.resolve(__dirname, './../templates'))
	.then(files => files.filter(file => file.indexOf('.template') > -1))
	.then(files => {
		return Promise.all(files.map(file => {
			const inputPath = path.resolve(__dirname, `./../templates/${file}`);
			return readFile(inputPath, 'utf8').then(body => {
				Object.keys(replacements).forEach(key => {
					body = body.replace(new RegExp(key, 'g'), replacements[key]);
				});
				const outputPath = path.resolve(__dirname, './../dist/templates');
				return mkdir(outputPath).then(() => writeFile(`${outputPath}/${file}`, body));
			});
		}));
	});
