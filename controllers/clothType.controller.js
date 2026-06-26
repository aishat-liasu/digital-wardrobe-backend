import ClothTypeService from "../services/clothType.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export default class ClothTypeController {
  clothTypeService = new ClothTypeService();

  getAll = catchAsync(async (req, res, next) => {
    const data = await this.clothTypeService.getAll();
    res.status(200).json(data);
  });

  getById = catchAsync(async (req, res, next) => {
    res.status(200).json(await this.clothTypeService.getById(req.params.id));
  });

  create = catchAsync(async (req, res, next) => {
    res.status(201).json(await this.clothTypeService.create(req.body));
  });

  update = catchAsync(async (req, res, next) => {
    res
      .status(201)
      .json(await this.clothTypeService.update(req.params.id, req.body));
  });

  delete = catchAsync(async (req, res, next) => {
    await this.clothTypeService.delete(req.params.id);
    res.status(204).end();
  });
}
