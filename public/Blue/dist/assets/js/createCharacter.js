function getRaces() {

    var ajax = new XMLHttpRequest();
    ajax.open('GET', "/getRaces", false);

    //Send the proper header information along with the request
    //ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    ajax.onreadystatechange = function() { //Call a function when the state changes.
        if (ajax.readyState == 4 && ajax.status == 200) {

            try {
                var races = JSON.parse(ajax.responseText);
                console.log(races);

                races.forEach(function(race){
                    var card = document.createElement('div');
                    card.classList.add('card');
                    card.classList.add('wrap-card');
                    
                    var image = document.createElement('img');
                    image.classList.add("card-img-top");
                    image.classList.add("img-fluid");
                    image.setAttribute('src', 'assets/images/races/' + race.name + '.jpg')
                    card.appendChild(image);

                    var cardBody = document.createElement('div');
                    cardBody.classList.add("card-body");

                    var cardTitle = document.createElement('h5');
                    cardTitle.classList.add("card-title");
                    cardTitle.innerHTML = race.name;
                    cardBody.appendChild(cardTitle);

                    var cardDescription = document.createElement('p');
                    cardDescription.classList.add("card-text");
                    cardDescription.innerHTML = race.description;
                    cardBody.appendChild(cardDescription);

                    var cardTable = document.createElement('table');
                    cardTable.classList.add("race-stat-table");
                    cardTable.innerHTML = '<table class="race-stat-table"><tr><th>Str</th><th>Dex</th><th>Con</th><th>Speed</th><th>Int</th><th>Wis</th><th>Cha</th><th>Wit</th></tr>' + 
                    '<tr><td>' + race.strength_cost_adjust + '</td><td>' + race.dexterity_cost_adjust + '</td><td>' + race.constitution_cost_adjust + '</td><td>' + race.speed_cost_adjust + '</td><td>' + race.intelligence_cost_adjust + '</td><td>' + race.wisdom_cost_adjust + '</td><td>' + race.charisma_cost_adjust + '</td><td>' + race.wit_cost_adjust + '</td></tr></table>'
                    cardBody.appendChild(cardTable);

                    var cardSelect = document.createElement('a');
                    cardSelect.classList.add("card-text");
                    cardSelect.setAttribute("onclick", "selectRace(" + race.character_race_id + ")");
                    cardSelect.innerHTML= '<small class="text-muted">Select This Race</small>';
                    cardBody.appendChild(cardSelect);

                    card.appendChild(cardBody);
                    document.getElementById("races-deck").appendChild(card);
                });               

            } catch (err) {
                console.log(err.message + "in" + ajax.responseText)
            }

        }
    }
    ajax.send();

}