// create a new scene name "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene (our own customer variables - these are NOT part of the Phaser API)
gameScene.init = function() {
    this.playerSpeed = 1.5;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
}

gameScene.preload = function () {
    // The base address for assets - using phaser lab exampleshere
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('fire', 'assets/skies/fire.png');
    this.load.image('sky', 'assets/skies/gradient25.png');
    this.load.spritesheet('player', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('flower', 'assets/sprites/flower-exo.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('eyes', 'assets/sprites/slimeeyes.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('purpleBaddie', 'assets/sprites/space-baddie-purple.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('mine', 'assets/sprites/mine.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('stripes', 'assets/sprites/stripes800x32-bg.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('apple', 'assets/sprites/apple.png', { frameWidth: 32, frameHeight: 48 });
}

gameScene.create = function () {
    //  Underground background for our game
    let bg = this.add.image(400, 300, 'fire');

    // Sky background for our game
    this.add.image(400, -175, 'sky');

    // Add Flower at the top of the screen
    this.add.image(750, 110, 'flower');

    // Add player
    this.player = this.add.image(400, 100, 'player');

    // Add stripes for enemy starting positions
    this.add.image(100, 300, 'stripes');
    this.add.image(100, 340, 'stripes');
    this.add.image(100, 380, 'stripes');
    this.add.image(300, 460, 'stripes');
    this.add.image(300, 500, 'stripes');
    this.add.image(300, 540, 'stripes');
    this.add.image(600, 300, 'stripes');
    this.add.image(600, 260, 'stripes');
    this.add.image(600, 220, 'stripes');

    // Adding stripes for underground entrance
    this.add.image(400, 149, 'stripes');
    this.add.image(400, 190, 'stripes');
    this.add.image(400, 230, 'stripes');
    this.add.image(400, 270, 'stripes');
    this.add.image(400, 310, 'stripes');

    this.eyesEnemies = this.add.group({
        key: 'eyes',
        repeat: 1,
        setXY: {
            x: 100,
            y: 300,
            stepX: 0,
            stepY: 95
            },
        });  

    Phaser.Actions.Call(this.eyesEnemies.getChildren(), function(enemy) {
        enemy.speed = 1;
    }, this);

    this.purpleEnemies = this.add.group({
        key: 'purpleBaddie',
        repeat: 1,
        setXY: {
            x: 300,
            y: 450,
            stepX: 0,
            stepY: 100
        }
    });

    Phaser.Actions.Call(this.purpleEnemies.getChildren(), function(enemy) {
        enemy.speed = 1;
    }, this);

    this.mineEnemies = this.add.group({
        key: 'mine',
        repeat: 1,
        setXY: {
            x: 600,
            y: 220,
            stepX: 0,
            stepY: 80
        }
    });

    Phaser.Actions.Call(this.mineEnemies.getChildren(), function(enemy) {
        enemy.speed = 1;
    }, this);

    // Add apple
    let apple = this.add.image(400, 300, 'apple');
    apple.setScale(0.7);

    this.isPlayerAlive = true;

    this.cameras.main.resetFX();
}

gameScene.update = function() {
    // only if the player is alive
    if (!this.isPlayerAlive) {
        return;
    }

    // check for active input
    if (this.input.activePointer.isDown) {
        // player walks
        this.player.x += this.playertSpeed;
    }

    // eyes enemy movement variables
    let eyesEnemies = this.eyesEnemies.getChildren();
    let numEyesEnemies = eyesEnemies.length;

    // eyes enemy movement
    for (let i = 0; i < eyesEnemies.length; i++) {

        // move enemies
        eyesEnemies[i].y += eyesEnemies[i].speed;

        // reverse movement if reached the edges
        if (eyesEnemies[i].y >= 395 && eyesEnemies[i].speed >= 0){
            eyesEnemies[i].speed *= -1;
        } else if (eyesEnemies[i].y <= 285 && eyesEnemies[i].speed <= 0){
            eyesEnemies[i].speed *= -1;
        }

        // enemy collsion
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), eyesEnemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }

    // purple baddie movement variables
    let purpleEnemies = this.purpleEnemies.getChildren();
    let numPurpleEnemies = purpleEnemies.length;

    // purple enemy movement
    for (let i = 0; i < numPurpleEnemies; i++) {

        // move enemies
        purpleEnemies[i].y += purpleEnemies[i].speed;

        // reverse movement if reached the edges
        if (purpleEnemies[i].y >= 555 && purpleEnemies[i].speed >= 0){
            purpleEnemies[i].speed *= -1;
        } else if (purpleEnemies[i].y <= 450 && purpleEnemies[i].speed <= 0){
            purpleEnemies[i].speed *= -1;
        }

        // enemy collsion
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), purpleEnemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }

    // mine enemy movement variables
    let mineEnemies = this.mineEnemies.getChildren();
    let numMineEnemies = mineEnemies.length;

    // mine enemy movement
    for (let i = 0; i < numMineEnemies; i++) {

        // move enemies
        mineEnemies[i].y += mineEnemies[i].speed;

        // reverse movement if reached the edges
        if (mineEnemies[i].y >= 310 && mineEnemies[i].speed >= 0){
            mineEnemies[i].speed *= -1;
        } else if (mineEnemies[i].y <= 215 && mineEnemies[i].speed <= 0){
            mineEnemies[i].speed *= -1;
        }

        // enemy collsion
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), mineEnemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }
}

// end the game
gameScene.gameOver = function() {

    // flag to set player is dead
    this.isPlayerAlive = false;

    // shake the camera
    this.cameras.main.shake(500);

    // fade camera
    this.time.delayedCall(250, function(){
        this.cameras.main.fade(250);
    }, [], this);

    // restart game
    this.time.delayedCall(500, function() {
        this.scene.restart();
    }, [], this);
}

// phaser game settings
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: gameScene
};
  
// New game instance based on config
var game = new Phaser.Game(config);