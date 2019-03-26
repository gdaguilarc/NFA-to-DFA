const AFN = require('../src/AFN');

test('Add lambda transitions', () => {
  const automata = new AFN();
  automata.addTransition('q0', 'q3');
  expect(automata.transitions.q0).toEqual([{ letter: 'lambda', final: 'q3' }]);
});

// TODO: Lambda closure test
