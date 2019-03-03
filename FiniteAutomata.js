class FiniteAutoma {
  constructor() {
    this.states = [];
    this.alphabet = [];
    this.initial = null;
    this.final = [];
    this.transitions = [];
  }
  addState(state) {
    if (!this.states.includes(state)) {
      this.states.push(state);
    }
  }
  addInitial(initial) {
    if (this.states.includes(initial)) {
      this.initial = initial;
    }
  }
  addFinal(final) {
    if (this.states.includes(final)) {
      this.final = final;
    }
  }
  addLetter(letter) {
    if (!this.alphabet.includes(letter)) {
      this.alphabet.push(letter);
    }
  }
  addTransition(initial, final, trigger = 'lambda') {
    let obj = {
      initial: initial,
      final: final
    };

    if (!this.transitions[trigger]) {
      this.transitions[trigger] = [];
      this.addLetter(trigger);
    }

    if (!this.existTransition(obj, trigger)) {
      this.transitions[trigger].push(obj);
    }
  }
  existTransition(obj, trigger) {
    return this.transitions[trigger].some(elem => {
      return JSON.stringify(obj) === JSON.stringify(elem);
    });
  }
}

/**
 * TESTING
 *
 *
 *
 */

let M = new FiniteAutoma();
M.addState('a');
M.addState('b');
M.addState('q0');
M.addState('q1');
M.addTransition('a', 'b');
M.addTransition('a', 'a', 'w');
M.addTransition('a', 'q2', 'w');
M.addTransition('a', 'a', 'w');
M.addTransition('q0', 'a', 'a');
M.addInitial('q2');
M.addInitial('a');
console.log(M);
console.log(M.transitions['lambda']);
console.log(M.transitions['w']);
