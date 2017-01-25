---
title: Map Entity Loader
date: 2016-10-03 14:28
---

This post describes a neat system for generating unique IDs in Tiled JSON maps using a custom webpack loader. Whew, that's a mouthful.

[Here's the code for the loader in its current form.][gist]

I had a problem: I needed a way for the player to save their progress, which meant that I had to deterministically track every entity in my game that the player could interact with. I'm a programmer, though, which means I'm really lazy, so I didn't want to hand-generate each of those IDs manually. I was already using [webpack][] and I figured that I could write a [custom loader][custom-loader] that would decorate my maps with these IDs for me.

The save system uses these IDs to store whatever state those entities need in persistent storage. While testing, that's `localStorage`. Once my game is released that could be in a file on disk.

## Requirements

Here are the requirements:

  * I haven't released the game yet. When I do, I need to be able to edit the maps and not break all the existing saved games out there. Hence my algorithm had to be **deterministic**. No random IDs, here.
  * I'm working with [Tiled][tiled] so my custom loader had to handle Tiled maps with multiple layers.
  * I wanted the IDs to be opaque to a cursory examination.

The game's not even in beta yet, so I don't mind making changes to this algorithm yet. So far I haven't had to.

## The Algorithm

[Here's the code for the loader.][gist] It takes the map filename, the layer name, the object type, and the object's index in layer and constructs a string by concatenating those values together separated by a vertical pipe, `|`. The resultant string is then converted to base64 and re-assigned to the object's `properties` property as `id`.

The map filename is self-explanatory.

The layer name is the `objectgroup` where this entity is located. Typically, that's `entities` in my maps. It can also be `switches`. There are all kinds of layer names in my maps but most active things that need to save their states are in one of those three layers.

If I need to remove an entity in the future I can give it a sentinel flag, like `removed`. Then my game can simply refuse to load it while maintaining the IDs of every existing entity. That way the object index for subsequent objects doesn't change.

The object type is kinda like the class name: Beetle, or Walker.

### Example

Here's an ID I pulled from a map in my game: `cnVpbnMzTWFzay5qc29ufGVudGl0aWVzfG1hc2t8MA==`.

Converted from base64 that's `ruins3Mask.json|entities|mask|0`. Thus, this is the ID of an object of type `mask` in index position 0. It's in the `entities` layer of the map named `ruins3Mask.json`.


  [gist]: https://gist.github.com/drhayes/5e492f1966b9630a08fd3ef6cdea3e52
  [webpack]: https://webpack.github.io/
  [custom-loader]: http://webpack.github.io/docs/how-to-write-a-loader.html
  [tiled]: http://www.mapeditor.org
