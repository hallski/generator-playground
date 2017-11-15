/**
 * Uses the `produce` function to produce values until the `predicate` returns false.
 *
 * @param {Function} produce produces the next value
 * @param {Function} predicate return true if the production should continue
 */
function* produceWhile(produce, predicate) {
  let value = produce()
  while(predicate(value)) {
    yield value
    value = produce()
  }
}

/**
 * Creates a new generator which wraps `generator` and applied `mapper` to each value.
 *
 * @param {Generator} generator
 * @param {Function} mapper
 */
function* mappedGenerator(generator, mapper) {
  let result = generator.next()
  while(!result.done) {
    yield mapper(result.value)
    result = generator.next()
  }
}

/**
 * Zip function that zips each value from the supplied arrays. It will stop once
 * any of the iterators has been depleted.
 *
 * @param {Array of Iterables} iterables an array of Iterable objects.
 */
function* zip(...iterables) {
  const iterators = iterables.map(iterable => iterable[Symbol.iterator]())

  const producer = produceWhile(() => iterators.map(iterator => iterator.next()),
                                value => value.every(v => !v.done))

  yield* mappedGenerator(producer,
                         value => value.map(v => v.value))
}
// Creates a random seed that can be used with `randomInts`
const randomSeed = () => Math.floor(Math.random() * 1000)

/**
 * Inifinite random number generator producing values between lower bound and upper bound
 *
 * @param {Int} lower lower bound
 * @param {Int} upper upper bound
 * @param {Int} seed optional seed
 */
function* randomInts(lower, upper, seed = randomSeed()) {
  while(true) {
    const x = Math.sin(seed++) * 10000;
    const random = x - Math.floor(x)
    yield Math.round(lower + random * (upper - lower))
  }
}

const d20 = randomInts(1, 20)
d20.next().value // 13
d20.next().value // 1 - oh no, a fumble!

/**
 * Rolls 3d6 for each of the D&D character attributes and returns an array of pairs with the attribute and rolled value.
 */
function rollCharacter() {
  const attributes = ['Strength', 'Constituion', 'Dexterity', 'Intelligence', 'Wisdom', 'Charisma']

  return [...zip(attributes, randomInts(3, 18))]
}

console.log(rollCharacter())
