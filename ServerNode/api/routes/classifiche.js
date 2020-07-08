const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

let rawdata;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    const classifiche = getAllClassifiche();
    res.status(200).json(classifiche);
});
module.exports = router;


function getAllClassifiche() {
  rawdata = fs.readFileSync('DB/classifiche.json');
  if(rawdata.length == 0)
    return ([]);
  else
    return JSON.parse(rawdata);
}
