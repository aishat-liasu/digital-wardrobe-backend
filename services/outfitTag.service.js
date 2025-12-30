import OutfitTag from "../models/outfit_tag.model.js";
import { AppError } from "../utils/appError.js";

export default class OutfitTagService {
  getAll = async () => {
    return OutfitTag.findAll({ order: [["name", "ASC"]] });
  };

  getById = async (id) => {
    const tag = await OutfitTag.findByPk(id);
    if (!tag) throw new AppError(404, "Outfit tag not found");
    return tag;
  };

  create = async (data) => {
    return OutfitTag.create(data);
  };

  update = async (id, data) => {
    const tag = await OutfitTag.getById(id);
    return tag.update(data);
  };

  delete = async (id) => {
    const tag = await OutfitTag.getById(id);
    await tag.destroy();
  };
}
