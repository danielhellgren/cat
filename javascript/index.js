$(document).ready(function() {
    document.getElementById("mobile-menu").addEventListener("click", function() {
        this.classList.toggle("change");
        var dropdown = document.getElementById("dropdownhome");
        dropdown.classList.toggle("show");
        if (dropdown.classList.contains("show")) {
            console.log(document.getElementsByClassName("content")[0]);
            document.getElementsByClassName("content")[0].style.zIndex = "-1";
            document.getElementById("content-cover-home").style.display = "inline-block";
            document.getElementById("content-cover-home").style.zIndex = "-1";
        }
        else {
            document.getElementsByClassName("content")[0].style.zIndex = "";
            document.getElementById("content-cover-home").style.display = "none";
        }
    });
});