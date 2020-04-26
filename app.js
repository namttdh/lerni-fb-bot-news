require('dotenv').config();
const CreateImage = require('./create-image');
const VnExpress = require('./news/vnexpress');
const Facebook = require('./facebook');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const generator = async () => {
    let vnExpress = new VnExpress();
    let news = await vnExpress.get();

    let createImage = new CreateImage();
    let images = [];
    for (const feed of news) {
        images.push(await createImage.create(feed.img, feed.title, feed.description));
    }

    let facebook = new Facebook(process.env.ACCESS_TOKEN, process.env.GROUP_ID);

    if (process.env.PAGE_ID) {
        facebook.postAsPage(process.env.PAGE_ID)
    }
    facebook.postNews(images);
};

app.use((req, res, next) => {
    //BASIC AUTHENTICATION
    const auth = {login: process.env.BASIC_USER, password: process.env.BASIC_PASSWORD};

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next()
    }
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
});

app.get('/fb-news', (req, res) => {
    generator(); //no need wait done and no need return anything
    res.send('Hello Facebook!!!')
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
