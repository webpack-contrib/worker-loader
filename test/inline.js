const assert = require('assert');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');

process.chdir(__dirname);

const expected = './expected/inline';

describe('inline option', () => {
	beforeEach(() => {
		return del(expected);
	});

	it('should inline worker', done => {
		webpack({
			entry: './fixtures/inline/entry.js',
			output: {
				path: expected,
				filename: 'bundle.js'
			}
		}).run((err, stats) => {
			if (err) {
				done(err);
			} else {
				const bundleFile = stats.toJson('minimal').chunks
					.map(item => item.files)
					.reduce((acc, item) => acc.concat(item))
					.map(item => expected + '/' + item)[0];
				assert.notEqual(fs.readFileSync(bundleFile, 'utf-8').indexOf('inlined worker test mark'), -1);
				done();
			}
		});
	});

	it('should not create worker chunk', done => {
		webpack({
			entry: './fixtures/inline/entry.js',
			output: {
				path: expected,
				filename: 'bundle.js'
			}
		}).run((err, stats) => {
			if (err) {
				done(err);
			} else {
				const worker = expected + '/' + stats.toJson('minimal').children
					.map(item => item.chunks)
					.reduce((acc, item) => acc.concat(item))
					.map(item => item.files)
					.map(item => expected + '/' + item)[0];
				assert.equal(worker, null);
				done();
			}
		});
	});
});
