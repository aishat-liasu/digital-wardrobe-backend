// controllers/user.controller.js
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/appError.js";
import { sequelize } from "../config/db.js";

class UserService {
  /**
   * Create a new user record after Cognito code verification
   * @param {Object} userData - cognitoId, email, firstName, lastName
   * @returns {Promise<User>}
   */
  createUser = async (userData) => {
    const [results] = await sequelize.query(
      `SELECT * from users WHERE \"email\" ='${userData.email}' OR \"cognitoId\" = '${userData.cognitoId}'`
    );

    if (results?.length > 1) {
      throw new AppError(404, "Multiple users exists");
    }

    const existingUser = results?.[0];
    if (existingUser) {
      console.log(`User ${userData.email} already exists.`);
      return existingUser;
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
    console.log(user);
    if (!user) throw new AppError(404, "User not found");
    return user;
  };

  /**
   * Get user by Cognito user ID
   * @param {string} cognitoId - Cognito user sub
   * @returns {Promise<User>}
   */
  getUserByCognitoId = async (cognitoId) => {
    console.log("Get user by CognitoId");
    const user = await User.findOne({ where: { cognitoId } });
    const [results] = await sequelize.query(
      `SELECT * from users WHERE \"cognitoId\" = '${cognitoId}';`
    );

    console.log(results);

    if (!user) throw new AppError(404, "Cognito user doesn't exist");
    return user;
  };

  /**
   * Get user by email
   * @param {string} email - email
   * @returns {Promise<User>}
   */
  getUserByEmail = async (email) => {
    console.log("Get user by email");
    const user = await User.findOne({ where: { email } });
    const [results] = await sequelize.query(
      `SELECT * from users WHERE \"email\" = '${email}';`
    );

    console.log(results);

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
      if (!user) throw new Error("User not found");
      await user.update({ firstName, lastName });
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
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
      if (!user) throw new Error("User not found");
      await user.destroy();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
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
