

/**
 * Uses the `produce` function to produce values until the `predicate` returns false.
 * If supplied, each value is transformed by `transform` before being yielded.
 *
 * @param {Function} produce produces the next value
 * @param {Function} predicate return true if the production should continue
 * @param {Function} transform transforms the produced value, defaults to identity
 */
function* produceWhile(produce, predicate, transform = value => value) {
  while(true) {
    const value = produce()
    if (predicate(value) !== true) {
      break
    }

    yield transform(value)
  }
}

/**
 * Zip function that zips each value from the supplied arrays. It will stop once
 * any of the iterators has been depleted.
 *
 * @param {Array of Iterables} iterables an array of Iterable objects.
 */
function zip(...iterables) {
  const iterators = iterables.map(iterable => iterable[Symbol.iterator]())
  const zipper = produceWhile(() => iterators.map(iterator => iterator.next()),
                              value => value.find(v => v.done) === undefined,
                              value => value.map(v => v.value))
  return [...zipper]
}

/**
 * Inifinite random number generator producing values between lower bound and upper bound
 *
 * @param {integer} lower lower bound
 * @param {integer} upper upper bound
 */
function* randomInts(lower, upper) {
  while(true) {
    yield Math.round(lower + Math.random() * (upper - lower))
  }
}

/**
 * Generator simulating 3d6 (three six sided dice)
 */
function* threeD6() {
  yield* randomInts(3, 18)
}

/**
 * Rolls 3d6 for each of the D&D character attributes and returns an array of pairs with the attribute and rolled value.
 */
function rollCharacter() {
  const attributes = ['Strength', 'Constituion', 'Dexterity', 'Intelligence', 'Wisdom', 'Charisma']

  return zip(attributes, threeD6())
}

console.log(rollCharacter())
