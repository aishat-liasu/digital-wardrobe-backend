import { sequelize } from "../config/db.js";

// MODELS
import User from "./user.model.js";

import Cloth from "./cloth.model.js";
import ClothType from "./cloth_type.model.js";
import ClothStatus from "./cloth_status.model.js";
import ClothStatusMap from "./cloth_status_map.model.js";

import Outfit from "./outfit.model.js";
import OutfitItem from "./outfit_item.model.js";
import OutfitTag from "./outfit_tag.model.js";
import OutfitTagMap from "./outfit_tag_map.model.js";
import OutfitOccasion from "./outfit_occasion.model.js";

import WearHistory from "./wear_history.model.js";

// USER RELATIONSHIPS
User.hasMany(Cloth, { foreignKey: "userId", as: "clothes", onDelete: "CASCADE" });
Cloth.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Outfit, { foreignKey: "userId", as: "outfits", onDelete: "CASCADE" });
Outfit.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(WearHistory, { foreignKey: "userId", as: "wearHistory", onDelete: "CASCADE" });
WearHistory.belongsTo(User, { foreignKey: "userId", as: "user" });

// CLOTH TYPE RELATIONSHIP
ClothType.hasMany(Cloth, { foreignKey: "clothTypeId", as: "clothes", onDelete: "RESTRICT" });
Cloth.belongsTo(ClothType, { foreignKey: "clothTypeId", as: "type" });

// CLOTH STATUS MAP RELATIONSHIP
Cloth.hasMany(ClothStatusMap, { foreignKey: "clothId", as: "statusMap", onDelete: "CASCADE" });
ClothStatusMap.belongsTo(Cloth, { foreignKey: "clothId", as: "cloth" });

ClothStatus.hasMany(ClothStatusMap, {
  foreignKey: "clothStatusId",
  as: "statusMap",
  onDelete: "RESTRICT",
});
ClothStatusMap.belongsTo(ClothStatus, {
  foreignKey: "clothStatusId",
  as: "status",
});

// OUTFIT RELATIONSHIPS
Outfit.hasMany(OutfitItem, { foreignKey: "outfitId", as: "outfitItems", onDelete: "CASCADE" });
OutfitItem.belongsTo(Outfit, { foreignKey: "outfitId", as: "outfit" });

// OUTFIT ITEM RELATIONSHIPS
OutfitItem.belongsTo(Cloth, { foreignKey: "clothId", as: "cloth" });
Cloth.hasMany(OutfitItem, { foreignKey: "clothId", as: "outfitItems", onDelete: "RESTRICT" });

// OUTFIT OCCASIONS RELATIONSHIPS
OutfitOccasion.hasMany(Outfit, { foreignKey: "occasionId", onDelete: "RESTRICT" });
Outfit.belongsTo(OutfitOccasion, { foreignKey: "occasionId", as: "occasion" });

// WEAR HISTORY RELATIONSHIPS
WearHistory.belongsTo(Outfit, {
  foreignKey: "outfitId",
  as: "outfit",
});

Outfit.hasMany(WearHistory, {
  foreignKey: "outfitId",
  as: "history",
  onDelete: "RESTRICT", // When an Outfit has history, prevent deletion
  hooks: true,
});

// MANY TO MANY RELATIONSHIPS

// Cloth <-> ClothStatus
Cloth.belongsToMany(ClothStatus, {
  through: ClothStatusMap,
  foreignKey: "clothId",
  otherKey: "clothStatusId",
  as: "statuses",
});
ClothStatus.belongsToMany(Cloth, {
  through: ClothStatusMap,
  foreignKey: "clothStatusId",
  otherKey: "clothId",
  as: "clothes",
  onDelete: "RESTRICT",
});

// Outfit <-> Cloth (Many-to-Many)
Outfit.belongsToMany(Cloth, {
  through: OutfitItem,
  foreignKey: "outfitId",
  otherKey: "clothId",
  as: "items",
});
Cloth.belongsToMany(Outfit, {
  through: OutfitItem,
  foreignKey: "clothId",
  otherKey: "outfitId",
  as: "outfits",
});

// Outfit <-> Tags
Outfit.belongsToMany(OutfitTag, {
  through: OutfitTagMap,
  foreignKey: "outfitId",
  otherKey: "tagId",
  as: "tags",
  onDelete: "CASCADE",
});
OutfitTag.belongsToMany(Outfit, {
  through: OutfitTagMap,
  foreignKey: "tagId",
  otherKey: "outfitId",
  as: "outfits",
  onDelete: "CASCADE",
});

export {
  sequelize,
  User,
  ClothType,
  ClothStatus,
  Cloth,
  ClothStatusMap,
  OutfitOccasion,
  OutfitTag,
  Outfit,
  OutfitItem,
  OutfitTagMap,
  WearHistory,
};
