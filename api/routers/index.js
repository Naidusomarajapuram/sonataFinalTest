const express = require('express')
const router = express.Router()
const user = require('../controllers/login')
const insertController = require("../controllers/insert")
const editDataController = require("../controllers/update")
const getDataController = require("../controllers/retrive")

router.route('/login').post(user.login)
router.route('/addbook').post(user.isAuthenticated, insertController.insertData)
router.route('/editbook').post(user.isAuthenticated, editDataController.updateData)
router.route('/getbooks').get(user.isAuthenticated, getDataController.getData)

// user.isAuthenticated

module.exports = router