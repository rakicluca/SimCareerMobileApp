const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

let rawdata;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/',(req,res,next)=>{
    const utenti = getAllUtenti();
    res.status(200).json(utenti);
});
router.get('/:idUtente',(req,res,next)=>{
    const utenti = getAllUtenti();
    let index = getOneUtenteById(req.params.idUtente,utenti);
    if(index != -1 )
      res.status(200).json(utenti[index]);
      else {
        res.status(404).json([])
      }
});

router.post('/',(req,res,next)=>{
  const utenti = getAllUtenti();
  const alreadyUtenteEmail = findUtenteEmail(req.body[0].email, utenti);
  const alreadyUtenteUsername = findUtenteUsername(req.body[0],utenti);
  let check = addUtente(req.body);
  if(check)
    res.status(201).send("Utente aggiunto!");
    else{
      if(alreadyUtenteUsername) return res.status(400).send(`<h2>L'username '${req.body[0].username}' esiste già!</h2>`);
      else if(alreadyUtenteEmail) return res.status(400).send(`<h2>L'email '${req.body[0].email}' esiste già!</h2>`);
    }

});

//Handler modifica utente
router.put('/:utenteUsername',(req,res,next)=>{
  let tmp = modifyUtente(req.params.utenteUsername,req.body);
  if(tmp[0]==false && tmp[1]==false && tmp[2]==false)
    res.status(201).send("Utente modificato!");
    else{
      res.status(404).send(tmp);
    }
});

//Handler elimina utente
router.delete('/',(req,res,next)=>{
  let tmp = deleteUtente(req.body);
  if(tmp==true)
    res.status(201).send("Utente eliminato con successo!");
    else {
      res.status(404).send("Qualcosa è andato storto. Utente non trovato!");
    }
});

module.exports = router;


function getAllUtenti() {
  rawdata = fs.readFileSync('DB/utenti.json');
  if(rawdata.length == 0)
    return ([]);
  else
    return JSON.parse(rawdata);
}

function findUtenteEmail(utenteEmail,utenti){
  return utenti.find(ut => ut.email === utenteEmail.email)
}

function findUtenteUsername(utenteUsername,utenti) {
  return utenti.find(p => p.username === utenteUsername.username)
}

function getOneUtenteById(idUtente,utenti) {
  let index=-1;
  for (let i = 0; i < utenti.length; i++) {
    if(idUtente==utenti[i].id)
        index=i;
  }
  return index;
}

/*Aggiunge un prodotto al nostro "db" che è un file JSON.
  Il parametro body passa appunto tutto il body con i relativi dati
  Check se file vuoto prima di scrivere
*/
/**
  @param {Object} utente
  @return {Bool} success
*/

function addUtente(utente){
  let rawdata;
  let success = false;
  try {
    rawdata = fs.readFileSync('DB/utenti.json');
  } catch (e) {
    throw e;
  }
  let tmp = [];
  let index;
  if(utente.length==1){
    tmp = JSON.parse(rawdata);
    index = exist(utente[0].email,tmp);
    if(index==-1){
      tmp.push(utente.pop());
      success=true;
    }else {
      success=false;
    }
  }
  else {
    tmp = JSON.parse(rawdata);
    for (var i = 0; i < utente.length; i++) {
      index = exist(utente[i].email,tmp);
      if(index==-1){
      try {
        tmp.push(utente[i]);
        success=true;
      } catch (e) {
        success = false;
        }
      }
      else {
        success=false;
      }
    }
  }
  if(success)
    fs.writeFileSync('DB/utenti.json',JSON.stringify(tmp,null,2),'utf8');
  return success;
}

/*Modifica le info dell'utente del nostro "db" che è un file JSON.
  ritorna una variabile bool per controllare eventuali errori
*/

function modifyUtente(utenteUsername,utente){
  let rawdata = fs.readFileSync('DB/utenti.json');
  let success = [false,false,false]; //[0] -> email, [1] -> username, [2] -> usernameNonEsiste
  const utenti = getAllUtenti();
  rawdata = JSON.parse(rawdata);
  for (var i = 0; i < rawdata.length; i++) {
    for (var j = 0; j < utente.length; j++) {
      if(utenteUsername.localeCompare(rawdata[i].username)===0){
        if(utente[j].password=="")
        {

        }else {
          rawdata[i].password = utente[j].password;
        }
        if(utente[j].nome=="")
        {

        }else {
          rawdata[i].nome = utente[j].nome;
        }
        if(utente[j].cognome=="")
        {

        }else {
          rawdata[i].cognome = utente[j].cognome;
        }
        if(utente[j].data_nascita=="")
        {

        }else {
          rawdata[i].data_nascita = utente[j].data_nascita;
        }
        if(utente[j].residenza=="")
        {

        }else {
          rawdata[i].residenza = utente[j].residenza;
        }
        if(utente[j].imgUtente=="")
        {

        }else {
          rawdata[i].imgUtente = utente[j].imgUtente;
        }
        if(utente[j].numero_in_gara_preferito=="")
        {

        }else {
          rawdata[i].numero_in_gara_preferito = utente[j].numero_in_gara_preferito;
        }
        if(utente[j].id_numero_circuito_odiato=="")
        {

        }else {
          rawdata[i].id_numero_circuito_odiato = utente[j].id_numero_circuito_odiato;
        }
        if(utente[j].id_numero_circuito_preferito=="")
        {

        }else {
          rawdata[i].id_numero_circuito_preferito = utente[j].id_numero_circuito_preferito;
        }
        if(utente[j].id_auto_preferita=="")
        {

        }else {
          rawdata[i].id_auto_preferita = utente[j].id_auto_preferita;
        }
        if(utente[j].email=="")
        {

        }else{
          if(utente[j].id != rawdata[i].id){
            if(findUtenteEmail(utente[j],utenti)){
              success[0]=true;
            }
            }else{
              rawdata[i].email = utente[j].email;
          }
        }
        if(utente[j].username=="")
        {

        }else{
          if(utente[j].id != rawdata[i].id){
          if(findUtenteUsername(utente[j],utenti)){
            success[1]=true;
          }
          }else{
              rawdata[i].username = utente[j].username;
            }
        }
      }else {
        success[2] = true;
      }
    }
  }
  if (success[0]==false && success[1]==false && success[2]==false) {
    fs.writeFileSync('DB/utenti.json',JSON.stringify(rawdata,null,2),'utf8');
  }
  return success;
}

function deleteUtente(utente){
  let rawdata = fs.readFileSync('DB/utenti.json');
  let success = false;
  rawdata = JSON.parse(rawdata);
  for (var i = 0; i < utente.length; i++) {
    for (var j = 0; j < rawdata.length; j++) {
      if(utente[i].id==rawdata[j].id){
        rawdata.splice(j,1);
        success=true;
      }
    }
  }
  if(rawdata.length!=0)
    fs.writeFileSync('DB/utenti.json',JSON.stringify(rawdata,null,2),'utf8');
    else {
      fs.writeFileSync('DB/utenti.json',"[]",'utf8');
    }
  return success;
}

function exist(utenteEmail,utentiDB){
  let index=-1;
  for (let i = 0; i < utentiDB.length; i++) {
    if(utenteEmail.localeCompare(utentiDB[i].email)==0)
        index=i;
  }
  return index;
}
