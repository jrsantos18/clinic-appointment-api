import {
  format,
  isAfter,
  isBefore,
  addMinutes,
  subMinutes,
  getDay,
  getDate,
  setDate,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  differenceInDays,
  differenceInMinutes,
  roundToNearestMinutes,
  Interval,
} from 'date-fns';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import _ from 'lodash';

import HttpStatusCode from '@shared/enums/HttpStatusCode';
import AppError from '@shared/errors/AppError';

import { formatDate } from '@modules/appointments/utils/date';
import { isAppointmentAfter } from '@modules/appointments/utils/appointment';

import AppointmentType from '@modules/appointments/enums/AppointmentType';
import IIntervalDTO from '@modules/appointments/dtos/IIntervalDTO';
import Appointment from '@modules/appointments/infra/entities/Appointment';
import AvailableDate from '@modules/appointments/infra/entities/AvailableDate';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  start: string,
  end: string,
}

@injectable()
class FindAvailableDatesService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({
    start, end,
  }: IRequest): Promise<AvailableDate[]> {
    const [formattedStart, isStartValid] = formatDate(start);
    const [formattedEnd, isEndValid] = formatDate(end);

    if (!isStartValid || !isEndValid) {
      throw new AppError('Intervalo inválido', HttpStatusCode.BAD_REQUEST);
    }

    const appointments = await this.appointmentsRepository.get();

    const days = eachDayOfInterval({ start: formattedStart, end: formattedEnd });
    const weekDays = days.map((day) => getDay(day));
    const dayOfFilter = getDate(formattedStart);

    const filteredAppointments: Appointment[] = appointments.filter(
      (appointment) => ((appointment.date && (
        differenceInDays(appointment.date, formattedStart) === 0
        || differenceInDays(appointment.date, formattedEnd) === 0
        || (isAfter(appointment.date, formattedStart)
          && isBefore(appointment.date, formattedEnd)
        ))) || appointment.type === AppointmentType.DAILY
        || (appointment.type === AppointmentType.WEEKLY
          && weekDays.some((weekDay) => appointment.days!.includes(weekDay)))),
    ).sort((current, next) => isAppointmentAfter(current, next)).map((appointment) => ({
      type: appointment.type,
      days: appointment.days,
      date: appointment.date,
      intervals: appointment.intervals.map((appointmentInterval) => (
        {
          start: setDate(appointmentInterval.start, dayOfFilter),
          end: setDate(appointmentInterval.end, dayOfFilter),
        }
      )),
    }));

    const availableDates: AvailableDate[] = [];

    days.forEach((day) => {
      const dayIntervals: Interval[] = _.flatten(filteredAppointments.filter((appointment) => (
        (!appointment.date && !appointment.days)
        || (appointment.days && appointment.days.includes(getDay(day)))
        || (appointment.date && differenceInDays(day, appointment.date) === 0)
      )).map((appointment) => appointment.intervals));

      let lastStart = startOfDay(day);
      let lastEnd = endOfDay(day);
      const formattedAvailableIntervals: IIntervalDTO[] = [];

      for (let j = 0; j < dayIntervals.length; j++) {
        const dayInterval = dayIntervals[j];

        const newStart = addMinutes(lastStart, differenceInMinutes(dayInterval.start, lastStart));
        if (differenceInMinutes(newStart, lastStart) !== 0) {
          formattedAvailableIntervals.push({
            start: format(lastStart, 'HH:mm'),
            end: format(newStart, 'HH:mm'),
          });
        }

        const newEnd = roundToNearestMinutes(
          subMinutes(lastEnd, differenceInMinutes(lastEnd, dayInterval.end)),
          { nearestTo: 15 },
        );
        if (dayIntervals.length > 1 && j + 1 < dayIntervals.length) {
          lastEnd = subMinutes(lastEnd, differenceInMinutes(lastEnd, dayIntervals[j + 1].start));
          lastEnd = roundToNearestMinutes(lastEnd, { nearestTo: 15 });
        } else {
          lastEnd = endOfDay(day);
        }

        lastStart = lastEnd;

        if (differenceInMinutes(newEnd, lastEnd) !== 0) {
          formattedAvailableIntervals.push({
            start: format(newEnd, 'HH:mm'),
            end: format(lastEnd, 'HH:mm'),
          });
        }

        lastEnd = newEnd;
      }

      if (formattedAvailableIntervals.length === 0) {
        formattedAvailableIntervals.push({
          start: format(lastStart, 'HH:mm'),
          end: format(lastEnd, 'HH:mm'),
        });
      }

      availableDates.push({
        day: format(day, 'dd-MM-yyyy'),
        intervals: formattedAvailableIntervals,
      });
    });

    return availableDates;
  }
}

export default FindAvailableDatesService;
