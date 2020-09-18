

const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Docs = require('../models/docModel')

//render image upload page
const renderTemplate = async (req, res) => {
    res.render('index', {
        pathname: req.baseUrl
    })
}

//render on success
const renderSuccess = async (req, res, next, doc) => {
    //create a name for the file
    const fileName = `file${doc.substring(1, 4).replace(/\s/g, '')}-${Date.now()}.txt`
    const basePath = path.join(process.cwd() +  `/downloads/${fileName}`)
    await fs.writeFile(basePath, doc, (err) => {
        if(err){
            res.render('index', {
                msg: 'Error writing file',
                pathname: req.baseUrl
            })
        } else {
            res.render('index', {
                msg: 'file available for download',
                pathname: req.baseUrl,
                fileName
            })
            setTimeout(() => {
                fs.unlinkSync(basePath)
            }, 100000)
        }
        
    })
}

//render on failure
const renderError = async (req, res) => {
    res.render('index', { 
        msg: 'please use an image with text',
        pathname: req.baseUrl
    })
}

const createDoc = async(name, content) => {
    await Docs.create({
        name,
        content
    })
}

//multer logic
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd() + '/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer( { storage: storage, fileFilter } ).single('image')

function fileFilter(req, file, cb) {
    const fileType = /jpg|jpeg|png/;

    const extname = fileType.test(path.extname(file.originalname).toLowerCase())
    
    const mimeType = fileType.test(file.mimetype)

    if(mimeType && extname){
        return cb(null, true)
    } else {
        cb('Error: images only')
    }

}

const checkError = (req, res, next) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if(err) {
                res.render('index', {
                    msg: err,
                    pathname: req.baseUrl
                })
            } 
            else if (req.file === undefined){
                res.render('index', {
                    msg: 'no file selected',
                    pathname: req.baseUrl
                })
            }
            resolve(req.file)
        })
    }) 
}

//exports
module.exports = {
    renderTemplate,
    renderSuccess,
    renderError,
    createDoc,
    checkError
}