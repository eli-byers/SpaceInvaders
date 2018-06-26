var player;
var motherShip;
var time = 0;

var game = {
    canvas: document.getElementById('game'),
    components: [],
    enemys: [],
    keys: [],
    playerLasers: [],
    enemyLasers: [],
    pace: 20,
    pixl: 2,
    direction: "right",

    render: function(){
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e){
            game.keys = (game.keys || []);
            game.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function(e){
            game.keys[e.keyCode] = false;
            if (player.canShoot){ player.shot = false; }
        });
    },

    renderMapFor: function(obj){
        this.context.fillStyle = obj.color;
        for (var y = 0; y < obj.map.length; y++) {
            for (var x = 0; x < obj.map[y].length; x++) {
                if (obj.map[y][x]){
                    let xOff = obj.x + (x * this.pixl);
                    let yOff = obj.y + (y * this.pixl);
                    this.context.fillRect(xOff, yOff, this.pixl, this.pixl);
                }
            }
        }
    },

    clear: function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        var ctx = game.context;
        ctx.fillStyle = 'lime';
        ctx.fillRect(0, this.canvas.height - 27, this.canvas.width, 2);

        // lives
        var x = 40;
        var y = this.canvas.height - 13;
        var width = 30;
        ctx.fillRect(x, y, width, 8);
        ctx.fillRect(x+3, y-2, width-6, 2);
        ctx.fillRect(x+(width/2)-2, y-5, 4, 5);
        ctx.fillRect(x+(width/2)-1, y-6, 2, 6);

        ctx.fillStyle = 'white';
        ctx.font = "15px Arial";
        ctx.fillText(player.lives+" x",10,y+7);

        // score
        ctx.fillText("SCORE: "+player.points,this.canvas.width/2-30,17);
    }
}

//==============================================================================
//
//								OBJECTS
//
//==============================================================================

function Player(){
    this.map = [
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]
    this.width = this.map[0].length * game.pixl;
    this.height = this.map.length * game.pixl;;
    this.x = game.canvas.width/2 - this.width/2;
    this.y = 450;
    this.color = 'lime';
    this.lives = 3;
    this.points = 0;
    this.speed = 2;
    this.shot = false;
    this.canShoot = true;

    this.update = function(){
        game.renderMapFor(this);
    };
    
    this.move = function(dir){
        switch (dir) {
            case "left":
                if(this.x > 0){ this.x -= this.speed; }
                break;
            case "right":
                if(this.x < game.canvas.width-this.width){ this.x += this.speed; }
                break;
            default:
                break;
        }
    };
    
    this.shoot = function(){
        player.shot = true;
        player.canShoot = false;
        game.playerLasers.push(new laser(this.color, 10,'up',this.x+(this.width/2), this.y+10));
        setTimeout(function(){
            player.canShoot = true;
            if (!game.keys[32]){ player.shot = false; }
        }, 420);
    };
}

let enemyMaps = {
    'squid': 
        {'map':[
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,0,1,1,0],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,0,1,0,0,1,0,0,0],
            [0,0,1,0,1,1,0,1,0,0],
            [0,1,0,1,0,0,1,0,1,0],
        ], 
        'altMap':[
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,0,1,1,0],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,1,0,1,1,0,1,0,0],
            [0,1,0,0,0,0,0,0,1,0],
            [0,0,1,0,0,0,0,1,0,0],
        ]
    },
    'crab':{
        'map':[
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [0,0,0,1,1,0,1,1,0,0,0],
        ],
        'altMap':[
            [0,0,1,0,0,0,0,0,1,0,0],
            [1,0,0,1,0,0,0,1,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,1,1,0,1,1,1,0,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,0,0],
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,1,0,0,0,0,0,0,0,1,0],
        ]
    },
    'thulu':{
        'map':[
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,0,0,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,1,1,0,0,1,1,0,0,0],
            [0,0,1,1,0,1,1,0,1,1,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,1]
            
        ],
        'altMap':[
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,0,0,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,1,1,1,0,0,1,1,1,0,0],
            [0,1,1,0,0,1,1,0,0,1,1,0],
            [0,0,1,1,0,0,0,0,1,1,0,0]
        ]
    }
}

function Enemy(color, type, speed, x, y){
    this.map = enemyMaps[type].map
    this.altMap = enemyMaps[type].altMap
    this.height = this.map.length * game.pixl;
    this.width = this.map[0].length * game.pixl;
    this.gap = 11;
    this.color = color;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.left = x-98;
    this.right = x+46;

    this.update = function(){
        var dir = game.direction;
        if (time % game.pace === 0) {
            [this.map, this.altMap] = [this.altMap, this.map]
            switch (game.direction) {
                case 'left':
                    this.x -= this.speed;
                    if (this.x <= this.speed) {
                        dir = 'right';
                    }
                    break;
                case 'right':
                    this.x += this.speed;
                    if (this.x+this.width > game.canvas.width-this.speed){ 
                        dir = 'left';
                    }
                    break;
                default: break;
            }
        }

        var chance = Math.floor(Math.random() * 12000) + 1;
        if (chance == 1){
            this.shoot();
        }

        game.renderMapFor(this);
        return dir;
    };

    this.shoot = function(){
        game.enemyLasers.push(new laser('white', 10,'down',this.x+(this.width/2)-1, this.y+this.height));
    }
}

function MotherShip(){
    this.map = [
        [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,0,1,0,1,0,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,0,1,1,1,0,1,1,1,0,0],
        [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    ];
    this.height = this.map.length * game.pixl;
    this.width = this.map[0].length * game.pixl;
    this.x = -this.width;
    this.y = 25;
    this.speed = 0;
    this.color = 'red';

    this.update = function(){
        if (this.x > game.canvas.width){
            this.reset();
        }
        this.x += this.speed;
        game.renderMapFor(this);
    };

    this.reset = function(){
        this.speed = 0;
        this.x = -this.width;
    }
}

function laser(color, speed, dir, x, y){
    this.height = 4;
    this.width = 2;
    this.color = color;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.direction = dir;

    this.update = function(){
        this.y += this.direction == 'down' ? this.speed : -this.speed;
        
        // ob
        if (this.y > game.canvas.height || this.y < 0-this.height){ return -1; }
        // collision
        if (this.direction == 'up') {
            for (i in game.enemys){
                if (colliding(this, game.enemys[i])){ return i; }
            }
            if (motherShip.speed !== 0){
                if (colliding(this, motherShip)){ return -2; }
            }
        } else {
            if (colliding(this, player)){ return 1; }
        }

        var ctx = game.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

//==============================================================================
//
//								HELPERS
//
//==============================================================================

function colliding(rect1, rect2){
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y)
    { return true }
    return false;
}

function levelOne(){
    time = 0;
    var x = 70;
    var y = 60;
    const types = ['squid', 'crab', 'crab', 'thulu', 'thulu'];
    for (t = 0; t < types.length; t++){
        x = 80;
        for (i = 0; i < 9; i++){
            game.enemys.push(new Enemy('white',types[t], 10, x, y));
            x += 40;
        }
        y += 30;
    }
}

//==============================================================================
//
//								GAME
//
//==============================================================================

function startGame(){
    game.render();
    player = new Player();
    game.components.push(player);
    motherShip = new MotherShip();
    game.components.push(motherShip);
    levelOne();
}

function updateGameArea(){
    time++;
    game.clear();
    
    // enemys
    let nextDir = game.direction;
    game.enemys.forEach(e => {
        newDir = e.update();
        if (newDir != game.direction) {
            nextDir = newDir;
        }
    });
    if (nextDir != game.direction){
        game.enemys.map(e => e.y += 20)
        game.direction = nextDir;
    }
    
    // keys
    if(game.keys){
        if(game.keys[37]){ //left
            player.move("left");
        }
        if (game.keys[39]){ //right
            player.move("right");
        }
        if (game.keys[32] && player.canShoot && !player.shot){ //space
            player.shoot();
        }
    }

    // speed up
    if (time == 1200) {
        game.pace = 15;
    } else if (time == 2400){
        game.pace = 10;
    }

    // player
    for (var i = 0; i < game.components.length ; i++){
        game.components[i].update();
    }

    // player lasers
    for (var i = 0; i < game.playerLasers.length ; i++){
        var laserState = game.playerLasers[i].update();
        // collided with enemy
        if (laserState >= 0){
            game.enemys.splice(laserState, 1);
            player.points += 25;
        }
        // collided or out of bounds
        if (laserState >= -2){ game.playerLasers.splice(i, 1); }
        if (laserState == -2){
            motherShip.reset();
            var rand = Math.floor(Math.random() * 10) + 1;
            player.points += 200 + rand * 50;
        }
    }

    // enemy lasers
    for (var i = 0; i < game.enemyLasers.length ; i++){
        var laserState = game.enemyLasers[i].update();
        // collided with enemy
        if (laserState == 1){
            player.lives--;
        }
        // collided or out of bounds
        if (laserState >= -1){ game.enemyLasers.splice(i, 1); }
    }

    // mother ship
    if (motherShip.speed == 0){
        // motherShip.speed = 2;
        var chance = Math.floor(Math.random() * 5000) + 1;
        if (chance == 1111){
            motherShip.speed = 2;
        }
    }
}

