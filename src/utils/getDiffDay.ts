import dayjs from 'dayjs';

import { CURRENT_DATE } from '../constants';

export const getDiffDay = (date: Parameters<typeof dayjs>[0]) => {
  const publishedDate = dayjs(date);
  const diffMilliseconds = CURRENT_DATE.diff(publishedDate);

  return ~~(diffMilliseconds / 1000 / 60 / 60 / 24);
};
