Automata = require('./Automata');

class AFD extends Automata {
  constructor() {
    super();
  }

  // Adds a letter to the alphabet
  addLetter(letter) {
    if (!this.alphabet.includes(letter) && letter !== 'lambda') {
      this.alphabet.push(letter);
    }
  }

  // Adds a transition if is not repeated
  addTransition(initial, final, letter) {
    let obj = {
      letter: letter,
      final: final
    };

    // initialize the array of the state[key] if dosen't exists
    if (!this.transitions[initial]) {
      this.transitions[initial] = [];
      this.addLetter(letter);
    }

    if (!this.existTransition(obj, initial) && this.onePath(initial, letter)) {
      this.transitions[initial].push(obj);
    }
  }

  onePath(initial, letter) {
    return (
      this.transitions[initial].filter(elem => {
        return elem.letter === letter;
      }).length < 1
    );
  }
}

module.exports = AFD;
