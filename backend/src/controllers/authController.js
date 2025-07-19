import User from '../models/User.js';
import auth from '../middleware/auth.js';

const { generateToken, setAuthCookie, clearAuthCookie } = auth;
import errorHandler from "../middleware/errorHandler.js";

const { asyncHandler, createError } = errorHandler;

const signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw createError.conflict('User with this email already exists');
  }

  // Create new user
  const user = await User.create({ email, password, name });

  // Generate JWT token
  const token = generateToken(user.id);

  // Set HTTP-only cookie
  setAuthCookie(res, token);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findByEmail(email);
  if (!user) {
    throw createError.unauthorized('Invalid email or password');
  }

  // Validate password
  const isValidPassword = await User.validatePassword(password, user.password);
  if (!isValidPassword) {
    throw createError.unauthorized('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken(user.id);

  // Set HTTP-only cookie
  setAuthCookie(res, token);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  // Clear the authentication cookie
  clearAuthCookie(res);

  res.json({
    message: 'Logout successful'
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw createError.notFound('User not found');
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) {
    // Check if email is already taken by another user
    const existingUser = await User.findByEmail(email);
    if (existingUser && existingUser.id !== req.user.id) {
      throw createError.conflict('Email is already taken');
    }
    updates.email = email;
  }

  if (Object.keys(updates).length === 0) {
    throw createError.badRequest('No valid fields to update');
  }

  const updatedUser = await User.update(req.user.id, updates);

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      updatedAt: updatedUser.updated_at
    }
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get current user with password
  const user = await User.findByEmail(req.user.email);
  if (!user) {
    throw createError.notFound('User not found');
  }

  // Validate current password
  const isValidPassword = await User.validatePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw createError.unauthorized('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await User.hashPassword(newPassword);

  // Update password
  await User.update(req.user.id, { password: hashedPassword });

  res.json({
    message: 'Password changed successfully'
  });
});

export default {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
}; 