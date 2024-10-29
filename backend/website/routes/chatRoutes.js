const express = require('express')
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  removeGroup
} = require('../controllers/chatControllers')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupremoveuser').put(protect, removeFromGroup)
router.route('/groupremove/:id').delete(protect, removeGroup)
router.route('/groupadd').put(protect, addToGroup)

module.exports = router
