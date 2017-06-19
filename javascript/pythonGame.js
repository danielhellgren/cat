

$(document).ready(function(){

    /* CANVAS */
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    var cw = 10;
    var d;
    var food;
    var score;

    /* SNAKE ARRAY */
    var snake_array;

    function init()
    {
        d = "right"; //default directioN
        create_snake();
        create_food(); //the food particle
        score = 0;

       /* MOVING THE SNAKE */
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 60);
    }
    init();

    /* CREATING THE SNAKE */
    function create_snake()
    {
        var length = 5; //Length of the snake
        snake_array = []; //Empty array to start with
        for(var i = length-1; i>=0; i--)
        {
            //This will create a horizontal snake starting from the top left
            snake_array.push({x: i, y:0});
        }
    }

   /* CREATES THE FOOD */
    function create_food()
    {
        food = {
            x: Math.round(Math.random()*(w-cw)/cw),
            y: Math.round(Math.random()*(h-cw)/cw),
        };

    }

    /* PAINT THE SNAKE */
    function paint()
    {
        ctx.fillStyle = "#CEBEBE";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);


        var nx = snake_array[0].x;
        var ny = snake_array[0].y;


        if(d == "right") nx++;
        else if(d == "left") nx--;
        else if(d == "up") ny--;
        else if(d == "down") ny++;

       /* RESTARTS THE GAME IF THE SNAKE HITS THE WALL */
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
        {
            //restart game
            init();
            return;
        }

      /* FOR GETTING THE SNAKE TO EAT THE FOOD */
        if(nx == food.x && ny == food.y)
        {
            var tail = {x: nx, y: ny};
            score++;
            //Create new food
            create_food();
        }
        else
        {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }

        snake_array.unshift(tail); //puts back the tail as the first cell

        for(var i = 0; i < snake_array.length; i++)
        {
            var c = snake_array[i];
            paint_cell(c.x, c.y);
        }

        /* PAINT THE FOOD AND THE SCORE */
        paint_cell(food.x, food.y);

        var score_text = "Score: " + score;
        ctx.fillText(score_text, 5, h-5);
    }


    function paint_cell(x, y)
    {
        ctx.fillStyle = "#7D1128";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "#CEBEBE" +
            "";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    function check_collision(x, y, array)
    {

        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    /* ADDING THE KEYBOARD CONTROLS */
    $(document).keydown(function(e){
        var key = e.which;
        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
    })







});
