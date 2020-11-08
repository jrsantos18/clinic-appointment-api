import { parse, isValid } from 'date-fns';

// eslint-disable-next-line import/prefer-default-export
export function formatDate(date: string): [Date, boolean] {
  const formattedDate = parse(date, 'dd-MM-yyyy', new Date());
  const isDateValid = isValid(formattedDate);
  return [formattedDate, isDateValid];
}
