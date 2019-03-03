class FiniteAutoma {
  constructor() {
    this.states = [];
    this.alphabet = [];
    this.initial = null;
    this.final = [];
    this.transitions = [];
  }
  addState(state) {
    this.states.push(state);
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
    this.alphabet.push(letter);
  }
}

let M = new FiniteAutoma();
M.addState('a');

console.log(M);
