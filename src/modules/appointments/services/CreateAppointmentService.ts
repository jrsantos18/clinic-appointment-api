/* eslint-disable indent */
import {
  format,
  isSameDay,
  areIntervalsOverlapping,
  getDay,
} from 'date-fns';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import HttpStatusCode from '@shared/enums/HttpStatusCode';
import AppError from '@shared/errors/AppError';

import { formatAppointmentType } from '@modules/appointments/utils/appointmentType';
import { formatDays } from '@modules/appointments/utils/day';

import IAppointmentDTO from '@modules/appointments/dtos/IAppointmentDTO';
import AppointmentType from '@modules/appointments/enums/AppointmentType';
import Appointment from '@modules/appointments/infra/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute(formattedAppointment: Appointment | undefined): Promise<Appointment> {
    if (!formattedAppointment) {
      throw new AppError('Erro na formatação da requisição', HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    const appointments = await this.appointmentsRepository.get();
    const appointmentsWithOverlappingIntervals: IAppointmentDTO[] = [];

    appointments.forEach((appointment) => {
      formattedAppointment.intervals.forEach((newInterval) => {
        appointment.intervals.forEach((oldInterval) => {
          if (areIntervalsOverlapping(oldInterval, newInterval)) {
            appointmentsWithOverlappingIntervals.push({
              ...appointment,
              overlappingInterval: oldInterval,
            });
          }
        });
      });
    });

    appointmentsWithOverlappingIntervals.forEach((oldAppointment) => {
      if (formattedAppointment.type === AppointmentType.UNIQUE) {
        if (
          (oldAppointment.type === AppointmentType.UNIQUE
            && isSameDay(formattedAppointment.date!, oldAppointment.date!))
          || (oldAppointment.type === AppointmentType.DAILY)
          || (oldAppointment.type === AppointmentType.WEEKLY
            && oldAppointment.days!.includes(getDay(formattedAppointment.date!)))
        ) {
          this.formatErrorMessage(oldAppointment);
        }
      } else if (formattedAppointment.type === AppointmentType.DAILY) {
        this.formatErrorMessage(oldAppointment);
      } else if (formattedAppointment.type === AppointmentType.WEEKLY) {
        if ((oldAppointment.type === AppointmentType.UNIQUE
          && formattedAppointment.days!.includes(getDay(oldAppointment.date!)))
          || (oldAppointment.type === AppointmentType.DAILY)
          || (oldAppointment.type === AppointmentType.WEEKLY
            && oldAppointment.days!.some((day) => formattedAppointment.days!.includes(day)))) {
          this.formatErrorMessage(oldAppointment);
        }
      }
    });

    return this.appointmentsRepository.create(formattedAppointment);
  }

  private formatErrorMessage(oldAppointment: IAppointmentDTO) {
    const formattedDate = oldAppointment.date && `(${format(oldAppointment.date, 'dd-MM-yyyy')})`;
    const formattedDays = oldAppointment.days && `(${formatDays(oldAppointment.days)})`;
    throw new AppError('Existem intervalos sobrepondo o atendimento'
      + `${formatAppointmentType(oldAppointment.type) + formattedDate + formattedDays}`
      + `[${format(oldAppointment.overlappingInterval.start, 'HH:mm')}, `
      + `${format(oldAppointment.overlappingInterval.end, 'HH:mm')}]!`, HttpStatusCode.BAD_REQUEST);
  }
}

export default CreateAppointmentService;
