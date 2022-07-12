import { INpmDeps, IOurNpmDeps } from '../types';

export const isNpmDeps = (deps: INpmDeps | IOurNpmDeps): deps is INpmDeps =>
  Object.prototype.hasOwnProperty.call(deps, 'time');
