$().ready(function() {
    document.getElementById("mobile-menu").addEventListener("click", function() {
        this.classList.toggle("change");
        var dropdown = document.getElementById("dropdownpython");
        dropdown.classList.toggle("show");
        if (dropdown.classList.contains("show")) {
            console.log(document.getElementsByClassName("content")[0]);
            document.getElementsByClassName("content")[0].style.zIndex = "-1";
            document.getElementById("content-cover-python").style.display = "inline-block";
            document.getElementById("content-cover-python").style.zIndex = "-1";
        }
        else {
            document.getElementsByClassName("content")[0].style.zIndex = "";
            document.getElementById("content-cover-python").style.display = "none";
        }
    });
});


/* FOR DISPLAYING THE CODE */
$().ready(
    function(){
        $('#result-btn0').one("click", function () {
            $('#result-btn0').css("background-color","#555555");
            $('#result-btn0').css("color","white");
            $('.code2').toggle('slow', function() {
                $('.code2').css("display","block");
            });

        });
    }
);

/* FOR DISPLAYING THE CODE */
$().ready(
    function(){
        $('#result-btn2').one("click", function () {
            $('#result-btn2').css("background-color","#555555");
            $('#result-btn2').css("color","white");
            $('.code6').toggle('slow', function() {
                $('.code6').css("display","block");
            });

        });
    }
);

/* CHECKING THE INPUT */
$().ready(
    function() {
        $('#result-btn1').click(function () {
            $('#result-btn1').css("background-color", "#555555");
            $('#result-btn1').css("color", "white");
            var input = $("input[name=writtenCode]").val();
            if (input == 'print("Good bye!")') {
                    $('.code3').css("display", "none");
                    $('.code4').css("display", "none");

                $('.code3').toggle('slow', function () {
                    $('.code3').css("display", "block");
                });
            }
            else {
                $('.code3').css("display", "none");
                    $('.code4').css("display", "none");
                $('.code4').toggle('slow', function () {
                    $('.code4').css("display", "block");
                });
            }
        });
    });

/* CHECKING THE INPUT */
$().ready(
    function() {
        $('#result-btn3').click(function () {
            $('#result-btn3').css("background-color", "#555555");
            $('#result-btn3').css("color", "white");
            var input = $("input[name=writtenCode]").val();
            if (input == 'helloworld="Hello World!" print(helloworld)') {
                $('.code7').css("display", "none");
                $('.code4').css("display", "none");

                $('.code7').toggle('slow', function () {
                    $('.code7').css("display", "block");
                });
            }
            else {
                $('.code7').css("display", "none");
                $('.code4').css("display", "none");
                $('.code4').toggle('slow', function () {
                    $('.code4').css("display", "block");
                });
            }
        });
    });


/*SO YOU CANT PRESS ENTER ON THE FORM */
$(document).on('keyup keypress', 'form input[type="text"]', function(e) {
    if(e.which == 13) {
        e.preventDefault();
        return false;
    }
});





