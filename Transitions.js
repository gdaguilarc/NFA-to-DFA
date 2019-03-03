class Transition {
  constructor(initial, trigger = 'lambda', final) {
    this.initial = initial;
    this.trigger = trigger;
    this.final = final;
  }
}
