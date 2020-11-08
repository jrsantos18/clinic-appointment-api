import { container } from 'tsyringe';
import { Request, Response } from 'express';

import FindAvailableDatesService from '@modules/appointments/services/FindAvailableDatesService';

class AvailableDatesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { start, end } = request.body;

    const availableDates = await container.resolve(FindAvailableDatesService).execute({
      start,
      end,
    });

    return response.json(availableDates);
  }
}

export default AvailableDatesController;
