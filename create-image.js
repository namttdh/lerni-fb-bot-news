const { createCanvas, loadImage } = require('canvas');

function CreateImage() {
    const MAX_WIDTH_CANVAS = 700;

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';

        for(let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);

        return y;
    }

    this.create = async (imgLink, title, description) => {
        const ribonNew = await loadImage('ribbon.png');
        const canvasSource = [];
        const margin = 10;
        const spaceBetweenCanvas = margin * 2 * 3; //marginTop and marginBottom 10px x 3 canvas
        let imageCanvas = await createImageCanvas(imgLink);
        let descriptionCanvas = await createDescriptionCanvas(description);

        let titleCanvas = createTitleCanvas(title);

        canvasSource.push(imageCanvas);
        canvasSource.push(titleCanvas);
        canvasSource.push(descriptionCanvas);

        let maxWidth = 0;
        let height = 0;

        canvasSource.map(item => {
            if (maxWidth < item.width) maxWidth = item.width;
            height += item.height;
        });

        const canvas = createCanvas(maxWidth, height + spaceBetweenCanvas);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(imageCanvas.canvas, 0, 0, imageCanvas.canvas.width, imageCanvas.canvas.height);
        ctx.drawImage(titleCanvas.canvas, 0,  imageCanvas.canvas.height + margin, titleCanvas.canvas.width, titleCanvas.canvas.height);
        ctx.drawImage(descriptionCanvas.canvas, 0, imageCanvas.canvas.height + titleCanvas.height + margin*2, descriptionCanvas.canvas.width, descriptionCanvas.canvas.height);
        ctx.drawImage(ribonNew, maxWidth - (ribonNew.width/3) + 17, -17, ribonNew.width/3, ribonNew.height/3);

        return canvas.toBuffer('image/png');
    };

    const createTitleCanvas = (title) => {
        const canvas = createCanvas(MAX_WIDTH_CANVAS, 350);
        const ctx = canvas.getContext('2d');
        const paddingLeft = 20;
        const paddingRight = 20;

        ctx.font = 'bold 30px Helvetica, Arial, sans-serif';
        let heightText = wrapText(ctx, title, paddingLeft, 30, canvas.width - paddingRight, 30);

        return {canvas, height: heightText, width: MAX_WIDTH_CANVAS};
    };

    const createDescriptionCanvas = async (description) => {
        const canvas = createCanvas(MAX_WIDTH_CANVAS, 350);
        const ctx = canvas.getContext('2d');
        const paddingLeft = 20;
        const paddingRight = 20;

        ctx.font = '20px arial,sans-serif-light,sans-serif';
        let heightText = wrapText(ctx, description, paddingLeft, 20, canvas.width - paddingRight, 30);
        const lerniLogo = await loadImage('lerni.dev.png');
        let cordFitImage = getCordFitImage(lerniLogo, heightText, MAX_WIDTH_CANVAS);
        ctx.drawImage(lerniLogo, cordFitImage.x, cordFitImage.y, lerniLogo.width * cordFitImage.scale, lerniLogo.height * cordFitImage.scale);

        return {canvas, height: heightText, width: MAX_WIDTH_CANVAS};
    };

    const createImageCanvas = async (url) => {
        const canvasHeight = 350;
        const img = await loadImage(url);
        const canvas = createCanvas(MAX_WIDTH_CANVAS, canvasHeight);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#9b9b9b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let cordFitImage = getCordFitImage(img, canvas.height, canvas.width);

        ctx.drawImage(img, cordFitImage.x, cordFitImage.y, img.width * cordFitImage.scale, img.height * cordFitImage.scale);

        return {canvas, height: canvasHeight, width: MAX_WIDTH_CANVAS};
    };

    const getCordFitImage = (image, height, width) => {
        // get the scale
        let scale = Math.min(width / image.width, height / image.height);

        // get the top left position of the image
        let x = (width / 2) - (image.width / 2) * scale;
        let y = (height / 2) - (image.height / 2) * scale;

        return {scale, x, y};
    }
}


module.exports = CreateImage;
