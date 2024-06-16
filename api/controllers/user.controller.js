import prisma from '../lib/prisma.js'
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to get users!' })
  }
}

export const getUser = async (req, res) => {
  const id = req.params.id
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to get users!' })
  }
}

export const updateUser = async (req, res) => {
  const id = req.params.id
  const tokenUserId = req.userId
  const {password, ...inputs} = req.body

  console.log('req.params.id:', id)
  console.log('req.cookies.token:', tokenUserId)
  if (id !== tokenUserId) {
    return res.status(403).json({ message: 'Not Authorized' })
  }

    let updatedPassword=null
  try {

    if (password) {
      updatedPassword= await bcrypt.hash(password, 10)
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && {password: updatedPassword})
      },
    })

    return res.status(200).json(updatedUser)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to update user!' })
  }
}

export const deleteUser = async (req, res) => {
  try {
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to get users!' })
  }
}
