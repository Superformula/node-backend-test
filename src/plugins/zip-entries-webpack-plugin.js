const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

/**
 * ZipEntriesPlugin constructor
 * @constructor
 */
function ZipEntriesPlugin() {
}

/**
 * Zip each entry from the webpack config
 *
 * @param compiler
 */
ZipEntriesPlugin.prototype.apply = function (compiler) {
	compiler.plugin('after-emit', function (compilation, next) {
		const outputPath = compilation.options.output.path;
		compilation.chunks.forEach(function (chunk) {
			const stream = archiver('zip', {zlib: {level: 9}});
			const archive = fs.createWriteStream(path.resolve(outputPath, `${chunk.name}.zip`));
			stream.pipe(archive);
			chunk.files.forEach(function (file) {
				stream.append(fs.createReadStream(path.resolve(outputPath, file)), {name: 'index.js'});
			});
			stream.finalize();
		});
		next();
	});
};

module.exports = ZipEntriesPlugin;
