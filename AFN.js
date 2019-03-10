Automata = require('./Automata');

class AFN extends Automata {
  // Adds a transition if is not repeated
  addTransition(initial, final, letter = 'lambda') {
    let obj = {
      letter: letter,
      final: final
    };

    // initialize the array of the state[key] if dosen't exists
    if (!this.transitions[initial]) {
      this.transitions[initial] = [];
      this.addLetter(letter);
    }

    if (!this.existTransition(obj, initial)) {
      this.transitions[initial].push(obj);
    }
  }

  // TODO: Handle a circular lambda closure
  lambdaLock(state) {
    if (!this.transitions[state]) {
      return state;
    }

    let arr = this.transitions[state].filter(elem => {
      return elem.letter === 'lambda';
    });

    if (arr.length === 0) {
      return state;
    } else {
      arr.forEach(elem => {
        state += ',';
        return (state += this.lambdaLock(elem.final));
      });
    }

    // Returns only unique elements
    return state.split(',').filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }
}

module.exports = AFN;
