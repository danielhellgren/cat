

$(document).ready( function() {
    printBinaryResult();
});

// count from 0 to 255 and print - loop indefinetly
function printBinaryResult(){

    var textDiv = document.getElementsByClassName("result-text")[0];
    var i = 1;
    window.setInterval(function(){
        if(i > 255){
            i = 0;
        }
        textDiv.innerHTML = "" + i;
        i++;
    }, 500); //repeat every 1 sec
}