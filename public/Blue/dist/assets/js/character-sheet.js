function AJAX(methodType, url, callback, post) {

    console.log("AJAX call to: " + url);
    var ajax = new XMLHttpRequest();
    ajax.open(methodType, url, false);



    ajax.onreadystatechange = function() { //Call a function when the state changes.
        if (ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.responseText);
            callback(null, ajax.responseText);
        }
    }
    if(post) {
        console.log(encodeURIComponent(post));
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        
        ajax.send("value=" + encodeURIComponent(post));
    } else {
    ajax.send();
    }
}

function saveBackstory(){
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("backstory").getElementsByClassName("ql-editor")[0].innerHTML,
    url = '/updateBackstory?id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    }, value)
    console.log("Updating..." + url);
}

function updateHealth() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentHealth").innerHTML,
    url = '/updateHealth?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateActions() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentActions").value,
    url = '/updateHealth?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updatePowerDice() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentPowerDice").value,
    url = '/updatePowerDice?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateStrength() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentStrength").value,
    url = '/updateStrength?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateDexterity() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentDexterity").value,
    url = '/updatedexterity?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateConstitution() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentConstitution").value,
    url = '/updateConstitution?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateSpeed() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentSpeed").value,
    url = '/updateSpeed?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateIntelligence () {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentIntelligence").value,
    url = '/updateIntelligence?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateWisdom() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentWisdom").value,
    url = '/updateWisdom?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateCharisma() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentCharisma").value,
    url = '/updateCharisma?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )
    console.log("Updating..." + url);
}

function updateWit() {
    var urlParams = new URLSearchParams(window.location.search),
    value = document.getElementById("currentWit").value,
    url = '/updateWit?value=' + value + '&id=' + urlParams.get('id');
    AJAX('POST', url, function(err, result){
        if (err) {
            document.getElementById("success").classList.addClass("error");
            document.getElementById("success").classList.toggle("sucess", false)
        }
        document.getElementById("sucess").classList.addClass("success")
    } )    
    console.log("Updating..." + url);
}

window.addEventListener("load", function() {
    document.getElementById("backstory").getElementsByClassName("ql-editor")[0].innerHTML = document.getElementById("backstoryWrapper").innerHTML;
    //document.getElementById("backstoryWrapper").remove();
})