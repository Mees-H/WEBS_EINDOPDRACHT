const { ImgurClient } = require('imgur');
const fs = require('fs');
const url = require('url');
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });

// log if the client ID is not set
if (!process.env.IMGUR_CLIENT_ID) {
    console.error('IMGUR_CLIENT_ID is not set');
}

// Function to upload an image to Imgur
async function uploadImage(imagePath, title = 'Image uploaded from Target Service') {
    try {
        const response = await client.upload({
            image: fs.createReadStream(imagePath),
            title: title,
            type: 'stream',
          });

        // Wait for an url before deleting the image
        var imageUrl = response.data.link;

        // delete the image after uploading
        fs.unlinkSync(imagePath, (err) => {
            if (err) {
                console.error('Failed to delete image', err);
            } else {
                console.log('Image deleted successfully');
            }
        });

        const parsedUrl = url.parse(imageUrl);
        if (!parsedUrl.protocol || !parsedUrl.host) {
            throw new Error('Failed to upload image to Imgur ' + imageUrl);
        }

        return imageUrl;
    } catch (error) {
        console.error('Failed to upload image to Imgur', error);
        throw new Error('Failed to upload image to Imgur ' + error.message);
    }
}

module.exports = {
    uploadImage
};