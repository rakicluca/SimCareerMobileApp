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
    res.status(200).json(req.body[0].nome);
});

router.post('/',(req,res,next)=>{
  let bdy = req.body;
  const utenti = getAllUtenti();
  const alreadyUtenteEmail = findUtenteEmail(req.body[0].email, utenti);
  const alreadyUtenteUsername = findUtenteUsername(req.body[0],utenti);
  let check = addUtente(bdy);
  if(check)
    res.status(201).send("Utente aggiunto!");
    else{
      if(alreadyUtenteUsername) return res.status(400).send(`<h2>L'username '${req.body[0].username}' esiste già!</h2>`);
      else if(alreadyUtenteEmail) return res.status(400).send(`<h2>L'email '${req.body[0].email}' esiste già!</h2>`);
    }

});

//Handler modifica prodotto
router.put('/',(req,res,next)=>{
  let tmp = modifyUtente(req.body);
  if(tmp==true)
    res.status(201).send("Utente modificato!");
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

function modifyUtente(utente){
  let rawdata = fs.readFileSync('DB/utenti.json');
  let success = false;
  let check = false;
  const utenti = getAllUtenti();
  rawdata = JSON.parse(rawdata);
  for (var i = 0; i < rawdata.length; i++) {
    for (var j = 0; j < utente.length; j++) {
      if(utente[j].username.localeCompare(rawdata[i].username)===0){
        //console.log(product[j]);
        if(product[j].password==undefined)
        {
          rawdata[i].password = "";
        }else {
          rawdata[i].password = product[j].password;
        }
        if(product[j].nome==undefined)
        {
          rawdata[i].nome = "";
        }else {
          rawdata[i].nome = product[j].nome;
        }
        if(product[j].cognome==undefined)
        {
          rawdata[i].cognome = "";
        }else {
          rawdata[i].cognome = product[j].cognome;
        }
        if(product[j].data_nascita==undefined)
        {
          rawdata[i].data_nascita = "";
        }else {
          rawdata[i].data_nascita = product[j].data_nascita;
        }
        if(product[j].residenza==undefined)
        {
          rawdata[i].residenza = "";
        }else {
          rawdata[i].residenza = product[j].residenza;
        }
        if(product[j].imgUtente==undefined)
        {
          rawdata[i].imgUtente = "";
        }else {
          rawdata[i].imgUtente = product[j].imgUtente;
        }
        if(product[j].numero_in_gara_preferito==undefined)
        {
          rawdata[i].numero_in_gara_preferito = "";
        }else {
          rawdata[i].numero_in_gara_preferito = product[j].numero_in_gara_preferito;
        }
        if(product[j].id_numero_circuito_odiato==undefined)
        {
          rawdata[i].id_numero_circuito_odiato = "";
        }else {
          rawdata[i].id_numero_circuito_odiato = product[j].id_numero_circuito_odiato;
        }
        if(product[j].id_numero_circuito_preferito==undefined)
        {
          rawdata[i].id_numero_circuito_preferito = "";
        }else {
          rawdata[i].id_numero_circuito_preferito = product[j].id_numero_circuito_preferito;
        }
        if(product[j].id_auto_preferita==undefined)
        {
          rawdata[i].id_auto_preferita = "";
        }else {
          rawdata[i].id_auto_preferita = product[j].id_auto_preferita;
        }
        if(product[j].email==undefined)
        {
          rawdata[i].email = "";
        }else {
          if(!findUtenteEmail(product[j].email,utenti))
            rawdata[i].email = product[j].email;
            else{
              check=true;
            }
        }
        if(product[j].username==undefined)
        {
          rawdata[i].username = "";
        }else {
          if(!findUtenteUsername(product[j].username,utenti))
            rawdata[i].username = product[j].username;
            else{
              success=true;
            }
        }
        if (!check) {
          success=true;
        }
      }
    }
  }
  if (success) {
    fs.writeFileSync('DB/utenti.json',JSON.stringify(rawdata,null,2),'utf8');
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
