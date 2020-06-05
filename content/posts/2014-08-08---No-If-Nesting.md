---
title: Deeply nested ifs? Combine functions
date:   2014-08-08
tags: 
    - Scala 
    - Functional Programming
template: "post"
category:
    - Functional Programming
draft: false
slug: "deeply-nested-ifs-combine-functions"
description: ''
socialImage: ''
---

Update: I didn't know about monads and functional programming at this point :D

I was looking for a way to get rid of nasty deeply nested ifs in one of rather large functions in a codebase. This function was particularly notorious and would result in bugs and broken things everytime there was a change in it. The reason was simple, the real story lost in a mess of condition checks.

I thought there has to be a better way and I found one (hopefully).

I came up with this idea that the functions should be combined and the errors should short circuit the computation and return with helpful message of what went wrong. Usually it would be something like this:

```scala
if (check1) {
    if (check2) {
        //...more checks {
        doSomething()
        sendOk
    } else {
    	sendError2
    }
} else {
    sendError1()
}
```

This happens specially in case of a web application (play app in my case). 
You can not really get rid of the nesting without resorting to returns. 
If you use returns it becomes - 

```scala
if (!check1) {
    return error
}
if (!check2) {
    return error
}
doSomething()
return ok
```

But this suffers from the same problem that changes are hard and the logic
and flow are hidden behind the net of condition checks.

We can do a lot better by using awesome scala implicits and some functional goodness.

First we define a combinable implicit view of functions to enable cmobining them with ~.

```scala
implicit class Combinable[A, B, C, D](f: Function1[A, Either[B, C]]) {
    def ~(g: Function1[Either[B, C], Either[B, D]]): Function1[A, Either[B, D]] = { 
        x: A =>
            val v = f(x)
            if (v.isLeft) Left(v.left.get)
            else g(v)
    }
}
```

Notice how we do not proceed farther than the first error and return it as the result.

Now all are functions ```Function1[A, B]``` are combinable given they consume an Either 
and produce an Either and a function f is combined with another function g 
such that f's result can be consumed by g, which is usually the case.

Now just define your checks as different functions. So for example in a play app -

```scala
def foo(fooIn: Either[Result, String]) = {
    fu(fooIn) match {
        case None => Left(BadRequest("fu required"))
        case Some(f) => Right(f)
    }
}

def bar(barIn: Either[Result, Token]) = {
    val b = barIn.right.get
    if (check(b)) {
        Left(BadRequest("bar error"))
    } else {
        Right(b)
    }
}

//... and so on
```

And our main function becomes -

```scala
def makeFoo = {
    val f = foo ~ bar ~ baz // and so on
    f(someIn) match {
        case Left(e) => e
        case Right(f) => f
    }
}
```

Much easier to understand what is going on and much easier to add a new check. I think it might already be well known and
an established practice (much better than mine) but I couldn't look it up so I blogged about it.

Thanks for reading, happy coding :)
