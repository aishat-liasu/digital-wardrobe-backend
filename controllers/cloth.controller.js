import ClothService from "../services/cloth.service.js";

class ClothController {
  clothService = new ClothService();

  createCloth = async (req, res) => {
    try {
      const userId = req.user.id;
      const cloth = await this.clothService.createCloth(userId, req.body);
      res.status(201).json({ message: "Cloth created successfully", cloth });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getAllClothes = async (req, res) => {
    try {
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
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };

  getClothById = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: clothId } = req.params;
      const cloth = await this.clothService.getClothById({ userId, clothId });
      res.status(200).json(cloth);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  updateCloth = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: clothId } = req.params;
      const updateData = req.body;
      const cloth = await this.clothService.updateCloth({
        clothId,
        userId,
        updateData,
      });
      res.status(201).json({ message: "Cloth updated successfully", cloth });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteCloth = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: clothId } = req.params;
      const result = await this.clothService.deleteCloth({ clothId, userId });
      res.json({ result, message: "Cloth deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getClothStats = async (req, res) => {
    try {
      const stats = await this.clothService.getClothStats(req.user.id);

      res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  };
}

export default ClothController;
