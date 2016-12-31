game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        settings.image = "guy";

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        // walking & jumping speed
        this.body.setVelocity(1.5, 9);
        this.body.setFriction(0.1,0);

        this.dying = false;

        this.mutipleJump = 1;

        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT,     "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X,    "jump", true);
        me.input.bindKey(me.input.KEY.UP,    "jump", true);
        me.input.bindKey(me.input.KEY.DOWN,    "down");
        me.input.bindKey(me.input.KEY.SPACE,    "ok",true);
        me.input.bindKey(me.input.KEY.ENTER,    "ok",true);

        // set a renderable
        // define a basic walking animation
        this.renderable.addAnimation ("walk",  [1,2]);
        this.renderable.addAnimation ("rest",  [0,0,0,6,6,6,6]);
        this.renderable.addAnimation ("jump",  [3,4,5]);
        this.renderable.addAnimation ("blink",  [7,6]);
        // set as default
        this.renderable.setCurrentAnimation("rest");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 1.0);
    },

    /* -----
        update the player pos
    ------            */
    update : function (dt) {

        if (!game.data.dialog) {
          if (me.input.isKeyPressed('left'))    {
              this.body.vel.x -= this.body.accel.x * me.timer.tick;
              if (!this.renderable.isCurrentAnimation("walk") && !this.renderable.isCurrentAnimation("jump")) {
                  this.renderable.setCurrentAnimation("walk");
              }
              this.renderable.flipX(true);
          } else if (me.input.isKeyPressed('right')) {
              this.body.vel.x += this.body.accel.x * me.timer.tick;
              if (!this.renderable.isCurrentAnimation("walk") && !this.renderable.isCurrentAnimation("jump")) {
                  this.renderable.setCurrentAnimation("walk");
              }
              this.renderable.flipX(false);
          }

          if (me.input.isKeyPressed('jump')) {
            this.jumping = true;

            // reset the dblJump flag if off the ground
            this.mutipleJump = (this.body.vel.y === 0)?1:this.mutipleJump;

            if (this.mutipleJump<=2) {
              // easy 'math' for double jump
              this.body.vel.y -= (this.body.maxVel.y * this.mutipleJump++) * me.timer.tick;
              if (!this.renderable.isCurrentAnimation("jump")) {
                this.renderable.setCurrentAnimation("jump","walk");
              }
              me.audio.play("jump", false);
            }
          }
        }

        // clear dialogs
        if (me.input.isKeyPressed('ok')) {
          game.data.dialog = false;
          }

        // check for collision with environment
        this.body.update();

        me.collision.check(this);

        // check if we moved (a "stand" animation would definitely be cleaner)
        if (this.body && this.body.vel.x == 0 && this.body.vel.y == 0) {
            if (!this.renderable.isCurrentAnimation("rest")) {
                this.renderable.setCurrentAnimation("rest");
            }
        }

        this._super(me.Entity, 'update', [dt]);
        return true;

    },


    /**
     * colision handler
     */
    onCollision : function (response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed('down') &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the pltform (pass through)
                    return false;
                }

                if (other.type === "stair") {
                  if ((response.overlapV.x == 0) && (this.pos.y <= response.other.pos.y)) {
                    this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                  }
                }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    // spike or any other fixed danger
                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                    this.hurt();
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        this.hurt();
                    }
                    // Not solid
                    return false;
                }
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
},


 /**
     * ouch
     */
    hurt : function () {
        if (!this.renderable.flickering)
        {
            this.renderable.flicker(750);
            // flash the screen
            me.game.viewport.fadeIn("#FF0000", 100);
            // Play hurt sound
            me.audio.play("die", false);
            // Remove some points
            game.data.score -= 10;
            if (game.data.score < 0) {
              game.data.score = 0;
            }
        }
    }
});

/**
 * a gem (collectable) entiry
 */
game.CoinEntity = me.CollectableEntity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        settings.image = "gem";

        // call the super constructor
        this._super(me.CollectableEntity, 'init', [x, y , settings]);

        // add the coin sprite as renderable
        this.renderable.addAnimation ("beer",  [0,1,2,3]);
        this.renderable.addAnimation ("wine",  [4,5,6,7]);
        this.renderable.addAnimation ("shot",  [8,9,10,11]);
        this.renderable.addAnimation ("cocktail",  [12,13,14,15]);
        this.renderable.addAnimation ("capsule",  [16,17,18,19]);
        this.renderable.addAnimation ("pill",  [20,21,22,23]);
        this.renderable.addAnimation ("coffee",  [24,25,26,27]);

        // set as default
        this.renderable.setCurrentAnimation(settings.type || "beer");

        // set the renderable position to center
        this.anchorPoint.set(0.5, 0.5);
    },

    /**
     * collision handling
     */
    onCollision : function (response) {

        // do something when collide
        me.audio.play("cling", false);
        // give some score
        game.data.score += 10;

        //avoid further collision and delete it
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        me.game.world.removeChild(this);

        return false;
    }
});
