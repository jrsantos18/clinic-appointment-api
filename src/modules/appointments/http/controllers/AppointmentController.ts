import { container } from 'tsyringe';
import { Request, Response } from 'express';

import AppointmentsRepository from '@modules/appointments/infra/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import DeleteAppointmentService from '@modules/appointments/services/DeleteAppointmentService';

class AppointmentController {
  public async show(_: Request, response: Response): Promise<Response> {
    const appointmentsRepository = new AppointmentsRepository();
    const appointments = await appointmentsRepository.get(true);

    return response.json(appointments);
  }

  public async create(_: Request, response: Response): Promise<Response> {
    const { formattedAppointment } = response.locals;

    const appointment = await container.resolve(CreateAppointmentService)
      .execute(formattedAppointment);

    return response.json(appointment);
  }

  public async delete(_: Request, response: Response): Promise<Response> {
    const { formattedAppointment } = response.locals;

    const message = await container.resolve(DeleteAppointmentService)
      .execute(formattedAppointment);

    return response.json({ status: 'ok', message });
  }
}

export default AppointmentController;
