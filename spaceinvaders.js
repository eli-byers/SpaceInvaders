const game = new Game();


/*  .oooooo.                                          
 d8P'  `Y8b                                         
888            .oooo.   ooo. .oo.  .oo.    .ooooo.  
888           `P  )88b  `888P"Y88bP"Y88b  d88' `88b 
888     ooooo  .oP"888   888   888   888  888ooo888 
`88.    .88'  d8(  888   888   888   888  888    .o 
 `Y8bood8P'   `Y888""8o o888o o888o o888o `Y8bod8P' 
                                                    
                                                    
                                                    */

function Game(){
    this.canvas = document.getElementById('game');
    this.context = this.canvas.getContext('2d');

    this.enemyRemoveQueue = [];
    this.playerLasers = [];
    this.enemyLasers = [];
    this.components = [];
    this.enemys = [];
    this.keys = [];

    this.stageEnd = 1200;
    this.stageProgress = 0;
    this.difficultyScale = 1.2;
    this.pace = 20;

    this.pixl = 2;
    this.time = 0;
    this.direction = "right";
    this.gameover = false;

    this.renderMap = ()=>{
        this.canvas.width = 500;
        this.canvas.height = 500;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        // init keys
        window.addEventListener('keydown', (e)=>{
            this.keys = (this.keys || []);
            this.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', (e)=>{
            this.keys[e.keyCode] = false;
            if (this.player.canShoot){ this.player.shot = false; }
        });
    };

    this.removeEnemy = ()=>{
        this.enemys.splice(this.enemyRemoveQueue.shift(),1);
    };

    this.renderMapFor = (obj)=>{
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
    };

    this.clear = ()=>{
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        var ctx = this.context;
        ctx.fillStyle = 'lime';
        ctx.fillRect(0, this.canvas.height - 27, this.canvas.width, 2);

        // player icon
        var y = this.canvas.height - 13;
        game.renderMapFor({ map: this.player.map, color: 'lime',  x: 40,  y: this.canvas.height - 24})
        
        // lives count
        ctx.fillStyle = 'white';
        ctx.font = "normal 15px Arial";
        ctx.textAlign = 'left'
        ctx.fillText(this.player.lives + " x", 10, y+7);
        
        // score
        ctx.textAlign = 'right'
        ctx.fillText("SCORE: " + this.player.points, this.canvas.width-10, this.canvas.height-6);
    };

    this.updateGameArea = ()=>{
        this.time += 1;
        this.stageProgress += 1;
        this.clear();
        
        // enemys
        let nextDir = this.direction;
        let shooteridx = Math.floor(Math.random() * this.enemys.length);
        for (var i = 0; i < this.enemys.length; i++){
            // hit edge
            let newDir = this.enemys[i].update();
            if (newDir != this.direction) {
                nextDir = newDir;
            }
            // hit player
            if (colliding(this.enemys[i], this.player)){
                this.enemys[i].boomOne();
                this.player.lives -= 1;
            }
            // shoot
            if (game.enemyLasers.length == 0 && shooteridx == i){
                this.enemys[i].shoot();
            }
        };
        this.direction = nextDir;

        // game play
        if (!game.gameover){
            // spawn
            if (this.enemys.length == 0){
                this.initEnemies();
                this.player.lives += 1;
            }
            
            // tag
            // speed up
            if (this.stageProgress == this.stageEnd) {
                this.stageProgress = 0;
                this.stageEnd = Math.round(this.stageEnd *= this.difficultyScale)

                let step = Math.ceil( this.pace * 0.1 )
                this.pace -= step;
                this.pace = this.pace ? this.pace : 1;
            }
        }

        // keys: left - right - space
        if(this.keys){
            if(game.gameover){
                if(this.keys[13]) {
                    game.reset();
                }
            } 
            else {
                this.player.move(this.keys)
            }
        }

        // player(s) / baracades / m-ship
        for (var i = 0; i < this.components.length; i++){
            this.components[i].update();
        }

        // player lasers
        for (var i = 0; i < this.playerLasers.length; i++){
            var laserState = this.playerLasers[i].update();
            if (laserState != undefined){
                // collided with enemy
                if (laserState >= 0){
                    let idx = laserState;
                    this.player.points += this.enemys[idx].points;
                    this.enemys[idx].boomOne();
                }
                // collided or out of bounds
                if (laserState >= -2){ 
                    let laser = this.playerLasers[i];
                    this.playerLasers.push(new Splat(laser.color, laser.x, laser.y));
                    this.playerLasers.splice(i, 1); 
                }
                // collided with mother ship
                if (laserState == -2){
                    this.motherShip.boomOne();
                    var rand = Math.floor(Math.random() * 10) + 1;
                    this.player.points += 200 + rand * 50;
                }
                // splat done
                if (laserState == -3){
                    this.playerLasers.splice(i, 1); 
                }
            }
        }

        // enemy lasers
        for (var i = 0; i < this.enemyLasers.length; i++){
            let laser = this.enemyLasers[i];
            var laserState = laser.update();
            // collided with player
            if (laserState == -1){
                this.player.lives -= 1;
                this.enemyLasers.push(new Splat(laser.color, laser.x, laser.y));
            }
            // -1: collided, now splat
            // -2: out of bounds 
            // -3: splat done
            if (laserState <= -1){ 
                this.enemyLasers.splice(i, 1); 
            }
        }

        // game over
        if (!game.gameover && this.player.lives <= 0){
            this.player.lives = 0;
            this.gameover = true;
            this.player.boomOne();
        } 
        if (game.gameover){
            this.player.lives = 0;
            var ctx = this.context;
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center'
            ctx.font = "bold 30px Arial";
            ctx.fillText("YOU DIED", this.canvas.width / 2, this.canvas.height / 2);
            ctx.font = "normal 20px Arial";
            ctx.fillText("Press RETURN to Play", this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    };

    this.start = ()=>{
        this.renderMap();
        this.initEnemies();

        this.player = new Player();
        this.components.push(this.player);
        
        this.motherShip = new MotherShip();
        this.components.push(this.motherShip);

        for (var i = 1; i < 5; i++){
            this.components.push(new Baracade('lime', Math.round(i/5 * this.canvas.width), 400));
        }

        // start gameloop
        this.time = 0;
        this.interval = setInterval(this.updateGameArea, 20);
    };

    this.reset = ()=>{
        clearInterval(this.interval);

        this.enemyRemoveQueue = [];
        this.playerLasers = [];
        this.enemyLasers = [];
        this.components = [];
        this.enemys = [];
        this.keys = [];

        this.stageEnd = 1200;
        this.stageProgress = 0;
        this.pace = 20;

        this.pixl = 2;
        this.time = 0;
        this.direction = "right";
        this.gameover = false;

        this.start();
    }

    this.initEnemies = ()=>{
        var x = 0;
        var y = 60;
        const types = ['squid', 'crab', 'crab', 'thulu', 'thulu'];
        for (t = 0; t < types.length; t++){
            x = 80;
            for (i = 0; i < 9; i++){
                this.enemys.push(new Enemy('white', types[t], 10, x, y));
                x += 40;
            }
            y += 30;
        }
    };

    this.deleteComponent = (c)=>{
        for (i in this.components){
            if (c === this.components[i]){
                this.components.splice(i, 1);
                break;
            }
        }
    };

    this.deleteEnemy = (e)=>{
        for (i in this.enemys){
            if (e === this.enemys[i]){
                this.enemys.splice(i, 1);
                break;
            }
        }
    }
}


/*ooooooooo.   oooo                                           
`888   `Y88. `888                                           
 888   .d88'  888   .oooo.   oooo    ooo  .ooooo.  oooo d8b 
 888ooo88P'   888  `P  )88b   `88.  .8'  d88' `88b `888""8P 
 888          888   .oP"888    `88..8'   888ooo888  888     
 888          888  d8(  888     `888'    888    .o  888     
o888o        o888o `Y888""8o     .8'     `Y8bod8P' d888b    
                             .o..P'                         
                             `Y8P'                          
                                                            */
function Player(){
    this.map = objectMaps.player.map
    this.width = this.map[0].length * game.pixl;
    this.height = this.map.length * game.pixl;;
    this.x = game.canvas.width/2 - this.width/2;
    this.y = 445;
    this.color = 'lime';
    this.lives = 3;
    this.points = 0;
    this.speed = 2;
    this.shot = false;
    this.canShoot = true;
    this.canCollide = true;

    this.update = function(){
        game.renderMapFor(this);
    };

    this.move = function(keys){
        if(keys[37]) this.moveLeft();
        if(keys[39]) this.moveRight();
        if(keys[32]) this.shoot();
    };

    this.moveLeft = function(){
        if(this.x > 0){ 
            this.x -= this.speed; 
        }
        this.x = Math.max(0, this.x);
    };

    this.moveRight = function(){
        let point = game.canvas.width-this.width;
        if(this.x < point){
            this.x += this.speed;
        }
        this.x = Math.min(point, this.x);
    };

    this.shoot = function(){
        if (this.canShoot & !this.shot){
            this.shot = true;
            this.canShoot = false;
            game.playerLasers.push(new Laser(this.color, 7,'up',this.x+(this.width/2), this.y+10));
            setTimeout(()=>{
                this.canShoot = true;
                // pressed again
                if (!game.keys[32]){ this.shot = false; }
            }, 420);
        }
    };

    this.boomOne = ()=>{
        this.speed = 0;
        this.canShoot = false;
        this.canCollide = false;
        
        this.color = 'orange';
        this.map = objectMaps.shroom.map1;
        setTimeout(this.boomTwo, 100);
    };
    
    this.boomTwo = ()=>{
        this.map = objectMaps.shroom.map2;
        setTimeout(this.boomThree, 100);
    };
    
    this.boomThree = ()=>{
        this.map = objectMaps.shroom.map3;
        setTimeout(this.delete, 100);
    };

    this.delete = ()=>{
        game.deleteComponent(this);
    };
}

function Baracade(color, x, y){
    this.map = [];
    for (var i = 0; i < objectMaps['baracade'].map.length; i++){
        this.map[i] = objectMaps['baracade'].map[i].slice();
    }

    this.height = this.map.length * game.pixl;
    this.width = this.map[0].length * game.pixl;
    this.color = color;
    this.x = x - this.width / 2;
    this.y = y;
    this.canCollide = true;

    this.update = function(){
        game.renderMapFor(this);
    };

    this.damage = function(x, y){
        
    }
}

/*oooooooooooo                                                     
`888'     `8                                                     
 888         ooo. .oo.    .ooooo.  ooo. .oo.  .oo.   oooo    ooo 
 888oooo8    `888P"Y88b  d88' `88b `888P"Y88bP"Y88b   `88.  .8'  
 888    "     888   888  888ooo888  888   888   888    `88..8'   
 888       o  888   888  888    .o  888   888   888     `888'    
o888ooooood8 o888o o888o `Y8bod8P' o888o o888o o888o     .8'     
                                                     .o..P'      
                                                     `Y8P'       
                                                                 */

function Enemy(color, type, speed, x, y){
    this.map = objectMaps[type].map
    this.altMap = objectMaps[type].altMap
    this.points = objectMaps[type].points
    this.height = this.map.length * game.pixl;
    this.width = this.map[0].length * game.pixl;
    this.gap = 11;
    this.color = color;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.left = x-98;
    this.right = x+46;
    this.canCollide = true;

    this.update = function(){
        var dir = game.direction;
        if (game.stageProgress % game.pace === 0) {
            
            [this.map, this.altMap] = [this.altMap, this.map]
            switch (game.direction) {
                case 'left':
                    this.x -= this.speed;
                    if (this.x <= this.speed) {
                        dir = 'down-right';
                    }
                    break;
                case 'right':
                    this.x += this.speed;
                    if (this.x+this.width > game.canvas.width-this.speed){ 
                        dir = 'down-left';
                    }
                    break;
                case 'down-right':
                    this.y += 30;
                    dir = 'right'
                    break;
                case 'down-left':
                    this.y += 30;
                    dir = 'left'
                    break;
                    
                default: break;
            }
        }

        if (this.y > game.canvas.height - this.height - 30){
            this.boomOne();
        }

        game.renderMapFor(this);
        return dir;
    };

    this.shoot = function(){
        game.enemyLasers.push(
            new Laser('white', 7,'down',this.x+(this.width/2)-1, this.y+this.height)
        );
    }

    this.boomOne = ()=>{
        this.canCollide = false;
        this.map = objectMaps['boom'].map;
        this.altMap = this.map;
        setTimeout(this.boomTwo, 100);
    };
    
    this.boomTwo = ()=>{
        this.map = objectMaps['boom'].altMap;
        this.altMap = this.map;
        setTimeout(this.delete, 100);
    };

    this.delete = ()=>{
        game.deleteEnemy(this);
    };
}

function MotherShip(){
    this.map = objectMaps.motherShip.map;
    this.height = this.map.length * game.pixl;
    this.width = this.map[0].length * game.pixl;
    this.x = -this.width;
    this.y = 15;
    this.speed = 0;
    this.color = 'red';
    this.canCollide = true;

    this.update = function(){
        if (this.speed == 0){
            var chance = Math.floor(Math.random() * 5000) + 1;
            if (chance == 1111){
                this.speed = 2;
            }
        }
        else if (this.x > game.canvas.width){
            this.reset();
        }
        this.x += this.speed;
        game.renderMapFor(this);
    };

    this.boomOne = ()=>{
        this.map = objectMaps['boom'].map;
        setTimeout(this.boomTwo, 100);
    };
    
    this.boomTwo = ()=>{
        this.map = objectMaps['boom'].altMap;
        setTimeout(this.reset, 100);
    };

    this.reset = ()=>{
        this.map = objectMaps['motherShip'].map;
        this.speed = 0;
        this.x = -this.width;
    };
}

/*ooooo                                              
`888'                                              
 888          .oooo.    .oooo.o  .ooooo.  oooo d8b 
 888         `P  )88b  d88(  "8 d88' `88b `888""8P 
 888          .oP"888  `"Y88b.  888ooo888  888     
 888       o d8(  888  o.  )88b 888    .o  888     
o888ooooood8 `Y888""8o 8""888P' `Y8bod8P' d888b    
                                                   
                                                   
                                                   */

function Laser(color, speed, dir, x, y){
    this.height = 4;
    this.width = 2;
    this.color = color;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.canCollide = true;

    this.update = function(){
        this.y += this.direction == 'down' ? this.speed : -this.speed;
        let bottommargin = 25;

        // ob
        if (this.y > game.canvas.height - bottommargin - this.height || this.y < 0-this.height){ return -3; }
        
        // collision up
        if (this.direction == 'up') {
            // enemys
            for (var i = 0; i < game.enemys.length; i++){
                if (colliding(this, game.enemys[i])){ 
                    return i;
                }
            }
            // mothership
            if (game.motherShip.speed !== 0){
                if (colliding(this, game.motherShip)){
                    return -2;
                }
            }
        } 
        
        // collision down
        else {
            // player
            if (colliding(this, game.player)){ 
                return -1;
            }
        }

        var ctx = game.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

function Splat(color, x, y){
    this.frames = [objectMaps.splat.map1, objectMaps.splat.map2, objectMaps.splat.map3]
    this.map = null;
    this.frame = 0;
    this.x = x - Math.round(objectMaps.splat.map1[0].length / 2);
    this.y = y;
    this.color = color;
    
    this.update = function(){
        if (this.frame == this.frames.length) return -3;

        this.map = this.frames[this.frame];
        this.frame += 1;

        game.renderMapFor(this);
    }

}


/*ooooo   ooooo           oooo                                         
`888'   `888'           `888                                         
 888     888   .ooooo.   888  oo.ooooo.   .ooooo.  oooo d8b  .oooo.o 
 888ooooo888  d88' `88b  888   888' `88b d88' `88b `888""8P d88(  "8 
 888     888  888ooo888  888   888   888 888ooo888  888     `"Y88b.  
 888     888  888    .o  888   888   888 888    .o  888     o.  )88b 
o888o   o888o `Y8bod8P' o888o  888bod8P' `Y8bod8P' d888b    8""888P' 
                               888                                   
                              o888o                                  
                                                                     */

function colliding(rect1, rect2){
    cancollide = rect1.canCollide && rect2.canCollide;
    x = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    y = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;

    return  cancollide && x && y;
}



