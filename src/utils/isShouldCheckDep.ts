import { MAX_DIFF_DAYS } from '../constants';
import { getCache } from '../cache';

import { getDiffDay } from './getDiffDay';
import { isObjectHasOwnProperty } from './isObjectHasOwnProperty';

export const isShouldCheckDep = (dependency: string) => {
  const CACHE = getCache();
  if (!isObjectHasOwnProperty(CACHE, dependency)) return true;

  const diffDays = getDiffDay(CACHE[dependency]);

  return diffDays < MAX_DIFF_DAYS;
};
