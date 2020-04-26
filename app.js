require('dotenv').config();
const CreateImage = require('./create-image');
const VnExpress = require('./news/vnexpress');
const Facebook = require('./facebook');
const express = require('express');
const app = express();
const port = 3000;

const generator = async () => {
    let vnExpress = new VnExpress();
    let news = await vnExpress.get();

    let createImage = new CreateImage();
    let images = [];
    for (const feed of news) {
        images.push(await createImage.create(feed.img, feed.title, feed.description));
    }

    let facebook = new Facebook(process.env.ACCESS_TOKEN, process.env.GROUP_ID);

    facebook.postAsPage(process.env.PAGE_ID).postNews(images);
};

app.get('/fb-news', (req, res) => {
    generator(); //no need wait done and no need return anything
    res.send('Hello Facebook!!!')
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
