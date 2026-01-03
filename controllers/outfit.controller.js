import OutfitService from "../services/outfit.service.js";

class OutfitController {
  outfitService = new OutfitService();

  createOutfit = async (req, res) => {
    try {
      const userId = req.user.id;
      const outfit = await this.outfitService.createOutfit(userId, req.body);
      res.status(201).json({ message: "Outfit created successfully", outfit });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getAllOutfits = async (req, res) => {
    try {
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
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };

  getOutfitById = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: outfitId } = req.params;
      const outfit = await this.outfitService.getOutfitById({
        userId,
        outfitId,
      });
      res.status(200).json(outfit);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  updateOutfit = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: outfitId } = req.params;
      const updateData = req.body;
      const outfit = await this.outfitService.updateOutfit({
        outfitId,
        userId,
        updateData,
      });
      res.status(201).json({ message: "Outfit updated successfully", outfit });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteOutfit = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id: outfitId } = req.params;
      const result = await this.outfitService.deleteOutfit({
        outfitId,
        userId,
      });
      res.json({ result, message: "Outfit deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getOutfitStats = async (req, res) => {
    try {
      const stats = await this.outfitService.getOutfitStats(req.user.id);

      res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  };
}

export default OutfitController;
