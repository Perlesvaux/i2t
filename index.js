const express = require('express')
const app = express()
const port = 3001

//Utility to parse the path name
const path = require('path');

// Enable CORS (import module and use it globally)
const cors = require('cors')
app.use(cors())

// Enable usage of CLI tools
const { exec, spawn } = require('child_process');

const { createWorker } = require('tesseract.js');


// Configure body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))

// Configure multer to handle file upload
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// Import file-system module
const fs = require('fs')


// Logger
function MWLogger (req, res, next){
  console.log(`${req.method} ${req.path} ${req.ip}`)
  next()
}


// const worker = createWorker('eng')
//
// async function recognizeText(image){
//
//   const ret = await worker.recognize(image)
//   console.log(ret.data.text)
//   
//   await worker.terminate()
// }

app.post("/itt", upload.single("sendfile"), MWLogger, async (req, res) => {
    if (![ '.png', '.jpeg', '.tiff', '.jpg ', '.gif', '.webp', '.bmp', '.pnm' ].includes(path.extname(req.file.originalname).toLowerCase())){
    return res.json({output: "Invalid type"})
  }

  
  const worker = await createWorker('eng');
  const ret = await worker.recognize(`uploads/${req.file.filename}`);
  console.log(ret.data.text);
  await worker.terminate();

  res.json({output:ret.data.text})

  // await recognizeText(`uploads/${req.file.filename}`)


  })

// app.post("/itt", upload.single("sendfile"), MWLogger, (req, res) => {
//     if (![ '.png', '.jpeg', '.tiff', '.jpg ', '.gif', '.webp', '.bmp', '.pnm' ].includes(path.extname(req.file.originalname).toLowerCase())){
//     return res.json({output: "Invalid type"})
//   }
  //   //make sure to do: OMP_THREAD_LIMIT=1
//
//     const process = spawn('tesseract', [`uploads/${req.file.filename}`, '-', '-c', 'dotproduct=sse']);
//
//     process.stdout.on('data', (data)=>{
//       res.json({output:data.toString()})
//   })
//
//
//     process.on('close', (code) => {
//       if (code !== 0) {
//           return res.json({ err: `Process exited with code ${code}` });
//       }
//
//       const remotion = [`uploads/${req.file.filename}`];
//           Promise.all(remotion.map(file => fs.promises.unlink(file)));
//
//     return
//   });




  //   process.on('close', (code) => {
  //     if (code !== 0) {
  //         return res.json({ err: `Process exited with code ${code}` });
  //     }
  //
  //     res.setHeader('Content-Disposition', `attachment; filename=${req.file.originalname}.txt`);
  //     res.setHeader('Content-Type', 'application/octet-stream');
  //
  //     return res.sendFile(__dirname + `/text/${req.file.filename}.txt`, (err) => {
  //         if (err) {
  //             return res.json({ err: err });
  //         }
  //         const remotion = [`text/${req.file.filename}.vtt`, `text/${req.file.filename}.txt`, `text/${req.file.filename}.tsv`, `text/${req.file.filename}.srt`, `text/${req.file.filename}.json`, `uploads/${req.file.filename}`];
  //         Promise.all(remotion.map(file => fs.promises.unlink(file)));
  //     });
  // });
// });


//App is ready to go!
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
