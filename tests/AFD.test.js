const AFD = require('../src/AFD');

test('No same letter transitions', () => {
  const automata = new AFD();
  automata.addState('q0');
  automata.addState('q1');
  automata.addState('q2');
  automata.addInitial('q0');
  automata.addTransition('q0', 'q1', 'a');
  automata.addTransition('q0', 'q2', 'a');
  expect(automata.transitions.q0).toHaveLength(1);
});
