import { execSync } from 'child_process';

import dayjs from 'dayjs';
import yargs from 'yargs';

import logger, { Prefix } from './logger';

interface INpmDeps {
  _id: 'yargs@17.5.1';
  _rev: '967-32faa315dae84a6d6ce3e2bb45f003f1';
  name: 'yargs';
  description: 'yargs the modern, pirate-themed, successor to optimist.';
  'dist-tags': {
    latest: '17.5.1';
    next: '17.1.1-candidate.0';
    'latest-11': '11.1.1';
    'next-14': '14.2.1';
    'latest-14': '14.2.3';
    'latest-13': '13.3.2';
    'latest-7': '7.1.2';
    'next-15': '15.5.0-candidate.0';
  };
  versions: string[]; // [ '1.0.0', ... '4.7.1' ];
  maintainers: string[]; // ['bcoe <bencoe@gmail.com>'];
  time: Record<string, string>;
  repository: { type: 'git'; url: 'git+https://github.com/yargs/yargs.git' };
  readmeFilename: 'README.md';
  homepage: 'https://yargs.js.org/';
  keywords: string[];
  bugs: { url: 'https://github.com/yargs/yargs/issues' };
  license: 'MIT';
  contributors: string[]; // ['Yargs Contributors (https://github.com/yargs/yargs/graphs/contributors)'];
  _cached: true;
  _contentLength: 1036069;
  version: '17.5.1';
  main: './index.cjs';
  exports: Record<string, string>;
  type: 'module';
  module: './index.mjs';
  dependencies: {
    cliui: '^7.0.2';
    escalade: '^3.1.1';
    'get-caller-file': '^2.0.5';
    'require-directory': '^2.1.1';
    'string-width': '^4.2.3';
    y18n: '^5.0.5';
    'yargs-parser': '^21.0.0';
  };
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  engines: { node: '>=12' };
  gitHead: '850a18123aa7c3a43e1f9c1254bd305c2d08188d';
  _nodeVersion: '14.19.2';
  _npmVersion: '8.10.0';
  dist: {
    integrity: 'sha512-t6YAJcxDkNX7NFYiVtKvWUz8l+PaKTLiL63mJYWR2GnHq2gjEWISzsLp9wg3aY36dY1j+gfIEL3pIF+XlJJfbA==';
    shasum: 'e109900cab6fcb7fd44b1d8249166feb0b36e58e';
    tarball: 'https://registry.npmjs.org/yargs/-/yargs-17.5.1.tgz';
    fileCount: 60;
    unpackedSize: 287602;
  };
  _npmUser: 'oss-bot <bencoe+oss-bot@gmail.com>';
  directories: Record<string, unknown>;
  _npmOperationalInternal: {
    host: 's3://npm-registry-packages';
    tmp: 'tmp/yargs_17.5.1_1652667256416_0.29815538357362836';
  };
  _hasShrinkwrap: false;
}

interface IOurNpmDeps {
  name: '@npm/eslint-config';
  versions: ['0.0.1', '0.0.2', '0.0.3', '0.0.4', '0.0.5'];
  'dist-tags': {
    latest: '0.0.5';
  };
  _cached: true;
  _contentLength: 2670;
  dist: {
    shasum: '5f12db6ec77b66c19cb8cbfda6ce3df1f31c8d17';
    tarball: 'https://glab.lad24.ru/api/v4/projects/609/packages/npm/@npm/eslint-config/-/@npm/eslint-config-0.0.5.tgz';
  };
  version: '0.0.5';
  dependencies: {
    'eslint-plugin-prettier': '^4.0.0';
    'eslint-config-prettier': '^8.5.0';
    '@typescript-eslint/eslint-plugin': '^5.29.0';
    '@typescript-eslint/parser': '^5.29.0';
    'eslint-plugin-import': '^2.26.0';
    'eslint-plugin-jest': '^26.5.3';
    'eslint-plugin-react': '^7.30.1';
    'prettier-eslint': '^15.0.1';
  };
}

interface INpmConfigArgv {
  remain: [];
  cooked: string[]; // ['add'];
  original: string[]; // ['add', 'jest'];
}

class Index {
  check = async (argv: yargs.ArgumentsCamelCase<Record<string, unknown>>) => {
    logger.debug(Prefix, argv);
    const npmConfigArgvRaw = execSync('echo $npm_config_argv', {
      encoding: 'utf-8',
    });

    if (npmConfigArgvRaw !== '\n') {
      const npmConfigArgv: INpmConfigArgv = JSON.parse(npmConfigArgvRaw);

      logger.debug(npmConfigArgv.toString());

      npmConfigArgv.original.shift();

      npmConfigArgv.original.forEach((dependency) => {
        checkDep(dependency);
      });
    }

    const output = execSync(
      "yarn list | awk '/[\\w|@|\\/|\\-|.]*@\\d*.\\d*.\\d*[-|\\w|\\.|\\d]*/ {print $2}' | grep -v '[├───└─│]'",
      { encoding: 'utf-8' }
    ).split('\n');

    logger.debug('found dependencies ', output);

    output.forEach((dependency) => {
      checkDep(dependency);
    });
  };
}

const isNpmDeps = (deps: INpmDeps | IOurNpmDeps): deps is INpmDeps =>
  Object.prototype.hasOwnProperty.call(deps, 'time');

const checkDep = async (dependency: string) => {
  logger.info('checking ' + dependency);

  const rawData = execSync(`npm view ${dependency} --json`, {
    encoding: 'utf-8',
  });

  const dependencyData: INpmDeps | IOurNpmDeps = JSON.parse(rawData);

  const version = dependencyData.version;

  if (!isNpmDeps(dependencyData)) {
    logger.warn(`Deps ${dependency} don't have time in npm view`);
    return;
  }

  const publishedDate = dayjs(dependencyData.time[version]);
  const currentDate = dayjs();
  const diffMilliseconds = currentDate.diff(publishedDate);
  const diffDays = ~~(diffMilliseconds / 1000 / 60 / 60 / 24);

  logger.info('was published ' + diffDays + ' days ago');
};

export default new Index();
