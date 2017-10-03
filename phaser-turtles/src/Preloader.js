
Turtles.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

Turtles.Preloader.prototype = {

	preload: function () {

		this.preloadBar = this.add.sprite(120, 200, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('sky', 'images/BG.png');
		this.load.image('right', 'images/1.png');
		this.load.image('left', 'images/3.png');
		this.load.image('water', 'images/17.png');
		this.load.image('turtle', 'images/Mushroom_1.png');
		this.load.atlasJSONHash('player', 'images/sprites.png', 'sprites.json');
	},

	create: function () {

		this.preloadBar.cropEnabled = false;

		this.state.start('Game');

	},

	update: function () {

		// if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		// {
			// this.ready = true;
			// this.state.start('MainMenu');
		// }

	}

};
