import { execSync } from 'child_process';
import fs from 'node:fs/promises';

import logger from './logger';
import { ICheckParams, INpmConfigArgv } from './types';
import { checker } from './utils/checker';
import { setCachePath, saveCache } from './cache';

const filterByIgnore = (arr: string[], ignoreRegexps: string[]) => {
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

    // filter flags like --frozen-lock-file
    const newOriginal = npmConfigArgv.original.filter(
      (item) => !item.startsWith('-')
    );

    await checker(filterByIgnore(newOriginal, ignoreRegexps));
  }

  const output = execSync(
    "yarn list | awk '/[\\w|@|\\/|\\-]*@\\d*.\\d*.\\d*[-|\\w|\\d]*$/gm {print $2}' | grep -v '[├───└─│]'",
    { encoding: 'utf-8' }
  ).split('\n');

  // del empty deps from not perfect output
  output.pop();
  output.shift();

  logger.debug('found dependencies ', output);

  await checker(filterByIgnore(output, ignoreRegexps));

  await saveCache();
};

export default { check };
