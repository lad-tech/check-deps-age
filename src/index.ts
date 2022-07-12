import { execSync } from 'child_process';
import fs from 'node:fs';

import yargs from 'yargs';

import logger from './logger';
import { INpmConfigArgv } from './types';
import cache, { CACHE_PATH } from './constants';
import { checker } from './utils/checker';

class Index {
  check = async (argv: yargs.ArgumentsCamelCase<Record<string, unknown>>) => {
    logger.debug(argv);
    const npmConfigArgvRaw = execSync('echo $npm_config_argv', {
      encoding: 'utf-8',
    });

    // catch if someone does yarn add package and check it before install
    if (npmConfigArgvRaw !== '\n') {
      const npmConfigArgv: INpmConfigArgv = JSON.parse(npmConfigArgvRaw);

      logger.debug(npmConfigArgv.toString());

      npmConfigArgv.original.shift();

      checker(npmConfigArgv.original);
    }

    const output = execSync(
      "yarn list | awk '/[\\w|@|\\/|\\-|.]*@\\d*.\\d*.\\d*[-|\\w|\\.|\\d]*/ {print $2}' | grep -v '[├───└─│]'",
      { encoding: 'utf-8' }
    ).split('\n');

    // del empty deps from not perfect output
    output.pop();

    logger.debug('found dependencies ', output);

    checker(output);

    // save cache
    const data = new Uint8Array(Buffer.from(JSON.stringify(cache)));
    fs.writeFileSync(CACHE_PATH, data, { encoding: 'utf-8', flag: 'w' });
  };
}

export default new Index();
