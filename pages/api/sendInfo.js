export default (req, res) => {
    const body = JSON.parse(req.body);
    const fs = require('fs');
    const dir = fs.readdir('././public/images', (err) => err && console.error(err));
    console.log(dir);
    let rawdata = fs.readFileSync('././public/animals.json'); // Читаем файл.
    let parseddata= JSON.parse(rawdata); // парсим и получаем JS объект из строки
    parseddata.push({
        "content": body.name,
        "header": body.age,
        'email': body.breed,
        'img': body.image,
    });
    let data = JSON.stringify(parseddata);
    fs.writeFileSync('././public/animals.json', data);
    console.log(body);
    res.status(200).json({ status: 'OK' });

};
class RandImg {
    static count = 0;
    static strName = ['mouse.png', 'cat.png', 'dog.png', 'rabbit.png'];
    rand();
}

function rand(number) {
    if (RandImg.count < RandImg.strName.length) {
        let temp = RandImg.strName[RandImg.count];
        RandImg.count++;
        console.log(temp);
        return temp;
    } else {
        RandImg.count = 0;
        return RandImg.strName[RandImg.count];
    }
}

function convertToDataURLviaCanvas(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}