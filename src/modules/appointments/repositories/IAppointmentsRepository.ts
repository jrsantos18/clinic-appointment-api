import Appointment from '../infra/entities/Appointment';

interface IAppointmentRepository {
  get(): Promise<Appointment[]>;
  update(appointments: Appointment[]): Promise<void>
  create(appointment: Appointment): Promise<Appointment>;
}

export default IAppointmentRepository;
