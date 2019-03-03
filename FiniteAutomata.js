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
  addTransition(initial, final, trigger = 'thislambdaLock') {
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

  lambdaLock(state) {
    let arr = this.transitions['thislambdaLock'].filter(elem => {
      return elem.initial === state;
    });

    if (arr.length === 0) {
      return state;
    } else {
      arr.forEach(elem => {
        state += ',';
        return (state += this.lambdaLock(elem.final));
      });
    }

    return state.split(',');
  }
}

/**
 * TESTING
 *
 *
 *
 */

let M = new FiniteAutoma();
var f = [];
M.addState('a');
M.addState('q0');
M.addState('q0');
M.addState('q1');
M.addTransition('a', 'b');
M.addTransition('a', 'b');
M.addTransition('b', 'q0');
M.addTransition('a', 'a', 'w');
M.addTransition('a', 'q2', 'w');
M.addTransition('a', 'a', 'w');
M.addTransition('q0', 'a', 'a');
M.addInitial('q2');
M.addInitial('a');
//console.log(M);
//console.log(M.transitions['thislambdaLock']);
//console.log(M.transitions['w']);
//console.log('dadasdas');
let popo = [];
console.log(M.lambdaLock('a'));
