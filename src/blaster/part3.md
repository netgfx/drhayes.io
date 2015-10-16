---
title: Part Three, Enemies and AI
date: 2015-10-15 22:20:00
---

This is the third part of an extended write-up I'm doing about my [Phaser](http://phaser.io) game, Blaster. [Play Blaster here][playblaster].

[I'm on commit 0d1171.][sha3] It is also tagged as [part3][].

Hang on, because this one has *lots* of code and is thus pretty long. I think it's worth it since the enemy AI is the heart of an action game and very important to get right.

## What Works Right Now

The player spawns in the center of the screen when it dies. There are now *two* kinds of enemies, Guards and Enforcers. And both kinds have distinct behaviors that result in lots of player death.

## What I Skipped

There's a new kind of enemy, called an Enforcer. In groups of more than six they are virtually unbeatable, especially when combined with a bunch of Guards. I'm still populating levels by instantiating enemies by hand.

When an enemy overlaps the player, the player dies in an explosion. Neat!

## Important Stuff That Has Shown Up

Two things: enemy AI and spawning.

### Enemy AI

It's awesome and it kills me a lot in testing. When there are a lot of enemies on the screen I can squint and call this a game. This is a deeply satisfying moment for me. I spend a lot of time reloading the game and practicing against my new bad guys.

#### Guards

Guards have two behaviors, `TiltMove` and `March`. `TiltMove` is the easier one and is present on the Player as well: it sets the angle of the entity proportional to its velocity like so:

```js
update(entity) {
  entity.angle = ANGLE_RATIO * entity.body.velocity.x;
}
```

After some quick fiddling with the `ANGLE_RATIO` coefficient, I got the effect I wanted. Easy-peasy.

`March` is what makes the guards swarm the player until the player is killed. The intent is that the Guard will take a short hop, pause, then hop again. I'm going for an inexorable swarm and I think I've achieved it. Follow along by checking out [March#update][marchupdate].

It looks like a lot of code so let's break it down:

```js
  let player = entity.game.player;
  if (!player || !player.alive) {
    entity.body.velocity.set(0);
    return;
  }
```

If there's no player, stop moving and do nothing else from this method.

```js
  let velX = 0;
  let velY = 0;

  if (this.moveTime <= 0 && this.sleepTime <= 0) {
    this.moveTime = MOVE_TIME_MS + Math.random() * MOVE_TIME_MS;
  }
  this.moveTime -= entity.game.time.physicsElapsedMS;
  this.sleepTime -= entity.game.time.physicsElapsedMS;
```

There are two phases of march movement: moving and sleeping. Moving is the amount of time the Guard will spend moving towards the player. Sleeping is the amount of time the Guard will pause before moving again. If `moveTime` and `sleepTime` are both 0, that means it's time to start moving.

Notice the use of `game.time.physicsElapsedMS`. The frame rate for your game is never steady. When timing something you have to take into account how much time has passed since the last frame. Phaser stores that value in `game.time.physicsElapsedMS` (and its seconds-based sibling `game.time.physicsElapsed`).

```js
  if (this.moveTime > 0) {
    this.sleepTime = SLEEP_TIME_MS + Math.random() * SLEEP_TIME_MS;
    if (!Phaser.Math.fuzzyEqual(player.y, entity.y, EPSILON)) {
      if (player.y < entity.y) {
        velY = -MAX_VEL;
      } else {
        velY = MAX_VEL;
      }
    }
    if (!Phaser.Math.fuzzyEqual(player.x, entity.x, EPSILON)) {
      if (player.x < entity.x) {
        velX = -MAX_VEL;
      } else {
        velX = MAX_VEL;
      }
    }
  }
```

If the `moveTime` is positive then it's time to move! Remember, we're decrementing the `moveTime` every pass through this method. This provides a timer on how long the Guard is going to move.

I set the `sleepTime` while the guard is moving. And, yes, it's getting set every run through this loop because, in the end, it costs almost nothing. I want the `sleepTime` to be kind of random. Like so many other places in this codebase I vary the value by a random factor. If I didn't then all the Guards would move and sleep the same amount of time; I experimented with that and it did not look good.

Next we move towards the player, both in Y and in X, by setting some velocity values. If we're above the player, move down. If we're below the player, move up. Similarly for left and right.

Notice the use of `Phaser.Math.fuzzyEqual`. If this weren't there then the guards "bounce" when they get close to the player as they move first in one direction then the other very quickly. Not desirable.

I'm a huge fan of [Phaser.Math][phasermath]. All those utility methods mean you don't have to write them yourself. They're also a pleasant read when looking at the source code.

Finally, we close out `update` with these:

```js
  if (this.sleepTime > 0) {
    // entity.body.velocity.set(0);
  }
  entity.body.velocity.x = velX;
  entity.body.velocity.y = velY;
```

Originally I was going to stop the Guards in their tracks when asleep, but I found the slight friction-y glide to a standstill was much more pleasant.

#### Enforcers

Enforcers have three behaviors: `TwirlMove`, `OrbitPlayer`, and `ShootPlayer`.

`TwirlMove` is a pretty thing where the Enforcers rotate with a speed proportional to the maximum of their velocity in X or Y:

```js
let rotationFactor = 0.1;
if (entity.body.velocity.x || entity.body.velocity.y) {
  let maxVel = Math.max(Math.abs(entity.body.velocity.x), Math.abs(entity.body.velocity.y));
  rotationFactor *= maxVel / 20;
}
rotationFactor = Math.max(rotationFactor, 0.1);
entity.angle += rotationFactor * entity.game.time.physicsElapsedMS;
```

Again, crucially, I'm multiplying the `rotationFactor` by `game.time.physicsElapsedMS`. Just like the sleep and move times of the Guard, I want the rotation to be smooth under a varying frame rate.

Check out [OrbitPlayer#update][orbitupdate]. When I first started working on it I wanted the Enforcers to, literally, orbit the player in an ellipse and adjust for player movements. I spent a bit of time trying to get that right before realizing that accelerating towards the player's position would be good enough since the acceleration would swing the Enforcer around in a vaguely elliptical path anyway. No tricks here, just good ol' physics.

And now we've arrived at [ShootPlayer#update][shootplayerupdate]. There's some subtlety here so I'll break this one down line-by-line.

```js
if (!entity.alive) {
  return;
}
this.shootTimer -= entity.game.time.physicsElapsedMS;
let player = entity.game.player;
if (!player || !player.alive) {
  this.shootTimer = SHOOT_TIMER_MS;
  return;
}
```

I love timers. I love timers so much. The Enforcer shoots on a timer. The Enforcer does not shoot if there's nothing to shoot because the player is dead.

```js
if (this.shootTimer <= 0) {
  this.shootTimer = SHOOT_TIMER_MS;
  // First shot.
  this.angleForShoot.set(player.x - entity.x, player.y - entity.y);
  Phaser.Point.normalize(this.angleForShoot, this.angleForShoot);
  entity.game.shooting.enforcerShoot(entity.x, entity.y, this.angleForShoot.x, this.angleForShoot.y);
  // Second shot.
  entity.game.time.events.add(SECOND_SHOT_DELAY, () => {
    this.angleForShoot.set(player.x - entity.x + player.body.velocity.x, player.y - entity.y + player.body.velocity.y);
    Phaser.Point.normalize(this.angleForShoot, this.angleForShoot);
    entity.game.shooting.enforcerShoot(entity.x, entity.y, this.angleForShoot.x, this.angleForShoot.y);
  });
}
```

The Enforcer takes two shots: one at the player's current position, and another a little bit later at where the player is going to be based on their current velocity.

Honestly, I lucked out here: the second shot's delay and velocity, combined with the player's maximum velocity, means the Enforcer's score direct hits with the second bullet *all the time* if the player travels in straight lines and doesn't dodge. Combining a lot of Enforcers together makes things pretty deadly.

Note that I'm not using `Phaser.Point.normalize` correctly here: I should be calling `this.angleForShoot`'s method instead of the static version. Oops. ¯\\\_(ツ)\_/¯

### Spawn

Not as obviously awesome as the enemy AI, but key. Here's the most important code from `spawn.js`:

```js
startSpawn() {
  this.spawnEvent = null;
  this.spawning = true;
  this.playerImage.angle = 0;
  this.playerImage.alpha = 0;
  this.playerImage.visible = true;
  this.playerImage.scale.set(3);
  this.game.add.tween(this.playerImage).to({
    angle: 360,
    alpha: 1
  }, SPAWN_DURATION_MS, Phaser.Easing.Quadratic.Out, true)
    .onComplete.add(this.spawn, this);
  this.game.add.tween(this.playerImage.scale).to({
    x: 1,
    y: 1
  }, SPAWN_DURATION_MS, Phaser.Easing.Quadratic.Out, true);
  this.game.time.events.add(SPAWN_DURATION_MS - SPAWN_SOUND_DURATION_MS, () => {
    this.spawnSound.play();
  })
}
```

The player doesn't just **start** in the center of the screen. The player slowly fades in with a little twirl thanks to a tween. That gives the player a chance to prepare before being hit with a bunch of enemies.

## Let's Review

### Now

Enemies that go after the player and *really* kill it! Shooting and spawning!

At this point I was sitting people down in front of the game and watching them die a lot. Too much, in fact. I'd wanted the game to be hard (it *was* inspired by Robotron: 2084 after all), but it was brutal and not fun. I didn't need it to be super fun, but it was heading towards super UN-fun. Not good.

### Next

Assassins! Lives! Score! All the things a little game needs to be a grown-up. Stay tuned.

  [playblaster]: http://blaster.drhayes.io
  [sha3]: https://github.com/drhayes/blaster/commit/0d11712c2a771d19c538eba79518b1738d179941
  [part3]: https://github.com/drhayes/blaster/tree/part3
  [marchupdate]: https://github.com/drhayes/blaster/blob/0d11712c2a771d19c538eba79518b1738d179941/src/behaviors/march.js#L23
  [phasermath]: http://phaser.io/docs/2.4.3/Phaser.Math.html
  [orbitupdate]: https://github.com/drhayes/blaster/blob/0d11712c2a771d19c538eba79518b1738d179941/src/behaviors/orbitPlayer.js#L12
  [shootplayerupdate]: https://github.com/drhayes/blaster/blob/0d11712c2a771d19c538eba79518b1738d179941/src/behaviors/shootPlayer.js#L16
