import fs from 'fs';

import { parseISO, format } from 'date-fns';

import databaseConfig from '@config/database';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/entities/Appointment';

interface Database {
  appointments: Appointment[]
}

const intervalKeys = ['start', 'end'];

class AppointmentsRepository implements IAppointmentRepository {
  private async readDatabase(formattedDates?: boolean): Promise<Database> {
    const appointmentsDataBaseJSON = await fs.promises.readFile(databaseConfig.databaseDirectory);
    return JSON.parse(appointmentsDataBaseJSON.toString(), (key, value) => {
      if (intervalKeys.includes(key)) {
        return formattedDates ? format(parseISO(value), 'HH:mm') : parseISO(value);
      }
      if (key === 'date') {
        return formattedDates ? format(parseISO(value), 'dd-MM-yyyy') : parseISO(value);
      }

      return value;
    });
  }

  private async writeToDatabase(stringifiedObject: string): Promise<void> {
    return fs.promises.writeFile(databaseConfig.databaseDirectory, stringifiedObject);
  }

  public async get(formattedDates?: boolean): Promise<Appointment[]> {
    const appointmentsDataBase = await this.readDatabase(formattedDates);
    return appointmentsDataBase.appointments;
  }

  public async create(appointment: Appointment): Promise<Appointment> {
    const appointmentsDataBase = await this.readDatabase();

    appointmentsDataBase.appointments.push(appointment);

    await this.update(appointmentsDataBase.appointments);

    return appointment;
  }

  public async update(appointments: Appointment[]): Promise<void> {
    const updatedAppointmentsDataBaseJSON = JSON.stringify({ appointments });
    await this.writeToDatabase(updatedAppointmentsDataBaseJSON);
  }
}

export default AppointmentsRepository;
