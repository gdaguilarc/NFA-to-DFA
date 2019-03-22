/**
 *
 * @author      David Aguilar <gd.aguilarc@gmail.com>
 * @author      Andrea Becerra
 * @author      Saul Neri
 * @version     1.0.0
 * @since       1.0.0
 *
 *  @description Basic class used to establish the basic structure of a
 * finite automata.
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

  /**
   *
   * @param {String} state A state of the FA
   * @description Checks if the state exist in order to assign it as the initial state
   */
  addInitial(state) {
    if (this.states.includes(state) && this.initial === null) {
      this.initial = state;
    }
  }

  // Checks if the state exists and is not repeated in final
  addFinal(final) {
    if (this.states.includes(final) && !this.final.includes(final)) {
      this.final.push(final);
    }
  }

  /**
   *
   * @param {String} state A final state
   * @description Deletes the final state from the array of finals
   */
  removeFinal(state) {
    this.final = this.final.filter(final => final !== state);
  }

  /**
   *
   * @param {String} state The state father of the transitions
   * @description Deletes from the hashmap the transitions of given state
   */
  removeTransitions(state) {
    const newTransitions = [];
    Object.keys(this.transitions).forEach(key => {
      if (key !== state) {
        newTransitions[key] = this.transitions[key];
      }
    });
    this.transitions = newTransitions;
  }

  // deleteState(state) {
  //   if (this.states.includes(state) && this.final.includes(state)) {
  //     this.removeFinal(state);
  //   } else if (this.states.includes(state)) {
  //   }
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
