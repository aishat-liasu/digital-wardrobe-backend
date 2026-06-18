import WearHistoryService from "../services/wearHistory.service.js";

class WearHistoryController {
  wearHistoryService = new WearHistoryService();

  createWearHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const wearHistory = await this.wearHistoryService.createWearHistory(
        userId,
        req.body
      );
      res
        .status(201)
        .json({ message: "WearHistory created successfully", wearHistory });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getAllWearHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const { month, year, limit } = req.query;

      const wearHistory = await this.wearHistoryService.getAllWearHistory({
        userId,
        month,
        year,
        limit,
      });
      res.status(200).json(wearHistory);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };

  getWearHistoryById = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: wearHistoryId } = req.params;
      const wearHistory = await this.wearHistoryService.getWearHistoryById({
        userId,
        wearHistoryId,
      });
      res.status(200).json(wearHistory);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  updateWearHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: wearHistoryId } = req.params;
      const updateData = req.body;
      const wearHistory = await this.wearHistoryService.updateWearHistory({
        wearHistoryId,
        userId,
        updateData,
      });
      res
        .status(201)
        .json({ message: "WearHistory updated successfully", wearHistory });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteWearHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: wearHistoryId } = req.params;
      const result = await this.wearHistoryService.deleteWearHistory({
        wearHistoryId,
        userId,
      });
      res.json({ result, message: "WearHistory deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };

  getWearHistoryStats = async (req, res) => {
    try {
      const stats = await this.wearHistoryService.getWearHistoryStats(
        req.user.id
      );

      res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  };
}

export default WearHistoryController;
