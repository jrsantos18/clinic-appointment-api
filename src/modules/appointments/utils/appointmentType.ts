import AppointmentType from '@modules/appointments/enums/AppointmentType';

export function isAppointmentTypeValid(type: AppointmentType): boolean {
  return Object.values(AppointmentType).includes(type);
}

export function formatAppointmentType(type: AppointmentType): string {
  switch (type) {
    case AppointmentType.UNIQUE:
      return 'ÚNICO';
    case AppointmentType.DAILY:
      return 'DIÁRIO';
    case AppointmentType.WEEKLY:
      return 'SEMANAL';
    default:
      return 'TIPO INVÁLIDO';
  }
}
