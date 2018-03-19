// singleton class that generates ids to use has unique variable names for variables
// counter.js

let value = 0

module.exports = {
  increment: () => value++,
  get: () => value
}
