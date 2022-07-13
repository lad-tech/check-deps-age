import { CommandModule } from 'yargs';

import Checker from '../index';

const check: CommandModule<Record<string, never>, { ignore: string }> = {
  aliases: ['$0'],
  builder: (cmd) =>
    cmd.option('ignore', {
      alias: 'i',
      describe: 'Path to ignore file',
      type: 'string',
      default: './.checkdepsignore',
    }),
  command: 'upload [options]',
  describe: 'Check deps',
  handler: (argv) => {
    Checker.check({ ignore: argv.ignore })
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
