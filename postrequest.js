const owner_id = 1,
  party_id = 1,
  race = req.body.race,
  characterClass = req.body.class,
  major_background = req.body.major_background,
  minor_background = req.body.minor_background,
  name = req.body.name,
  hair = req.body.hair,
  skin = req.body.skin,
  eyes = req.body.eyes,
  height = req.body.height,
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
  +     "VALUES      ("+ owner_id +", "+ +", "+ party_id +", "+ race +", "+ characterClass +", "+ major_background +", "+ minor_background +",     '"+ name +"',   '"+ hair +"'   ,   '"+ skin +"'  , '"+ eyes +"',  '"+ height +"'  ,    "+ weight +", "+ str +", "+ dex +", "+ con +", "+ spd +", "+ wit +", "+ int +", "+ wis +", " + cha +", 1, CURRENT_DATE, 1, CURRENT_DATE)";
  console.log(sql);
