import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Secret key for JWT (store in environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'queueSecreteAppKey';

// User Signup Controller
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );  

      res.status(201).json({
        message: 'Signup successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
};

// User Login Controller
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name:user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '3h' } // Token expires in 1 hour
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;  // Extract the authenticated user ID from the JWT or session
    const { name } = req.body;  // The new name to update
  
    try {
      // Find the user by ID
      const user = await User.findByPk(userId);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      // Update the user's name
      user.name = name;
      await user.save();  // Save the changes
  
      // Return the updated user data
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email  // Optionally return other fields as needed
        }
      });
  
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile', error });
    }
  };