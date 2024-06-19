import prisma from '../lib/prisma.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ message: 'Failed to retrieve users!', error: err.message }); 
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error retrieving user by id:', err); 
    res.status(500).json({ message: 'Failed to retrieve user!', error: err.message }); 
  }
};
