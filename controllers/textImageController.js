


const mongoose = require('mongoose');
const vision = require('@google-cloud/vision');
const fs = require('fs')
const { checkError, renderSuccess, renderError, createDoc } = require('../middleware/index');

const getText = async(req, res, next) => {
    // Imports the Google Cloud client library
    try {
        // Creates a client
        const client = new vision.ImageAnnotatorClient();
        const imageDesc = await checkError(req, res)
        if(imageDesc !== undefined) {
            console.log(imageDesc)
            const [result] = await client.textDetection(imageDesc.path);
            const detections = result.textAnnotations;
            if(detections.length >  0) {
                //text exists
                const [ text, ...others ] = detections
                createDoc(imageDesc.filename, text.description)
                await renderSuccess(req, res, text.description)
            } else {
                //no text
                renderError(req, res)
            }
            //delete uploaded file to avoid waste of storage space
            fs.unlinkSync(imageDesc.path)
        }
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    getText
}