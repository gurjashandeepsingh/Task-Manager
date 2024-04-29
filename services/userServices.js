import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import { AuthenticationMiddleware } from "../middleware/middleware.js";
export default class UserService {
  /**
   * Registers a new user with the provided details.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @param {string} confirmPassword - The confirmation password to ensure correctness.
   * @param {string} username - The username of the user.
   * @returns {Promise<Object>} A Promise that resolves to the registered user object if registration is successful.
   * @throws {Error} If the provided email already exists in the database.
   */
  async registerUser(email, password, confirmPassword, username) {
    console.log("2");
    if (password === confirmPassword) {
      const checkIfAlreadyExisting = await User.findOne({ email: email });
      if (!checkIfAlreadyExisting) {
        password = await bcrypt.hash(password, 9);
        console.log(password);
        const newUser = new User({ email, password, username });
        const registeredUser = await newUser.save();
        return registeredUser;
      } else {
        throw new Error("Email already exists");
      }
    }
  }

  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @returns {Promise<Object>} A Promise that resolves to an object containing the authentication token and the user information if login is successful.
   * @throws {Error} If the provided email or password is incorrect.
   */
  async loginUser(email, password) {
    const searchUser = await User.findOne({ email });
    if (searchUser) {
      const isMatch = await bcrypt.compare(password, searchUser.password);
      console.log(isMatch);
      if (isMatch) {
        const jwtTokenInstance = new AuthenticationMiddleware();
        const token = await jwtTokenInstance.generateToken(searchUser._id);
        return { token, searchUser };
      } else {
        throw new Error("User Invalid");
      }
    }
  }
}
