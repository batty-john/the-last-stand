const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://pdalrvwbtruhfe:b1e3a44f14fcc8b4fee09854f31859cdba2fa828cc332cb6704305667b8f6a1d@ec2-52-86-33-50.compute-1.amazonaws.com:5432/dali8un83c1hi5?ssl=true';
const pool = new Pool({ connectionString: connectionString })

express()
  .use(express.static(path.join(__dirname, 'public/Blue/dist')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    characters = getCharacters();
    party = getParty();
    games = getGames();
    res.render('pages/index')
  })
  .get('/createCharacter', (req,res) => {
    characters = getCharacters();
    party = getParty();
    games = getGames();
    res.render('pages/createCharacter')
  })
  .get('/getRaces', (request, response) => {

    

            getRaces(function(err, result) {

                response.end(JSON.stringify(result))

            })
 
    
})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  function getRaces (callback) { 
    //let sql = 'SELECT * FROM character_races c INNER JOIN user_orders orders ON c.module_id = orders.module_id WHERE orders.user_account_id = $1'
      let sql = 'SELECT * FROM character_races';
    pool.query(sql, (err, res) => {
        if (err) {
            callback(err)
        }
        if (res){
        callback(null,res.rows);
        }
})
}



  function getCharacters() {
    return [{name:"Griffhorn", race: "minotaur"}]
  }

  function getParty() {
    return [
      {name: "Griffhorn", race: "Minotaur"},
      {name: "Shaladon", race: "Myr"},
      {name: "Revin", race: "Dark Elf"}
    ]
  }

  function getGames() {
    return [
      {name: "Adventures in Sogored", lastPlayed: "Today", gameMaster: "John Batty"},
      {name: "Dawnforge", lastPlayed: "2 days", gameMaster: "Luke Batty"},
      {name: "Spectria", lastPlayed: "11 Months Ago", gameMaster: "Dawson Norton"}
    ]
  }