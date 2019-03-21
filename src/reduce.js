/** ESLINT DEVELOPMENT DISABLED RULES!!! DELETE AT THE  END OF THE DEVELOPING */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

/**
 *
 * @author      David Aguilar
 * @author      Andrea Becerra
 * @author      Saul Neri
 * @version     1.0.0
 * @since       1.0.0
 *
 * @description This script is in charge of performing the minimization of the AFD resulting from the transformation of the AFN
 */

// TODO: Reduce method

const AFD = require('./AFD');

/**
 *
 * @param {Integer} numberStates The size of the hashmap
 * @returns {Object} Hashmap
 * @description Initialize a hashmap for pairs of values i, j where i < j
 */
function initializePairs(numberStates) {
  const pairs = [];
  for (let i = 0; i < numberStates; i += 1) {
    for (let j = 1; j < numberStates; j += 1) {
      if (i < j) {
        pairs[`${i},${j}`] = 0;
      }
    }
  }
  return pairs;
}

/**
 *
 * @param {Object} pairs Array of pairs for validation
 * @param {String []} states Array of states of an automata
 * @param {String []} final Array of final states
 * @returns {Object} New array of pairs
 * @description Checks what pair of states contain a final and makes them equal to 1
 */
function checkFinalPairs(pairs, states, final) {
  const newPairs = pairs;
  for (const i in pairs) {
    const indexes = i.split(',');
    const possibleStates = [];
    indexes.forEach(element => {
      possibleStates.push(states[parseInt(element, 10)]);
    });

    if (
      (final.includes(possibleStates[0]) && !final.includes(possibleStates[1])) ||
      (final.includes(possibleStates[1]) && !final.includes(possibleStates[0]))
    ) {
      newPairs[i] = 1;
    }
  }
  return newPairs;
}

/**
 *
 * @param {Integer} index
 * @param {Object} automata
 * @param {String} letter
 */
function getNM(index, automata, letter) {
  return automata.states.indexOf(
    automata.transitions[automata.states[index]].filter(elem => elem.letter === letter)[0].final
  );
}

/**
 *
 * @param {Object} automata
 * @param {Object} statesD
 * @param {Integer} indexA
 * @param {Integer} indexB
 *
 * @description
 * Check if exist a letter that: d(qi, a) = qm, d(qj, a) = qn and D[m, n] = 1 or D[n, m] = 1
 */
function existLetterOnes(automata, statesD, indexA, indexB) {
  for (let i = 0; i < automata.alphabet.length; i += 1) {
    const m = getNM(indexA, automata, automata.alphabet[i]);
    const n = getNM(indexB, automata, automata.alphabet[i]);
    if (statesD[`${m},${n}`] === 1 || statesD[`${n},${m}`] === 1) return true;
  }
  return false;
}

// TODO: Function DIST
// function dist(i, j){}
function dist(message) {
  console.log(message);
}

/**
 *
 * @param {Object} automata DFA (Deterministic Finite Automata)
 * @returns {Object}
 * @description Reduces a Deterministic Finite Automata
 */
function reduceAFN(automata) {
  let statesD = initializePairs(automata.states.length);
  let statesS = initializePairs(automata.states.length);

  statesD = checkFinalPairs(statesD, automata.states, automata.final);
  console.log(statesD);

  let m = 0;
  let n = 0;

  // Iterates over the hasmap of pairs
  for (const pair in statesD) {
    // Only if the pair is equal to 0
    if (statesD[pair] === 0) {
      if (
        existLetterOnes(
          automata,
          statesD,
          parseInt(pair.split(',')[0], 10),
          parseInt(pair.split(',')[1], 10)
        )
      ) {
        // TODO: Implement dist
        dist(pair);
      } else {
        for (let i = 0; i < automata.alphabet.length; i += 1) {
          const m = getNM(
            parseInt(pair.split(',')[0], 10),
            automata,
            automata,
            automata.alphabet[i]
          );
          const n = getNM(
            parseInt(pair.split(',')[1], 10),
            automata,
            automata,
            automata.alphabet[i]
          );

          if (m < n && pair !== `${m},${n}`) {
            statesS[`${m},${n}`].push(pair);
          } else if (m > n && pair !== `${n},${m}`) {
            statesS[`${n},${m}`].push(pair);
          }
        }
      }
    }
  }
}

/**
 * THIS SECTION IS ONLY FOR TESTING!!! SHOULD BE REMOVED AT THE END OF THE DEVELOPMENT.
 */

const automata = new AFD();
automata.addState('q0');
automata.addState('q1');
automata.addState('q2');
automata.addState('q3');
automata.addState('q4');
automata.addState('q5');
automata.addState('q6');
automata.addState('q7');

automata.addInitial('q0');

automata.addFinal('q1');
automata.addFinal('q2');
automata.addFinal('q3');
automata.addFinal('q4');
automata.addFinal('q5');
automata.addFinal('q6');

automata.addLetter('a');
automata.addLetter('b');

automata.addTransition('q0', 'q1', 'a');
automata.addTransition('q0', 'q4', 'b');

automata.addTransition('q1', 'q2', 'a');
automata.addTransition('q1', 'q3', 'b');

automata.addTransition('q2', 'q7', 'a');
automata.addTransition('q2', 'q7', 'b');

automata.addTransition('q3', 'q7', 'a');
automata.addTransition('q3', 'q3', 'b');

automata.addTransition('q4', 'q5', 'a');
automata.addTransition('q4', 'q6', 'b');

automata.addTransition('q5', 'q7', 'a');
automata.addTransition('q5', 'q7', 'b');

automata.addTransition('q6', 'q7', 'a');
automata.addTransition('q6', 'q6', 'b');

automata.addTransition('q7', 'q7', 'a');
automata.addTransition('q7', 'q7', 'b');

console.log(automata.transitions);

// Main function testing
reduceAFN(automata);

/**
 *  END OF THE TESTING SECTION
 */

// export the main function of the file
module.exports = reduceAFN;
