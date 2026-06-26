import StorageService from "../services/storage.service.js";
import { catchAsync } from "../utils/catchAsync.js";

class StorageController {
  storageService = new StorageService();

  getPresignedUrl = catchAsync(async (req, res, next) => {
    const { fileName, fileType, folder } = req.body;

    const cognitoId = req.user.cognitoId;
    const allowedFolders = ["clothes", "outfits", "avatars"];
    const targetFolder = allowedFolders.includes(folder) ? folder : "misc";

    const data = await this.storageService.generatePresignedUrl({
      fileName,
      fileType,
      targetFolder,
      cognitoId,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  });
}

export default StorageController;
