# Nestup, the Nested Tuplet Generator [[]_[]]

It's Nestup! The domain specific language for describing and generating nested tuplets, just like you've always wanted. It also can divide anything that has dimension.

## Cheat Sheet

| Nestup_example_expression     | Description | Piano_roll |
| ----------- | ----------- | ----------- |
| `[4]`      | One event, 4 beats long | ![](./img/cheat-01.png)
| `[[2] [2]]`   | Two events, each 2 beats long | ![](./img/cheat-02.png)
| `[3 [2] [3]]` | Two events, squeezed into 3 beats. The first will have length `2/5` of 3 beats, and the second will have length `3/5` of 3 beats. | ![](./img/cheat-03.png)
|`[[] []] [2, 3/7 [] []]`|Four events, with the second two events scaled at a ratio of `3:7` to the first two. |![](./img/cheat-scale2.png)
| `[4] {3}` | Three events, evenly spaced over 4 beats (aka a triplet over 4 beats) | ![](./img/cheat-04.png)
| `[4] {3} [4] {5}` | A 3:4 triplet followed by a 5:4 quintuplet | ![](./img/cheat-05.png)
| `[4] {3 2 {3} }` | A triplet, where the second event has been itself subdivided into a triplet. A total of 5 note events | ![](./img/cheat-06.png)
| `[4] {3 2:2 {5} }` | A triplet, where the second and third beat have been replaced with a quintuplet over that same time. A total of 6 events | ![](./img/cheat-07.png) |
| `[4 [1] ['] [1]]` | Three equally long notes in the space of 4 beats (aka a triplet), where the second note is a rest | ![](./img/cheat-08.png) |
| `[4 [1] [1] _ [1] [1]]` | Four notes in the space of four beats, The second note is tied to the third. | ![](./img/cheat-09.png) |
| `[4 {5 2 [] _ 3 [] }]` | Five notes in the space of four beats, where the second note is tied to the third. | ![](./img/cheat-10.png) |
| `[3] {3 > 1/2}` | Three notes in the space of three beats, offset by half a beat. | ![](./img/cheat-11.png) |
| `['4] [2]` | An empty container, four beats long, followed by a note two beats long. | ![](./img/cheat-12.png) |

## Getting set up

This library uses `yarn` as opposed to `npm`, so before you can do anything else you'll need `yarn` installed on your system. From there simply run

```sh
yarn install
```

to get the repo all set up.

## Why Nestup?

Most DAWs and other music software are designed to facilitate creating music with rhythmic subdivisions that divide in twos and into threes. However, there are many types of music in the world, such as tabla rhythms from Indian classical music, rhythms by musicians such as Tigran Hamasyan, drawing from Armenian folk traditions, or the nested tuplets common to "New Complexity" composers like Brian Ferneyhough, that do not divide solely into twos and threes. Most of these rhythms are rather difficult, or at least tedious, to program in any DAW.

![nested quintuplet](img/nested-tup-ex.png "Figure 1")

With Nestup, programming such a rhythm can be quite easy:
```
[2]{5
  4:2 {3}
}
```
![nested quintuplet](img/nested-tup-ex2.png "Figure 2")

In addition, DAWs that employ looping clips, for example Ableton Live or Logic Pro, facilitate the creation of clips that are defined by a number of 16th note subdivisions, making a looping clip of a "[fragmentary rhythm](https://www.instagram.com/p/CFxKMSMAS22/?utm_source=ig_web_copy_link)" very difficult to create.

Nestup is designed to be a simple and expressive solution for these and other rhythmic needs.

## Dividing Containers

In Nestup, we describe containers which are divided into parts. For the purposes of this documentation, where we are talking about music, those containers are generally periods of time, and those parts are generally experienced as events in time.

Music notation, and in particular "western" music notation, has its own conventions for describing the rhythmic subdivion of events in time.

The Nestup language is simple in that it ignores many of these conventions. That is, Nestup doesn't care if you are in compound or simple meter, or whether the tuplet is described in sixteenth notes or eighth notes. A musician writing in Nestup simply describes when events (such as musical notes or rhythmic attacks) occur in a given period of time.

![5 against 4 eighth notes, followed by two quarter notes](img/ex-5-4.png "Figure 3")

In the above figure, we see a measure of common time, where the first two beats of the measure contain 5 eighth notes in the space of 4 eighth notes, and the second half of the measure contains a quarter note on each beat.

This could be rendered in multiple ways in Nestup, depending on the user's preference. One rendering of this rhythm could be:
```
[4
    [] {5}
    [] {2}
]
```
Another way to write it could be:

```
[4] {4
      1:2 [] {5}
}
```

Nestup doesn't have an explicit notion of beats or time signatures, it simply divides containers (of time) and generates events. So, Nestup could render this rhythm in at least these two ways. Let's take a closer look at what these examples are doing.

## What These Examples Are Doing

1. Here, we specify a **container** `[]`, with a **size** of 4, with `[4]`.

2. A container can contain child containers—in our first example, our container contains two containers, `[]` and `[]`, of equal size.

3. A container can be subvidided equally using the **subdivider** `{}`. In our first example, the first child container is subdivided into 5 subdivisions with `{5}`, and the second child is subdivided into 2 with `{2}`.

In our second example, we describe the rhythm a little differently.

1. We start, as in the first example, by specifying a container of size 4 with `[4]`.

2. This container is subdivided into 4 subdivisions with `{4}`.

3. A child container can be placed within those subdivisions, by specifying that container's **range**—where it should start, and how long it should continue. In the second example, the ranged container is placed on the first subdivision, stretched across two subdivisions, with `1:2 []`.

4. Finally, that ranged container is subdivided into 5 subdivisions with `{5}`.

Both of these examples gives us the rhythm from Figure 1: five evenly spaced events followed by two evenly spaced events that take up the same amount of time as the first five.


## How Nestup Works

We can now take a step back and describe the Nestup language systematically, starting from its most simple expression.

### The Container

```
[]
```
The **container,** specified by the square brackets `[]`, defines a period of time, for example, a beat or a measure. If you are using Nestup to generate musical rhythms in a DAW like Ableton Live, the simple expression `[]` will generate one note spanning one beat in the DAW's global time signature. This is because every container has a **size**, which is by default 1. If you wanted your container to be 4 beats long, like a whole note in a 4/4 time signature, you would define the container size with `[4]`. *The container size can be any positive integer.*

Our `[4]` gives us a rhythm like:

![a whole note](img/ex-1.png "Figure 2") or, in the piano roll, ![a whole note in piano roll](img/pno-roll-1.png "Figure 4") 

#### Flexible Container
A container can be divided into child containers, for example, `[[2] [2]]` will divide the container into two. Those child containers have a size of 2, and since the parent container has been given no explicit size, it is **flexible**, and inherits its size from the sum of its children's sizes—in this case, a size of 4. 

![two half notes in piano roll](img/pno-roll-2.png "Figure 5") 

To give another example, `[[3] [2]]` will give us a container of size 5, for example, a five beat long rhythm, with a note spanning three beats and a note spanning two beats, like:

![[[3][2]] in piano roll](img/pno-roll-3.png "Figure 6") 

#### Fixed Container

What if you wanted to specify the size of the parent container to be 4, but keep the 3:2 porportion of the child containers? 

You can do this by specifying a size of the parent container, making it a **fixed container**, as with
```
[4 [3] [2]]
```
![[4[3][2]] in piano roll](img/pno-roll-4.png "Figure 7") 

With a combination of fixed and flexible parent and child containers, we can generate a wide variety of rhythms.


#### Container Scale

You can also **scale** the size of a container by a ratio of two positive integers. It cannot be a decimal number. For example,
```
[2 [] []] [2, 3/5[] []]
```
would generate a container of size two with two child containers, followed by a second container of size two with two child containers, this second one being 3/5 the size of the first.

![container scale in piano roll](img/pno-roll-6.png "Figure 8") 

In this way, Nestup facilitates the creation of looping clips with fragmentary meters in DAWs such as Ableton Live. Note that in the figure above, the end point of the loop is off of Ableton's "grid."

Note: if you wish to scale a container and want to maintain its flexible size, simply writing a comma `,` followed by the desired ratio will add a container scale while maintaining the container's flexibility. For example, `[,8/3 [] []]`. 

This would be a container of size 2, because it is a parent container with children whose sizes sum to 2. That size is then multiplied by 8/3 to produce its final size.


### The Subdivider

A positive integer wrapped in curly braces `{}` evenly divides a container into that many subdivisions. For example, `[4] {3}` might be rendered in conventional western musical notation as:

![a half-note triplet](img/ex-3.png "Figure 9")

In the same way, `[4] {1}` gives us:

![a whole note](img/ex-1.png "Figure 10")

And `[4] {13}` gives us:

![a 13-let](img/ex-13.png "Figure 11")

*Warning:* A container can only be subdivided with the subdivider if it has no child containers. For example, the expression `[[]] {3}` **is not valid.**

If you are subdividing a container of size 1 with no sibling containers, you can leave off the preceding `[]`. For example, `[] {5}` and `{5}` are equivalent. However, `{5} {5}` or `{5} [] {4}` **are not valid.**

#### Ranged Containers

Once you’ve subdivided a container, you can place more containers within those subdivisions. To place one of these ranged containers, you first specify a **range** for the container. The range includes a **start** and a **length.** The range length, written after the colon `:`, is used to stretch that ranged container across multiple subdivisions, but defaults to 1 subdivision if not otherwise specified. 

For example, to place the container `[[2] [1]]` on the first beat of a container subdivided into 3 parts, you would write:
```
[] {3 1 [[2] [1]]}
```
![ranged container](img/pno-roll-7.png "Figure 12")

`[] {3 1:2 [[2] [1]]}` would stretch the container across two subdivisions. 

![range, length](img/pno-roll-8.png "Figure 13")

#### Ranged Container Shorthand

If you want to place a ranged container of size 1, you can simply declare the range start, or the range start and length, and the ranged container of size 1 will be implied.

For example, the following two expressions are equivalent:

```
[] {8
  1 []
  2 []
  3 []
  4:5 []
}
```
and
```
[] {8
  1
  2
  3
  4:5
}
```
![range shorthand](img/pno-shorthand.png "Figure 14")

*Warning:* The size of the ranged container will always be determined by its range expression. For this reason, you can not give a ranged container a fixed size: `{3 1 [2]}` **is not valid**. Additionally, a ranged container cannot have siblings: `{3 1 [] []}` **is not valid**, though it can have children, as demonstrated in the examples above.

### Empty Containers

Up until this point, we have described containers full of rhythmic events. What if we want to describe a period of time that is empty?

```
['4]
```
The expression above describes a container of size 4 which is empty. We can see such an empty container in context below:

```
[4] {3}
['4]
[2]
```
![empty](img/pno-empty-1.png "Figure 15")

The **Empty Container** shares many characteristics with its non-empty counterpart: it has a container size, it can have a scale expressed as a ratio of two positive integers, and it can be subdivided using `{}` expressions. 

However, the empty container cannot have children. Why? Because the child containers would fill the empty container and it would no longer be empty. Therefore, if you write `['4[2]['3]]`, this will throw a syntax error. The correct form of this expression is `[4[2]['3]]`.

It is perfectly possible to add rhythmic events into an empty container, however. You simply need to use the subdivider `{}`. Take for instance:

```
['4] {16
  1 {2}
  8 {3}
  16
}
```
![empty 2](img/pno-empty-2.png "Figure 16")

#### Rests

A common use for an empty container is for adding rests.

For example,
```
[]
[']
[3] {5
  2 [']
  4:2 [']
}
```
![rests](img/pno-roll-10.png "Figure 17") 

### Ties and Rotations

Nestup has two additional features to help you generate rhythms: the ability to combine two adjascent containers, in a manner similar to a "tie" in western classical music notation, and the ability to "rotate" rhythmic events forward or backward in a subdivided container.


#### Ties

In Nestup, ties are written using the underscore `_` and connect sibling containers. When used, the subdivision before and after are combined. 

For example:
`[3] {5} _ [] {3}` will give us:

![tie](img/pno-roll-9.png "Figure 18")

#### Rotation

Once you've subdivided a container, you can offset those subdivisions forward or backward using the rotation operators `>` or `<`. The **distance** of a rotation is defined in terms of the number of subdivisions, for example, if you've divided a container into 10 subdivisions, then rotating forward by 5 would have the effect of rotating all subdivisions forward by half of the parent container. 

You can see this demonstrated in the colored visualizer element along the bottom of the Ableton Live Nestup device in the following example:


![rotate-first](img/first-rotate.gif "Figure 19")

Rotating in this subdivided container by 10 would have the same effect as not rotating at all. Rotations can be fractions, so you can rotate by 1/2 of 1 subdivision. This can be a nice way to achieve syncopation.

![rotate-diagram](img/rotationDiagram.png "Figure 20")
*It could be helpful to visualize a grid of subdivisions, shifted over by the rotation distance*

For example, to place a snare drum on beats "2" and "4" of a 4/4 measure, you might write the following expression:

```
['4] {4
  2
  4
}
```
With **Rotation**, you could achieve a snare drum hitting on "2" and "4" with the following expression:
```
[4] {2 > 1/2}
```
In this second example, we've made two subdivisions (rather than four) of the parent container, and then used the character `>` to offset the start of those subdivisions by 1/2 of one subdivision.

It is also possible to offset a rhythm backwards with `<`, by any ratio of one subdivision. For example:

```
[4] {3}
[4] {3 < 1/3}
```
![rotate](img/pno-rotate.png "Figure 21")

You can see in the preceeding example that it appears as if there is a rest at the beginning of the second container. This is due to the first event of the subdivided second container being pushed past the beginning of the container and wrapping around the end of that container. 

This wrap-around effect can be seen in the following animation using the Ableton Live Nestup device. As the rotation distance approaches 1 (3/3), the final event in the container gets closer to wrapping around to the beginning of the container.

![rotate-anim](img/rotate.gif "Figure 22")

______
## Ableton-specific documentation

If you are using the [Nestup Max For Live device](https://gum.co/nestup) to parse your Nestup expressions, please visit the Nestup Max for Live Device Reference [here](https://nestup.s3.amazonaws.com/Nestup+Max+for+Live+Device+Reference.pdf). You can find the Live device for purchase [here](https://gum.co/nestup). Thank you, have fun, and be in touch!
