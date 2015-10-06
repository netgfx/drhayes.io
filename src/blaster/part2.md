---
title: Part Two, Shooting and Explosions
date: 2015-10-05 13:00:00
---

This is the second part of an extended write-up I'm doing about my [Phaser](http://phaser.io) game, Blaster. [Play Blaster here][playblaster].

This is the first really cool part, where things start blowing up. [I'm on commit cd81d9.][sha2] It is also tagged as [part2][].

## What Works Right Now

The player sprite can shoot using the gamepad or IJKL. There's an enemy on the field, a Guard. The bullets shoot fast and furious, and there's sound when they do. The yellow diamonds of various sizes show up on bullet impact.

## What I Skipped

Sounds when the player shoots (that includes a commit called [THE SOUND OF BULLETS IS AWESOME][soundofbullets]). Automated deployment to [Divshot][divshot]. The Guard sprite, itself.

Two things of note: I have a one line deployment now courtesy of `npm` and I factored out the behavior `TiltMove`.

When I type `npm run deploy` my project rebuilds from scratch and pushes out to the world. That command is an alias for:

```bash
rm -rf dist && mkdir -p dist/vendor
cp index.html dist && cp vendor/phaser.min.js dist/vendor && browserify src/game.js -o dist/game.js && cp -R media dist/media && divshot push
```

The first lines technically runs as `predeploy`. This makes iteration very, very fast and lets me push out bug fixes and adjustments with no thought. Sure, I could've fired up some GUI to SFTP the files somewhere by hand every time but this tiny piece of automation took about five minutes and has saved me tons of time. As much time as, of this writing, about forty by-hand deployments.

`TiltMove` is the behavior that sets an entity's angle proportionate to its X velocity. Both the player and the guard have it. Little touches like that make the game feel more responsive and alive.

## Important Stuff That Has Shown Up

Most important is the first big architectural mistake that won't bite me in the ass until I start seriously using states and restarting the game: namely, using plugins.

Plugins are a great mechanism that I did not fully understand the implications of until much later in the project. Not the biggest deal, but my first in-public mistake. I thought I should call it out in big letters.

The first two plugins are `Shooting` and `Explosions`. They are each responsible for what you think they are responsible for. The architectural mistake is that I kept making plugins out of things that were very state dependent, like player spawning and wave generation. But that's for a later writeup.

### Shooting

The game *is* called "Blaster", after all. Shooting is the fundamental verb of the game, the only way the player has to interact with every other object they can see. It deserves a lot of attention and a lot of polish.

Beyond the simple "press a key and fire some bullets" interactions there were other knobs to adjust when it came to how shooting "felt". I fiddled with lots of different elements:

  * The number of bullets.
  * How long one bullet lasted before getting `kill`ed.
  * The angle of the bullets when fired.
  * Their impact upon enemies.
  * What shooting sounded like.
  * How many hits did it take to kill a single enemy.

All of these work together to create an experience in the players' head that is core to playing this game.

The relevant classes are the `Shooting` plugin itself, the behavior `PlayerShoot`, and the `Bullet` sprite.

#### When Bullets Are Fired

A single bullet lasts for 1000ms and travels at 1000 pixels per second. Bullets also rotate to face the direction they were fired in. That seems like a tiny detail since the sprite is only 4px long but, believe me, you can tell when they don't.

[Bullets waver as they are fired][waver]. That spread makes the bullets feel more organic *and* helps the player hit things on the side they're shooting at. Only computers use completely straight lines.

The `SOUND_DELAY` constant in the `Shooting` plugin prevents the shooting sound from playing as fast as possible while the player is shooting. Without it, the sound would be muddy and would lose its characteristic "whump" sound. The sound delay varies from 0 to 10ms per play randomly to make a nice texture.

#### When Bullets Hit

[First, there is a small explosion][bulletexplosion]. Then the enemy that was hit is [knocked back][knockback] by an amount proportional to the amount of overlap from the collision. This is a semi-random amount that will vary per bullet and, again, gives a nice organic feel to the process.

### Explosions

There are three different kinds of [explosions][]: bits, small, and medium. Each one is a [Phaser.Emitter][emitter] that is positioned as needed to represent an explosion. Bits are the same size as bullets. Smalls are small diamonds that scale down to half size over the life of the particle. Mediums scale upwards and use the same sprite as the player and guards (very handy for showing the player dying).

Medium explosions are what I use when sprites die, either the player or the guard. I had plans to modify the medium explosion based on what was dying but, after playing the game a lot, I don't think having different explody shapes would make the game better.

Small explosions are used when the player's bullets strike an enemy. Thus, the same audio delay thing happens here with small explosions as with the bullet sounds from the player: there's a delay between when each sound would play so they don't overlap.

## Let's Review

### Now

The architectural framework of the game is in place and will only have one large change before release. There is an enemy that can be destroyed. There are sounds.

At this stage I was showing it to people who thought it looked neat and "like a real game". That kind of quick feedback and support is very important!

### Next

More enemies! Enemy AI! Player spawning! Stay tuned.

  [playblaster]: http://blaster.drhayes.io
  [sha2]: https://github.com/drhayes/blaster/tree/cd81d97dc42ccb94542677065ef96578c5d21836
  [part2]: https://github.com/drhayes/blaster/tree/part2
  [soundofbullets]: https://github.com/drhayes/blaster/tree/5dd40d31453fe65c6f0e6756f3c29adb6ccb1ce9
  [Divshot]: https://divshot.com/
  [waver]: https://github.com/drhayes/blaster/blob/cd81d97dc42ccb94542677065ef96578c5d21836/src/behaviors/playerShoot.js#L57
  [bulletexplosion]: https://github.com/drhayes/blaster/blob/cd81d97dc42ccb94542677065ef96578c5d21836/src/plugins/shooting.js#L43
  [knockback]: https://github.com/drhayes/blaster/blob/cd81d97dc42ccb94542677065ef96578c5d21836/src/plugins/shooting.js#L44
  [emitter]: http://phaser.io/docs/2.4.3/Phaser.Particles.Arcade.Emitter.html
  [explosions]: https://github.com/drhayes/blaster/blob/cd81d97dc42ccb94542677065ef96578c5d21836/src/plugins/explosions.js
