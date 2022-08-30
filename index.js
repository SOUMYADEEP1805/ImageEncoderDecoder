const express = require('express')

const multer = require('multer')

const imageToBase64 = require("image-to-base64");

const decode = require('node-base64-image').decode

const fs = require('fs')
const encode = require('node-base64-image').encode

const path = require('path')

const bodyparser = require('body-parser');
const { fstat } = require('fs');

const app = express()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage }).single('file');

app.use(bodyparser.urlencoded({ extended: false }))

// app.use(bodyparser.json())

app.use(express.static('public/uploads'))

app.set('view engine','ejs')

const PORT = process.env.PORT || 5500

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/encode', (req, res) => {
    // upload the file

    output = Date.now()+ "En-output.txt"

    upload(req, res, (err) => {
        if (err) {
            console.log("some error occured in uploading the file")
            return
        }
        else {
            console.log(req.file.path)

            // encode to base64

            imageToBase64(req.file.path) // Path to the image
              .then((response) => {
                  console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
                  
                  fs.writeFileSync(output, response)
                  
                  res.download(output, () => {
                      console.log("file is downloaded")
                  })
              })
              .catch((error) => {
                console.log(error); // Logs an error if there was one
              });
        }
    })
})


app.post('/decode', async (req, res) => {
    
    output = Date.now()+ "De-output"
    upload(req, res,async (err) => {
        if (err) {
            console.log("error takes place")
            return
        }
        else {
            console.log(req.file.path)

            const base64code = fs.readFileSync(req.file.path, "utf8");

            console.log(base64code)
            
            await decode(base64code, { fname: output, ext: "jpg" });

            res.download(output + ".jpg", () => {
                console.log("file is downloaded")
            })

        }
    })
})

app.listen(PORT, () => {
    console.log("App is listening on port 5500")
})