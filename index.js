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
    
    if(req.query.id) {
      sqlQuery("SELECT * FROM player_characters WHERE player_character_id = " + req.query.id, function (request, result) {
        displayCharacter = result[0];
        res.render('pages/character-sheet', {characters: req.characters, party: req.party, games: req.games, user: req.user[0],session: req.session, displayCharacter: displayCharacter})
      })
    }
    else {
      displayCharacter = req.characters[0];
      res.render('pages/character-sheet', {characters: req.characters, party: req.party, games: req.games, user: req.user[0],session: req.session, displayCharacter: displayCharacter})
    }

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
                    req.session.game_id = 0;
                  }
                  else {
                    console.log("in else")
                    req.session.game_id = response[0].game_id;
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
  major_background = req.body.Background,
  minor_background = 1,
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
  +     "VALUES      ("+ owner_id +", "+ game_id +", "+ party_id +", "+ race +", "+ characterClass +", "+ major_background +", "+ minor_background +",     '"+ name +"',   '"+ hair +"'   ,   '"+ skin +"'  , '"+ eyes +"',  '"+ height +"'  ,    "+ weight +", "+ str +", "+ dex +", "+ con +", "+ spd +", "+ wit +", "+ int +", "+ wis +", " + cha +", 1, CURRENT_DATE, 1, CURRENT_DATE)";
  sqlQuery(sql, function(result) {
    res.redirect('/')
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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  function sqlQuery (sql, callback) { 
    
    
    console.log("SQL Query: " + sql);

    pool.query(sql, (err, res) => {
        if (err) {
            callback(err)
        }
        if (res){
          console.log("------------Result-------------");
          console.log(res.rows);
          console.log("------------End Result---------")
          callback(null,res.rows);
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

      
    } else {
    req.session.redirect = req.url;
    res.redirect('/login')
}
   
}
