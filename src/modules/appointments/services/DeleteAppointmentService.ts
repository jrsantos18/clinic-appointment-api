import {
  differenceInDays,
  differenceInHours,
} from 'date-fns';
import _ from 'lodash';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import HttpStatusCode from '@shared/enums/HttpStatusCode';
import AppError from '@shared/errors/AppError';

import AppointmentType from '@modules/appointments/enums/AppointmentType';
import Appointment from '@modules/appointments/infra/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

@injectable()
class DeleteAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute(formattedAppointment: Appointment | undefined): Promise<string> {
    if (!formattedAppointment) {
      throw new AppError('Erro na formatação da requisição', HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    const appointments = await this.appointmentsRepository.get();

    const filteredAppointments = appointments.filter((appointment) => (
      appointment.type !== formattedAppointment.type
      || differenceInHours(appointment.intervals[0].start,
        formattedAppointment.intervals[0].start) !== 0
      || (
        (formattedAppointment.type === AppointmentType.UNIQUE
          && differenceInDays(appointment.date!, formattedAppointment.date!) !== 0)
        || (formattedAppointment.type === AppointmentType.WEEKLY
          && !_.isEqual(appointment.days, formattedAppointment.days))
      )
    ));

    if (appointments.length === filteredAppointments.length) {
      return 'Nenhum registro encontrado para ser deletado';
    }

    await this.appointmentsRepository.update(filteredAppointments);

    return 'Registro deletado com sucesso';
  }
}

export default DeleteAppointmentService;
