const express = require('express')
const { getGroupChats, createGroupChat, addToGroup, removeGroup } = require('../controllers/chatControllers')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(protect, getGroupChats)
router.route('/group').post(protect, createGroupChat)
router.route('/groupremove/:id').delete(protect, removeGroup)
router.route('/groupadd').put(protect, addToGroup)

module.exports = router
