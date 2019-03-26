// TODO: Update all the comments
// TODO: Update Class Authors
// TODO: Testing for this class (jest)

const Automata = require('./Automata');

class AFD extends Automata {
  // Adds a letter to the alphabet
  addLetter(letter) {
    if (!this.alphabet.includes(letter) && letter !== 'lambda') {
      this.alphabet.push(letter);
    }
  }

  // Adds a transition if is not repeated
  addTransition(initial, final, letter) {
    const obj = {
      letter,
      final
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
