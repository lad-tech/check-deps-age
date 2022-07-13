import { isShouldCheckDep } from './isShouldCheckDep';
import { checkDep } from './checkDep';

export const checker = async (arr: string[]) => {
  for (const dependency of arr) {
    isShouldCheckDep(dependency) && (await checkDep(dependency));
  }
};
