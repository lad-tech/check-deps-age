import cache, { MAX_DIFF } from '../constants';

import { getDiffDay } from './getDiffDay';

export const isShouldCheckDep = (dependency: string) => {
  if (!Object.prototype.hasOwnProperty.call(cache, dependency)) return true;

  const diffDays = getDiffDay(cache[dependency]);

  return diffDays < MAX_DIFF;
};
