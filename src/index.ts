import { execSync } from 'child_process';
import fs from 'node:fs/promises';

import logger from './logger';
import { ICheckParams, INpmConfigArgv } from './types';
import { checker } from './utils/checker';
import { getCachePath, setCachePath, getCache } from './cache';

const filetByIgnore = (arr: string[], ignoreRegexps: string[]) => {
  return arr.filter((dep) => !ignoreRegexps.some((re) => dep.match(re)));
};

const check = async ({ ignore, cacheFile }: ICheckParams) => {
  let ignoreRegexps: string[] = [];

  await setCachePath(cacheFile);

  try {
    logger.info('Reading ignore');
    ignoreRegexps = (await fs.readFile(ignore, { encoding: 'utf-8' }))
      .toString()
      .trim()
      .split('\n');
    logger.debug('Ignore', ignoreRegexps);
  } catch (e) {
    logger.error(e);
  }

  const npmConfigArgvRaw = execSync('echo $npm_config_argv', {
    encoding: 'utf-8',
  });

  // catch if someone does yarn add package and check it before install
  if (npmConfigArgvRaw !== '\n') {
    const npmConfigArgv: INpmConfigArgv = JSON.parse(npmConfigArgvRaw);

    logger.debug(npmConfigArgv.toString());

    npmConfigArgv.original.shift();

    await checker(filetByIgnore(npmConfigArgv.original, ignoreRegexps));
  }

  const output = execSync(
    "yarn list | awk '/[\\w|@|\\/|\\-|.]*@\\d*.\\d*.\\d*[-|\\w|\\.|\\d]*/ {print $2}' | grep -v '[├───└─│]'",
    { encoding: 'utf-8' }
  ).split('\n');

  // del empty deps from not perfect output
  output.pop();

  logger.debug('found dependencies ', output);

  await checker(filetByIgnore(output, ignoreRegexps));

  // save cache
  const data = Buffer.from(JSON.stringify(getCache()));
  await fs.writeFile(getCachePath(), data, { encoding: 'utf-8', flag: 'w' });
};

export default { check };
