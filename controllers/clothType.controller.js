import ClothTypeService from "../services/clothType.service.js";

export default class ClothTypeController {
  clothTypeService = new ClothTypeService();

  getAll = async (req, res, next) => {
    try {
      const data = await this.clothTypeService.getAll();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      res.status(200).json(await this.clothTypeService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      res.status(201).json(await this.clothTypeService.create(req.body));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      res
        .status(201)
        .json(await this.clothTypeService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.clothTypeService.delete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
