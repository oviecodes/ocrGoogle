


// route to detect text from images
const express = require('express')
const router = express.Router()
const { getText } = require('../controllers/textImageController')
const { renderTemplate } = require('../middleware/index')

router.route('/')
    .get(renderTemplate)
    .post(getText)


module.exports = router