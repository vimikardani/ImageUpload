const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const port = 3100;

const app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/imageUpload')

const imageSchema = mongoose.Schema({
    picture: String
})

let mymodel = mongoose.model('mymodel', imageSchema);

let storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }

})

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/gif' ||
            file.mimetype == 'image/png'
        ) {
            cb(null, true)
        }
        else {
            cb(null, false)
            cb(new Error('Only JPEG,JPG,GIF,PNG Files are allowed'))
        }
    }
})

app.get('/', (req, res) => {
    res.send('Home page')
})

app.get('/indexfile', (req, res) => {
    res.render('index')
})

app.post('/fileUpload', upload.single('single-input'), async (req, res) => {
    const imageCreate =await mymodel.create({ picture: req.file.filename })

        res.redirect('/imagePreview')


//         .then((x) => {
//             console.log('Upload succssfully')
//             res.redirect('/imagePreview')
//         })
//         .catch((e) => console.log(e.message));
})

app.get('/imagePreview', async(req, res) => {

    const imageFind=await mymodel.find();
    res.render('imagePreview',{x:imageFind})

    // const imageFind = mymodel.find().then((x) => {
    //     res.render('imagePreview', { x })
    //     console.log(x);
    // })
    //     .catch((e) => {
    //         console.log(e);
    //     })


})

app.listen(port, () => {
    console.log('Server is listening');
})