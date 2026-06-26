import ClothStatusService from "../services/clothStatus.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export default class ClothTypeController {
  clothStatusService = new ClothStatusService();

  getAll = catchAsync(async (req, res, next) => {
    const data = await this.clothStatusService.getAll();
    res.status(200).json(data);
  });

  getById = catchAsync(async (req, res, next) => {
    res
      .status(200)
      .json(await this.clothStatusService.getById(req.params.id));
  });

  create = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    res
      .status(201)
      .json(await this.clothStatusService.create({ name, description }));
  });

  update = catchAsync(async (req, res, next) => {
    res
      .status(201)
      .json(await this.clothStatusService.update(req.params.id, req.body));
  });

  delete = catchAsync(async (req, res, next) => {
    await this.clothStatusService.delete(req.params.id);
    res.status(204).end();
  });
}
