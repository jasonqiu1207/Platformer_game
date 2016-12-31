/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(5, 5));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.score = -1;
        this.life=100;
        this.letter_left=-1;

    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
 
        if (this.letter !== game.data.letter) {
            this.letter+ = game.data.letter+"";
            return true;
        }

       




        return false;
    },

    /**
     * draw the score,life,letter, and letter left
     */
    draw : function (context) {
        // draw it baby !
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            
        }


        if (this.letter !== game.data.letter) {
            this.letter = game.data.letter;
            
        }

         if (this.life !== game.data.life) {
            this.life = game.data.life;
            
        }

        


        return false;

    }

    /*
    update:Dialog:functino(){
        this.super(me.Renderbalbe,"init",[x,y,10,10]);
        this.text="Letters collected"+letter;
    }

    
    */

    game.HUD.DialogBox = me.Renderable.extend( {
    /**
    * constructor
    */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create a font
        this.font = new me.BitmapFont("smallfont", {x:7,y:9});
        this.font.set("left");

        this.text = ""
        this.dialog = me.loader.getImage("dialog");

    },

    wordwrap: function (str, width, brk) {

        brk = brk || '\n';
        width = width || 45;

        if (!str) {
            return str;
        }
        var regex = '.{1,' + width + '}(\\s|$)' + (false ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
        return str.match(RegExp(regex, 'g')).join(brk);

    },


    /**
    * update function
    */
    update : function (dt) {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated

        this.text = game.data.text || "Do you have the necessary English vacobulary skills?"
        if (game.data.dialog) {
            this.pos.y = 161;
        } else {
            this.pos.y = 240;
        }
        return this.isShown;
    },

    /**
    * draw the score
    */
    draw : function (renderer) {
        renderer.drawImage(this.dialog, this.pos.x, this.pos.y);
        this.font.draw (renderer, this.wordwrap(this.text.replace("+","\n")), this.pos.x +20, this.pos.y +16);
    }
});



});
