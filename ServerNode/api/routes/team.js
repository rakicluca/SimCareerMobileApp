const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

let rawdata;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    const team = getAllTeam();
    res.status(200).json(team);
});
router.get('/:idTeam',(req,res,next)=>{
    let teams = getAllTeam();
    let teamIndex = getTeamById(req.params.idTeam,teams)
    if(teamIndex!=-1)
      res.status(200).json(teams[teamIndex]);
      else {
        res.status(500).json([]);
      }
});

module.exports = router;

function getAllTeam() {
  rawdata = fs.readFileSync('DB/team.json');
  if(rawdata.length == 0)
    return ([]);
  else
    return JSON.parse(rawdata);
}

function getTeamById(idTeam,teams) {
    let index=-1;
    for (let i = 0; i < teams.length; i++) {
      if(idTeam==teams[i].idTeam)
          index=i;
    }
    return index;
}
