import { Interval } from 'date-fns';

import AppointmentType from '../enums/AppointmentType';
import Day from '../enums/Day';

interface IAppointmentDTO {
  type: AppointmentType;

  date: Date | undefined;

  days: Day[] | undefined;

  intervals: Interval[];

  overlappingInterval: Interval;

}

export default IAppointmentDTO;
