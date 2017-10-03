
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
	
};

Turtles.Game.prototype = {

	create: function () {

		//  We're going to be using physics, so enable the Arcade Physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.add.image(0, 0, 'sky');
		
		// this group contains the rising/sinking turtles
		this.turtles = this.game.add.group();
		this.turtles.enableBody = true;
		
		// this is the water, it does not move but we need to do collision detection with it for killing player
		this.water = this.game.add.group();
		this.water.enableBody = true;
		
		//  this group contains land on either end of the river
		this.land = this.game.add.group();
		this.land.enableBody = true;
		
		// The player and its settings
		this.player = this.game.add.sprite( 128 + 8 + 25 + 20 - 100, this.game.world.height - 128 - 400, 'player');
		this.player.scale.setTo(0.21,0.21);
		this.player.anchor.set(0.5);
		
		//  We need to enable physics on the player
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = this.gameOptions.playerGravity;
		
		// these are the 6 turtles
		for ( var i = 0; i < 6; i++ ) {
			var turtle = this.turtles.create( 128 + 8 + 25 + (100*i), this.game.world.height - 128, 'turtle');
			turtle.body.immovable = true;
			turtle.body.bounce.y = 0.03;		
		}
		
		// this is the water, done last in z-order so turtles/etc go behind it
		for ( i = 0; i < 6; i++ ) {
			this.water.create(64+(128*i), this.game.world.height - 99,'water').body.immovable = true;
		}
		
		// Here we create the ground on left and right respectively.
		this.land.create(0, this.game.world.height - 128, 'left').body.immovable = true;
		this.land.create(this.game.world.width - 128 - 128, this.game.world.height - 128, 'right').body.immovable = true;
		
        // waiting for player input
        this.game.input.onDown.add(this.handleJump, this);
	},
	
	handleJump: function() {	
		if ( this.canJump ) {
			// setting hero horizontal speed
			this.player.body.velocity.x = this.gameOptions.playerSpeed;
			// applying jump force
			this.player.body.velocity.y = -this.gameOptions.playerJump;	

			// hero can't jump anymore
			this.canJump = false;
			
			var sprite = this.turtles.getAt( parseInt(Math.random() * 6) ); 
			tween = this.game.add.tween(sprite).to( { y: 700 }, 4000, Phaser.Easing.Bounce.Out, true);
			tween.onComplete.addOnce( function() { this.game.add.tween(sprite).to( { y: this.game.world.height - 128 }, 4000, Phaser.Easing.Bounce.Out, true); }, this);
		}		
	},
	
	stopJump: function() {
		this.player.body.velocity.x = this.player.body.velocity.y = 0;
		this.canJump = true;
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
