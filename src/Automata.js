/**
 * Basic class used to establish the basic structure of a
 * finite automata.
 * AFD and AFN extends this class!!!
 */

// TODO: Class Authors
// TODO: Update all the comments

class Automata {
  constructor() {
    this.states = [];
    this.alphabet = [];
    this.initial = null;
    this.final = [];
    this.transitions = [];
  }

  // Adds a state if is not repeated
  addState(state) {
    if (!this.states.includes(state)) {
      this.states.push(state);
    }
  }

  // Checks if the state exists and if initial is not already picked
  addInitial(state) {
    if (this.states.includes(state) && this.initial === null) {
      this.initial = state;
    }
  }

  // Checks if the state exists and is not repeated in final
  addFinal(final) {
    if (this.states.includes(final) && !this.final.includes(final)) {
      this.final = final;
    }
  }

  // Adds a letter to the alphabet
  addLetter(letter) {
    if (!this.alphabet.includes(letter)) {
      this.alphabet.push(letter);
    }
    this.alphabet.sort((a, b) => {
      return a > b;
    });
  }

  // Transforms a object into a String and compares it
  existTransition(obj, state) {
    return this.transitions[state].some(elem => {
      return JSON.stringify(obj) === JSON.stringify(elem);
    });
  }
}

module.exports = Automata;
