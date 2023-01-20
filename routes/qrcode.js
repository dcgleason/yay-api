const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const qrcode = require('qrcode');
const fs = require('fs');
const Gift = require("../models/Gift");

// Configure the AWS SDK with your S3 credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

router.post('/uploadAudio', async (req, res) => {
    try {
        // Send the audio file to S3
        const s3Response = await s3.upload({
            Bucket: process.env.S3_BUCKET,
            Key: `audio-${Date.now()}`,
            Body: req.body
        }).promise();

        // Generate the QR code from the audio file URL
        const qrCodeUrl = await generateQRCode(s3Response.Location);

        // Save the QR code URL to the database by updating the gift
        const updatedGift = await Gift.findByIdAndUpdate(req
            .body.giftId, {
            qrCodeUrl
        }, {
            new: true
        });
        

    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading audio');
    }
});

const generateQRCode = async (audioUrl) => {
    const qrCodeUrl = await qrcode.toDataURL(audioUrl);
    return qrCodeUrl;
}

module.exports = router;