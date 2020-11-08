import { Request, Response, NextFunction } from 'express';

import HttpStatusCode from '@shared/enums/HttpStatusCode';
import AppError from '@shared/errors/AppError';

import { isAppointmentTypeValid } from '@modules/appointments/utils/appointmentType';
import { formatDate } from '@modules/appointments/utils/date';
import { areDaysValid } from '@modules/appointments/utils/day';
import { areIntervalsValid } from '@modules/appointments/utils/interval';

import IIntervalDTO from '@modules/appointments/dtos/IIntervalDTO';
import Day from '@modules/appointments/enums/Day';
import AppointmentType from '@modules/appointments/enums/AppointmentType';

interface IRequest {
  type: AppointmentType;
  date: string;
  days: Day[];
  intervals: IIntervalDTO[];
}

export default function formatRequest(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const {
    type, date, days, intervals,
  }: IRequest = request.body;

  if (!isAppointmentTypeValid(type)) {
    throw new AppError('Tipo de atendimento inválido!', HttpStatusCode.BAD_REQUEST);
  }

  const [formattedDate, isDateValid] = formatDate(date);
  if (type === AppointmentType.UNIQUE && !isDateValid) {
    throw new AppError('A data é inválida!', HttpStatusCode.BAD_REQUEST);
  }

  if (type === AppointmentType.WEEKLY) {
    const invalidDay = areDaysValid(days);
    if (invalidDay) {
      throw new AppError(`O dia ${invalidDay} é inválido!`, HttpStatusCode.BAD_REQUEST);
    }
  }

  const [formattedIntervals, invalidInterval] = areIntervalsValid(intervals);

  if (invalidInterval) {
    throw new AppError('Existem intervalos inválidos!', HttpStatusCode.BAD_REQUEST);
  }

  response.locals.formattedAppointment = {
    type,
    date: type === AppointmentType.UNIQUE ? formattedDate : undefined,
    days: type === AppointmentType.WEEKLY ? days : undefined,
    intervals: formattedIntervals,
  };

  return next();
}
