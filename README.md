# Nestup, the Nested Tuplet Generator

It's Nestup! The domain specific language for describing and generating nested tuplets, just like you've always wanted. It also can divide anything that has dimension.

## Getting set up

This library uses `yarn` as opposed to `npm`, so before you can do anything else you'll need `yarn` installed on your system. From there simply run

```sh
yarn install
```

to get the repo all set up.

## Why Nestup?
1. *tigran, carnatic rhythm, this is hard to do in a DAW or engraving software, hard to express, even harder to program in a DAW*
2. DAWs are built to facilitate certian kinds of common rhythmic subdivision: mostly duple (splitting in halfs) and triple (splitting into thirds). For what is sometimes reffered to as "irregular" division, division of a beat into some number of subdivisions or tuplets 
3. sometimes with a further, nested, subdivision or *tuplet*, no simple solution currently exists. 
4. [fragmentary rhythms](https://www.instagram.com/p/CFxKMSMAS22/?utm_source=ig_web_copy_link) without changing tempo and loops composed of such rhythms have heretofore been impossible 

## Generating rhythms

In Nestup, we describe containers which are divided into parts. For the purposes of this documentation, where we are talking about music, those containers are generally periods of time, and those parts are generally experienced as events in time.

Music notation, and in particular "western" music notation, has its own conventions for describing the rhythmic subdivion of events in time.

The Nestup language is simple in that it ignores many of these conventions. That is, Nestup doesn't care if you are in compound or simple meter, or whether the tuplet is described in sixteenth notes or eighth notes. A musician writing in Nestup simply describes when events (such as musical notes or rhythmic attacks) occur in a given period of time.

![5 against 4 eighth notes, followed by two quarter notes](img/ex-5-4.png "Figure 1")

*Figure 1*

In the above figure, we see a measure of common time, where the first two beats of the measure contain 5 eighth notes in the space of 4 eighth notes, and the second half of the measure contains a quarter note on each beat.

This could be rendered in multiple ways in Nestup, depending on the user's preference. One rendering of this rhythm could be:

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
How are these two examples equivalent? Well, let's look at how Nestup works.

## How Nestup Works

1. You specify a number of subdivisions using the **subdivider** `{}`, so in our first example, we start by describing four subdivisions of our period of time, our **container**, with `{4}`.

2. To describe a further level of rhythmic subdivision, you use a **range** `(x, y)`, wherein you identify:
- x: the **range start** where, within the previously described subdivisions, this further level of rhythmic subdivision is to take place, and
- y: the **range length**, the duration of the new rhythmic subdivision, in terms of a number of subdivisions in the preceding rhythmic level.

3. So, in the initial example, `(1, 2)` describes that from the **first** event of the four events described by `{4}`, and lasting for the length of **two** of those events, there should be some number of events. How many events? The first example specifies `{5}`.

This gives us the rhythm from Figure 1: four events, where the first two events have been split equally into five events.

If we wrote this rhythm using the second Nestup code example, we've simply described this rhythm slightly differently. The example begins by subdividing the period of time into *two* events, the first being subdivided into five subdivisions `{5}` that take up the entire space of the first event, as described by `(1, 1)`, and the second being subdivided into two subdivisions: `(2, 1) {2}`.



## The Simplest Nestup Expression

We can now take a step back and describe the Nestup language systematically, starting from its most simple expression.

### The Subdivider

```
{3}
```
A non-zero whole number wrapped in curly braces describes that number of events evenly spaced inside of a container. The above example, `{3}` might be rendered in conventional western musical notation as:

![a half-note triplet](img/ex-3.png "Figure 2")

*Figure 2*

In the same way, `{1}` gives us:

![a whole note](img/ex-1.png "Figure 3")

*Figure 3*

And `{13}` gives us:

![a 13-let](img/ex-13.png "Figure 4")

*Figure 4*

[^1]: Humphries, Carl. 2002. The Piano Handbook. San Francisco, CA: Backbeat Books; London: Hi Marketing. ISBN 0-87930-727-7.

## A nested tuplet
If we want to place an evenly-spaced rhythm somewhere within another rhythm composed of evenly-spaced events, we are essentially nesting a tuplet 

Sam's nesting language:

Once you’ve subdivided a container, you can place more containers within those subdivisions. To place one of these ranged containers, you first specify a range, followed by the container. For example, to place the container [ [2] [1] ] on the first beat of a container subdivided into 3 parts, you would write {3 (1) [ [2] [1]] }

You can stretch that subcontainer across multiple subdivions as well by adding a length to the range expression. For example {3 (1, 2) [ [2] [1] ]} would stretch the container across two subdivisions.