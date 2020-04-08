const express = require('express')
const fileUpload = require('express-fileupload');
const path = require('path')
const session = require('express-session');
const bcrypt = require('bcrypt');
const FileStore = require('session-file-store')(session);
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')
const DATABASE_URL  = 'postgres://pdalrvwbtruhfe:b1e3a44f14fcc8b4fee09854f31859cdba2fa828cc332cb6704305667b8f6a1d@ec2-52-86-33-50.compute-1.amazonaws.com:5432/dali8un83c1hi5?ssl=true';
const connectionString = process.env.DATABASE_URL || DATABASE_URL
const pool = new Pool({ connectionString: connectionString })



express()
//.use(require('morgan')('dev'))
.use(express.json())
.use(express.urlencoded())
.use(express.static(path.join(__dirname, 'public/Blue/dist')))
.use(session({
    name: 'delicious-cookie-id',
    secret: 'some secret',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()

}))
// enable files upload
.use(fileUpload())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', getMenuData, (req, res) => {res.render('pages/index', {characters: req.characters, party: req.party, games: req.games, user: req.user[0], session: req.session})})
  .get('/createCharacter', getMenuData, (req,res) => {res.render('pages/createCharacter', {characters: req.characters, party: req.party, games: req.games, user: req.user[0],session: req.session})})
  .get('/createGame', getMenuData, (req,res) => {res.render('pages/createGame', {characters: req.characters, party: req.party, games: req.games, user: req.user[0],session: req.session})})
  .get('/joinGame', getMenuData, (req,res) => {
    if(req.query.game && req.query.party) {
      sql = "INSERT INTO party_members (party_id, player_id, created_by, created_date, last_updated_by, last_updated_date) VALUES (" + req.query.party + ",  1, 1, CURRENT_DATE, 1, CURRENT_DATE)";
    }
    if(req.query.g && !req.query.p) {
      sql = "select g.game_id, p.party_id from games g INNER JOIN party p ON p.game_id = g.game_id INNER JOIN party_members pm ON pm.party_id = p.party_id WHERE g.invite_link = '" + req.query.g + "'";
      sqlQuery(sql, function (err, result) {
        sql = "INSERT INTO party_members (party_id, player_id, created_by, created_date, last_updated_by, last_updated_date) VALUES (" + result[0].party_id + ",  " + req.session.user_id + ", 1, CURRENT_DATE, 1, CURRENT_DATE)"
        sqlQuery(sql, function(err,innerResult) { 
          req.session.game_id = result[0].game_id;
          req.session.party_id = result[0].party_id;
          res.redirect('/');
        })
      })
    }

  })
  .get('/character', getMenuData, (req, res) => {
    
    var count = 0,
    id,
    displayCharacter,
    knownSpells,
    knownAbilities;

    if(req.query.id) {
       id = req.query.id
    }
    else {
       id = req.characters[0];
    }
      sqlQuery("SELECT *  FROM player_characters c "
      + "INNER JOIN (SELECT name AS race_name, character_races_id FROM character_races) AS r ON r.character_races_id = c.race "
      + "INNER JOIN (SELECT name AS class_name, character_classes_id FROM character_classes) AS cl ON cl.character_classes_id = c.class "
      + "INNER JOIN (SELECT name AS major_background_name, character_backgrounds_id FROM character_backgrounds) AS b1 ON b1.character_backgrounds_id = c.major_background "
      + "INNER JOIN (SELECT name AS minor_background_name, character_backgrounds_id FROM character_backgrounds) AS b2 ON b2.character_backgrounds_id = c.minor_background WHERE player_character_id= " + id, function (request, result) {
        
        displayCharacter = result[0];
        console.log(displayCharacter);
        count += 1;
        if (count == 3) {
        res.render('pages/character-sheet', {characters: req.characters, party: req.party, games: req.games, user: req.user[0],session: req.session, displayCharacter: displayCharacter, spells: knownSpells, abilities: knownAbilities})
        }
      })

      sqlQuery("SELECT * FROM known_spells s INNER JOIN character_spells c ON s.character_spells_id = c.character_spells_id WHERE player_character_id = " + id, function (err, result) {

        knownSpells = result;
        console.log(knownSpells);
        count +=1;
        if(count == 3) {
          res.render('pages/character-sheet', {characters: req.characters, party: req.party, games: req.games, user: req.user[0],session: req.session, displayCharacter: displayCharacter, spells: knownSpells, abilities: knownAbilities})
        }


      })

      sqlQuery("SELECT * FROM known_abilities a INNER JOIN character_abilities c ON a.character_abilities_id = c.character_abilities_id WHERE player_character_id = " + id, function (err, result) {

        knownAbilities = result;
        console.log(knownAbilities);
        count +=1;
        if(count == 3) {
          res.render('pages/character-sheet', {characters: req.characters, party: req.party, games: req.games, user: req.user[0],session: req.session, displayCharacter: displayCharacter, spells: knownSpells, abilities: knownAbilities})
        }


      })

  })
  .get('/login', (req,res) => {res.render('pages/login')})
  .post('/login', (req, res) => {

    var email = req.body.email;
    var password = req.body.password;


    let sql = "SELECT user_account_id, password, game_id from user_accounts u LEFT OUTER JOIN party_members pm ON u.user_account_id = pm.player_id LEFT OUTER JOIN party p ON p.party_id = pm.party_id WHERE email = '" + email + "'";

    sqlQuery(sql, function (err, response){

      if(err) {
          console.error(err);
      }
      
      if(response.length >= 1) {
            
            bcrypt.compare(password, response[0].password, function(err, result) {
                if(result) {

                  console.log(response[0].game_id);
                  if(response[0].game_id == null) {
                    console.log('In if')
                    req.session.game_id = 1;
                    req.session.party_id = 1;
                  }
                  else {
                    console.log("in else")
                    req.session.game_id = response[0].game_id;
                    req.session.party_id = response[0].party_id;
                  }

                    req.session.user_id = response[0].user_account_id;
                    
                    if (req.session.redirect) {
                      console.log("Redirecting to: " + req.session.redirect)
                      res.redirect(req.session.redirect)
                    } else {
                      res.redirect('/')
                    }
                    
                }
                else {
                    res.render('pages/login')
                }
            });
            
        }
        else {
            res.render('pages/login')
        }
    })
  })
  .get('/register', (req, res) => { res.render('pages/register', {error: "", username: "", firstname: "", lastname: "", email: " ", password: ""})})
  .post('/register',(req, res) => {
    
    console.log(req.body)
    var username = req.body.username,
    firstname = req.body.firstname,
    lastname = req.body.lastname,
    email = req.body.email,
    password = req.body.password;

    bcrypt.hash(password, 10).then(function(hash) {
      password = hash;

      sql = "INSERT INTO user_accounts (username, password, email, first_name, last_name, created_by, created_date, last_updated_by, last_updated_date) VALUES" +
              "('"+ username +"',     '"+ password +"' , '" + email + "' ,  '" + firstname + "',     '" + lastname + "',    1,          CURRENT_DATE, 1,              CURRENT_DATE )"

      sqlQuery(sql, function(err, data) {
         if(err){
           console.error(err)
           
           res.status(422)
           res.render('pages/register', {error: err, username: username, firstname: firstname, lastname: lastname, email: email, password: req.body.password})
         }
         else {
          res.redirect('/login');
         }
         
      })
  });


  })
  .get('/logout', (req, res) => {req.session.destroy(); res.redirect('/login')})
  .get('/getRaces', (request, response) => {

            //let sql = 'SELECT * FROM character_races c INNER JOIN user_orders orders ON c.module_id = orders.module_id WHERE orders.user_account_id = $1'
    let id = (request.query.id ? request.query.id : 0)

    let sql = 'SELECT * FROM character_races';

    if (id != 0) {
      sql += (" WHERE character_races_id = " + id);
    }


    sqlQuery(sql, function(err, result) {

      response.end(JSON.stringify(result))

    })
  })
  .get('/getClasses', (request, response) => {

    let id = (request.query.id ? request.query.id : 0)

    //let sql = 'SELECT * FROM character_classes c INNER JOIN user_orders orders ON c.module_id = orders.module_id WHERE orders.user_account_id = $1'
    let sql = 'SELECT * FROM character_classes';

    if (id != 0) {
      sql += (" WHERE character_classes_id = " + id);
    }

    sqlQuery(sql, function(err, result) {

        response.end(JSON.stringify(result))

    })
})
.get('/getBackgrounds', (request, response) => {

  let id = (request.query.id ? request.query.id : 0)

  //let sql = 'SELECT * FROM character_classes c INNER JOIN user_orders orders ON c.module_id = orders.module_id WHERE orders.user_account_id = $1'
  let sql = 'SELECT * FROM character_backgrounds';

  if (id != 0) {
    sql += (" WHERE character_backgrounds_id = " + id); 
  }

  sqlQuery(sql, function(err, result) {

      response.end(JSON.stringify(result))

  })
})
.post('/submitNewCharacter', (req, res) => {

  console.log(req.body);

  const owner_id = req.session.user_id,
  party_id = req.session.party_id,
  game_id = req.session.game_id,
  race = req.body.Race,
  characterClass = req.body.Class,
  major_background = req.body.MajorBackground,
  minor_background = req.body.MinorBackground,
  name = req.body.name,
  hair = req.body.hair,
  skin = req.body.skin,
  eyes = req.body.Eyes,
  height = req.body.feet + " " + req.body.inches,
  weight = req.body.weight,
  str = 10,
  dex = 10,
  con = 10,
  spd = 10,
  wit = 10,
  int = 10,
  cha = 10,
  wis = 10;
  var sql = 'INSERT INTO player_characters (owner_id, game_id, party_id, race, class, major_background, minor_background, name, hair, skin, eyes, height, weight, strength, dexterity, constitution, speed, wit, intelligence, wisdom, charisma, created_by, created_date, last_updated_by, last_updated_date)' 
  +     "VALUES      ("+ owner_id +", "+ game_id +", "+ party_id +", "+ race +", "+ characterClass +", "+ major_background +", "+ minor_background +",     '"+ name +"',   '"+ hair +"'   ,   '"+ skin +"'  , '"+ eyes +"',  '"+ height +"'  ,    "+ weight +", "+ str +", "+ dex +", "+ con +", "+ spd +", "+ wit +", "+ int +", "+ wis +", " + cha +", 1, CURRENT_DATE, 1, CURRENT_DATE);"
  + " SELECT player_character_id from player_characters WHERE name = '" + name + "' AND owner_id = " + owner_id;
  sqlChainQuery(sql, function(err, result) {

    console.log(result[1].rows);
    let count = 0,
    character_id = result[1].rows[0].player_character_id;

    sqlQuery("SELECT * FROM class_abilities ca1 INNER JOIN character_abilities ca2 ON ca1.character_abilities_id = ca2.character_abilities_id WHERE character_classes_id = " + characterClass, function(err, abilitiesResult) {
      
      console.log("----AbilitiesResult-----")
      console.log(abilitiesResult);
      console.log("Length: " + abilitiesResult.length)
      let abilityInsertSQL = "INSERT INTO known_abilities (character_abilities_id, player_character_id, created_by, created_date, last_updated_by, last_updated_date) VALUES ";
      for (let i = 0; i < abilitiesResult.length; i++) {
        
        abilityInsertSQL += "(" + abilitiesResult[i].character_abilities_id + ", " + character_id + ", 1,          CURRENT_DATE, 1,               CURRENT_DATE)";
        if (i != abilitiesResult.length - 1) {
          abilityInsertSQL += ", "
        } else {
          sqlQuery(abilityInsertSQL, function (err, deepResult) {
            console.log("abilities inserted");
            count++;
            if(count == 2) {
              console.log("Count")
              res.redirect('/character?id=' + character_id)
            }
    
          })
        }
      }

      

      sqlQuery("SELECT * FROM class_spells ca1 INNER JOIN character_spells ca2 ON ca1.character_spells_id = ca2.character_spells_id WHERE character_classes_id =  " + characterClass, function(err, spellsResult) {
          var spellInsertSQL = "INSERT INTO known_spells (character_spells_id, player_character_id, created_by, created_date, last_updated_by, last_updated_date) VALUES ";
          for (let j = 0; j < spellsResult.length; j++) {
            spellInsertSQL += "(" + spellsResult[j].character_spells_id + ", " + character_id + ", 1,          CURRENT_DATE, 1,               CURRENT_DATE)";
            if (j != spellsResult.length - 1) {
              spellInsertSQL += ", "
            } else {
              sqlQuery(spellInsertSQL, function (err, deepResult) {
                console.log("spells inserted");
                count++
                if(count == 2) {
                res.redirect('/character?id=' + character_id)
                }
              })
            }
          }

          if (spellsResult.length == 0) {
            console.log("spells inserted");
            count++
            if(count == 2) {
            res.redirect('/character?id=' + character_id)
            }
          }
        })
        

      })
      
    })
    
})

.post('/submitNewGame', (req,res) => {

    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let image = req.files.image;
            let imageName = req.session.user_id + Math.random() + image.name;
            

            var sql = 'INSERT INTO games (owner_id, name, image, invite_link, created_by, created_date, last_updated_by, last_updated_date) '
  + "VALUES          (" + req.session.user_id + ", '" + req.body.gameName + "', '" + imageName + "','" + req.body.inviteLink + "',1, CURRENT_DATE, 1, CURRENT_DATE);"
  + "INSERT INTO party (game_id, created_by, created_date, last_updated_by, last_updated_date)"
  + "VALUES  ( currval('games_game_id_seq') ,  1, CURRENT_DATE, 1, CURRENT_DATE); "
  + "INSERT INTO party_members (party_id, player_id, created_by, created_date, last_updated_by, last_updated_date)"
  + " VALUES      (currval('party_party_id_seq')," + req.session.user_id + ", 1, CURRENT_DATE, 1, CURRENT_DATE);";
            
            image.mv('./public/Blue/dist/assets/images/games/' + imageName, function(err) {
              if (err)
                return res.status(500).send(err);
            });

            sqlQuery(sql, function(err, result) {
                        
              res.redirect('/?game=' + req.body.gameName)
              
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }

  

})
.post('/updateBackstory', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
      console.log(req.body)
    var value = req.body.value;
    sqlQuery("UPDATE player_characters SET backstory = '" + value + "' WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateHealth', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    console.log(req.session.user_id);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET current_health= " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
    }  
    else {
      res.json({success: false})
    }
  })
})
.post('/updatePowerDice', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET current_power_dice = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateStrength', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_strength = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateDexterity', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_dexterity = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateConstitution', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_constitution = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateSpeed', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_speed = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateIntelligence', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_intelligence = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateWisdom', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_wisdom= " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateCharisma', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_charisma = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})
.post('/updateWit', (req, res) => {
  sqlQuery("SELECT owner_id FROM player_characters WHERE player_character_id = " + req.query.id, function(err, checkResult){
    console.log(checkResult);
    if(checkResult[0].owner_id == req.session.user_id) {
    value = req.query.value;
    sqlQuery("UPDATE player_characters SET temp_wit = " + value + " WHERE player_character_id = " + req.query.id, function(err, result) {
      res.json({success: true});
      res.end();
    })
  }  
  else {
    res.json({success: false})
  }

  })
  

})




  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


 function sqlQuery (sql, callback) { 
    
    
    console.log("SQL Query: " + sql);

    pool.query(sql, (err, res) => {
        if (err) {
            callback(err)
        }
        if (res){
          //console.log("------------Result-------------");
          //console.log(res.rows);
          //console.log("------------End Result---------")
          callback(null,res.rows);
        }
})
}

function sqlChainQuery (sql, callback) { 
    
    
  console.log("SQL Chain Query: " + sql);

  pool.query(sql, (err, res) => {
      if (err) {
          callback(err)
      }
      if (res){
        //console.log("------------Result-------------");
        //console.log(res.rows);
        //console.log("------------End Result---------")
        callback(null,res);
      }
})
}


  function getMenuData(req, res, next) {

    if (req.query.game) {
      if (isNaN(req.query.game))  {
        var sql = "select g.game_id, p.party_id from games g INNER JOIN party p ON p.game_id = g.game_id INNER JOIN party_members pm ON pm.party_id = p.party_id WHERE g.name = '" + req.query.game + "' AND pm.player_id = " + req.session.user_id;
      } else {
        req.session.game_id = req.query.game
      var sql = "select g.game_id, p.party_id from games g INNER JOIN party p ON p.game_id = g.game_id INNER JOIN party_members pm ON pm.party_id = p.party_id WHERE g.game_id = " + req.query.game + " AND pm.player_id = " + req.session.user_id;
    }

      
      sqlQuery(sql, function(err, result) {
        console.log(result);
        req.session.game_id = result[0].game_id
        req.session.party_id = result[0].party_id;
        console.log ("Party id set to " + req.session.party_id);
        console.log ("Game id set to " + req.session.game_id);
      })
    }

    if(req.session.user_id && req.session.game_id) {

      var completed = 0;
      let sql = "SELECT * FROM player_characters WHERE game_id = " + req.session.game_id + " AND owner_id <> " + req.session.user_id;

      sqlQuery(sql, function(err, result) {
        
        if(err) {
          console.error(err)
        }
        else{        
          req.party = result;
          completed++;
          if(completed === 4) {
            next()
          }
        }
      });
        
  

      sql = "SELECT * from player_characters WHERE owner_id = " + req.session.user_id + " AND game_id = " + req.session.game_id;
      sqlQuery(sql, function(err, result) {

        if(err) {
          console.error(err)
        }
        else{        
          req.characters = result;
          completed++;
          if(completed === 4) {
            next()
          }
        }
      })

      sql = "SELECT g.game_id, g.name, g.owner_id, g.image, g.invite_link FROM games g INNER JOIN party p ON p.game_id = g.game_id INNER JOIN party_members pm ON pm.party_id = p.party_id WHERE pm.player_id = " + req.session.user_id;

      sqlQuery(sql, function(err, result) {
        
        if(err) {
          console.error(err)
        }
        else{        
          req.games = result;
          completed++;
          if(completed === 4) {
            next()
          }
        }

      })
      
      sql = "SELECT * FROM user_accounts WHERE user_account_id = " + req.session.user_id;

      sqlQuery(sql, function(err, result) {
        
        if(err) {
          console.error(err)
        }
        else{        
          req.user = result;
          completed++;
          if(completed === 4) {
            next()
          }
        }

      });

      
      console.log("Game_id: " + req.session.game_id);
      console.log("Party_id: " + req.session.party_id);
      console.log("User_id: " + req.session.user_id);
      
    } else {
    req.session.redirect = req.url;
    res.redirect('/login')
}
   
}
