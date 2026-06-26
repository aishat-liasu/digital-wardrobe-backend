import UserService from "../services/user.service.js";
import { catchAsync } from "../utils/catchAsync.js";

class UserController {
  userService = new UserService();
  /**
   * Create a user after successful Cognito signup
   */
  createUser = catchAsync(async (req, res, next) => {
    const userData = req.body; // { cognitoId, email, firstName, lastName }
    const user = await this.userService.createUser(userData);
    res.status(201).json({ success: true, data: user });
  });

  /**
   * Get user by Id
   */
  getUser = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);
    res.status(200).json({ success: true, data: user });
  });

  /**
   * Get user by Id
   */
  getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await this.userService.getUserById(id);
    res.status(200).json({ success: true, data: user });
  });

  /**
   * Get user by cognitoId
   */
  getUserByCognitoId = catchAsync(async (req, res, next) => {
    const { cognitoId } = req.params;
    const user = await this.userService.getUserByCognitoId(cognitoId);
    res.status(200).json({ success: true, data: user });
  });

  /**
   * Get user by email
   */
  getUserByEmail = catchAsync(async (req, res, next) => {
    const { email } = req.query;
    const user = await this.userService.getUserByEmail(email);
    res.status(200).json({ success: true, data: user });
  });

  /**
   * Update user data
   */
  updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const updatedUser = await this.userService.updateUser(
      id,
      firstName,
      lastName
    );
    res.status(200).json({ success: true, data: updatedUser });
  });

  /**
   * Delete user by Id
   */
  deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await this.userService.deleteUser(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  });

  /**
   * Get all the users on the users table
   */
  getUsers = catchAsync(async (req, res, next) => {
    if (req.query.email) {
      return this.getUserByEmail(req, res, next);
    }
    const users = await this.userService.getUsers();
    res.status(200).json({ success: true, data: users });
  });
}

export default UserController;
