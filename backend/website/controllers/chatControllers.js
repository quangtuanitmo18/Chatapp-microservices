const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    console.log('UserId param not sent with request')
    return res.sendStatus(400)
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }]
  }).populate('users', '-password')

  // isChat = await User.populate(isChat, {
  //   path: 'latestMessage.sender',
  //   select: 'name pic email'
  // })

  if (isChat.length > 0) {
    res.send(isChat[0])
  } else {
    var chatData = {
      chatName: `chat: ${req.user._id} and ${userId}`,
      isGroupChat: false,
      users: [req.user._id, userId]
    }

    try {
      const createdChat = await Chat.create(chatData)
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password')
      res.status(200).json(FullChat)
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }
})

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const getGroupChats = asyncHandler(async (req, res) => {
  // filet chats by chatName
  const keyword = req.query.search
    ? {
        chatName: { $regex: req.query.search, $options: 'i' }
      }
    : {}

  try {
    // Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    Chat.find(keyword)
      .find()
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        // results = await User.populate(results, {
        //   path: 'latestMessage.sender',
        //   select: 'name pic email'
        // })
        res.status(200).send(results)
      })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ message: 'Please Fill all the feilds' })
  }

  var users = req.body.users ? JSON.parse(req.body.users) : []
  // if (users.length < 2) {
  //   return res.status(400).send('More than 2 users are required to form a group chat')
  // }

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).json(fullGroupChat)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName
    },
    {
      new: true
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!updatedChat) {
    res.status(404)
    throw new Error('Chat Not Found')
  } else {
    res.json(updatedChat)
  }
})

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremoveuser
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId }
    },
    {
      new: true
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!removed) {
    res.status(404)
    throw new Error('Chat Not Found')
  } else {
    res.json(removed)
  }
})

// @desc    Remove  Group Chat
// @route   DELETE /api/chat/groupremove
// @access  Protected

const removeGroup = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = req.user
  const chat = await Chat.findById(id)

  if (!chat) {
    res.status(404)
    throw new Error('Chat Not Found')
  }
  if (chat.groupAdmin.toString() !== user._id.toString()) {
    res.status(401)
    throw new Error('User not authorized')
  }
  // delete the chat by id from params
  const removed = await Chat.findByIdAndDelete(id)

  if (!removed) {
    res.status(404)
    throw new Error('Chat Not Found')
  } else {
    res.json(removed)
  }
})

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }
    },
    {
      new: true
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!added) {
    res.status(404)
    throw new Error('Chat Not Found')
  } else {
    res.json(added)
  }
})

module.exports = {
  accessChat,
  getGroupChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  removeGroup
}
