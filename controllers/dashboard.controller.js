import ClothService from "../services/cloth.service.js";
import OutfitService from "../services/outfit.service.js";
import WearHistoryService from "../services/wearHistory.service.js";
import { catchAsync } from "../utils/catchAsync.js";
class DashboardController {
  clothService = new ClothService();
  outfitService = new OutfitService();
  wearHistoryService = new WearHistoryService();

  getDashboardData = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const limit = 3;

    const [clothes, clothStats, outfits, outfitStats, wearHistory, wearStats] = await Promise.all([
      this.clothService.getAllClothes({ userId, limit }),
      this.clothService.getClothStats(userId),
      this.outfitService.getAllOutfits({ userId, limit }),
      this.outfitService.getOutfitStats(userId),
      this.wearHistoryService.getAllWearHistory({ userId, limit }),
      this.wearHistoryService.getWearHistoryStats(userId),
    ]);

    res.status(200).json({
      clothes,
      clothStats,
      outfits,
      outfitStats,
      wearHistory,
      wearStats,
    });
  });
}

export default DashboardController;
