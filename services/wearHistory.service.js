import { sequelize, Outfit, WearHistory } from "../models/index.js";

import { getDateRange } from "../helper/dateFilters.js";
import StorageService from "./storage.service.js";
class WearHistoryService {
  storageService = new StorageService();

  /**
   * Log an outfit for a specific date
   *
   */
  createWearHistory = async (userId, entryData) => {
    console.log("createWearHistory");
    console.log(userId, entryData);
    const { outfitId, dateWorn, note } = entryData;

    const newDateWorn = dateWorn ? new Date(dateWorn) : new Date();
    const dateRange = getDateRange({ day: newDateWorn });

    // Check if there is a existing record
    const checkQuery = `
      SELECT 1 
      FROM wear_history
      WHERE "userId" = :userId 
        AND "outfitId" = :outfitId 
        AND "dateWorn" BETWEEN :startDate AND :endDate
      LIMIT 1;
    `;

    const existingRows = await sequelize.query(checkQuery, {
      replacements: {
        userId,
        outfitId,
        startDate: dateRange.start, // 00:00:00
        endDate: dateRange.end, // 23:59:59
      },
      type: sequelize.QueryTypes.SELECT,
    });

    if (existingRows.length > 0) {
      const error = new Error(
        "You have already logged this outfit for this date."
      );
      error.status = 409;
      throw error;
    }
    const transaction = await sequelize.transaction();

    try {
      const outfit = await Outfit.findOne({
        where: { id: outfitId, userId },
        transaction,
      });

      if (!outfit) {
        throw new Error("Outfit not found or does not belong to you.");
      }

      // Create the Log Entry
      const historyEntry = await WearHistory.create(
        {
          userId,
          outfitId,
          dateWorn: newDateWorn,
          note,
        },
        { transaction }
      );

      const currentLastWorn = outfit.lastWornAt
        ? new Date(outfit.lastWornAt)
        : null;

      if (!currentLastWorn || newDateWorn > currentLastWorn) {
        await outfit.update({ lastWornAt: newDateWorn }, { transaction });
      }

      //  Update "wearCount" for the Outfit
      await outfit.increment("wearCount", { transaction });
      await transaction.commit();
      return historyEntry;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  /**
   * Get Filtered History
   */
  getAllWearHistory = async ({
    userId,
    year,
    month,
    weekDate,
    day,
    limit = 30,
    offset = 0,
  }) => {
    console.log("getWearHistory");
    console.log(userId, year, month, weekDate, day, limit, day);

    const dateRange = getDateRange({ year, month, weekDate, day });

    console.log(dateRange);

    const query = `
    SELECT
      wh.id,
      wh."dateWorn",
      wh.note,
      COUNT(*) OVER()::int as "totalCount",
      json_build_object(
        'id', o.id,
        'name', o.name,
        'occasionName', occ.name,
        'occasion', json_build_object(
        'id', occ.id, 
        'name', occ.name
        ),
        'items', COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'name', c.name,
              'imagePath', c."imagePath",
              'displayPriority', ct."displayPriority"
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        )
      ) AS outfit
    FROM wear_history wh
    JOIN outfits o 
      ON wh."outfitId" = o.id
    LEFT JOIN outfit_occasions occ        
      ON o."occasionId" = occ.id
    LEFT JOIN outfit_items oi 
      ON o.id = oi."outfitId"
    LEFT JOIN clothes c 
      ON oi."clothId" = c.id
    LEFT JOIN cloth_types ct             
      ON c."clothTypeId" = ct.id
    WHERE wh."userId" = :userId
      ${dateRange ? 'AND wh."dateWorn" BETWEEN :startDate AND :endDate' : ""}
    GROUP BY wh.id, o.id, occ.id, occ.name
    ORDER BY wh."dateWorn" DESC
    LIMIT :limit OFFSET :offset;
  `;

    const results = await sequelize.query(query, {
      replacements: {
        userId,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
        limit,
        offset,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    console.log(results[0]);

    const totalCount = results.length > 0 ? results[0].totalCount : 0;

    const dataWithUrls = await Promise.all(
      results.map(async (row) => {
        const { totalCount, ...rowData } = row;

        // row = { id, totalCount, dateWorn, note, outfit: { ... } }
        if (!rowData.outfit || !rowData.outfit.items) return rowData;

        const itemsWithUrls = await Promise.all(
          rowData.outfit.items.map(async (item) => ({
            ...item,
            imageUrl: item.imagePath
              ? await this.storageService.getFile(item.imagePath)
              : null,
          }))
        );

        // Sort: Head -> Toe
        itemsWithUrls.sort(
          (a, b) => (a.displayPriority || 100) - (b.displayPriority || 100)
        );

        return {
          ...rowData,
          outfit: {
            ...rowData.outfit,
            items: itemsWithUrls,
          },
        };
      })
    );

    return {
      data: dataWithUrls,
      totalCount,
    };
  };

  /**
   * Get a single history log by ID
   */
  getWearHistoryById = async ({ userId, id }) => {
    const query = `
      SELECT
        wh.id,
        wh."dateWorn",
        wh.note,
        json_build_object(
          'id', o.id,
          'name', o.name,
          'description', o.description,
          'occasionId', o."occasionId",
          'occasionName', occ.name,
            json_build_object(
            'id', occ.id, 
            'name', occ.name
            ) as occasion,
          'items', COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'imagePath', c."imagePath",
                'displayPriority', ct."displayPriority"
              )
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'
          )
        ) AS outfit
      FROM wear_history wh
      JOIN outfits o 
        ON wh."outfitId" = o.id
      LEFT JOIN outfit_occasions occ 
        ON o."occasionId" = occ.id
      LEFT JOIN outfit_items oi 
        ON o.id = oi."outfitId"
      LEFT JOIN clothes c 
        ON oi."clothId" = c.id
      LEFT JOIN cloth_types ct 
        ON c."clothTypeId" = ct.id
      WHERE wh.id = :id AND wh."userId" = :userId
      GROUP BY wh.id, o.id, occ.id, occ.name;
    `;

    const results = await sequelize.query(query, {
      replacements: { userId, id },
      type: QueryTypes.SELECT,
    });

    if (!results.length) throw new Error("History entry not found.");

    const row = results[0];

    if (row.outfit && row.outfit.items) {
      const itemsWithUrls = await Promise.all(
        row.outfit.items.map(async (item) => ({
          ...item,
          imageUrl: item.imagePath
            ? await this.storageService.getFile(item.imagePath)
            : null,
        }))
      );

      // Sort: Head -> Toe
      itemsWithUrls.sort(
        (a, b) => (a.displayPriority || 100) - (b.displayPriority || 100)
      );

      row.outfit.items = itemsWithUrls;
    }

    return row;
  };

  /**
   * Update Date or Note
   *
   */
  updateWearHistory = async ({ userId, id, updateData }) => {
    const { dateWorn, note } = updateData;
    const entry = await WearHistory.findOne({
      where: { id, userId },
    });

    if (!entry) {
      throw new Error("History entry not found.");
    }

    // Only update fields that are provided
    if (dateWorn) entry.dateWorn = dateWorn;
    if (note !== undefined) entry.note = note;

    await entry.save();
    return entry;
  };

  /**
   * Delete a log entry
   * Transactional: Decrements stats for Outfit and Clothes
   */
  deleteWearHistory = async ({ userId, id }) => {
    const transaction = await sequelize.transaction();

    try {
      // Find the entry and the outfit stats
      const entry = await WearHistory.findOne({
        where: { id, userId },
        transaction,
      });

      if (!entry) {
        throw new Error("History entry not found.");
      }

      const outfit = await Outfit.findByPk(entry.outfitId, transaction);
      if (outfit) await outfit.decrement("wearCount", { transaction });

      await entry.destroy({ transaction });
      await transaction.commit();
      return { message: "Entry deleted and stats updated." };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  /**
   * Get stats for the dashboard
   */
  getWearStats = async (userId) => {
    const todayRange = getDateRange({ day: new Date() });
    const monthRange = getDateRange({}); // defaults to current month

    const todayQuery = `
      SELECT COUNT(*)::int as "loggedToday"
      FROM wear_history
      WHERE "userId" = :userId
        AND "dateWorn" BETWEEN :todayStart AND :todayEnd
    `;

    const monthQuery = `
      SELECT COUNT(*)::int as "wearsThisMonth"
      FROM wear_history
      WHERE "userId" = :userId
        AND "dateWorn" BETWEEN :monthStart AND :monthEnd
    `;

    const [todayResult, monthResult] = await Promise.all([
      sequelize.query(todayQuery, {
        replacements: { userId, todayStart: todayRange.start, todayEnd: todayRange.end },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(monthQuery, {
        replacements: { userId, monthStart: monthRange.start, monthEnd: monthRange.end },
        type: sequelize.QueryTypes.SELECT,
      })
    ]);

    return {
      loggedToday: todayResult[0]?.loggedToday > 0,
      wearsThisMonth: monthResult[0]?.wearsThisMonth || 0,
    };
  };
}

export default WearHistoryService;
