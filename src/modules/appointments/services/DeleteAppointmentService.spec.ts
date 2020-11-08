import AppError from '@shared/errors/AppError';

import { formatDate } from '@modules/appointments/utils/date';
import { areIntervalsValid } from '@modules/appointments/utils/interval';

import AppointmentType from '@modules/appointments/enums/AppointmentType';
import Day from '@modules/appointments/enums/Day';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import DeleteAppointmentService from './DeleteAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let deleteAppointmentService: DeleteAppointmentService;

describe('DeleteAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    deleteAppointmentService = new DeleteAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to delete an appointment with same interval, type, date and days', async () => {
    const [formattedDate] = formatDate('20-11-2020');
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = await fakeAppointmentsRepository.create({
      type: AppointmentType.UNIQUE,
      days: undefined,
      date: formattedDate,
      intervals: formattedIntervals,
    });

    const message = await deleteAppointmentService.execute(appointment);
    expect(message).toBe('Registro deletado com sucesso');
  });

  it('should not be able to delete an appointment of another type and same interval', async () => {
    const [formattedDate] = formatDate('20-11-2020');
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = await fakeAppointmentsRepository.create({
      type: AppointmentType.UNIQUE,
      days: undefined,
      date: formattedDate,
      intervals: formattedIntervals,
    });

    await fakeAppointmentsRepository.create({
      type: AppointmentType.WEEKLY,
      days: [Day.MONDAY],
      date: undefined,
      intervals: formattedIntervals,
    });

    await deleteAppointmentService.execute(appointment);

    const appointments = await fakeAppointmentsRepository.get();
    expect(appointments.length).toBe(1);
  });

  it('should not be able to delete an appointment of same type and interval but different date', async () => {
    const [formattedDate] = formatDate('20-11-2020');
    const [otherFormattedDate] = formatDate('21-11-2020');
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = await fakeAppointmentsRepository.create({
      type: AppointmentType.UNIQUE,
      days: undefined,
      date: formattedDate,
      intervals: formattedIntervals,
    });

    await fakeAppointmentsRepository.create({
      type: AppointmentType.UNIQUE,
      days: undefined,
      date: otherFormattedDate,
      intervals: formattedIntervals,
    });

    await deleteAppointmentService.execute(appointment);

    const appointments = await fakeAppointmentsRepository.get();
    expect(appointments.length).toBe(1);
  });

  it('should not be able to delete an appointment of same type and interval but different days', async () => {
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = await fakeAppointmentsRepository.create({
      type: AppointmentType.WEEKLY,
      days: [Day.SATURDAY],
      date: undefined,
      intervals: formattedIntervals,
    });

    await fakeAppointmentsRepository.create({
      type: AppointmentType.WEEKLY,
      days: [Day.MONDAY],
      date: undefined,
      intervals: formattedIntervals,
    });

    await deleteAppointmentService.execute(appointment);

    const appointments = await fakeAppointmentsRepository.get();
    expect(appointments.length).toBe(1);
  });

  it('should be able to tell if there is no appointment to delete', async () => {
    const [formattedDate] = formatDate('20-11-2020');
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = {
      type: AppointmentType.UNIQUE,
      days: undefined,
      date: formattedDate,
      intervals: formattedIntervals,
    };

    const message = await deleteAppointmentService.execute(appointment);
    expect(message).toBe('Nenhum registro encontrado para ser deletado');
  });

  it('should not be able to delete a unformatted appointment',
    async () => {
      expect(deleteAppointmentService.execute(undefined)).rejects.toBeInstanceOf(AppError);
    });
});
