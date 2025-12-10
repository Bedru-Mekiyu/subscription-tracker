import User from '../models/user.model.js'

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error)
  }
}
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      const error = new Error('user not found')
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error)
  }
}

// controllers/user.controller.js

// ... existing getUsers, getUser

// Create new user (admin only – assume authorize checks role if added)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    // Check ownership or admin
    if (user._id.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to update this user");
      error.statusCode = 403;
      throw error;
    }
    Object.assign(user, req.body);
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 12);
    }
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    // Check ownership or admin
    if (user._id.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to delete this user");
      error.statusCode = 403;
      throw error;
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};