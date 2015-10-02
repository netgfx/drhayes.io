---
title: Part Two, Shooting and Explosions
---

This is the first really cool part, where things start blowing up. [I'm on commit df45ad.][sha2]

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

### `Shooting`

  [sha2]: https://github.com/drhayes/blaster/tree/df45ada58cc9431b4ce4008d63fb4f87fd43cb1d/src
  [soundofbullets]: https://github.com/drhayes/blaster/tree/5dd40d31453fe65c6f0e6756f3c29adb6ccb1ce9
  [Divshot]: https://divshot.com/
