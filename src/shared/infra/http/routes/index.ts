import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/http/routes/appointments.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);

export default routes;
