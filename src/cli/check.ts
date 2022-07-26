import { CommandModule } from 'yargs';

import Checker from '../index';
import { ICheckParams } from '../types';
import { saveCache } from '../cache';

const check: CommandModule<Record<string, never>, ICheckParams> = {
  aliases: ['$0'],
  builder: (cmd) =>
    cmd.options({
      ignore: {
        alias: 'i',
        describe: 'Path to ignore file',
        type: 'string',
        default: './.checkdepsignore',
      },
      cacheFile: {
        describe: 'Path to cache file',
        type: 'string',
        default: './checkdepscache.json',
      },
    }),
  command: 'upload [options]',
  describe: 'Check deps',
  handler: (argv) => {
    Checker.check({ ignore: argv.ignore, cacheFile: argv.cacheFile })
      .then(() => {
        console.log('Well done!');
      })
      .catch((err: { message: string }) => {
        console.error('ERROR:', err.message);
        saveCache().then(() => process.exit(1));
      });
  },
};

export default check;
