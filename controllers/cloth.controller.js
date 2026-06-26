import ClothService from "../services/cloth.service.js";
import { catchAsync } from "../utils/catchAsync.js";

class ClothController {
  clothService = new ClothService();

  createCloth = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const cloth = await this.clothService.createCloth(userId, req.body);
    res.status(201).json({ message: "Cloth created successfully", cloth });
  });

  getAllClothes = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { page, limit, clothTypeId, statusIds, search, sortBy, sortOrder } =
      req.query;

    const clothes = await this.clothService.getAllClothes({
      userId,
      page,
      limit,
      clothTypeId,
      statusIds,
      search,
      sortBy,
      sortOrder,
    });
    res.status(200).json(clothes);
  });

  getClothById = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: clothId } = req.params;
    const cloth = await this.clothService.getClothById({ userId, clothId });
    res.status(200).json(cloth);
  });

  updateCloth = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: clothId } = req.params;
    const updateData = req.body;
    const cloth = await this.clothService.updateCloth({
      clothId,
      userId,
      updateData,
    });
    res.status(201).json({ message: "Cloth updated successfully", cloth });
  });

  deleteCloth = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: clothId } = req.params;
    const result = await this.clothService.deleteCloth({ clothId, userId });
    res.json({ result, message: "Cloth deleted successfully" });
  });

  getClothStats = catchAsync(async (req, res, next) => {
    const stats = await this.clothService.getClothStats(req.user.id);
    res.status(200).json(stats);
  });
}

export default ClothController;
