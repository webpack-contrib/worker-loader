import path from 'path';

import getPort from 'get-port';
import express from 'express';
import puppeteer from 'puppeteer';

export default async function getResultFromBrowser(stats) {
  const assets = Object.entries(stats.compilation.assets);
  const app = express();
  const port = await getPort();
  const server = app.listen(port);

  app.use(
    '/public-path-static',
    express.static(stats.compilation.outputOptions.path)
  );
  app.use(
    '/public-path-static-other',
    express.static(stats.compilation.outputOptions.path)
  );

  for (const asset of assets) {
    let [route] = asset;
    [route] = route.split('?');

    const existsAt = path.resolve(stats.compilation.outputOptions.path, route);

    if (route === 'index.html') {
      app.get('/', (req, res) => {
        res.sendFile(existsAt);
      });
    } else {
      app.get(`/${route}`, (req, res) => {
        res.sendFile(existsAt);
      });
    }
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page
    .on('console', (message) =>
      // eslint-disable-next-line no-console
      console.log(message)
    )
    .on('pageerror', ({ message }) =>
      // eslint-disable-next-line no-console
      console.log(message)
    )
    // .on('response', (response) =>
    //   // eslint-disable-next-line no-console
    //   console.log(`${response.status()} ${response.url()}`)
    // )
    .on('requestfailed', (request) =>
      // eslint-disable-next-line no-console
      console.log(`${request.failure().errorText} ${request.url()}`)
    );

  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForSelector('button', { timeout: 90000 });
  await page.click('button');
  await page.waitForSelector('#result', { timeout: 90000 });

  const addedFromWorkerText = await page.$eval(
    '#result',
    (el) => el.textContent
  );

  browser.close();
  server.close();

  return addedFromWorkerText;
}
