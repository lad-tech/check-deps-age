import { isShouldCheckDep } from './isShouldCheckDep';
import { checkDep } from './checkDep';

export const checker = (arr: string[]) => {
  arr.forEach((dependency) => {
    isShouldCheckDep(dependency) && checkDep(dependency);
  });
};
