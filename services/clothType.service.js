import ClothType from "../models/cloth_type.model.js";
import { AppError } from "../utils/appError.js";

export default class ClothTypeService {
  getAll = async () => {
    return ClothType.findAll({ order: [["name", "ASC"]] });
  };

  getById = async (id) => {
    const type = await ClothType.findByPk(id);
    if (!type) throw new AppError(404, "Cloth type not found");
    return type;
  };

  create = async (data) => {
    return ClothType.create(data);
  };

  update = async (id, data) => {
    const type = await ClothType.findByPk(id);
    if (!type) throw new AppError(404, "Cloth type not found");
    return type.update(data);
  };

  delete = async (id) => {
    const type = await ClothType.findByPk(id);
    if (!type) throw new AppError(404, "Cloth type not found");
    await type.destroy();
  };
}
