import ClothStatus from "../models/cloth_status.model.js";
import { AppError } from "../utils/appError.js";

export default class ClothStatusService {
  getAll = async () => {
    return ClothStatus.findAll({ order: [["name", "ASC"]] });
  };

  getById = async (id) => {
    const type = await ClothStatus.findByPk(id);
    if (!type) throw new AppError(404, "Cloth status not found");
    return type;
  };

  create = async (data) => {
    return ClothStatus.create(data);
  };

  update = async (id, data) => {
    const type = await ClothStatus.findByPk(id);
    if (!type) throw new AppError(404, "Cloth status not found");
    return type.update(data);
  };

  delete = async (id) => {
    const type = await ClothStatus.findByPk(id);
    if (!type) throw new AppError(404, "Cloth status not found");
    await type.destroy();
  };
}
