import WearHistoryService from "../services/wearHistory.service.js";
import { catchAsync } from "../utils/catchAsync.js";

class WearHistoryController {
  wearHistoryService = new WearHistoryService();

  createWearHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const wearHistory = await this.wearHistoryService.createWearHistory(
      userId,
      req.body
    );
    res
      .status(201)
      .json({ message: "WearHistory created successfully", wearHistory });
  });

  getAllWearHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { month, year, limit } = req.query;

    const wearHistory = await this.wearHistoryService.getAllWearHistory({
      userId,
      month,
      year,
      limit,
    });
    res.status(200).json(wearHistory);
  });

  getWearHistoryById = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: wearHistoryId } = req.params;
    const wearHistory = await this.wearHistoryService.getWearHistoryById({
      userId,
      id: wearHistoryId,
    });
    res.status(200).json(wearHistory);
  });

  updateWearHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: wearHistoryId } = req.params;
    const updateData = req.body;
    const wearHistory = await this.wearHistoryService.updateWearHistory({
      id: wearHistoryId,
      userId,
      updateData,
    });
    res
      .status(201)
      .json({ message: "WearHistory updated successfully", wearHistory });
  });

  deleteWearHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id: wearHistoryId } = req.params;
    const result = await this.wearHistoryService.deleteWearHistory({
      id: wearHistoryId,
      userId,
    });
    res.json({ result, message: "WearHistory deleted successfully" });
  });

  getWearHistoryStats = catchAsync(async (req, res, next) => {
    const stats = await this.wearHistoryService.getWearHistoryStats(
      req.user.id
    );
    res.status(200).json(stats);
  });
}

export default WearHistoryController;
