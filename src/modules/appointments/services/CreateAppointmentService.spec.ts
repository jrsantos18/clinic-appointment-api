import AppError from '@shared/errors/AppError';

import { formatDate } from '@modules/appointments/utils/date';
import { areIntervalsValid } from '@modules/appointments/utils/interval';

import AppointmentType from '@modules/appointments/enums/AppointmentType';
import Day from '@modules/appointments/enums/Day';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to create a new unique appointment', async () => {
    const [formattedDate] = formatDate('20-11-2020');
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = await createAppointmentService.execute({
      type: AppointmentType.UNIQUE,
      days: undefined,
      date: formattedDate,
      intervals: formattedIntervals,
    });

    expect(appointment).toHaveProperty('date');
  });

  it('should be able to create a new daily appointment', async () => {
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = await createAppointmentService.execute({
      type: AppointmentType.DAILY,
      days: undefined,
      date: undefined,
      intervals: formattedIntervals,
    });

    expect(appointment).toHaveProperty('date');
  });

  it('should be able to create a new weekly appointment', async () => {
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

    const appointment = await createAppointmentService.execute({
      type: AppointmentType.WEEKLY,
      days: [Day.MONDAY, Day.FRIDAY],
      date: undefined,
      intervals: formattedIntervals,
    });

    expect(appointment).toHaveProperty('date');
  });

  it('should not be able to create two unique appointments with overlapping intervals',
    async () => {
      const [formattedDate] = formatDate('20-11-2020');
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.UNIQUE,
        days: undefined,
        date: formattedDate,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.UNIQUE,
        days: undefined,
        date: formattedDate,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create two daily appointments with overlapping intervals',
    async () => {
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.DAILY,
        days: undefined,
        date: undefined,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.DAILY,
        days: undefined,
        date: undefined,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create two weekly appointments with overlapping intervals',
    async () => {
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.WEEKLY,
        days: [Day.MONDAY, Day.FRIDAY],
        date: undefined,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.WEEKLY,
        days: [Day.MONDAY, Day.FRIDAY],
        date: undefined,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create a unique appointment with overlapping intervals of a daily one',
    async () => {
      const [formattedDate] = formatDate('20-11-2020');
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.DAILY,
        days: undefined,
        date: undefined,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.UNIQUE,
        days: undefined,
        date: formattedDate,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create a unique appointment with overlapping intervals of a weekly one',
    async () => {
      const [formattedDate] = formatDate('20-11-2020');
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.WEEKLY,
        days: [Day.FRIDAY],
        date: undefined,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.UNIQUE,
        days: undefined,
        date: formattedDate,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create a daily appointment with overlapping intervals of a unique one',
    async () => {
      const [formattedDate] = formatDate('20-11-2020');
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.UNIQUE,
        days: undefined,
        date: formattedDate,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.DAILY,
        days: undefined,
        date: undefined,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create a daily appointment with overlapping intervals of a weekly one',
    async () => {
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.WEEKLY,
        days: [Day.MONDAY],
        date: undefined,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.DAILY,
        days: undefined,
        date: undefined,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create a weekly appointment with overlapping intervals of a unique one',
    async () => {
      const [formattedDate] = formatDate('20-11-2020');
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.UNIQUE,
        days: undefined,
        date: formattedDate,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.WEEKLY,
        days: [Day.FRIDAY],
        date: undefined,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create a weekly appointment with overlapping intervals of a daily one',
    async () => {
      const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);

      await createAppointmentService.execute({
        type: AppointmentType.DAILY,
        days: undefined,
        date: undefined,
        intervals: formattedIntervals,
      });

      const [otherFormattedIntervals] = areIntervalsValid([{ start: '09:00', end: '11:00' }]);
      expect(createAppointmentService.execute({
        type: AppointmentType.WEEKLY,
        days: [Day.MONDAY],
        date: undefined,
        intervals: otherFormattedIntervals,
      })).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to create a unformatted appointment',
    async () => {
      expect(createAppointmentService.execute(undefined)).rejects.toBeInstanceOf(AppError);
    });
});
