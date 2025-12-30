import OutfitOccasion from "../models/outfit_occasion.model.js";
import { AppError } from "../utils/appError.js";

export default class OutfitOccasionService {
  getAll = async () => {
    return OutfitOccasion.findAll({ order: [["name", "ASC"]] });
  };

  getById = async (id) => {
    const occasion = await OutfitOccasion.findByPk(id);
    if (!occasion) throw new AppError(404, "Outfit occasion not found");
    return occasion;
  };

  create = async (data) => {
    return OutfitOccasion.create(data);
  };

  update = async (id, data) => {
    const occasion = await OutfitOccasion.getById(id);
    return occasion.update(data);
  };

  delete = async (id) => {
    const occasion = await OutfitOccasion.getById(id);
    await occasion.destroy();
  };
}
