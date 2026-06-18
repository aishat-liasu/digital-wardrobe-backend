import {
  sequelize,
  Outfit,
  OutfitItem,
  OutfitTagMap,
  WearHistory,
} from "../models/index.js";
import StorageService from "./storage.service.js";

class OutfitService {
  storageService = new StorageService();

  // CREATE OUTFIT
  createOutfit = async (userId, outfitData) => {
    const t = await sequelize.transaction();

    try {
      const {
        name,
        description,
        occasionId,
        isFavourite = false,
        clothIds = [],
        tagIds = [],
        lastWornAt,
      } = outfitData;

      // Create the Outfit Record
      const outfit = await Outfit.create(
        {
          userId,
          name,
          description,
          occasionId,
          isFavourite,
          wearCount: lastWornAt ? 1 : 0,
          lastWornAt: lastWornAt || null,
        },
        { transaction: t }
      );

      // Link Clothes (Junction Table)
      if (clothIds.length > 0) {
        const itemMappings = clothIds.map((clothId) => ({
          outfitId: outfit.id,
          clothId,
        }));
        await OutfitItem.bulkCreate(itemMappings, { transaction: t });
      }

      // Link Tags (Junction Table)
      if (tagIds.length > 0) {
        const tagMappings = tagIds.map((tagId) => ({
          outfitId: outfit.id,
          tagId,
        }));
        await OutfitTagMap.bulkCreate(tagMappings, { transaction: t });
      }

      await t.commit();
      return outfit;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  // GET ALL OUTFITS
  getAllOutfits = async ({
    userId,
    page = 1,
    limit = 20,
    search,
    occasionId,
    isFavourite = null,
    tagIds = [],
    sortBy = "createdAt",
    sortOrder = "DESC",
  }) => {
    console.log("getAllOutfits");
    console.log(userId, page, limit, search, occasionId, isFavourite, tagIds);
    const offset = (page - 1) * limit;

    // Sorting Logic
    const SORT_COLUMNS = {
      createdAt: 'o."createdAt"',
      name: "o.name",
      wearCount: 'o."wearCount"',
      lastWornAt: 'o."lastWornAt"',
    };
    const orderColumn = SORT_COLUMNS[sortBy] || SORT_COLUMNS.createdAt;
    const orderDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const query = `
      SELECT 
        o.id,
        o.name,
        o.description,
        o."occasionId",
        o."isFavourite",
        o."wearCount",
        o."lastWornAt",
        o."createdAt",
        json_build_object(
        'id', occ.id, 
        'name', occ.name
        ) as occasion,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', ot.id, 'name', ot.name)) 
          FILTER (WHERE ot.id IS NOT NULL), '[]'
        ) as tags,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
             'id', c.id, 
             'imagePath', c."imagePath",
             'displayPriority', ct."displayPriority"
          )) 
          FILTER (WHERE c.id IS NOT NULL), '[]'
        ) as items,
        COUNT(*) OVER()::INT as "totalCount"
      FROM outfits o
      LEFT JOIN outfit_occasions occ ON o."occasionId" = occ.id
      LEFT JOIN outfit_tag_map otm ON o.id = otm."outfitId"
      LEFT JOIN outfit_tags ot ON otm."tagId" = ot.id
      LEFT JOIN outfit_items oi ON o.id = oi."outfitId"
      LEFT JOIN clothes c ON oi."clothId" = c.id
      LEFT JOIN cloth_types ct ON c."clothTypeId" = ct.id
      WHERE o."userId" = :userId
        AND (:occasionId IS NULL OR o."occasionId" = :occasionId)
        AND (:isFavourite IS NULL OR o."isFavourite" = :isFavourite)
        AND (
          :tagIdsCount = 0 
          OR EXISTS (
            SELECT 1 FROM outfit_tag_map tm 
            WHERE tm."outfitId" = o.id 
            AND tm."tagId" IN (:tagIds)
          )
        )
        AND (:search IS NULL OR o.name ILIKE '%' || :search || '%'
        OR o.description ILIKE '%' || :search || '%')
      GROUP BY o.id, occ.id
      ORDER BY ${orderColumn} ${orderDirection}
      LIMIT :limit OFFSET :offset;
    `;

    const results = await sequelize.query(query, {
      replacements: {
        userId,
        limit,
        offset,
        search: search || null,
        occasionId: occasionId || null,
        isFavourite: isFavourite !== undefined ? isFavourite : null,
        tagIds: tagIds && tagIds.length > 0 ? tagIds : [-1],
        tagIdsCount: tagIds ? tagIds.length : 0,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    console.log(results[0]);

    const totalCount = results.length ? results[0].totalCount : 0;

    const dataWithUrls = await Promise.all(
      results.map(async (row) => {
        const { totalCount, ...outfit } = row;
        const itemsWithUrls = await Promise.all(
          outfit.items.map(async (item) => ({
            ...item,
            imageUrl: await this.storageService.getFile(item.imagePath),
          }))
        );

        // Sort items by priority (Head -> Toe)
        itemsWithUrls.sort(
          (a, b) => (a.displayPriority || 100) - (b.displayPriority || 100)
        );

        return {
          ...outfit,
          items: itemsWithUrls,
        };
      })
    );

    return {
      page: parseInt(page),
      limit: parseInt(limit),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: dataWithUrls,
    };
  };

  // GET ONE OUTFIT
  getOutfitById = async ({ outfitId, userId }) => {
    // Reusing the same logic structure but for single ID
    console.log("getOneOutfit");
    const query = `
      SELECT 
        o.*,
        json_build_object('id', occ.id, 'name', occ.name) as occasion,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', ot.id, 'name', ot.name)) FILTER (WHERE ot.id IS NOT NULL), '[]') as tags,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
            'id', c.id, 
            'name', c.name,
            'imagePath', c."imagePath",
            'colours', c.colours,
            'type', jsonb_build_object('id', ct.id, 'name', ct.name, 'displayPriority', ct."displayPriority")
        )) FILTER (WHERE c.id IS NOT NULL), '[]') as items
      FROM outfits o
      LEFT JOIN outfit_occasions occ ON o."occasionId" = occ.id
      LEFT JOIN outfit_tag_map otm ON o.id = otm."outfitId"
      LEFT JOIN outfit_tags ot ON otm."tagId" = ot.id
      LEFT JOIN outfit_items oi ON o.id = oi."outfitId"
      LEFT JOIN clothes c ON oi."clothId" = c.id
      LEFT JOIN cloth_types ct ON c."clothTypeId" = ct.id
      WHERE o.id = :outfitId AND o."userId" = :userId
      GROUP BY o.id, occ.id;
    `;

    const results = await sequelize.query(query, {
      replacements: { outfitId, userId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!results.length) throw new Error("Outfit not found");

    const outfit = results[0];

    // Sign URLs
    const itemsWithUrls = await Promise.all(
      outfit.items.map(async (item) => ({
        ...item,
        imageUrl: await this.storageService.getFile(item.imagePath),
      }))
    );

    // Sort items
    itemsWithUrls.sort(
      (a, b) =>
        (a.type?.displayPriority || 100) - (b.type?.displayPriority || 100)
    );

    return { ...outfit, items: itemsWithUrls };
  };

  // GET RANDOM OUTFIT
  getRandomOutfit = async (userId) => {
    const query = `
      SELECT id FROM outfits
      WHERE "userId" = :userId
      ORDER BY RANDOM()
      LIMIT 1;
    `;
    const results = await sequelize.query(query, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });
    
    if (!results.length) throw new Error("No outfits found");
    
    return await this.getOutfitById({ outfitId: results[0].id, userId });
  };

  // UPDATE OUTFIT
  updateOutfit = async ({ userId, outfitId, updateData }) => {
    const t = await sequelize.transaction();

    try {
      const outfit = await Outfit.findOne({ where: { id: outfitId, userId } });
      if (!outfit) throw new Error("Outfit not found");

      const { name, description, occasionId, isFavourite, clothIds, tagIds } =
        updateData;

      // Update Basic Info
      await outfit.update(
        { name, description, occasionId, isFavourite },
        { transaction: t }
      );

      // Sync Clothes (Destroy all links, recreate new ones)
      if (clothIds) {
        await OutfitItem.destroy({ where: { outfitId }, transaction: t });
        if (clothIds.length > 0) {
          await OutfitItem.bulkCreate(
            clothIds.map((clothId) => ({ outfitId, clothId })),
            { transaction: t }
          );
        }
      }

      // Sync Tags
      if (tagIds) {
        await OutfitTagMap.destroy({ where: { outfitId }, transaction: t });
        if (tagIds.length > 0) {
          await OutfitTagMap.bulkCreate(
            tagIds.map((tagId) => ({ outfitId, tagId })),
            { transaction: t }
          );
        }
      }

      await t.commit();
      return outfit;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  // DELETE OUTFIT
  deleteOutfit = async ({ userId, outfitId }) => {
    const outfit = await Outfit.findOne({ where: { id: outfitId, userId } });
    if (!outfit) throw new Error("Outfit not found");

    const outfitUsageCount = await WearHistory.count({
      where: { outfitId },
    });

    if (outfitUsageCount > 0) {
      const error = new Error(
        `Cannot delete item. It has been logged under wear history ${outfitUsageCount} time(s).`
      );
      error.status = 409;
      throw error;
    }

    await outfit.destroy();

    return { message: "Outfit deleted successfully" };
  };

  getOutfitStats = async (userId) => {
    const totalQuery = `
    SELECT COUNT(*)::int as "totalOutfits"
    FROM outfits
    WHERE "userId" = :userId
  `;

    const occasionQuery = `
    SELECT 
      ooc.id, 
      ooc.name, 
      COUNT(o.id)::int as count
    FROM outfit_occasions ooc
    LEFT JOIN outfits o 
      ON o."occasionId" = ooc.id 
      AND o."userId" = :userId
    GROUP BY ooc.id, ooc.name
    ORDER BY count DESC;
  `;

    const tagQuery = `
    SELECT 
      t.id, 
      t.name, 
      COUNT(o.id)::int as count
    FROM outfit_tags t
    LEFT JOIN outfit_tag_map otm 
      ON otm."tagId" = t.id
    LEFT JOIN outfits o 
      ON o.id = otm."outfitId" 
      AND o."userId" = :userId
    GROUP BY t.id, t.name
    HAVING COUNT(o.id) > 0 
    ORDER BY count DESC;
  `;

    // Execute in parallel
    const [totalResult, occasionResult, tagResult] = await Promise.all([
      sequelize.query(totalQuery, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(occasionQuery, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(tagQuery, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }),
    ]);

    return {
      totalCount: totalResult[0]?.totalOutfits || 0,
      byOccasion: occasionResult,
      byTag: tagResult,
    };
  };
}

export default OutfitService;
