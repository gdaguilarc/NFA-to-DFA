(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Automata = require('./Automata');

var AFN =
/*#__PURE__*/
function (_Automata) {
  _inherits(AFN, _Automata);

  function AFN() {
    _classCallCheck(this, AFN);

    return _possibleConstructorReturn(this, _getPrototypeOf(AFN).apply(this, arguments));
  }

  _createClass(AFN, [{
    key: "addTransition",
    // Adds a transition if is not repeated
    value: function addTransition(initial, final) {
      var letter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'lambda';
      var obj = {
        letter: letter,
        final: final
      }; // initialize the array of the state[key] if dosen't exists

      if (!this.transitions[initial]) {
        this.transitions[initial] = [];
        this.addLetter(letter);
      }

      if (!this.existTransition(obj, initial)) {
        this.transitions[initial].push(obj);
      }
    } // TODO: Handle a circular lambda closure

  }, {
    key: "lambdaLock",
    value: function lambdaLock(state) {
      var _this = this;

      if (!this.transitions[state]) {
        return state;
      }

      var arr = this.transitions[state].filter(function (elem) {
        return elem.letter === 'lambda';
      });

      if (arr.length === 0) {
        return state;
      } else {
        arr.forEach(function (elem) {
          state += ',';
          return state += _this.lambdaLock(elem.final);
        });
      } // Returns only unique elements


      return state.split(',').filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });
    }
  }]);

  return AFN;
}(Automata);

module.exports = AFN;

},{"./Automata":2}],2:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Basic class used to establish the basic structure of a
 * finite automata.
 * AFD and AFN extends this class!!!
 */
var Automata =
/*#__PURE__*/
function () {
  function Automata() {
    _classCallCheck(this, Automata);

    this.states = [];
    this.alphabet = [];
    this.initial = null;
    this.final = [];
    this.transitions = [];
  } // Adds a state if is not repeated


  _createClass(Automata, [{
    key: "addState",
    value: function addState(state) {
      if (!this.states.includes(state)) {
        this.states.push(state);
      }
    } // Checks if the state exists and if initial is not already picked

  }, {
    key: "addInitial",
    value: function addInitial(state) {
      if (this.states.includes(state) && this.initial === null) {
        this.initial = state;
      }
    } // Checks if the state exists and is not repeated in final

  }, {
    key: "addFinal",
    value: function addFinal(final) {
      if (this.states.includes(final) && !this.final.includes(final)) {
        this.final = final;
      }
    } // Adds a letter to the alphabet

  }, {
    key: "addLetter",
    value: function addLetter(letter) {
      if (!this.alphabet.includes(letter)) {
        this.alphabet.push(letter);
      }
    } // Transforms a object into a String and compares it

  }, {
    key: "existTransition",
    value: function existTransition(obj, state) {
      return this.transitions[state].some(function (elem) {
        return JSON.stringify(obj) === JSON.stringify(elem);
      });
    }
  }]);

  return Automata;
}();

module.exports = Automata;

},{}]},{},[1]);
