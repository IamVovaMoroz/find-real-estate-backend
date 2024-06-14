import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email } // Added this check
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use!' }) // Respond if email is already in use
    }
    // hash password

    const hashedPassword = await bcrypt.hash(password, 10)
    //create new user and save to DB

    console.log(hashedPassword)

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    })
    console.log(newUser)

    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to create user!' })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if the user exists.
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials!' }) // Respond if user does not exist
    }

    // Check if the user's password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Credentials!' }) // Respond if password is incorrect
    }

	const age = 24 * 60 * 60 * 1000 // 1 day in milliseconds

	const token = jwt.sign({
		id: user.id,
		isAdmin: false,
	},
	 process.env.JWT_SECRET_KEY, {expiresIn: age})
    // Generate cookie token and send to the user
    //   res.setHeader('Set-Cookie', 'test=' + 'myValue')
	console.log("Generated JWT Token login:", token)

	const {password: userPassword, ...userInfo} =  user

    res.cookie('token', token, {
      httpOnly: true,
	  sameSite: 'strict', // Helps prevent CSRF attacks
      maxAge: age
    //   secure: true
    })
    res.status(200).json(userInfo) // Respond if login is successful
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to login!' }) // Respond if there is a server error
  }
}

export const logout = (req, res) => {
  // db operation
  res.clearCookie("token").status(200).json({message: "Logout Successfully"})
  console.log('logout endpoint')
}

