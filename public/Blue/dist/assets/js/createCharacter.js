function AJAX(methodType, url, callback) {

    console.log("AJAX call to: " + url);
    var ajax = new XMLHttpRequest();
    ajax.open(methodType, url, false);



    ajax.onreadystatechange = function() { //Call a function when the state changes.
        if (ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.responseText);
            callback(ajax.responseText);
        }
    }
    ajax.send();
}

function getRaces() {

    AJAX('GET', '/getRaces', function (response) {

        var races = JSON.parse(response);

        races.forEach(function(race){
            var card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('wrap-card');
            card.classList.add('race-card');
            
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
            cardTable.innerHTML = '<table class="race-stat-table"><tr><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Str</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Dex</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Con</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Speed</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Int</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Wis</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Cha</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Wit</th></tr>' + 
            '<tr><td>' + race.strength_cost_adjust + '</td><td>' + race.dexterity_cost_adjust + '</td><td>' + race.constitution_cost_adjust + '</td><td>' + race.speed_cost_adjust + '</td><td>' + race.intelligence_cost_adjust + '</td><td>' + race.wisdom_cost_adjust + '</td><td>' + race.charisma_cost_adjust + '</td><td>' + race.wit_cost_adjust + '</td></tr></table>'
            cardBody.appendChild(cardTable);

            var cardSelect = document.createElement('a');
            cardSelect.classList.add("card-text");
            cardSelect.setAttribute("onclick", "selectRace(" + race.character_races_id + ")");
            cardSelect.innerHTML= '<button class="btn btn-primary">Select This Race</button>';
            cardBody.appendChild(cardSelect);

            card.appendChild(cardBody);
            document.getElementById("races-deck").appendChild(card);

        });


    });
}

function getClasses() {

    AJAX('GET', '/getClasses', function (response) {

        var classes = JSON.parse(response);

        classes.forEach(function(item){
            var card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('wrap-card');
            card.classList.add('class-card');
            
            var image = document.createElement('img');
            image.classList.add("card-img-top");
            image.classList.add("img-fluid");
            image.setAttribute('src', 'assets/images/classes/' + item.name + '.jpg')
            card.appendChild(image);

            var cardBody = document.createElement('div');
            cardBody.classList.add("card-body");

            var cardTitle = document.createElement('h5');
            cardTitle.classList.add("card-title");
            cardTitle.innerHTML = item.name;
            cardBody.appendChild(cardTitle);

            var cardDescription = document.createElement('p');
            cardDescription.classList.add("card-text");
            cardDescription.innerHTML = item.description;
            cardBody.appendChild(cardDescription);

            var cardSelect = document.createElement('a');
            cardSelect.classList.add("card-text");
            cardSelect.setAttribute("onclick", "selectClass(" + item.character_classes_id + ")");
            cardSelect.innerHTML= '<button class="btn btn-primary">Select This Class</button>';
            cardBody.appendChild(cardSelect);

            card.appendChild(cardBody);
            document.getElementById("races-deck").appendChild(card);

        });


    });
}

function getBackgrounds() {

    AJAX('GET', '/getBackgrounds', function (response) {

        var backgrounds = JSON.parse(response);

        backgrounds.forEach(function(background){
            var card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('wrap-card');
            card.classList.add('background-card');
            
            /*
            var image = document.createElement('img');
            image.classList.add("card-img-top");
            image.classList.add("img-fluid");
            image.setAttribute('src', 'assets/images/background/' + background.name + '.jpg')
            card.appendChild(image);
            */

            var cardBody = document.createElement('div');
            cardBody.classList.add("card-body");

            var cardTitle = document.createElement('h5');
            cardTitle.classList.add("card-title");
            cardTitle.innerHTML = background.name;
            cardBody.appendChild(cardTitle);

            var cardDescription = document.createElement('p');
            cardDescription.classList.add("card-text");
            cardDescription.innerHTML = background.description;
            cardBody.appendChild(cardDescription);

            /*
            var cardTable = document.createElement('table');
            cardTable.classList.add("race-stat-table");
            cardTable.innerHTML = '<table class="race-stat-table"><tr><th>Str</th><th>Dex</th><th>Con</th><th>Speed</th><th>Int</th><th>Wis</th><th>Cha</th><th>Wit</th></tr>' + 
            '<tr><td>' + race.strength_cost_adjust + '</td><td>' + race.dexterity_cost_adjust + '</td><td>' + race.constitution_cost_adjust + '</td><td>' + race.speed_cost_adjust + '</td><td>' + race.intelligence_cost_adjust + '</td><td>' + race.wisdom_cost_adjust + '</td><td>' + race.charisma_cost_adjust + '</td><td>' + race.wit_cost_adjust + '</td></tr></table>'
            cardBody.appendChild(cardTable);
            */

            var cardSelect = document.createElement('a');
            cardSelect.classList.add("card-text");
            cardSelect.setAttribute("onclick", "selectMajorBackground(" + background.character_backgrounds_id + ")");
            cardSelect.innerHTML= '<button class="btn btn-primary">Select This Background</button>';
            cardBody.appendChild(cardSelect);

            card.appendChild(cardBody);
            document.getElementById("races-deck").appendChild(card);

        });


    });
}

function getMinorBackgrounds() {

    AJAX('GET', '/getBackgrounds', function (response) {

        var backgrounds = JSON.parse(response);

        backgrounds.forEach(function(background){
            var card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('wrap-card');
            card.classList.add('background-card');
            
            /*
            var image = document.createElement('img');
            image.classList.add("card-img-top");
            image.classList.add("img-fluid");
            image.setAttribute('src', 'assets/images/background/' + background.name + '.jpg')
            card.appendChild(image);
            */

            var cardBody = document.createElement('div');
            cardBody.classList.add("card-body");

            var cardTitle = document.createElement('h5');
            cardTitle.classList.add("card-title");
            cardTitle.innerHTML = background.name;
            cardBody.appendChild(cardTitle);

            var cardDescription = document.createElement('p');
            cardDescription.classList.add("card-text");
            cardDescription.innerHTML = background.description;
            cardBody.appendChild(cardDescription);

            /*
            var cardTable = document.createElement('table');
            cardTable.classList.add("race-stat-table");
            cardTable.innerHTML = '<table class="race-stat-table"><tr><th>Str</th><th>Dex</th><th>Con</th><th>Speed</th><th>Int</th><th>Wis</th><th>Cha</th><th>Wit</th></tr>' + 
            '<tr><td>' + race.strength_cost_adjust + '</td><td>' + race.dexterity_cost_adjust + '</td><td>' + race.constitution_cost_adjust + '</td><td>' + race.speed_cost_adjust + '</td><td>' + race.intelligence_cost_adjust + '</td><td>' + race.wisdom_cost_adjust + '</td><td>' + race.charisma_cost_adjust + '</td><td>' + race.wit_cost_adjust + '</td></tr></table>'
            cardBody.appendChild(cardTable);
            */

            var cardSelect = document.createElement('a');
            cardSelect.classList.add("card-text");
            cardSelect.setAttribute("onclick", "selectMinorBackground(" + background.character_backgrounds_id + ")");
            cardSelect.innerHTML= '<button class="btn btn-primary">Select This Background</button>';
            cardBody.appendChild(cardSelect);

            card.appendChild(cardBody);
            document.getElementById("races-deck").appendChild(card);

        });


    });
}

function selectRace(id) {

    AJAX('GET', '/getRaces?id=' + id, function (response) {
        
        selectedRace = JSON.parse(response)[0];
        selectedRace.id = id;
        selectedRace.category = "Race"
        timelineCard = createTimelineCard(selectedRace, 1);
        
        button = document.getElementById("chooseRaceButton")
        nextStep(button);
        deleteCards = document.getElementsByClassName('race-card');
        //deleteCards.forEach(function(element){element.remove()})
        while(deleteCards.length > 0) {
            deleteCards[0].remove();
        }
        document.getElementById("timeline").insertBefore(timelineCard, button);
        getBackgrounds();

        //nextStep(document.getElementById("chooseRaceButton"));
        

    })
}

function selectClass(id) {

    AJAX('GET', '/getClasses?id=' + id, function (response) {
        
        selectedRace = JSON.parse(response)[0];
        selectedRace.id = id;
        selectedRace.category = "Class"
        timelineCard = createTimelineCard(selectedRace);
        
        button = document.getElementById("chooseClassButton")
        nextStep(button);
        deleteCards = document.getElementsByClassName('class-card');
        
        while(deleteCards.length > 0) {
            deleteCards[0].remove();
        }
        document.getElementById("timeline").insertBefore(timelineCard, button);      

    })
    

}

function selectMajorBackground(id) {

    AJAX('GET', '/getBackgrounds?id=' + id, function (response) {
        
        selectedBackground = JSON.parse(response)[0];
        selectedBackground.id = id;
        selectedBackground.category = "MajorBackground"
        timelineCard = createTimelineCard(selectedBackground);
        
        button = document.getElementById("chooseMajorBackgroundButton")
        nextStep(button);
        deleteCards = document.getElementsByClassName('background-card');
        //deleteCards.forEach(function(element){element.remove()})
        while(deleteCards.length > 0) {
            deleteCards[0].remove();
        }
        document.getElementById("timeline").insertBefore(timelineCard, button);

        getMinorBackgrounds();
        //nextStep(document.getElementById("chooseRaceButton"));
        

    })
}

function selectMinorBackground(id) {

    AJAX('GET', '/getBackgrounds?id=' + id, function (response) {
        
        selectedBackground = JSON.parse(response)[0];
        selectedBackground.id = id;
        selectedBackground.category = "MinorBackground"
        timelineCard = createTimelineCard(selectedBackground, 1);
        
        button = document.getElementById("chooseMinorBackgroundButton")
        nextStep(button);
        deleteCards = document.getElementsByClassName('background-card');
        //deleteCards.forEach(function(element){element.remove()})
        while(deleteCards.length > 0) {
            deleteCards[0].remove();
        }
        document.getElementById("timeline").insertBefore(timelineCard, button);

        getClasses();
        //nextStep(document.getElementById("chooseRaceButton"));
        

    })
}

function createTimelineCard(data, alt) {

    console.log(data);

    arrow = document.createElement('span');
    arrow.classList.add("arrow");

    icon = document.createElement('span');
    icon.classList.add("timeline-icon");
    icon.classList.add("bg-success");
    icon.innerHTML = '<i class="mdi mdi-adjust"></i>';

    title = document.createElement('h4');
    title.classList.add("text-success");
    title.innerHTML = data.name;

    category = document.createElement('p');
    category.classList.add('timeline-date');
    category.classList.add('text-muted');
    category.innerHTML = '<small>' + data.category + '</small>';

    description = document.createElement('p');
    description.innerHTML = data.description;

    if(data.character_races_id){
    cardTable = document.createElement('table');
    cardTable.classList.add("race-stat-table");
    cardTable.innerHTML = '<table class="tablesaw mb-0" data-tablesaw-mode="stack"><tr><th>Str</th><th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">Dex</th><th>Con</th><th>Speed</th><th>Int</th><th>Wis</th><th>Cha</th><th>Wit</th></tr>' + 
    '<tr><td>' + data.strength_cost_adjust + '</td><td>' + data.dexterity_cost_adjust + '</td><td>' + data.constitution_cost_adjust + '</td><td>' + data.speed_cost_adjust + '</td><td>' + data.intelligence_cost_adjust + '</td><td>' + data.wisdom_cost_adjust + '</td><td>' + data.charisma_cost_adjust + '</td><td>' + data.wit_cost_adjust + '</td></tr></table>'
    }
    formInput = document.createElement('input');
    formInput.classList.add("hidden-input");
    formInput.setAttribute('type', 'hidden');
    formInput.setAttribute('name', data.category);
    formInput.value = data.id;

    timelineContent = document.createElement('div');
    timelineContent.classList.add("timeline-box");
    timelineContent.appendChild(arrow);
    timelineContent.appendChild(icon);
    timelineContent.appendChild(title);
    timelineContent.appendChild(category);
    timelineContent.appendChild(description);
    timelineContent.appendChild(formInput);
    if (data.character_races_id) {
        timelineContent.appendChild(cardTable);
    }
    
    panel = document.createElement('div');
    panel.classList.add('panel');
    panel.appendChild(timelineContent);

    wrapper = document.createElement('div');
    wrapper.classList.add('timeline-desk');
    wrapper.appendChild(panel)

    timelineCard = document.createElement('article');
    timelineCard.classList.add("timeline-item");
    timelineCard.id = data.category + "-timeline-item";
    if (alt) {
        timelineCard.classList.add("alt");
    }
    timelineCard.appendChild(wrapper);


    return timelineCard;

}

function nextStep(e) {
    e.classList.toggle("hidden")
    e.nextElementSibling.classList.toggle("hidden")
}

function startForm() {
    document.getElementById("beginningButton").getElementsByClassName("btn")[0].innerHTML = "The Beginning";
    document.getElementById("vanity").classList.toggle("hidden")
    
    document.getElementById("vanity-form-button").addEventListener("click", function () {
        document.getElementById("vanity").classList.toggle("hidden")
        document.getElementById("chooseRaceButton").classList.toggle("hidden")
        getRaces();
    }) 
}

function finalizeForm() {
    document.getElementById("vanity").classList.toggle("hidden");
    document.getElementById("vanity-form-button").classList.toggle("hidden");
    document.getElementById("submit-button").classList.toggle("hidden");

}
function submit() {
    var race = document.getElementById("race-timeline-item").getElementsByClassName("hidden-input")[0].value,
    characterClass = document.getElementById("class-timeline-item").getElementsByClassName("hidden-input")[0].value,
    majorBackground = document.getElementById("major-background-timeline-item").getElementsByClassName("hidden-input")[0].value,
    minorBackground = document.getElementById("minor-background-timeline-item").getElementsByClassName("hidden-input")[0].value,
    name = document.getElementById("name").value,
    hair = document.getElementById("hair").value,
    skin = document.getElementById("skin").value,
    eyes = document.getElementById("eyes").value,
    feet = document.getElementById("feet").value,
    inches = document.getElementById("inches").value,
    weight = document.getElementById("weight").value,
    errMesseage = "";

    if (errMesseage === "") {
        document.getElementById("createCharacterForm").submit();
    }
}

window.addEventListener('load', startForm());