import OutfitTagService from "../services/outfitTag.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export default class OutfitTagController {
  outfitTagService = new OutfitTagService();

  getAll = catchAsync(async (req, res, next) => {
    const data = await this.outfitTagService.getAll();
    res.status(200).json(data);
  });

  getById = catchAsync(async (req, res, next) => {
    res.status(200).json(await this.outfitTagService.getById(req.params.id));
  });

  create = catchAsync(async (req, res, next) => {
    res.status(201).json(await this.outfitTagService.create(req.body));
  });

  update = catchAsync(async (req, res, next) => {
    res
      .status(201)
      .json(await this.outfitTagService.update(req.params.id, req.body));
  });

  delete = catchAsync(async (req, res, next) => {
    await this.outfitTagService.delete(req.params.id);
    res.status(204).end();
  });
}
