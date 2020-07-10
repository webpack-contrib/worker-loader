import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import del from 'del';

async function setup() {
  await del(path.resolve(__dirname, `./test/outputs`));
}

module.exports = setup;
