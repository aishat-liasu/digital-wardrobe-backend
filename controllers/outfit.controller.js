import OutfitService from "../services/outfit.service.js";
import { catchAsync } from "../utils/catchAsync.js";

class OutfitController {
  outfitService = new OutfitService();

  createOutfit = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const outfit = await this.outfitService.createOutfit(userId, req.body);
    res.status(201).json({ message: "Outfit created successfully", outfit });
  });

  getAllOutfits = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const {
      page,
      limit,
      occasionId,
      tagIds,
      isFavourite,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    const outfits = await this.outfitService.getAllOutfits({
      userId,
      page,
      limit,
      occasionId,
      tagIds,
      isFavourite,
      search,
      sortBy,
      sortOrder,
    });
    res.status(200).json(outfits);
  });

  getOutfitById = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: outfitId } = req.params;
    const outfit = await this.outfitService.getOutfitById({
      userId,
      outfitId,
    });
    res.status(200).json(outfit);
  });

  getRandomOutfit = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await this.outfitService.getRandomOutfit(userId);
    res.status(200).json(result);
  });

  updateOutfit = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: outfitId } = req.params;
    const updateData = req.body;
    const outfit = await this.outfitService.updateOutfit({
      outfitId,
      userId,
      updateData,
    });
    res.status(201).json({ message: "Outfit updated successfully", outfit });
  });

  deleteOutfit = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: outfitId } = req.params;
    const result = await this.outfitService.deleteOutfit({
      outfitId,
      userId,
    });
    res.json({ result, message: "Outfit deleted successfully" });
  });

  getOutfitStats = catchAsync(async (req, res, next) => {
    const stats = await this.outfitService.getOutfitStats(req.user.id);
    res.status(200).json(stats);
  });
}

export default OutfitController;
