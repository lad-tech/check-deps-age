import { execSync } from 'child_process';

import logger from '../logger';
import { INpmDeps, IOurNpmDeps } from '../types';

import { isNpmDeps } from './isNpmDeps';
import { getDiffDay } from './getDiffDay';

export const checkDep = async (dependency: string) => {
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

  const diffDays = getDiffDay(dependencyData.time[version]);

  logger.info('was published ' + diffDays + ' days ago');

  return diffDays;
};
