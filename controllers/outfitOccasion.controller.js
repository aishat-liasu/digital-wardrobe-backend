import OutfitOccasionService from "../services/outfitOccasion.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export default class OutfitOccasionController {
  outfitOccasionService = new OutfitOccasionService();

  getAll = catchAsync(async (req, res, next) => {
    const data = await this.outfitOccasionService.getAll();
    res.status(200).json(data);
  });

  getById = catchAsync(async (req, res, next) => {
    res
      .status(200)
      .json(await this.outfitOccasionService.getById(req.params.id));
  });

  create = catchAsync(async (req, res, next) => {
    res.status(201).json(await this.outfitOccasionService.create(req.body));
  });

  update = catchAsync(async (req, res, next) => {
    res
      .status(201)
      .json(await this.outfitOccasionService.update(req.params.id, req.body));
  });

  delete = catchAsync(async (req, res, next) => {
    await this.outfitOccasionService.delete(req.params.id);
    res.status(204).end();
  });
}
