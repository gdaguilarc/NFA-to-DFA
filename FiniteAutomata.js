class FiniteAutoma {
  constructor(states, alphabet, initial, final, transitions) {
    this.states = states;
    this.alphabet = alphabet;
    this.initial = initial;
    this.final = final;
    this.transitions = transitions;
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
