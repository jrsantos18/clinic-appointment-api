import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async get(): Promise<Appointment[]> {
    return this.appointments;
  }

  public async create(appointmentDTO: Appointment): Promise<Appointment> {
    this.appointments.push(appointmentDTO);
    return appointmentDTO;
  }

  public async update(appointments: Appointment[]): Promise<void> {
    this.appointments = appointments;
  }
}

export default FakeAppointmentsRepository;
