const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

let rawdata;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    const champ = getAllCampionati();
    res.status(200).json(champ);
});
router.get('/:idCampionato',(req,res,next)=>{
    const campionati = getAllCampionati();
    let indexCampionato = getCampionatoById(req.params.idCampionato,campionati);
    if(indexCampionato!=-1)
      res.status(200).json(campionati[indexCampionato]);
      else {
        res.status(500).json([]);
      }
});

module.exports = router;


function getAllCampionati() {
  rawdata = fs.readFileSync('DB/campionati.json');
  if(rawdata.length == 0)
    return ([]);
  else
    return JSON.parse(rawdata);
}

function getCampionatoById(idCampionato,campionati) {
    let index=-1;
    for (let i = 0; i < campionati.length; i++) {
      if(idCampionato==campionati[i].id)
          index=i;
    }
    return index;
}
