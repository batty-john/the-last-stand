function createInviteLink() {
    var name = document.getElementById("gameName").value,
    email = document.getElementById("email").value;

    console.log(name);
    console.log(email);

    var inviteLink = stringToHash(name + email);
    document.getElementById("gameNameConfirm").innerHTML = name;
    document.getElementById("inviteLink").innerHTML = "https://last-stand-character-sheet.herokuapp.com/joinGame?g=" + inviteLink;
    document.getElementById("inviteLinkField").value = inviteLink;

}

function stringToHash(string) { 
                  
    var hash = 0; 
      
    if (string.length == 0) return hash; 
      
    for (i = 0; i < string.length; i++) { 
        char = string.charCodeAt(i); 
        hash = ((hash << 5) - hash) + char; 
        hash = hash & hash; 
    } 
      
    return hash; 
} 