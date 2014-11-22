WeightWatchers Parser
=====================

A simple script to parse a Weight Watchers XML files of weight history and output a more usable CSV.

Why?
====

When I was last a member of Weight Watchers Online there was no way to export your weight data.  I find this... lacking...

How do I get the XML?
=====================

Run `Fiddler` while loading the Weight Tracker and look for a URL with `WeightWatchers_WeightTracker.xml` in the name.  This is a webservice that returns an XML document with your weight history in it.  Note: this might have changed in the year since I left Weight Watchers.

How do I run the script?
========================

    $ npm install
    $ node app.js --in /path/to/WeightWatchers_WeightTracker.xml --out myweightdata.csv

Is it any good?
===============

Yes!

License
=======

MIT.
