


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



/*SO YOU CANT PRESS ENTER ON THE FORM */
$(document).on('keyup keypress', 'form input[type="text"]', function(e) {
    if(e.which == 13) {
        e.preventDefault();
        return false;
    }
});
