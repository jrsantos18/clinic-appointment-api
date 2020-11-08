import { Router } from 'express';

import formatRequest from '@modules/appointments/http/middlewares/formatRequest';

import AppointmentController from '../controllers/AppointmentController';
import AvailableDatesController from '../controllers/AvailableDatesController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();
const availableDatesController = new AvailableDatesController();

appointmentsRouter.get('/', appointmentController.show);

appointmentsRouter.post('/', formatRequest, appointmentController.create);

appointmentsRouter.delete('/', formatRequest, appointmentController.delete);

appointmentsRouter.get('/available', availableDatesController.index);

export default appointmentsRouter;
