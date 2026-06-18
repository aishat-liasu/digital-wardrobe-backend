import ClothService from "../services/cloth.service.js";
import OutfitService from "../services/outfit.service.js";
import WearHistoryService from "../services/wearHistory.service.js";

class DashboardController {
  clothService = new ClothService();
  outfitService = new OutfitService();
  wearHistoryService = new WearHistoryService();

  getDashboardData = async (req, res) => {
    try {
      const userId = req.user.id;
      const limit = 3;

      const [clothes, clothStats, outfits, outfitStats, wearHistory, wearStats] = await Promise.all([
        this.clothService.getAllClothes({ userId, limit }),
        this.clothService.getClothStats(userId),
        this.outfitService.getAllOutfits({ userId, limit }),
        this.outfitService.getOutfitStats(userId),
        this.wearHistoryService.getAllWearHistory({ userId, limit }),
        this.wearHistoryService.getWearStats(userId),
      ]);

      res.status(200).json({
        clothes,
        clothStats,
        outfits,
        outfitStats,
        wearHistory,
        wearStats,
      });
    } catch (error) {
      console.error("Dashboard data aggregation failed:", error);
      res.status(500).json({ message: "Failed to load dashboard data" });
    }
  };
}

export default DashboardController;
