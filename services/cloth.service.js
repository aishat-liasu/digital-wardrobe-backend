import { sequelize, Cloth, ClothStatusMap } from "../models/index.js";

import StorageService from "./storage.service.js";
class ClothService {
  storageService = new StorageService();
  // Create a new cloth
  createCloth = async (userId, clothData) => {
    // Start Transaction
    console.log(userId, clothData);
    const t = await sequelize.transaction();

    try {
      const {
        name,
        clothTypeId,
        colours,
        comment,
        imageName,
        imagePath,
        statusIds = [],
      } = clothData;

      // Create Cloth
      const cloth = await Cloth.create(
        {
          userId,
          name,
          clothTypeId,
          colours,
          imageName,
          imagePath,
          comment,
        },
        { transaction: t }
      );

      // Add Statuses
      if (statusIds.length > 0) {
        const statusMappings = statusIds.map((statusId) => ({
          clothId: cloth.id,
          clothStatusId: statusId,
        }));

        await ClothStatusMap.bulkCreate(statusMappings, { transaction: t });
      }

      // Commit
      await t.commit();
      return cloth;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  // Fetch all clothes for a user
  getAllClothes = async ({
    userId,
    page = 1,
    limit = 20,
    clothTypeId,
    statusIds = [],
    search,
    sortBy = "createdAt",
    sortOrder = "DESC",
  }) => {
    console.log("getAllClothes");
    console.log(userId, page, limit, search, clothTypeId, statusIds);
    const offset = (page - 1) * limit;

    const SORT_COLUMNS = {
      createdAt: 'c."createdAt"',
      name: "c.name",
    };

    const orderColumn = SORT_COLUMNS[sortBy] || SORT_COLUMNS.createdAt;
    const orderDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const query = `
    SELECT
      c.id,
      c.name,
      c."clothTypeId",
      json_build_object(
        'id', ct.id,
        'name', ct.name,
        'displayPriority', ct."displayPriority"
      ) AS type,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', cs.id,
            'name', cs.name
          )
        ) FILTER (WHERE cs.id IS NOT NULL),
        '[]'
      ) AS statuses,
      c.colours,
      c."imageName",
      c."imagePath",
      c."createdAt",
      COUNT(*) OVER()::INT AS "totalCount"
    FROM clothes c
    JOIN cloth_types ct
      ON ct.id = c."clothTypeId"
    LEFT JOIN cloth_status_map csm
      ON csm."clothId" = c.id
    LEFT JOIN cloth_statuses cs
      ON cs.id = csm."clothStatusId"
    WHERE c."userId" = :userId
      AND (:clothTypeId IS NULL OR c."clothTypeId" = :clothTypeId)
      AND (
        :search IS NULL
        OR c.name ILIKE '%' || :search || '%'
        OR c.comment ILIKE '%' || :search || '%'
      )
      AND (
        :statusIdsCount = 0
        OR EXISTS (
          SELECT 1
          FROM cloth_status_map sm
          WHERE sm."clothId" = c.id
            AND sm."clothStatusId" IN (:statusIds)
        )
      )
    GROUP BY c.id, ct.id
    ORDER BY ${orderColumn} ${orderDirection}
    LIMIT :limit OFFSET :offset;
  `;

    const results = await sequelize.query(query, {
      replacements: {
        userId,
        limit,
        offset,
        clothTypeId: clothTypeId || null,
        search: search || null,
        statusIds: statusIds && statusIds.length > 0 ? statusIds : [-1],
        statusIdsCount: statusIds ? statusIds.length : 0,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    console.log(results);

    const totalCount = results.length ? results[0].totalCount : 0;

    const resultWithUrls = await Promise.all(
      results.map(async (row) => {
        const { totalCount, ...clothData } = row;
        const imageUrl = await this.storageService.getFile(clothData.imagePath);

        return {
          ...clothData,
          imageUrl,
        };
      })
    );

    return {
      page: parseInt(page),
      limit: parseInt(limit),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: resultWithUrls,
    };
  };

  // Get one cloth
  getClothById = async ({ clothId, userId }) => {
    console.log(userId, clothId);
    const query = `
    SELECT
      c.id,
      c.name,
      c."clothTypeId",
      c.colours,
      c.comment,
      c."imageName",
      c."imagePath",
      c."createdAt",
      json_build_object(
        'id', ct.id,
        'name', ct.name,
        'displayPriority', ct."displayPriority"
      ) AS type,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', cs.id,
            'name', cs.name
          )
        ) FILTER (WHERE cs.id IS NOT NULL),
        '[]'
      ) AS statuses
    FROM clothes c
    JOIN cloth_types ct
      ON ct.id = c."clothTypeId"
    LEFT JOIN cloth_status_map csm
      ON csm."clothId" = c.id
    LEFT JOIN cloth_statuses cs
      ON cs.id = csm."clothStatusId"
    WHERE c.id = :clothId AND c."userId" = :userId
    GROUP BY c.id, ct.id;
  `;

    const results = await sequelize.query(query, {
      replacements: { clothId, userId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!results.length) throw new Error("Cloth not found");

    const clothData = results?.[0];
    const imageUrl = await this.storageService.getFile(clothData?.imagePath);

    return {
      ...clothData,
      imageUrl,
    };
  };

  // Update cloth
  updateCloth = async ({ userId, clothId, updateData }) => {
    // Start a Transaction
    const t = await sequelize.transaction();

    try {
      const cloth = await Cloth.findOne({ where: { id: clothId, userId } });
      if (!cloth) throw new Error("Cloth not found");

      const {
        name,
        clothTypeId,
        colours,
        comment,
        imageName,
        imagePath,
        statusIds,
      } = updateData;

      // Update Cloth
      await cloth.update(
        {
          name,
          clothTypeId,
          colours,
          imageName,
          imagePath,
          comment,
        },
        { transaction: t }
      );

      // Handle Statuses
      if (statusIds) {
        // Remove ALL existing statuses for this cloth
        await ClothStatusMap.destroy({
          where: { clothId },
          transaction: t,
        });

        // Add the new ones (only if any are selected)
        if (statusIds.length > 0) {
          const statusMappings = statusIds.map((statusId) => ({
            clothId,
            clothStatusId: statusId,
          }));
          await ClothStatusMap.bulkCreate(statusMappings, { transaction: t });
        }
      }

      await t.commit();
      return cloth;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  // Delete cloth
  deleteCloth = async ({ userId, clothId }) => {
    const cloth = await Cloth.findOne({ where: { id: clothId, userId } });
    if (!cloth) throw new Error("Cloth not found");

    const imagePath = cloth.imagePath;
    await ClothStatusMap.destroy({ where: { clothId: cloth.id } });
    await cloth.destroy();

    // 4. Clean up AWS S3
    if (imagePath) this.storageService.deleteFile(imagePath);

    return { message: "Cloth deleted successfully" };
  };

  getClothStats = async (userId) => {
    //  Total Clothes Count
    const totalQuery = `
      SELECT COUNT(*)::int as "totalClothes"
      FROM clothes
      WHERE "userId" = :userId
    `;

    // Count by Type (e.g. Hijab: 10, Skirt: 5)
    const typeQuery = `
      SELECT 
        ct.id, 
        ct.name, 
        COUNT(c.id)::int as count
      FROM cloth_types ct
      LEFT JOIN clothes c 
        ON c."clothTypeId" = ct.id 
        AND c."userId" = :userId
      GROUP BY ct.id, ct.name
      ORDER BY count DESC;
    `;

    // Count by Status (e.g. Event Wear: 4, Dirty: 1)
    const statusQuery = `
      SELECT 
        cs.id, 
        cs.name, 
        COUNT(c.id)::int as count
      FROM cloth_statuses cs
      LEFT JOIN cloth_status_map csm 
        ON csm."clothStatusId" = cs.id
      LEFT JOIN clothes c 
        ON c.id = csm."clothId" 
        AND c."userId" = :userId
      GROUP BY cs.id, cs.name
      ORDER BY count DESC;
    `;

    // Execute all 3 in parallel for performance
    const [totalResult, typeResult, statusResult] = await Promise.all([
      sequelize.query(totalQuery, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(typeQuery, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(statusQuery, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }),
    ]);

    console.log(totalResult, typeQuery, statusQuery);

    return {
      totalCount: totalResult[0]?.totalClothes || 0,
      byType: typeResult,
      byStatus: statusResult,
    };
  };
}

export default ClothService;
