
//Variable for column dimentions, enemy and player positions
var COL_WIDTH= 101;
var COL_HEIGHT= 83;
var X_START= -130;
var X_END= 606;
var Y_START= 60;
var CHAR_X =200;
var CHAR_Y =300;

//Control the changes with each level
var maxSpeed= 300, levelDuration = 45*1000;
var levelControl =  function(){
    if(level == 2)
    {
        maxSpeed = 400;
        levelDuration = 60*1000;
        newLevel();
    }
    if(level == 3)
    {
        maxSpeed = X_END;
        levelDuration=75*1000;
        newLevel();
    }
    if(level == 4)
    {
        level = 0; 
        score = 0 ;
        startGame=false;
        newLevel();
        clearInterval(starTimerId);
        window.alert("Congratulations! You have completed the game!");
        displayLevel();
        displayScore();
    }
};

//Change the layout of objects in each new level
var newLevel = function(){
    player.startPos();
    rock.startPos();
    allEnemies.forEach(function(enemy){
            enemy.startPos();
        });
    allGems.forEach(function(gem){
            gem.startPos();
        });
    clearInterval(starTimerId);
    star.startPos();
}

// Enemies our player must avoid
var Enemy = function() {
    
    this.startPos();
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if(this.x > X_END)
    {
        this.startPos();
    }

    //If the enemy clashes with the rock, destroy the enemy
    var range = 30;
    var xRightRange = this.x + range;
    var xLeftRange = this.x - range;
    var yDownRange = this.y + range;
    var yUpRange = this.y - range;
    if(rock.x >= xLeftRange && rock.x <= xRightRange && 
        rock.y >= yUpRange && rock.y <= yDownRange){
           this.startPos();
        }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.startPos = function(){
    this.x = X_START;
    this.y = this.randomY();
    this.speed = this.randomSpeed();
};

Enemy.prototype.randomY = function(){
    var rowEnemy = Math.floor((Math.random()*3)+1);
    return  COL_HEIGHT*rowEnemy - 30;
};

Enemy.prototype.randomSpeed = function(){
    var baseSpeed = Math.abs(X_START);
    return Math.floor((Math.random()*(maxSpeed-baseSpeed))+baseSpeed);
};

var Player = function() {
    this.startPos();
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt){
    var player = this;
    var range = 30;
    var xRightRange = player.x + range;
    var xLeftRange = player.x - range;
    var yDownRange = player.y + range;
    var yUpRange = player.y - range;
    
    //if the player clashes with the enemy or rock, it return to the starting position
    //score decrements by 5-enemy, 10-rock
    allEnemies.forEach(function(enemy){
    if(enemy.x >= xLeftRange && enemy.x <= xRightRange && 
        enemy.y >= yUpRange && enemy.y <= yDownRange){
           player.startPos();
           score-=5;
           displayScore();
        }
    });
    
    if(rock.x >= xLeftRange-12 && rock.x <= xRightRange+12 && 
        rock.y >= yUpRange && rock.y <= yDownRange){
           player.startPos();
           score-=10;
           displayScore();
        }
}

Player.prototype.handleInput = function(key){
  if(startGame){  
    var xPos = this.x;
    var yPos = this.y;
    if( key === 'left' ){
            xPos -= COL_WIDTH;
            if( xPos < -COL_WIDTH)
                this.x -=0;
            else 
                this.x -=COL_WIDTH;
            
    }
    if(key ==='right'){
        xPos += COL_WIDTH;
            if( xPos > X_END-COL_WIDTH*2)
                this.x +=0;
            else 
                this.x +=COL_WIDTH;
    } 
    if( key === 'up' ){
            yPos -= COL_HEIGHT;
            if( yPos < 0)
                this.y -=0;
            else 
                this.y -=COL_HEIGHT;     
    }
    if(key ==='down'){
        yPos += COL_HEIGHT;
            if( yPos > CHAR_Y )
                this.y +=0;
            else 
                this.y +=COL_HEIGHT;
    } 

  }
}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.startPos = function(){
    this.x = CHAR_X;
    this.y = CHAR_Y;
}


//Gems the player must collect to increase score
var Gem = function() {
    
    this.startPos();
  
};

Gem.prototype.update = function(dt) {
        var gem = this;
        var range = 55;
        var xRightRange = gem.x + range;
        var xLeftRange = gem.x - range;
        var yDownRange = gem.y + range;
        var yUpRange = gem.y - range;
        
        //Increment player point on collecting gems    
        if(player.x >= xLeftRange && player.x <= xRightRange && 
        player.y >= yUpRange && player.y <= yDownRange){
           gem.startPos();
           score+=gem.getScore();
           displayScore();
        }
        
        //Place gems so that it does not clash with the rock
        if(rock.x >= xLeftRange-10 && rock.x <= xRightRange+10 && 
        rock.y >= yUpRange && rock.y <= yDownRange){
           gem.startPos();
           displayScore();
        }
};

Gem.prototype.getScore = function(){
    var score;
    if(this.sprite == 'images/Gem Green.png'){
        score = 10;
    }
    if(this.sprite == 'images/Gem Blue.png'){
        score = 20;
    }
    if(this.sprite == 'images/Gem Orange.png'){
        score = 30;
    }
    return score;
}   


Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.startPos = function(){
    
        this.x = Math.floor((Math.random()*(X_END-200+1)));
        this.y= this.randomY();
        this.sprite = this.randomGem();
};

Gem.prototype.randomY = function(){
    var rowEnemy = Math.floor((Math.random()*3)+1);
    return  COL_HEIGHT*rowEnemy - 30;
};

Gem.prototype.randomGem = function(){
    var gems = ['images/Gem Green.png', 'images/Gem Blue.png', 'images/Gem Orange.png'];
    return gems[Math.floor(Math.random()*3)];
};

// Rocks our player must avoid
var Rock = function() {
    
    this.startPos();
    this.sprite = 'images/Rock.png';
};


// Draw the rock on the screen, required method for game
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Rock.prototype.startPos = function(){
    this.x = Math.floor((Math.random()*(X_END-200+1)));
    this.y = this.randomY();
    
};

Rock.prototype.randomY = function(){
    var rowEnemy = Math.floor((Math.random()*3)+1);
    return  COL_HEIGHT*rowEnemy - 30;
};

// Wandering star- Position changes every 3 seconds
var Star = function() {
    
    this.startPos();
    this.sprite = 'images/Star.png';
};

Star.prototype.update = function(dt){
    var star = this;
    var range = 40;
    var xRightRange = star.x + range;
    var xLeftRange = star.x - range;
    var yDownRange = star.y + range;
    var yUpRange = star.y - range;
    if(player.x >= xLeftRange-15 && player.x <= xRightRange+15 && 
        player.y >= yUpRange && player.y <= yDownRange){
           score+=25;
           star.x = -200;
           star.y =-200;
           displayScore();
    }
}


Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Star.prototype.startPos = function(){
    var star = this;
    starTimerId= setInterval(function(){ 
    star.x = Math.floor((Math.random()*(X_END-200+1)));
    star.y = star.randomY();}, 3*1000);
    
};
Star.prototype.randomY = function(){
    var rowEnemy = Math.floor((Math.random()*3)+1);
    return  COL_HEIGHT*rowEnemy - 30;
};

//Key- to move to the next level
var Key = function() {
    
    this.startPos();
    this.sprite = 'images/Key.png';
};

Key.prototype.update = function(dt){
        var key = this;
        var range = 55;
        var xRightRange = key.x + range;
        var xLeftRange = key.x - range;
        var yDownRange = key.y + range;
        var yUpRange = key.y - range;
        if(player.x >= xLeftRange && player.x <= xRightRange && 
        player.y >= yUpRange && player.y <= yDownRange){
           score+=100;
           level++;
           key.x=-200;
           key.y=-200;
           displayScore();
           displayLevel();
           levelControl();
           key.startPos();
        }
        
        //Position key to avoid rock
        if(rock.x >= xLeftRange && rock.x <= xRightRange && 
        rock.y >= yUpRange && rock.y <= yDownRange){
           key.x = Math.floor((Math.random()*(X_END-200+1)));
           key.y = key.randomY();
        }
}


Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Key.prototype.startPos = function(){
    var key = this;
    //display key after a level's time duration   
    setTimeout(function(){ 
    key.x = Math.floor((Math.random()*(X_END-200+1)));
    key.y = key.randomY();
    }, levelDuration);
    
};

Key.prototype.randomY = function(){
    var rowEnemy = Math.floor((Math.random()*3)+1);
    return  COL_HEIGHT*rowEnemy - 30;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy(), enemy2 = new Enemy(), enemy3 = new Enemy();
var allEnemies = [enemy1,enemy2,enemy3];
var player = new Player();
var gem1 = new Gem(), gem2 = new Gem(), gem3 = new Gem();
var allGems = [gem1,gem2,gem3];
var rock = new Rock();
var score= 0;
var star;
var startGame = false;
var level=0;
var starTimerId;
var key = new Key();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* Disable arrow keys in the browser
Source:
http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
*/
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var displayScore =function(){
    document.getElementById('score').innerHTML = score;
};

displayScore();

var displayLevel =function(){
    document.getElementById('level').innerHTML = level;
};

displayLevel();

var start = function(){
    startGame =true;
    star = new Star();
    level=1;
    displayLevel();
    levelControl();
}


