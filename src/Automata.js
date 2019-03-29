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
  constructor(states = [], alphabet = [], initial = null, final = [], transitions = []) {
    this.states = states;
    this.alphabet = alphabet;
    this.initial = initial;
    this.final = final;
    this.transitions = transitions;
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
   * @param {String} state A state in the FA
   */
  removeState(state) {
    if (this.initial !== state) {
      this.states = this.states.filter(elem => elem !== state);
      if (this.final.includes(state)) {
        this.removeFinal(state);
      }
    }
  }

  /**
   *
   * @param {String} state A state in the FA
   * @description Search and appends all the transitions where the given state is the destination
   */
  searchFinals(state) {
    return this.listTransitions().filter(elem => {
      return elem.final === state;
    });
  }

  /**
   *
   * @param {String} initial The hashmap key
   * @param {String} letter The letter of the transition
   * @param {String} final  The destination of the transition
   */
  deleteTransition(initial, letter, final) {
    if (this.transitions[initial]) {
      this.transitions[initial] = this.transitions[initial].filter(tr => {
        return letter !== tr.letter || final !== tr.final;
      });
    }
  }

  /**
   * @description Creates a list of all the transitions in the FA
   */
  listTransitions() {
    const list = [];
    Object.keys(this.transitions).forEach(key => {
      if (Array.isArray(this.transitions[key])) {
        for (let k = 0; k < this.transitions[key].length; k += 1) {
          const obj = {
            initial: key,
            letter: this.transitions[key][k].letter,
            final: this.transitions[key][k].final
          };
          list.push(obj);
        }
      } else {
        const object = {
          initial: key,
          letter: this.transitions[key].letter,
          final: this.transitions[key].final
        };
        list.push(object);
      }
    });

    return list;
  }

  /**
   *
   * @param {Integer} n The index of the state
   */
  searchStateByIndex(n) {
    return this.states[n];
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

  // Adds a letter to the alphabet
  addLetter(letter) {
    if (!this.alphabet.includes(letter)) {
      this.alphabet.push(letter);
    }
    this.alphabet.sort((a, b) => {
      return a > b;
    });
  }
  /**
   * Checks if the transition is in the transitions hashmap
   * @param  {[type]} obj   [description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  existTransition(obj, state) {
    return this.transitions[state].some(elem => {
      return JSON.stringify(obj) === JSON.stringify(elem);
    });
  }
}
