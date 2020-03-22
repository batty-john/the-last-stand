const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL || "postgres://noyhvnbaxtkxpx:283a83628fde31341a2731969eb18d54ad54a2e84daa887429d7647d531b4393@ec2-184-72-235-80.compute-1.amazonaws.com:5432/dfqhr4c08nknuo?ssl=true";
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
    pool.query('SELECT * FROM character_races c INNER JOIN user_orders orders ON c.module_id = orders.module_id WHERE orders.user_account_id = $id', [1],  (err, res) => {
        if (err) {
            callback(err)
        }
        
        let races = [];

        for (let i = 0; i < res.rows.length; i++) {
            var resultCounter = 0;
            console.log(res.rows[i].race_id);

            races.push(res.rows[i])
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