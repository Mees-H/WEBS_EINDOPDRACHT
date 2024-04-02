const { ImgurClient } = require('imgur');
const fs = require('fs');
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });

// log if the client ID is not set
if (!process.env.IMGUR_CLIENT_ID) {
    console.error('IMGUR_CLIENT_ID is not set');
}

// Function to upload an image to Imgur
// use dynamic parent folder name as title if title is not provided
async function uploadImage(imagePath, title = 'Image uploaded from Target Service') {
    try {
        const response = await client.upload({
            image: fs.createReadStream(imagePath),
            title: title,
            type: 'stream',
          });

        // delete the image after uploading
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Failed to delete image', err);
            } else {
                console.log('Image deleted successfully');
            }
        });

        return response.data.link;
    } catch (error) {
        console.error('Failed to upload image to Imgur', error);
        throw new Error('Failed to upload image to Imgur ' + error.message);
    }
}

module.exports = {
    uploadImage
};