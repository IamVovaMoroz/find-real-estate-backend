import prisma from '../lib/prisma.js'

// Function to get all chats for the logged-in user
export const getChats = async (req, res) => {
  // Extract the user ID from the request (assumed to be set by middleware)
  const tokenUserId = req.userId

  try {
    // Fetch all chats where the logged-in user is a participant
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId] // Condition to check if the user is part of the chat
        }
      }
    })

    // Iterate over each chat to find the receiver's information
    for (const chat of chats) {
      // Find the ID of the other user (receiver) in the chat
      const receiverId = chat.userIDs.find(id => id !== tokenUserId)

      // Fetch the receiver's details (id, username, avatar) from the user table
      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId
        },
        select: {
          id: true,
          username: true,
          avatar: true
        }
      })

      // Add the receiver's details to the chat object
      chat.receiver = receiver
    }

    // Send the response with the list of chats
    res.status(200).json(chats)
  } catch (err) {
    // Log the error to the console for debugging
    console.log(err)

    // Send a 500 status response with an error message
    res.status(500).json({ message: 'Failed to get chats!' })
  }
}

export const getChat = async (req, res) => {
  const tokenUserId = req.userId

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId]
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    await prisma.chat.update({
      where: {
        id: req.params.id
      },
      data: {
        seenBy: {
          push: [tokenUserId]
        }
      }
    })
    res.status(200).json(chat)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to get chat!' })
  }
}

export const addChat = async (req, res) => {
  const tokenUserId = req.userId
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId]
      }
    })
    res.status(200).json(newChat)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to add chat!' })
  }
}

export const readChat = async (req, res) => {
  const tokenUserId = req.userId

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId]
        }
      },
      data: {
        seenBy: {
          set: [tokenUserId]
        }
      }
    })
    res.status(200).json(chat)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to read chat!' })
  }
}
