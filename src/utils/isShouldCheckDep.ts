import CACHE, { MAX_DIFF_DAYS } from '../constants';

import { getDiffDay } from './getDiffDay';
import { isObjectHasOwnProperty } from './isObjectHasOwnProperty';

export const isShouldCheckDep = (dependency: string) => {
  if (!isObjectHasOwnProperty(CACHE, dependency)) return true;

  const diffDays = getDiffDay(CACHE[dependency]);

  return diffDays < MAX_DIFF_DAYS;
};
