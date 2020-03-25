const express = require('express')
const path = require('path')
const session = require('express-session');
const bcrypt = require('bcrypt');
const FileStore = require('session-file-store')(session);
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')
const DATABASE_URL  = 'postgres://pdalrvwbtruhfe:b1e3a44f14fcc8b4fee09854f31859cdba2fa828cc332cb6704305667b8f6a1d@ec2-52-86-33-50.compute-1.amazonaws.com:5432/dali8un83c1hi5?ssl=true';
const connectionString = process.env.DATABASE_URL || DATABASE_URL
const pool = new Pool({ connectionString: connectionString })
//const bodyParser = require('body-parser')
//var urlencodedParser = bodyParser.urlencoded({extended:false});



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
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', getMenuData, (req, res) => {res.render('pages/index', {characters: req.characters, party: req.party, games: req.games, user: req.user[0]})})
  .get('/createCharacter', getMenuData, (req,res) => {res.render('pages/createCharacter', {characters: req.characters, party: req.party, games: req.games, user: req.user[0]})})
  .get('/login', (req,res) => {res.render('pages/login')})
  .post('/login', (req, res) => {

    var email = req.body.email;
    var password = req.body.password;


    let sql = "SELECT * from user_accounts WHERE email = '" + email + "'";

    sqlQuery(sql, function (err, response){

      if(err) {
          console.error(err);
      }
      
      if(response.length === 1) {
            
            bcrypt.compare(password, response[0].password, function(err, result) {
                if(result) {
                    
                    req.session.user_id = response[0].user_account_id;
                    req.session.game_id = 1;
                    res.redirect('/')
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
  req.session.userID = 1;

  const owner_id = req.session.user_id,
  party_id = 1,
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
  var sql = 'INSERT INTO player_characters (owner_id, party_id, race, class, major_background, minor_background, name, hair, skin, eyes, height, weight, strength, dexterity, constitution, speed, wit, intelligence, wisdom, charisma, created_by, created_date, last_updated_by, last_updated_date)' 
  +     "VALUES      ("+ owner_id +", "+ party_id +", "+ race +", "+ characterClass +", "+ major_background +", "+ minor_background +",     '"+ name +"',   '"+ hair +"'   ,   '"+ skin +"'  , '"+ eyes +"',  '"+ height +"'  ,    "+ weight +", "+ str +", "+ dex +", "+ con +", "+ spd +", "+ wit +", "+ int +", "+ wis +", " + cha +", 1, CURRENT_DATE, 1, CURRENT_DATE)";
  sqlQuery(sql, function(result) {
    res.redirect('/')
  })

  

})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  function sqlQuery (sql, callback) { 
    
    
    console.log(sql);

    pool.query(sql, (err, res) => {
        if (err) {
            callback(err)
        }
        if (res){
        callback(null,res.rows);
        }
})
}


  function getMenuData(req, res, next) {

    

    if(req.session.user_id && req.session.game_id) {

      var completed = 0;
      let sql = "SELECT pc.name, p.party_id, owner_id FROM party p INNER JOIN party_members pm on p.party_id = pm.party_id INNER JOIN player_characters pc on pc.owner_id = pm.player_id WHERE p.game_id =" + req.session.game_id;

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
        
  

      sql = "SELECT * from player_characters WHERE owner_id = " + req.session.user_id;
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

      sql = "SELECT * FROM games";

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
    res.redirect('/login')
}
   
}