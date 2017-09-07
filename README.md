
Find differences between two objects. 

This module will tell you the path to each difference, e.g. `foo.bar.baz`, but will not tell you anything about the type of difference (addition, change, deletion).

This is useful for quickly checking for state changes in a simple and backwards-compatible manner.

Streaming mode is not yet working in a properly async fashion so your process will still have to wait until the entire diff is complete.

# Other ways

Modern browsers have the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object which is great for watching for state changes. Older firefox browsers have [Object.observe](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe) which could also be used but is now obsolete.

The problem is that `Proxy` only works for very modern browsers and a shim is impossible for most browsers without resorting to polling.

The other way to check for object changes is to dynamically re-build the object with every property replaced with setters and getters using `Object.defineProperty({set: <function>, get: <function>})`. This is the method used by [mobx](https://github.com/mobxjs/mobx) under the hood. 

This method is backwards compatible and probably scales better than diffing but has some non-obvious drawbacks:

* Adding and removing object properties cannot be detected since `Object.defineProperty` must specify the property (no catch-alls) and does not catch deletions
* Adding and removing elements to an array cannot be detected unless it is done with `.push` and `.pop` since it is equivalent to adding and removing object properties
* Arrays are re-implemented as generic objects in order to overwrite and intercept `.push` and `.pop` which causes problems with checks for `instanceof Array` (though this is a solvable problem, it seems it's just a problem with the mobx implementation)

These limitations could be easily managed as long as developers are aware of them, however if any module is used which acts on arrays or objects in any of the undetected ways then this could cause really annoying and hard-to-debug issues.

Also, unfortunately the mobx implementation is in TypeScript :/

This method likely scales better for very large objects where small changes happen often since no diffing needs to take place when the object changes, however every change to the object will need to be re-built using `Object.defineProperty` so it might actually scale worse for large changes. 

