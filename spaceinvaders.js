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

    this.enemysRemoveQueue = [];
    this.playerLasers = [];
    this.enemyLasers = [];
    this.components = [];
    this.enemys = [];
    this.keys = [];

    this.pace = 20;
    this.pixl = 2;
    this.time = 0;
    this.direction = "right";

    this.render = ()=>{
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

        // start gameloop
        this.interval = setInterval(this.updateGameArea, 20);
    };

    this.boomOne = ()=>{
        const idx = this.enemysRemoveQueue[0];
        this.enemys[idx].map = objectMaps['boom'].map
        this.enemys[idx].altMap = objectMaps['boom'].map
        setTimeout(this.boomTwo, 100);
    };
    
    this.boomTwo = ()=>{
        const idx = this.enemysRemoveQueue[0];
        this.enemys[idx].map = objectMaps['boom'].altMap
        this.enemys[idx].altMap = objectMaps['boom'].altMap
        setTimeout(this.removeEnemy, 100);
    };

    this.removeEnemy = ()=>{
        this.enemys.splice(this.enemysRemoveQueue.shift(),1);
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
        game.renderMapFor({ map: this.player.map, color: 'lime',  x: 40,  y: this.canvas.height - 20})
        // limes count
        ctx.fillStyle = 'white';
        ctx.font = "15px Arial";
        ctx.textAlign = 'left'
        ctx.fillText(this.player.lives + " x", 10, y+7);
        // score
        ctx.textAlign = 'right'
        ctx.fillText("SCORE: " + this.player.points, this.canvas.width-10, this.canvas.height-6);
    };

    this.updateGameArea = ()=>{
        this.clear();

        // speed up
        this.time++;
        switch (this.time) {
            case 1200: this.pace = 15; break;
            case 2400: this.pace = 10; break;
        }
        // enemys
        let nextDir = this.direction;
        this.enemys.forEach(e => {
            newDir = e.update();
            if (newDir != this.direction) {
                nextDir = newDir;
            }
        });
        // drop a row
        if (nextDir != this.direction){
            this.enemys.map(e => e.y += 20)
            this.direction = nextDir;
        }
        // keys: left - right - space
        if(this.keys){
            if(this.keys[37]){ this.player.move("left"); }
            if(this.keys[39]){ this.player.move("right"); }
            if(this.keys[32]){ this.player.shoot(); }
        }
        // player(s) / m-ship
        for (var i = 0; i < this.components.length ; i++){
            this.components[i].update();
        }
        // player lasers
        for (var i = 0; i < this.playerLasers.length ; i++){
            var laserState = this.playerLasers[i].update();
            if (laserState != undefined){
                // collided with enemy
                if (laserState >= 0){
                    this.enemysRemoveQueue.push(laserState);
                    this.player.points += this.enemys[laserState].points;
                    setTimeout(this.boomOne, 100);
                }
                // collided or out of bounds
                if (laserState >= -2){ 
                    let laser = this.playerLasers[i];
                    this.playerLasers.splice(i, 1); 
                    this.playerLasers.push(new Splat(laser.color, laser.x-8, laser.y));
                }
                // collided with mother ship
                if (laserState == -2){
                    motherShip.boomOne();
                    var rand = Math.floor(Math.random() * 10) + 1;
                    player.points += 200 + rand * 50;
                }
                // splat done
                if (laserState == -3){
                    this.playerLasers.splice(i, 1); 
                }
            }
        }
        // enemy lasers
        for (var i = 0; i < this.enemyLasers.length ; i++){
            var laserState = this.enemyLasers[i].update();
            // collided with enemy
            if (laserState == 1){
                game.player.lives--;
            }
            // collided or out of bounds
            if (laserState >= -1){ this.enemyLasers.splice(i, 1); }
        }
    };

    this.start = ()=>{
        this.player = new Player();
        this.components.push(this.player);
        this.motherShip = new MotherShip();
        this.components.push(this.motherShip);
        this.time = 0;
        this.render();
        // init level
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

    this.update = function(){
        var dir = game.direction;
        if (game.time % game.pace === 0) {
            
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

        var chance = Math.floor(Math.random() * 3000) + 1;
        if (chance == 1){
            this.shoot();
        }

        game.renderMapFor(this);
        return dir;
    };

    this.shoot = function(){
        game.enemyLasers.push(new Laser('white', 7,'down',this.x+(this.width/2)-1, this.y+this.height));
    }
}

function MotherShip(){
    this.map = objectMaps.motherShip.map;
    this.height = this.map.length * game.pixl;
    this.width = this.map[0].length * game.pixl;
    this.x = -this.width;
    this.y = 15;
    this.speed = 0;
    this.color = 'red';

    this.boomOne = ()=>{
        this.map = objectMaps['boom'].map;
        setTimeout(this.boomTwo, 100);
    };
    
    this.boomTwo = ()=>{
        this.map = objectMaps['boom'].altMap;
        setTimeout(this.reset, 100);
    };

    this.removeEnemy = function(){
        game.enemys.splice(game.enemysRemoveQueue.shift(),1);
    };

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

    this.reset = ()=>{
        this.map = objectMaps['motherShip'].map;
        this.speed = 0;
        this.x = -this.width;
    }
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

    this.update = function(){
        this.y += this.direction == 'down' ? this.speed : -this.speed;
        
        // ob
        if (this.y > game.canvas.height || this.y < 0-this.height){ return -1; }
        // collision
        if (this.direction == 'up') {
            for (i in game.enemys){
                if (colliding(this, game.enemys[i])){ return i; }
            }
            if (game.motherShip.speed !== 0){
                if (colliding(this, game.motherShip)){ return -2; }
            }
        } else {
            if (colliding(this, game.player)){ return 1; }
        }

        var ctx = game.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

function Splat(color, x, y){
    this.frames = [objectMaps.splat.map1, objectMaps.splat.map2, objectMaps.splat.map3]
    
    this.life = 2;
    this.x = x;
    this.y = y;
    this.color = color;
    
    this.update = function(){
        if (this.life < 0) return -3;
        this.map = this.frames[this.life];
        
        game.renderMapFor(this);
        this.life--;
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
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y)
    { return true }
    return false;
}



