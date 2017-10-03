
Turtles.Game = function (game) {
	
	this.gameOptions = {
	 
		// player gravity
		playerGravity: 1900,
	 
		// player horizontal speed
		playerSpeed: 193,
	 
		// player force
		playerJump: 500,
	 
		// enemy horizontal speed
		enemySpeed: 150
	}

	this.platforms = null;
	this.water = null;
	this.turtles = null;
	this.player = null;
        
	// the hero can jump, turned on and off for when we are in the air
	this.canJump = true;	
	// are we able to pick "fruit"?
	this.canPick = false;
	// index of the current "tile" player is on, 0 - 7 => land left [1..6] turtles 7 land right
	// used to determine his position relative to a sprite that is clicked, and hence the direction
	// that he must just in response to the click
	this.playerTileIndex = 0;
	
};

Turtles.Game.prototype = {

	create: function () {

		//  We're going to be using physics, so enable the Arcade Physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.add.image(0, 0, 'sky');
		
		// this group contains the rising/sinking turtles
		this.turtles = this.game.add.group();
		this.turtles.enableBody = true;
		this.turtles.inputEnableChildren = true;
		
		// this is the water, it does not move but we need to do collision detection with it for killing player
		this.water = this.game.add.group();
		this.water.enableBody = true;
		
		//  this group contains land on either end of the river
		this.land = this.game.add.group();
		this.land.enableBody = true;
		this.land.inputEnableChildren = true;
		
		// The player and its settings
		this.player = this.game.add.sprite( 128 + 8 + 25 + 20 - 100, this.game.world.height - 128 - 400, 'player', 'player/idle/0001');
		this.player.anchor.set(0.5);
		
		//  We need to enable physics on the player
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = this.gameOptions.playerGravity;
		
		// these are the 6 turtles
		for ( var i = 0; i < 6; i++ ) {
			var turtle = this.turtles.create( 128 + 8 + 25 + (100*i), this.game.world.height - 128, 'turtle');
			turtle.body.immovable = true;
			turtle.body.bounce.y = 0.03;	
			turtle.tileIndex = i + 1;	
		}
		this.turtles.onChildInputDown.add(this.onClickTile, this);
		
		// this is the water, done last in z-order so turtles/etc go behind it
		for ( i = 0; i < 6; i++ ) {
			this.water.create(64+(128*i), this.game.world.height - 99,'water').body.immovable = true;
		}
		
		// Here we create the ground on left and right respectively.
		var block = this.land.create(0, this.game.world.height - 128, 'left');
		block.body.immovable = true;
		block.tileIndex = 0;

		block = this.land.create(this.game.world.width - 128 - 128, this.game.world.height - 128, 'right');
		block.body.immovable = true;
		block.tileIndex = 7;

		this.land.onChildInputDown.add(this.onClickTile, this);
		
    	// animation
    	this.player.animations.add('idle', Phaser.Animation.generateFrameNames('player/idle/', 1, 10, '', 4), 10, true, false);
    	this.player.animations.add('jump', Phaser.Animation.generateFrameNames('player/jump/', 1, 10, '', 4), 10, true, false);
    	this.player.animations.play('idle');
	},

	onClickTile: function(sprite) {
		if ( sprite.tileIndex < this.playerTileIndex ) {
			this.jumpLeft();
		} else if ( sprite.tileIndex > this.playerTileIndex ) {
			this.jumpRight();
		}
	},

	jumpLeft: function() {
		this.handleJump(-1);
	},

	jumpRight: function() {
		this.handleJump(1);
	},
	
	handleJump: function(direction) {	
		if ( this.canJump ) {
			this.playerTileIndex += direction;
			this.player.scale.x = Math.abs(this.player.scale.x) * direction;	

			// setting hero horizontal speed
			this.player.body.velocity.x = this.gameOptions.playerSpeed * direction;
			// applying jump force
			this.player.body.velocity.y = -this.gameOptions.playerJump;	

			// hero can't jump anymore
			this.canJump = false;
			this.player.animations.play('jump');

			var sprite = this.turtles.getAt( parseInt(Math.random() * 6) ); 
			tween = this.game.add.tween(sprite).to( { y: 700 }, 4000, Phaser.Easing.Bounce.Out, true);
			tween.onComplete.addOnce( function() { this.game.add.tween(sprite).to( { y: this.game.world.height - 128 }, 4000, Phaser.Easing.Bounce.Out, true); }, this);
		}		
	},
	
	stopJump: function() {
		if ( !this.canJump ) {
			this.player.body.velocity.x = this.player.body.velocity.y = 0;
			this.canJump = true;
			this.player.animations.play('idle');

			if ( this.playerTileIndex == 0 ) {
				this.player.scale.x = Math.abs(this.player.scale.x);
			} else if ( this.playerTileIndex == 7 ) {
				this.player.scale.x = Math.abs(this.player.scale.x) * -1;
			}
		}
	},
	
	landOnLand: function(hero, layer) {
		this.stopJump();
		this.canPick = ( layer.key == "right" );
	},
	
	landOnTurtle: function() {
		this.stopJump();
	},
	
	update: function () {
		var self = this;
		
		//  Collide the player land
		this.game.physics.arcade.collide(this.player, this.land, function(hero, layer) { self.landOnLand(hero, layer) } );
		//  Collide the player with the turtles
		this.game.physics.arcade.collide(this.player, this.turtles, function(hero, layer) { self.landOnTurtle() } );
	
		
	
	},

	quitGame: function () {

		this.state.start('MainMenu');

	}

};
