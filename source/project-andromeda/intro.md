title: Introduction
layout: andromeda
date: 2015-01-06
---

I've recently become interested in doing some hardware hacking and I've been
looking for a more meaningful project than "make those LEDs blink". This is part
of my in-built engineer drive to make everything more complicated. I'd argue,
though, that it makes the projects more *significant*, as well. I'm more likely
to work on something that's meaningful to me. So I started casting around for
meaningful projects that I could take my time on that would teach me a lot.

Then it hit me: my son loves to drive our car.

I always sit in there with him and turn on the engine so it's easier
for him to turn the wheel and see dashboard lights when he pushes buttons. He's
reaching an age where he appreciates how much of an effect he can have on the
world and I love enabling that whenever I can. It's fun to watch his face as
the wipers swish, the emergency flashers go off, and **oh God don't let him
shift into reverse--**. Anyhoo.

However, I don't like that it uses gas and, y'know, for heaven's sake, he's
sitting in our car with the engine running pushing random buttons. That's not
so great.

Enter...

<h2 class="andromeda-header">Project Andromeda</h2>

*Project Andromeda* is my codename for the spaceship console I'm going to build
for my son. [Here's the GitHub repo][repo].

  [repo]: https://github.com/drhayes/andromeda

The basic idea is a two foot by two foot panel with a centrally mounted
steering wheel. Surrounding the steering wheel are various buttons, switches,
knobs, digital displays, and LEDs with interesting, not random but slightly
arbitrary interactions. I'd like my son to be able to sit in front of it
to manipulate everything.

Initial Limited Parts List
--------------------------

  * [A Tessel microcontroller][tessel]. JavaScript programmable and easy to
    use. I prefer this over an Arduino because I know JS better than
    the Arduino language and because it's hard to beat `npm`'s breadth
    of library functions.
  * [This steering wheel][steeringwheel]. Found on Amazon, it's about the right
    size and heft. My plan is to bolt it in the center and let it spin free with
    no associated electronics.
  * [This big red button][bigredbutton]. At 100mm it's pretty big but oh so
    worth it. Exactly the feel I'm going for.
  * [Many of these "workhorse" buttons][workhorsebutton]. I call this the
    "workhorse" button because I'm planning on using a bunch of them across
    the main panel. These have a *very* satisfying click action and have a LED
    that is independent of the button action.
  * [Some of these buttons][smallbluelatch]. Same as above: nice clicking action
    with a LED in the middle.
  * [A decade counter][decade]. Why not? I'm *probably* not going to actually
    hook this one up as it requires a (for me) prohibitive amount of soldering.
  * [A 7-segment display or two][7segment]. What spaceship console wouldn't have
    a digital readout? Not this one.

  [tessel]: http://tessel.io
  [steeringwheel]: http://www.amazon.com/gp/product/B005FMT2RA/ref=oh_aui_detailpage_o05_s00?ie=UTF8&psc=1
  [bigredbutton]: https://www.sparkfun.com/products/9181
  [workhorsebutton]: https://www.adafruit.com/products/491
  [smallbluelatch]: https://www.adafruit.com/products/1476
  [decade]: https://www.adafruit.com/product/1082
  [7segment]: https://www.adafruit.com/products/881

Further Updates
---------------

I'll periodically update my progress here with big write-ups with lessons
learned, pictures, videos, etc. The more up-to-the-moment mini-updates will
be on [my Tumblr][tumlbr].

  [tumlbr]: http://drhayes.tumblr.com/tagged/projectandromeda
