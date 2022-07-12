#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import yargs from 'yargs';

import check from './check';

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')
);

yargs
  .usage('Usage: $0 [options]')
  .version(pkg.version)
  .command(check)
  .env('CHECKER')
  .help('help')
  .alias('help', 'h').argv;
