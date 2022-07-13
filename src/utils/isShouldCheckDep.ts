import CACHE, { MAX_DIFF_DAYS } from '../constants';

import { getDiffDay } from './getDiffDay';

export const isShouldCheckDep = (dependency: string) => {
  if (!Object.prototype.hasOwnProperty.call(CACHE, dependency)) return true;

  const diffDays = getDiffDay(CACHE[dependency]);

  return diffDays < MAX_DIFF_DAYS;
};
