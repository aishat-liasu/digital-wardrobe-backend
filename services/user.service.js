import { User } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/appError.js";
import { Op } from "sequelize";

class UserService {
  /**
   * Create a new user record after Cognito code verification
   * @param {Object} userData - cognitoId, email, firstName, lastName
   * @returns {Promise<User>}
   */
  createUser = async (userData) => {
    const existingUsers = await User.findAll({
      where: {
        [Op.or]: [
          { email: userData.email },
          { cognitoId: userData.cognitoId }
        ]
      }
    });

    if (existingUsers.length > 1) {
      throw new AppError(404, "Multiple users exists");
    }

    if (existingUsers.length === 1) {
      return existingUsers[0];
    }
    const user = await User.create({
      id: uuidv4(),
      ...userData,
    });

    return user;
  };

  /**
   * Get user by their ID (local UUID)
   * @param {string} userId - Local user UUID
   * @returns {Promise<User>}
   */
  getUserById = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError(404, "User not found");
    return user;
  };

  /**
   * Get user by Cognito user ID
   * @param {string} cognitoId - Cognito user sub
   * @returns {Promise<User>}
   */
  getUserByCognitoId = async (cognitoId) => {
    const user = await User.findOne({ where: { cognitoId } });
    if (!user) throw new AppError(404, "Cognito user doesn't exist");
    return user;
  };

  /**
   * Get user by email
   * @param {string} email - email
   * @returns {Promise<User>}
   */
  getUserByEmail = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError(404, "User doesn't exist");
    return user;
  };

  /**
   * Update user info
   * @param {string} userId - Local user UUID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<User>}
   */
  updateUser = async (userId, firstName, lastName) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new AppError(404, "User not found", "NOT_FOUND");
      await user.update({ firstName, lastName });
      return user;
    } catch (error) {
      throw new AppError(500, "Failed to update user", "UPDATE_FAILED");
    }
  };

  /**
   * Delete a user
   * @param {string} userId - Local user UUID
   * @returns {Promise<void>}
   */
  deleteUser = async (userId) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new AppError(404, "User not found", "NOT_FOUND");
      await user.destroy();
    } catch (error) {
      throw new AppError(500, "Failed to delete user", "DELETE_FAILED");
    }
  };

  /**
   * Get all the users on the users table
   * @returns {Promise<User[]>}
   */
  getUsers = async () => {
    const users = await User.findAll();
    if (!users) throw new AppError(404, "No user not found");
    return users;
  };
}

export default UserService;
