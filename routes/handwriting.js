

const express = require('express')
const router = express.Router()
const { getText } = require('../controllers/handwritingController')
const { renderTemplate } = require('../middleware/index')


router.route('/')
    .get(renderTemplate)
    .post(getText)

module.exports = router
