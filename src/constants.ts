import fs from 'node:fs';

import dayjs from 'dayjs';

import logger from './logger';

export const CACHE_PATH = './checkdeps.json';
export const CURRENT_DATE = dayjs();
export const MAX_DIFF_DAYS = 14;

let CACHE: Record<string, number> = {};

try {
  logger.info('Reading cache');
  CACHE = JSON.parse(fs.readFileSync(CACHE_PATH, { encoding: 'utf-8' }));
  logger.debug('cache', CACHE);
} catch (e) {
  logger.error(e);
}

export default CACHE;
