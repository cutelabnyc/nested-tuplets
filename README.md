# NESTUP, the Nested Tuplet Generator

It's NESTUP! The domain specific language for describing and generating nested tuplets, just like you've always wanted.

## Getting set up

This library uses `yarn` as opposed to `npm`, so before you can do anything else you'll need `yarn` installed on your system. From there simply run

```sh
yarn install
```

to get the repo all set up.

## Why NESTUP?
1. tigran, carnatic rhythm, this is hard to do in a DAW or engraving software, hard to express, even harder to program in a DAW
2. DAWs are built to facilitate certian kinds of common rhythmic subdivision: mostly duple (splitting in halfs) and triple (splitting into thirds). For what is sometimes reffered to as "irregular" division, division of a beat into some number of subdivisions or tuplets 
3. sometimes with a further, nested, subdivision or *tuplet*, no simple solution currently exists. 
4. [fragmentary rhythms](https://www.markdownguide.org/basic-syntax) without changing tempo and loops composed of such rhythms have heretofore been impossible 

## Generating rhythms

NESTUP is a language for describing how time should be divided. Music notation, and in particular "western" music notation, has its own conventions for describing rhythmic subdivion. 

The NESTUP language is simple in that it ignores many of these conventions. That is, NESTUP doesn't care if you are in compound or simple meter, or whether the tuplet is described in sixteenth notes or eighth notes. A musician writing in NESTUP simply describes when events (such as musical notes or rhythmic attacks) occur in a given period of time.

![5 against 4 eighth notes, followed by two quarter notes](img/ex-5-4.png "Figure 1")

*Figure 1*

In the above figure, we see a measure of common time, where the first two beats of the measure contain 5 eighth notes in the space of 4 eighth notes, and the second half of the measure contains a quarter note on each beat.

This could be rendered in multiple ways in NESTUP, depending on the user's preference. One rendering of this rhythm could be:

```
{4
    (1, 2){5}
}
```
Another way to write it could be:

```
{2
    (1, 1){5}
    (2, 1){2}
}
```
How are these two examples equivalent? Well, let's look at how NESTUP works.

## How NESTUP Works

1. You specify a number of events using curly braces `{}`, so in our first example, we start by describing four events with `{4}`.

2. To describe a further level of rhythmic subdivision, you use parentheses `()`, wherein you identify:
- where, within the previously described events, this further level of rhythmic subdivision is to take place, and
- the duration of the new rhythmic subdivision, described in terms of number of events in the preceding rhythmic level over which the new rhythmic subdivision should extend.

3. So in the initial example, `(1, 2)` describes that from the **first** event of the four events described by `{4}`, and lasting for the length of **two** of those events, there should be some number of events. How many events? The first example specifies `{5}`.

This gives us the rhythm from Figure 1: four events, where the first two events have been split equally into five events.

If we wrote this rhythm using the second NESTUP code example, we've simply described this rhythm slightly differently. The example begins by describing *two* ...

### The Simplest NESTUP Expression

<<<<<<< Updated upstream
This gives us the rhythm from figure 1:
=======
```
{3}
```
```
[10,1]
```
>>>>>>> Stashed changes
