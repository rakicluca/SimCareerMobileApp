const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

let rawdata;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    const auto = getAllAuto();
    res.status(200).json(auto);
});

router.get('/:idAuto',(req,res,next)=>{
    const auto = getAllAuto();
    let indexAuto = getAutoById(req.params.idAuto,auto);
    if (indexAuto != -1)
      res.status(200).json(auto[indexAuto]);
      else {
        res.status(500).json([]);
      }
});

module.exports = router;

function getAllAuto() {
  rawdata = fs.readFileSync('DB/auto.json');
  if(rawdata.length == 0)
    return ([]);
  else
    return JSON.parse(rawdata);
}

function getAutoById(idAuto,auto) {
    let index=-1;
    for (let i = 0; i < auto.length; i++) {
      if(idAuto==auto[i].idAuto)
          index=i;
    }
    return index;
}
