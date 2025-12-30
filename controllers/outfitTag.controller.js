import OutfitTagService from "../services/outfitTag.service.js";

export default class OutfitTagController {
  outfitTagService = new OutfitTagService();

  getAll = async (req, res, next) => {
    try {
      const data = await this.outfitTagService.getAll();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      res.status(200).json(await this.outfitTagService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      res.status(201).json(await this.outfitTagService.create(req.body));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      res
        .status(201)
        .json(await this.outfitTagService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.outfitTagService.delete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
