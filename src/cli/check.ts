import { CommandModule } from 'yargs';

import Checker from '../index';

const check: CommandModule = {
  aliases: ['$0'],
  builder: (cmd) => {
    return cmd.option('ignore', {
      alias: 'i',
      describe: 'Path to ignore file',
      type: 'array',
    });
  },
  command: 'upload [options]',
  describe: 'Check deps',
  handler: (argv) => {
    Checker.check(argv)
      .then(() => {
        console.log('Well done!');
      })
      .catch((err: { message: string }) => {
        console.error('ERROR:', err.message);
        process.exit(1);
      });
  },
};

export default check;
