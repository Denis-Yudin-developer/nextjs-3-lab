//var formidable = require("formidable");
import formidable from "formidable";
import fs from "fs";


export const config = {
    api: {
      bodyParser: false
    }
};
  
const post = async (req, res) => {
    const form = new formidable.IncomingForm(); //получаем объект формы
    let rawdata = fs.readFileSync('././public/animals.json');
    let parseddata= JSON.parse(rawdata);
    form.parse(req, async function (err, fields, files) {
        try{
            console.log(fields);
            await saveFile(files.file);
            parseddata.push({
                "content": fields.name,
                "header": fields.age,
                'email': fields.breed,
                'img': 'images/' + files.file.originalFilename,
            });
            let data = JSON.stringify(parseddata);
            fs.writeFileSync('././public/animals.json', data);
            console.log(files.file.originalFilename);
        }   
        catch(e){
            console.log('Ошибка: ',e);	
        }
        return res.status(201).send("Nothing");
    });
};

const saveFile = async (file) => {
    const data = fs.readFileSync(file.filepath); //чтение содержимого временного файла
    fs.writeFileSync(`./public/images/${file.originalFilename}`, data); //сохранени файла
    await fs.unlinkSync(file.filepath); //Удаление временного файла
    return;
};

export default (req, res) => {
    if (req.method === "POST") post(req,res);
    else res.status(200).send("Invalid method, use POST")
}