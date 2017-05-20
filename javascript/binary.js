

$(document).ready( function() {
    printBinaryResult();
    document.getElementById("mobile-menu").addEventListener("click", function() {
        this.classList.toggle("change");
        var dropdown = document.getElementById("dropdownbinary");
        dropdown.classList.toggle("show");
        if (dropdown.classList.contains("show")) {
            console.log(document.getElementsByClassName("content")[0]);
            document.getElementsByClassName("content")[0].style.zIndex = "-1";
            document.getElementById("content-cover-binary").style.display = "inline-block";
            document.getElementById("content-cover-binary").style.zIndex = "-1";
        }
        else {
            document.getElementsByClassName("content")[0].style.zIndex = "";
            document.getElementById("content-cover-binary").style.display = "none";
        }
    });
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
    }, 500); //repeat every .5 sec
}