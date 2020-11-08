import Day from '@modules/appointments/enums/Day';

export function formatDay(day: Day): string {
  switch (day) {
    case Day.SUNDAY:
      return 'DOMINGO';
    case Day.MONDAY:
      return 'SEGUNDA';
    case Day.TUESDAY:
      return 'TERÇA';
    case Day.WEDNESDAY:
      return 'QUARTA';
    case Day.THURSDAY:
      return 'QUINTA';
    case Day.FRIDAY:
      return 'SEXTA';
    case Day.SATURDAY:
      return 'SÁBADO';
    default:
      return 'DIA INVÁLIDO';
  }
}

export function formatDays(days: Day[]): string {
  let formattedDays: string = '';
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    formattedDays += formatDay(day);

    if (i + 1 < days.length) {
      formattedDays += ', ';
    }
  }
  return formattedDays;
}

export function areDaysValid(days: Day[]): Day | undefined {
  const invalidDay = days.find((day) => !Object.values(Day).includes(day));
  return invalidDay;
}
