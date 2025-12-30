import OutfitOccasionService from "../services/outfitOccasion.service.js";

export default class OutfitOccasionController {
  outfitOccasionService = new OutfitOccasionService();

  getAll = async (req, res, next) => {
    try {
      const data = await this.outfitOccasionService.getAll();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      res
        .status(200)
        .json(await this.outfitOccasionService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      res.status(201).json(await this.outfitOccasionService.create(req.body));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      res
        .status(201)
        .json(await this.outfitOccasionService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.outfitOccasionService.delete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
