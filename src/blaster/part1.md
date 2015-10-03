---
title: Part One, The Player
date: 2015-09-27 8:20:00
---

First things first: I need a player. [I'm on commit 43f966 here][sha1].

## What Works Right Now

There is a player sprite, a blue square. The blue square can be moved around the game canvas using WASD or by using a gamepad (don't forget to hit a button to enable the gamepad first!).

## What I Skipped

This is around 18 commits into the life of the repository and I've skipped a boatload of setup stuff. I was using [webpack][], now I've switched to [browserify][]. As you can see from the [package.json][pjson] at this commit here is the stack:

  * [Phaser][phaser] the JS game engine I'm using to build it.
  * [browserify][] to bundle up the JavaScript into a single file.
  * [babelify][] to provide ES2015 goodness.
  * [brfs][] to inline text files in my JS bundle (great for shader source!).
  * [wzrd][] as the development server to bundle my stuff on the fly.

I love using `npm` scripts instead of gulp or grunt or what-have-you. The scripts already have `node_modules` on the path and have the full power of shell-scripting at their disposal. When I run `npm start` this runs: `wzrd src/game.js:game.js -p 8080 -- -d`. That gives me a server running locally at port 8080 that will provide a debug bundle of my JS; that means I get [source maps][sourcemaps] and, believe me, you want source maps.

## Important Stuff That Has Shown Up

Yeah, yeah... there are states and sprites and assets and whatever. I think the most important thing in the repo right at this moment is [enableBehaviors][]. Do me a favor and keep a tab with that module open while I refer to it here.

### The `enableBehaviors` Module

I want to be able to describe a behavior for a sprite in a single class, re-use it in multiple sprites, and be able to enable and disable the behavior easily. The first behavior I made for that Metroidvania I'm working on was `StayOnPlatform`, a behavior that applies to nearly every other sprite in the game besides the player. It, you guessed it, keeps the sprite from walking off the platform that it is currently on. As I've fixed bugs in it and refined its performance every sprite that uses it has benefited.

Honestly, in small projects like this I don't expect to see a lot of benefit besides some code organization. That benefit is secondary but very, very helpful.

`enableBehaviors.js` exports a single function, `enableBehaviors`. That method mixes in a prototype into a sprite using `Phaser.Utils.mixinPrototype`. That means that every object instantiated from that class from herein out will have the new methods that I'm mixing in.

Among those methods are `addBehavior` and `behave`. `addBehavior` adds behaviors to a sprite, and we call `behave` from specific methods that we want to expose to a sprite's behaviors.

For instance, here I am adding the behavior framework to the `Player` sprite and then adding the `PlayerMove` behavior to it in its constructor:

```js
enableBehaviors(this);
this.addBehavior(new PlayerMove());
```

And here's what the `Player`'s update method looks like:

```js
update() {
  this.behave('update');
}
```

Every behavior that I add to the player can implement `update` and it will be called because of the call to `this.behave` right there. In this case, `PlayerMove`'s `update` method will be called.

[Here's `PlayerMove`][playermove]. Its two important methods are `added` and `update`.

Every behavior has some lifecycle methods like `added` and `removed`. The behavior can then implement other methods that the sprite exposes. Common ones include `update` and sprite collision handlers. `added` is called when the behavior instance is first added to the sprite. The sprite is passed as the only argument. This allows the behavior to modify the sprite in whatever way it needs to.

For `PlayerMove`, that means adding a maximum velocity and setting the drag on the physics body of the player sprite.

In `update` you can see code that reads the keyboard and gamepad to see if the player is trying to move the sprite.

Kind of verbose, I admit. But imagine later in the game if I were to add an enemy weapon the could disable the player movement. I could do that by setting the `enabled` property of this behavior to false. That switches off the whole behavior all at once. Also, by logically organizing pieces of sprites' behaviors I don't have to go hunting deep into complicated `update` methods to find out how to make something move slower or to turn off player input while a menu is showing.

## What's Next

Shooting! Explosions! And the start of a series of mistakes that won't come back to haunt me until close to the alpha release!

  [sha1]: https://github.com/drhayes/blaster/tree/43f96688225dc80839acc2e507cc5b8d841d1149
  [webpack]: https://webpack.github.io/
  [phaser]: http://phaser.io
  [browserify]: https://github.com/substack/node-browserify
  [pjson]: https://github.com/drhayes/blaster/blob/58be685ae7b03d5fe2dd19a575f4d95d44091f90/package.json
  [babelify]: https://github.com/babel/babelify
  [brfs]: https://github.com/substack/brfs
  [wzrd]: https://github.com/maxogden/wzrd
  [sourcemaps]: http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
  [enableBehaviors]: https://github.com/drhayes/blaster/blob/43f96688225dc80839acc2e507cc5b8d841d1149/src/behaviors/enableBehaviors.js
  [playermove]: https://github.com/drhayes/blaster/blob/43f96688225dc80839acc2e507cc5b8d841d1149/src/behaviors/playerMove.js
