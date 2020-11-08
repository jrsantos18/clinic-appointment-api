import AppError from '@shared/errors/AppError';

import { formatDate } from '@modules/appointments/utils/date';
import { areIntervalsValid } from '@modules/appointments/utils/interval';

import AppointmentType from '@modules/appointments/enums/AppointmentType';
import Day from '@modules/appointments/enums/Day';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FindAvailableDatesService from './FindAvailableDatesService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let findAvailableDatesService: FindAvailableDatesService;

describe('FindAvailableDates', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    findAvailableDatesService = new FindAvailableDatesService(fakeAppointmentsRepository);
  });

  it('should give the entire day as an interval if the date doesn\'t have appointments', async () => {
    const availableDates = await findAvailableDatesService.execute({ start: '20-11-2020', end: '20-11-2020' });
    expect(availableDates[0].intervals[0].start).toBe('00:00');
    expect(availableDates[0].intervals[0].end).toBe('23:59');
  });

  it('should give the available intervals if the date have appointments', async () => {
    const [formattedDate] = formatDate('20-11-2020');
    const [formattedIntervals] = areIntervalsValid([{ start: '10:00', end: '11:00' }]);
    const [anotherFormattedIntervals] = areIntervalsValid([{ start: '14:00', end: '14:30' }]);
    const [stillAnotherFormattedIntervals] = areIntervalsValid([{ start: '06:00', end: '07:30' }]);

    await fakeAppointmentsRepository.create({
      type: AppointmentType.UNIQUE,
      days: undefined,
      date: formattedDate,
      intervals: formattedIntervals,
    });

    await fakeAppointmentsRepository.create({
      type: AppointmentType.DAILY,
      days: undefined,
      date: undefined,
      intervals: anotherFormattedIntervals,
    });

    await fakeAppointmentsRepository.create({
      type: AppointmentType.WEEKLY,
      days: [Day.FRIDAY],
      date: undefined,
      intervals: stillAnotherFormattedIntervals,
    });

    const availableDates = await findAvailableDatesService.execute({ start: '20-11-2020', end: '20-11-2020' });
    expect(availableDates[0].intervals[0].start).toBe('00:00');
    expect(availableDates[0].intervals[0].end).toBe('06:00');
    expect(availableDates[0].intervals[1].start).toBe('07:30');
    expect(availableDates[0].intervals[1].end).toBe('10:00');
    expect(availableDates[0].intervals[2].start).toBe('11:00');
    expect(availableDates[0].intervals[2].end).toBe('14:00');
    expect(availableDates[0].intervals[3].start).toBe('14:30');
    expect(availableDates[0].intervals[3].end).toBe('23:59');
  });

  it('should be able to give available intervals for the filter received', async () => {
    const availableDates = await findAvailableDatesService.execute({ start: '20-11-2020', end: '20-11-2020' });
    expect(availableDates).toHaveLength(1);
    expect(availableDates[0].intervals).toHaveLength(1);
    expect(availableDates[0].intervals[0].start).toBe('00:00');
    expect(availableDates[0].intervals[0].end).toBe('23:59');
  });

  it('should throw an error if it receives an invalid date',
    async () => {
      expect(findAvailableDatesService.execute({ start: '40-11-2020', end: '40-11-2020' }))
        .rejects.toBeInstanceOf(AppError);
    });
});
