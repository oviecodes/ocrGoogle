

const mongoose = require('mongoose')
const fs = require('fs')
const vision = require('@google-cloud/vision');
const { checkError, renderSuccess, renderError, createDoc } = require('../middleware/index')

const getText =  async(req, res, next) => {
    try {
        // Creates a client
        const client = new vision.ImageAnnotatorClient();
        //use multer to handle uploaded image
        const imageDesc = await checkError(req, res)
        if(imageDesc !== undefined) {
            // Read a local image as a text document
            const [result] = await client.documentTextDetection(imageDesc.path);
            //read text from file
            const fullTextAnnotation = result.fullTextAnnotation;

            if(fullTextAnnotation) {
                //text exists
                const fullText = fullTextAnnotation.text
                //store im mongodb
                createDoc(imageDesc.filename, fullText)
                //render template
                await renderSuccess(req, res, fullText)
            } else {
                //no text
                renderError(req, res)
            }
            //delete uploaded file to avoid waste of storage space
            fs.unlinkSync(imageDesc.path)
        }
        
    } catch (error) {
        console.log(err)
        next(error)
    }
}

module.exports = {
    getText
}
