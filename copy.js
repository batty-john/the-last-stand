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


express()
.use(express.json())
.use(express.urlencoded({extended: true})) // support URL encoded bodies
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
  .get('/', (req, res) => {

    getMenuData(function (result) {
      getMenuData(function (data) {
        console.log(data);
        characters = data.characters;
        party = data.party
        games = data.games
        res.render('pages/createCharacter')
      })
    })

  })
  .get('/createCharacter', (req,res) => {

    getMenuData(function (data) {
      characters = data.characters;
      party = data.party
      games = data.games
      res.render('pages/createCharacter')
    })
      

  })
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

  

  res.end("Recieved Post Request")

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


  function getMenuData(callback) {
    var completed = 0,
     data = [];
    let partysql = "SELECT * FROM player_characters pc INNER JOIN party_members pm on pc.owner_id = pm.player_id WHERE pc.party_id = 1 AND  pm.party_id = 1;"

    sqlQuery(partysql, function(err, result) {

    
    data.party = result;
    completed +=1;

    if(completed === 3) {
      callback(data)
    }


    })

    //let charactersql = "SELECT * from player_characters WHERE owner_id = 1";
    let charactersql = "SELECT * from player_characters WHERE player_character_id = 6";
    console.log("Getting Characters")
    sqlQuery(charactersql, function(err, result) {

    
      console.log("Returning Characters");
      data.characters = result;
      completed +=1;
    if (completed ===3) {
      callback(data);
    }

    })

    let gameSQL = "SELECT * FROM games";

    sqlQuery(gameSQL, function(err, result) {
      data.games =  result;
      completed += 1;
      if(completed === 3) {
        callback(data)
      }

    })
    


  }