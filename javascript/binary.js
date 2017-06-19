
/*
 * upon ready print the result of binary to decimal conv.
  * and show dropdown menu if in mobile view
 */
$(document).ready( function() {
    printBinaryResult();

    //creation of dropdown menu
    document.getElementById("mobile-menu").addEventListener("click", function() {
        this.classList.toggle("change");
        var dropdown = document.getElementById("dropdownbinary");
        dropdown.classList.toggle("show");
        //if it should be shown or not
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

/*
* print an incrementing number at the first div of class result-text
* the result is the binary to decimal convertion
*/
function printBinaryResult(){

    var textDiv = document.getElementsByClassName("result-text")[0];
    var i = 1;
    //count from 0 to 255 and print - loop indefinitely
    window.setInterval(function(){
        if(i > 255){
            i = 0;
        }
        textDiv.innerHTML = "" + i;
        i++;
    }, 500); //repeat every .5 sec
}