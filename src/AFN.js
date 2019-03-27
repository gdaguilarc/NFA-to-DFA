// TODO: Update all the comments
// TODO: Update Class Authors
// TODO: Testing for this class (jest)

/* eslint-disable no-param-reassign */

class AFN extends Automata {
  // Adds a transition if is not repeated
  addTransition(initial, final, letter = 'lambda') {
    const obj = {
      letter,
      final
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

    const arr = this.transitions[state].filter(elem => {
      return elem.letter === 'lambda';
    });

    if (arr.length === 0) {
      return state;
    }
    // we disable de eslint rules because
    arr.forEach(elem => {
      // eslint-disable-next-line no-param-reassign
      state += ',';
      // eslint-disable-next-line no-return-assign
      return (state += this.lambdaLock(elem.final));
    });

    const result = [];
    state.split(',').forEach(elem => result.push(elem));
    // Returns only unique elements
    return result.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }
}
