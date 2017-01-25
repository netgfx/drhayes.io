---
title: Save System
date: 2017-01-19 16:19
draft: true
---

I'm going to describe how the Secret Game loads and saves player progress.

This post relies heavily on concepts and code from the [map entity loader article earlier][mapEntityLoader]. You should check that out first since a lot of what I discuss here won't make sense without all that stuff.

Now that everything in my level files had a unique ID, I could reference that ID when storing information about that thing. If I could store information about a thing in my game in a JavaScript object, then I could later store it somewhere and get save/restore functionality in my game. Additionally, if I implemented it right, I could get checkpointing in my game.

Is this changing?

  [mapEntityLoader]: /secret-game/map-entity-loader.html