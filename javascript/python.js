

$().ready(
    function(){
        $('.result-btn').click(function () {
            $('.result-btn').css("background-color","#555555");
            $('.result-btn').css("color","white");
            $('.code2').toggle('slow', function() {
                $('.code2').css("display","block");
            });

        });
    }
);