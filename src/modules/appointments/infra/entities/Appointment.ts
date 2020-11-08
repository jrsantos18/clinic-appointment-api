import { Interval } from 'date-fns';

import AppointmentType from '../../enums/AppointmentType';
import Day from '../../enums/Day';

class Appointment {
  type: AppointmentType;

  date: Date | undefined;

  days: Day[] | undefined;

  intervals: Interval[];

  constructor({
    type, date, days, intervals,
  }: Appointment) {
    this.type = type;
    this.date = date;
    this.days = days;
    this.intervals = intervals;
  }
}

export default Appointment;
