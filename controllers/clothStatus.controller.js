import ClothStatusService from "../services/clothStatus.service.js";

export default class ClothTypeController {
  clothStatusService = new ClothStatusService();

  getAll = async (req, res, next) => {
    try {
      const data = await this.clothStatusService.getAll();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      res
        .status(200)
        .json(await this.clothStatusService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name, description } = req.body;
      res
        .status(201)
        .json(await this.clothStatusService.create({ name, description }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      res
        .status(201)
        .json(await this.clothStatusService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.clothStatusService.delete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
