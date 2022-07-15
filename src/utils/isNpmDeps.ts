import { INpmDeps, IOurNpmDeps } from '../types';

import { isObjectHasOwnProperty } from './isObjectHasOwnProperty';

export const isNpmDeps = (deps: INpmDeps | IOurNpmDeps): deps is INpmDeps =>
  isObjectHasOwnProperty(deps, 'time');
