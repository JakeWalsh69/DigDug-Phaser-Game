// create a new scene name "Game"
let gameScene = new Phaser.Scene('Game');

// phaser game settings
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: gameScene
};
  
// New game instance based on config
var game = new Phaser.Game(config);

var player;
var platforms;
var cursors;
var score = 0;
var apple;
var gameOver = false;
var scoreText;
var lives = 3;
var livesText;
var digDugText;

gameScene.preload = function () {
    this.load.image('fire', 'http://labs.phaser.io/assets/skies/fire.png');
    this.load.image('sky', 'http://labs.phaser.io/assets/skies/gradient25.png');
    this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('flower', 'http://labs.phaser.io/assets/sprites/flower-exo.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('eyes', 'http://labs.phaser.io/assets/sprites/slimeeyes.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('purpleBaddie', 'http://labs.phaser.io/assets/sprites/space-baddie-purple.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('mine', 'http://labs.phaser.io/assets/sprites/mine.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('stripes', 'http://labs.phaser.io/assets/sprites/stripes800x32-bg.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('apple', 'http://labs.phaser.io/assets/sprites/apple.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('ground', 'http://labs.phaser.io/assets/sprites/platform.png', { frameWidth: 32, frameHeight: 48 });
}

gameScene.create = function () {
    //  The platforms group contains the ground and the ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(100, 650, 'ground').setScale(3).refreshBody();
    platforms.create(100, -10, 'ground').setScale(3).refreshBody();
    
    //  Underground background for our game
    this.add.image(400, 300, 'fire');

    // Sky background for our game
    this.add.image(400, -175, 'sky');

    // Add Flower at the top of the screen
    this.add.image(750, 110, 'flower');

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
    this.add.image(400, 350, 'stripes');
    this.add.image(400, 390, 'stripes');
    this.add.image(400, 430, 'stripes');
    this.add.image(400, 470, 'stripes');
    this.add.image(400, 510, 'stripes');
    this.add.image(400, 540, 'stripes');
    
    // Add player
    this.player = this.add.image(400, 1000, 'player');

    // The player and its settings
    player = this.physics.add.sprite(400, 100, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setCollideWorldBounds(true);

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

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    
    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);

    this.apple = this.add.sprite(400, 400, 'apple');
    this.apple.setScale(0.7);

    this.isPlayerAlive = true;

    this.cameras.main.resetFX();
}

gameScene.drawScore = function()
{
    this.scoreText = this.add.text(16, 48, "Score: " + score, { fontSize: '32px', fill: 'gold'});
}

gameScene.drawLives = function()
{
    livesText = this.add.text(16, 16, "Lives: " + lives, { fontSize: '32px', fill: 'darkred' });
}

gameScene.drawDigDugTitle = function()
{
    digDugText = this.add.text(225, 0, "Dig Dug", { fontSize: '85px', fill: '#000' })
}

gameScene.update = function() {
    if (gameOver)
    {
        return;
    }

    if (lives < 1){
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);
    }

    gameScene.drawDigDugTitle();
    gameScene.drawLives();

    if (cursors.left.isDown)
    {
        player.setVelocityX(-60);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(60);

        player.anims.play('right', true);
    }
    else if (cursors.up.isDown && player.y > 100 && player.y < 600)
    {
        player.y -= 1;

        player.anims.play('right', true);
    }
    else if (cursors.down.isDown && player.y < 535)
    {
        player.y += 1;

        player.anims.play('left', true);
    }

    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    // apple collect
    if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), this.apple.getBounds())) {
        score += 100;
        this.apple.setX(10000);
        gameScene.drawScore();
    }

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
    for (let i = 0; i < numEyesEnemies; i++) {

        // move enemies
        eyesEnemies[i].y += eyesEnemies[i].speed;

        // reverse movement if reached the edges
        if (eyesEnemies[i].y >= 395 && eyesEnemies[i].speed >= 0){
            eyesEnemies[i].speed *= -1;
        } else if (eyesEnemies[i].y <= 285 && eyesEnemies[i].speed <= 0){
            eyesEnemies[i].speed *= -1;
        }

        // enemy collsion
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), eyesEnemies[i].getBounds())) {
            lives -= 1;
            gameScene.drawLives();
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
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), purpleEnemies[i].getBounds())) {
            lives -= 1;
            gameScene.drawLives();
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
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), mineEnemies[i].getBounds())) {
            lives -= 1;
            gameScene.drawLives();
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

var interval = setInterval(gameScene.create(), 10);