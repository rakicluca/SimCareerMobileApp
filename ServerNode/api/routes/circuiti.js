const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

let rawdata;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    const circuiti = getAllCircuiti();
    res.status(200).json(circuiti);
});

router.get('/:idCircuito',(req,res,next)=>{
    const circuiti = getAllCircuiti();
    let indexCircuito = getCircuitoById(req.params.idCircuito,circuiti);
    if (indexCircuito != -1)
      res.status(200).json(circuiti[indexCircuito]);
      else {
        res.status(500).json([]);
      }
});
module.exports = router;

function getAllCircuiti() {
  rawdata = fs.readFileSync('DB/circuiti.json');
  if(rawdata.length == 0)
    return ([]);
  else
    return JSON.parse(rawdata);
}

function getCircuitoById(idCircuito,circuiti) {
    let index=-1;
    for (let i = 0; i < circuiti.length; i++) {
      if(idCircuito==circuiti[i].idCircuito)
          index=i;
    }
    return index;
}
