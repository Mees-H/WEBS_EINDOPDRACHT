const axios = require('axios');

const apiKey = 'acc_d5dd195628efb1b';
const apiSecret = '04f1b855e72cd46de8771076d0b3a6fe';

async function compareImages(image1, image2) {
    try {
        url = 'https://api.imagga.com/v2/images-similarity/categories/general_v3?image_url=' + image1 + '&image2_url='+ image2;
        const response = await axios.get(url, {auth: {username: apiKey, password: apiSecret}});
        return response.data;
    } catch (error) {
        console.log(error.response.data);
    }
}

module.exports = {
    compareImages
};
