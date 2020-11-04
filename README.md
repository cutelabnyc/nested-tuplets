# NESTUP, the Nested Tuplet Generator

It's NESTUP! The domain specific language for describing and generating nested tuplets, just like you've always wanted.

## Getting set up

This library uses `yarn` as opposed to `npm`, so before you can do anything else you'll need `yarn` installed on your system. From there simply run

```sh
yarn install
```

to get the repo all set up.

## Generating rhythms

The NESTUP language is simple in that it ignores many of the conventions used to describe rhythmic subdivision and tuplets in "western" music notation. That is, NESTUP doesn't care if you are in compound or simple meter, or whether the tuplet is described in sixteenth notes or eighth notes. A musician writing in NESTUP simply describes the numbers of events (musical notes or rhythmic attacks) that should occur in a given period of time.

![5 against 4 eighth notes, followed by two quarter notes](ex-5-4.png "Figure 1")

In the above figure, we see a measure of common time, where the first two beats of the measure contain 5 eighth notes in the space of 4 eighth notes, and the second half of the measure contains a quarter note on each beat.

There are actually a number of ways this rhythm could be rendered in NESTUP, depending on the user's preference. A simple way to write this rhythm could be:

```sh
{4
    (1, 2){5}
}
```
