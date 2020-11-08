import { isAfter, isBefore } from 'date-fns';

import Appointment from '@modules/appointments/infra/entities/Appointment';

// eslint-disable-next-line import/prefer-default-export
export function isAppointmentAfter(
  firstAppointment: Appointment,
  secondAppointment: Appointment,
): number {
  if (isBefore(firstAppointment.intervals[0].start, secondAppointment.intervals[0].start)) {
    return -1;
  }
  if (isAfter(firstAppointment.intervals[0].start, secondAppointment.intervals[0].start)) {
    return 1;
  }

  return 0;
}
