import UserService from "../services/user.service.js";

class UserController {
  userService = new UserService();
  /**
   * Create a user after successful Cognito signup
   */
  createUser = async (req, res) => {
    try {
      const userData = req.body; // { cognitoId, email, firstName, lastName }
      const user = await this.userService.createUser(userData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  /**
   * Get user by Id
   */
  getUserById = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.log(error);
      res
        .status(error?.status || 500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  /**
   * Get user by cognitoId
   */
  getUserByCognitoId = async (req, res) => {
    try {
      const { cognitoId } = req.params;
      const user = await this.userService.getUserByCognitoId(cognitoId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  /**
   * Get user by email
   */
  getUserByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      const user = await this.userService.getUserByEmail(email);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  /**
   * Update user data
   */
  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName } = req.body;
      const updatedUser = await this.userService.updateUser(
        id,
        firstName,
        lastName
      );
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  /**
   * Delete user by Id
   */
  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  /**
   * Get all the users on the users table
   */
  getUsers = async (req, res) => {
    try {
      if (req.query.email) {
        return this.getUserByEmail(req, res);
      }
      const users = await this.userService.getUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default UserController;
