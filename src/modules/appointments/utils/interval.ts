import {
  parse,
  isValid,
  isAfter,
  areIntervalsOverlapping,
  Interval,
} from 'date-fns';

import IIntervalDTO from '@modules/appointments/dtos/IIntervalDTO';

export function formatInterval(interval: IIntervalDTO): Interval {
  const start = parse(interval.start, 'HH:mm', new Date());
  const end = parse(interval.end, 'HH:mm', new Date());
  return { start, end };
}

export function isIntervalValid(interval: Interval): boolean {
  return isValid(interval.start) && isValid(interval.end)
    && isAfter(interval.start, interval.end);
}

export function areIntervalsValid(intervals: IIntervalDTO[]): [Interval[], boolean] {
  const formattedIntervals: Interval[] = intervals.map((interval) => formatInterval(interval));

  for (let i = 0; i < formattedIntervals.length; i++) {
    const interval = formattedIntervals[i];

    if (!isIntervalValid(interval) || (i > 0 && areIntervalsOverlapping(
      interval,
      formattedIntervals[i - 1],
    ))) {
      return [formattedIntervals, false];
    }
  }

  return [formattedIntervals, true];
}
