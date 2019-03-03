class FiniteAutoma {
  constructor() {
    this.states = [];
    this.alphabet = [];
    this.initial = null;
    this.final = [];
    this.transitions = [];
  }
}
function addState(state) {
  this.states.push(state);
}
function addInitial(initial) {
  this.initial = initial;
}
function addFinal(final) {
  this.final = final;
}
function addLetter(letter) {
  this.alphabet.push(letter);
}
