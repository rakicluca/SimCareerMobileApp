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

router.get('/:idClassificaCampionato',(req,res,next)=>{
    const classifiche = getAllClassifiche();
    let indexClassifica = getClassicaById(req.params.idClassificaCampionato,classifiche);
    if (indexClassifica != -1)
      res.status(200).json(classifiche[indexClassifica]);
      else {
        res.status(500).json([]);
      }
});
module.exports = router;


function getAllClassifiche() {
  rawdata = fs.readFileSync('DB/classifiche.json');
  if(rawdata.length == 0)
    return ([]);
  else
    return JSON.parse(rawdata);
}

function getClassicaById(idClassifica,classifiche) {
    let index=-1;
    for (let i = 0; i < classifiche.length; i++) {
      if(idClassifica==classifiche[i].id)
          index=i;
    }
    return index;
}
