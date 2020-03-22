function getRaces() {

    var ajax = new XMLHttpRequest();
    ajax.open('GET', "/getRaces", false);

    //Send the proper header information along with the request
    //ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    ajax.onreadystatechange = function() { //Call a function when the state changes.
        if (ajax.readyState == 4 && ajax.status == 200) {

            try {
                console.log(ajax.responseText);
                let races = JSON.parse(ajax.responseText);
                console.log(races);                

            } catch (err) {
                console.log(err.message + "in" + ajax.responseText)
            }

        }
    }
    ajax.send();

}