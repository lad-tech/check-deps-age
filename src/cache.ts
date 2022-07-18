import fs from 'node:fs/promises';

import logger from './logger';

let CACHE_PATH = './checkdeps.json';
let CACHE: Record<string, number> = {};

const readCache = async () => {
  try {
    logger.info('Reading cache');
    CACHE = JSON.parse(await fs.readFile(CACHE_PATH, { encoding: 'utf-8' }));
    logger.debug('cache', CACHE);
  } catch (e) {
    logger.error(e);
  }
};
export const setCachePath = async (cacheFile: string) => {
  CACHE_PATH = cacheFile;
  await readCache();
};

export const getCachePath = () => CACHE_PATH;

export const getCache = () => CACHE;
