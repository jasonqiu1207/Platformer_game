
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
        Letter_collected:""
        Letters_left=-1;
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));

        me.loader.onload = this.loaded.bind( this );

        me.loader.preload( gameResources );

        me.state.change( me.state.LOADING );


    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set( me.state.PLAY, new PlayScreen() );
        me.state.set( me.state.MENU, new TitleScreen() );
        me.state.set( me.state.GAMEOVER, new GameOverScreen() );
        
        me.state.transition( "fade", "#000000", 300 );

        me.entityPool.add( "player", Player );
        me.entityPool.add( "enemy", Enemy );

        me.entityPool.add( "player", Player );
        me.entityPool.add( "letter", Enemy );
        
        me.entityPool.add( "player", Player );
        me.entityPool.add( "flying_enmey", Enemy );

        me.entityPool.add( "player", Player );
        me.entityPool.add( "boss", Enemy );


        me.debug.renderHitBox = false;

        me.state.change( me.state.INTRO );

        var LevelChanger = me.LevelEntity.extend({
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
    },
    goTo: function ( level ) {
        // dumb hack
        if ( this.gotolevel == "gameover" )
        {
            me.state.change( me.state.GAMEOVER );
            return;
        }
        this.parent( level );
        me.state.current().changeLevel( this.gotolevel );
    }
});

var StoryNode = me.InvisibleEntity.extend(
{
    init: function( x, y, settings )
    {
        this.parent( x, y, settings );
        this.text = settings.text;
        this.toggled = false;
    },
    
    checkCollision: function( obj )
    {
        if ( obj == me.game.player && !this.toggled )
        {
            return this.parent( obj );
        }
        return null;
    },
    
    onCollision: function()
    {
        if( ! this.toggled )
        {
            me.state.current().showStoryText( this.text );
            this.toggled = true;
        }
    }
});

var PlayScreen = me.ScreenObject.extend(
{

    init: function () {
        me.entityPool.add("LevelChanger", LevelChanger);
        me.entityPool.add("StoryNode", StoryNode);
        this.levelDisplay = new LevelDisplay();
        this.storyDisplay = new StoryDisplay();
        me.game.lives = 5;
        me.game.letters = 35;
    },

    showStoryText: function( text ) {
        this.storyDisplay.setText( text );
    },

    changeLevel: function( l ) {
        this.levelDisplay.reset();
        var levelNum = this.parseLevel( l );
        if ( levelNum == 1 )
        {
            me.audio.stopTrack();
            me.audio.playTrack( "forest" );
        }
        else if ( levelNum == 2 )
        {
            me.audio.stopTrack();
            me.audio.playTrack( "ice" );
        }

        else if ( levelNum == 3 )
        {
            me.audio.stopTrack();
            me.audio.playTrack( "jungle" );
        }

        else if ( levelNum == 4 )
        {
            me.audio.stopTrack();
            me.audio.playTrack( "witch" );
        }

        else if ( levelNum == 5 )
        {
            me.audio.stopTrack();
            me.audio.playTrack( "horror" );
        }

    },

    getLevel: function() {
        return this.parseLevel( me.levelDirector.getCurrentLevelId() );
    },
    
    parseLevel: function( input )
    {
        var re = /level(\d+)/;
        var results = re.exec( input );
        return results[1];
    },

    onResetEvent: function()
    {
        // stuff to reset on state change
        me.game.addHUD( 0, 0, me.video.getWidth(), me.video.getHeight() );
        me.game.HUD.addItem( "hp", new HPDisplay( 450, 15 ) );



        me.game.HUD.addItem( "letterDisplay", this.letterDisplay );
        me.game.HUD.addItem( "letter_left", this.letter_left );

        me.game.HUD.addItem( "angle_text", this.angleText );
        me.game.HUD.addItem( "not_enougth_letter", this.not_enough_letter );


        this.restartLevel(location.hash.substr(1));
        me.audio.playTrack( "horroable_story" );
    },

    restartLevel: function( level ) {
        this.levelDisplay.reset();
        level = level || me.levelDirector.getCurrentLevelId();
        me.levelDirector.loadLevel( level );
        me.game.sort();
    },

    onDestroyEvent: function()
    {
        me.game.disableHUD();
        me.audio.stopTrack();
    }
});
    }



var vcaboPrinceScreen=me.ScreenObject.extend({
    init: function() {
        this.parent( true );
        this.life = 100;
        this.letterString="";
        this.score=0;
        this.letter_left=-1;
    },

    onResetEvent: function() {
        if( ! this.title ) {
            this.bg= me.loader.getImage("intro_bg");
            this.glasses1 = me.loader.getImage("intro_glasses1"); 
            this.glasses2 = me.loader.getImage("intro_glasses2"); 
            this.glasses3 = me.loader.getImage("intro_glasses3"); 
            this.glasses4 = me.loader.getImage("intro_glasses4"); 
            this.text_vocab = me.loader.getImage("intro_castle"); 
            this.text_vocabPrince = me.loader.getImage("intro_how_to"); 
        }

        me.input.bindKey( me.input.KEY.ENTER, "enter", true );
        me.audio.playTrack( "introBGM" );
    },



    update: function() {
        if( me.input.isKeyPressed('enter')) {
            me.state.change(me.state.MENU);
        }
        if ( this.counter < 350 )
        {
            this.counter++;
        }else{
            me.state.change(me.state.MENU);
        }
        me.game.repaint();
    },

    draw: function(context) {
        context.drawImage( this.bg, 0, 0 );
        if( this.counter < 130) context.drawImage( this.text_mars, 266, 317 );
        else if( this.counter < 135) context.drawImage( this.text_prince2, 224, 317 );
        else if( this.counter < 140) context.drawImage( this.text_prince2, 224, 317 );
        else if( this.counter < 145) context.drawImage( this.text_prince2, 224, 317 );
        else if( this.counter < 150) context.drawImage( this.text_prince1, 224, 317 );
        else if( this.counter < 155) context.drawImage( this.text_prince2, 224, 317 );
        else if( this.counter < 160) context.drawImage( this.text_prince1, 224, 317 );
        else if( this.counter < 165) context.drawImage( this.text_prince2, 224, 317 );
        else context.drawImage( this.text_prince1, 224, 317 );
        
        
        
        
    },

    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.audio.stopTrack();
    }
});


var TitleScreen = me.ScreenObject.extend({
    init: function() {
        this.parent( true );
        this.counter = 480;
        //this.entercount = 0;
    },

    onResetEvent: function() {
        if( ! this.title ) {
            this.prince= me.loader.getImage("prince");
            this.cta = me.loader.getImage("splash_cta");
            //this.title = me.loader.getImage("splash_title");
        }

        me.input.bindKey( me.input.KEY.ENTER, "enter", true );
        me.audio.playTrack( "castle" );
    },

    update: function() {
        if( me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        if ( this.counter > 0 )
        {
            this.counter--;
        }
        if ( this.entercount > 10 )
        {
            this.entercount = 0;
        }
        this.enterCount++;
        me.game.repaint();
    },

    draw: function(context) {
        context.drawImage( this.splash, 0, 0 );
        context.drawImage( this.title, 50, 290 + ( this.counter / 5.85 ) );
        if ( this.counter == 0 && this.entercount < 5 )
        {
            context.drawImage( this.cta, 200, 420 );
        }
    },

    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.audio.stopTrack();
        me.audio.play( "ready" );
    }
});

})
};





var GameOverScreen = me.ScreenObject.extend(
{
    init: function()
    {
        this.parent( true );
    },
    
    onResetEvent: function()
    {
        if ( !this.background )
        {
            this.font = new me.BitmapFont( "32x32_font", 32 );
            this.font.set("center", 1);
            
            this.font2 = new me.BitmapFont( "16x16_font", 16);
            this.font2 .set("center", 1);
            
            this.background = me.loader.getImage( "end_background" );
            this.greet = me.loader.getImage( "greet" );
            this.more_words = me.loader.getImage( "more_words" );
            
        }
        me.audio.playTrack( "winning" );
    },
    
    draw: function( context, x, y )
    {
        context.drawImage( this.background, 0, 0 );
        context.drawImage( me.game.lives >= 0 ? this.great : this.terrible, me.game.lives >= 0 ? 200 : 130, 50 );
        
        var text = new Array();

        if ( me.game.letters == 0 )
        {
            text[0] = "Hm, learn more words maybe?";
            text[1] = "hahaha";
        }
        else if ( me.game.letters < 10 )
        {
            text[0] = "good job on the vocabulary.";
           
        }
        else if ( me.game.letters < 15 )
        {
            text[0] = "really nice, keep on learning";
        }
        
        
        for ( var i = 0; i < text.length; i++ )
        {
            //var string = text[i];
            //console.log( string );
            this.font2.draw( context, text[i], 320, 250 + ( i * 30 ) );
        }
    }
});

window.onReady( function()
{
    jsApp.onload();
});