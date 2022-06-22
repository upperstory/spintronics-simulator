(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexfuzzyplugin = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var GetVariableName = function GetVariableName(setName) {
    if (setName.indexOf('.') !== -1) {
      return setName.split('.')[0];
    } else {
      return setName.replace(/[+-]*/g, '');
    }
  };

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  */

  var FuzzyModule = /*#__PURE__*/function () {
    function FuzzyModule() {
      _classCallCheck(this, FuzzyModule);

      this.rules = [];
      this.flvs = {};
    }

    _createClass(FuzzyModule, [{
      key: "addFLV",
      value: function addFLV(name, flv) {
        this.flvs[name] = flv;
        return this;
      }
    }, {
      key: "removeFLV",
      value: function removeFLV(name) {
        delete this.flvs[name];
        return this;
      }
    }, {
      key: "hasFLV",
      value: function hasFLV(name) {
        return this.flvs.hasOwnProperty(name);
      }
    }, {
      key: "addRule",
      value: function addRule(rule) {
        this.rules.push(rule);
        return this;
      }
    }, {
      key: "removeRule",
      value: function removeRule(rule) {
        var rules = this.rules;
        var index = rules.indexOf(rule);
        rules.splice(index, 1);
        return this;
      }
    }, {
      key: "fuzzify",
      value: function fuzzify(name, value) {
        if (typeof name === 'string') {
          this._fuzzify(name, value);
        } else {
          var names = name;

          for (name in names) {
            this._fuzzify(name, names[name]);
          }
        }

        this.dirty = true;
        return this;
      }
    }, {
      key: "_fuzzify",
      value: function _fuzzify(name, value) {
        if (!this.hasFLV(name)) {
          return;
        }

        this.flvs[name].fuzzify(value);
      }
    }, {
      key: "defuzzify",
      value: function defuzzify(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FuzzyModule.DEFUZ_TYPE.MAXAV;

        this._evaluate();

        var result;

        if (typeof name === 'string') {
          result = this._defuzzify(name, type);
        } else if (Array.isArray(name)) {
          result = {};
          var names = name;

          for (var i = 0, cnt = names.length; i < cnt; i++) {
            name = names[i];
            result[name] = this._defuzzify(name, type);
          }
        } else {
          // Get all variable names of consequence        
          var _names = [];
          var rules = this.rules;

          for (var _i = 0, _cnt = rules.length; _i < _cnt; _i++) {
            var consequence = rules[_i].consequence;

            var _name = GetVariableName(consequence.name);

            if (_names.indexOf(_name) === -1) {
              _names.push(_name);
            }
          }

          result = this.defuzzify(_names, type);
        }

        return result;
      }
    }, {
      key: "_defuzzify",
      value: function _defuzzify(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FuzzyModule.DEFUZ_TYPE.MAXAV;

        if (!this.hasFLV(name)) {
          return;
        }

        var flv = this.flvs[name];
        var value;

        switch (type) {
          case FuzzyModule.DEFUZ_TYPE.MAXAV:
            value = flv.defuzzifyMaxAv();
            break;

          case FuzzyModule.DEFUZ_TYPE.CENTROID:
            value = flv.defuzzifyCentroid();
            break;

          default:
            value = flv.defuzzifyMaxAv();
          // use MaxAv as fallback
        }

        return value;
      }
    }, {
      key: "_evaluate",
      value: function _evaluate() {
        if (!this.dirty) {
          return;
        }

        var rules = this.rules;

        this._initConsequences();

        for (var i = 0, l = rules.length; i < l; i++) {
          rules[i].evaluate();
        }

        this.dirty = false;
      }
    }, {
      key: "_initConsequences",
      value: function _initConsequences() {
        var rules = this.rules; // initializes the consequences of all rules.

        for (var i = 0, l = rules.length; i < l; i++) {
          var rule = rules[i];
          rule.initConsequence();
        }

        return this;
      }
    }]);

    return FuzzyModule;
  }();

  FuzzyModule.DEFUZ_TYPE = Object.freeze({
    MAXAV: 0,
    CENTROID: 1
  });

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  */
  var FuzzyVariable = /*#__PURE__*/function () {
    function FuzzyVariable() {
      _classCallCheck(this, FuzzyVariable);

      this.fuzzySets = [];
      this.minRange = Infinity;
      this.maxRange = -Infinity;
    }

    _createClass(FuzzyVariable, [{
      key: "add",
      value: function add(fuzzySet) {
        this.fuzzySets.push(fuzzySet); // adjust range

        if (fuzzySet.left < this.minRange) {
          this.minRange = fuzzySet.left;
        }

        if (fuzzySet.right > this.maxRange) {
          this.maxRange = fuzzySet.right;
        }

        return this;
      }
    }, {
      key: "remove",
      value: function remove(fuzzySet) {
        var fuzzySets = this.fuzzySets;
        var index = fuzzySets.indexOf(fuzzySet);
        fuzzySets.splice(index, 1); // iterate over all fuzzy sets to recalculate the min/max range

        this.minRange = Infinity;
        this.maxRange = -Infinity;

        for (var i = 0, l = fuzzySets.length; i < l; i++) {
          var _fuzzySet = fuzzySets[i];

          if (_fuzzySet.left < this.minRange) {
            this.minRange = _fuzzySet.left;
          }

          if (_fuzzySet.right > this.maxRange) {
            this.maxRange = _fuzzySet.right;
          }
        }

        return this;
      }
    }, {
      key: "fuzzify",
      value: function fuzzify(value) {
        if (value < this.minRange || value > this.maxRange) {
          // Logger.warn('YUKA.FuzzyVariable: Value for fuzzification out of range.');
          return;
        }

        var fuzzySets = this.fuzzySets;

        for (var i = 0, l = fuzzySets.length; i < l; i++) {
          var fuzzySet = fuzzySets[i];
          fuzzySet.degreeOfMembership = fuzzySet.computeDegreeOfMembership(value);
        }

        return this;
      }
    }, {
      key: "defuzzifyMaxAv",
      value: function defuzzifyMaxAv() {
        // the average of maxima (MaxAv for short) defuzzification method scales the
        // representative value of each fuzzy set by its DOM and takes the average
        var fuzzySets = this.fuzzySets;
        var bottom = 0;
        var top = 0;

        for (var i = 0, l = fuzzySets.length; i < l; i++) {
          var fuzzySet = fuzzySets[i];
          bottom += fuzzySet.degreeOfMembership;
          top += fuzzySet.representativeValue * fuzzySet.degreeOfMembership;
        }

        return bottom === 0 ? 0 : top / bottom;
      }
    }, {
      key: "defuzzifyCentroid",
      value: function defuzzifyCentroid() {
        var samples = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var fuzzySets = this.fuzzySets;
        var stepSize = (this.maxRange - this.minRange) / samples;
        var totalArea = 0;
        var sumOfMoments = 0;

        for (var s = 1; s <= samples; s++) {
          var sample = this.minRange + s * stepSize;

          for (var i = 0, l = fuzzySets.length; i < l; i++) {
            var fuzzySet = fuzzySets[i];
            var contribution = Math.min(fuzzySet.degreeOfMembership, fuzzySet.computeDegreeOfMembership(sample));
            totalArea += contribution;
            sumOfMoments += sample * contribution;
          }
        }

        return totalArea === 0 ? 0 : sumOfMoments / totalArea;
      }
    }]);

    return FuzzyVariable;
  }();

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzyTerm
  */
  var FuzzySet = /*#__PURE__*/function () {
    function FuzzySet() {
      var representativeValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      _classCallCheck(this, FuzzySet);

      this.degreeOfMembership = 0;
      this.representativeValue = representativeValue;
      this.left = 0;
      this.right = 0;
    }

    _createClass(FuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership() {}
    }, {
      key: "clearDegreeOfMembership",
      value: function clearDegreeOfMembership() {
        this.degreeOfMembership = 0;
        return this;
      }
    }, {
      key: "getDegreeOfMembership",
      value: function getDegreeOfMembership() {
        return this.degreeOfMembership;
      }
    }, {
      key: "updateDegreeOfMembership",
      value: function updateDegreeOfMembership(value) {
        if (value > this.degreeOfMembership) {
          this.degreeOfMembership = value;
        }

        return this;
      }
    }]);

    return FuzzySet;
  }();

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzySet
  */

  var LeftShoulderFuzzySet = /*#__PURE__*/function (_FuzzySet) {
    _inherits(LeftShoulderFuzzySet, _FuzzySet);

    var _super = _createSuper(LeftShoulderFuzzySet);

    function LeftShoulderFuzzySet(left, midpoint, right) {
      var _this;

      _classCallCheck(this, LeftShoulderFuzzySet);

      // the representative value is the midpoint of the plateau of the shoulder
      var representativeValue = (midpoint + left) / 2;
      _this = _super.call(this, representativeValue);
      _this.left = left;
      _this.midpoint = midpoint;
      _this.right = right;
      return _this;
    }

    _createClass(LeftShoulderFuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership(value) {
        var midpoint = this.midpoint;
        var left = this.left;
        var right = this.right; // find DOM if the given value is left of the center or equal to the center

        if (value >= left && value <= midpoint) {
          return 1;
        } // find DOM if the given value is right of the midpoint


        if (value > midpoint && value <= right) {
          var grad = 1 / (right - midpoint);
          return grad * (right - value);
        } // out of range


        return 0;
      }
    }]);

    return LeftShoulderFuzzySet;
  }(FuzzySet);

  /**
  * @author {@link https://github.com/robp94|robp94}
  * @augments FuzzySet
  */

  var LeftSCurveFuzzySet = /*#__PURE__*/function (_FuzzySet) {
    _inherits(LeftSCurveFuzzySet, _FuzzySet);

    var _super = _createSuper(LeftSCurveFuzzySet);

    function LeftSCurveFuzzySet(left, midpoint, right) {
      var _this;

      _classCallCheck(this, LeftSCurveFuzzySet);

      // the representative value is the midpoint of the plateau of the shoulder
      var representativeValue = (midpoint + left) / 2;
      _this = _super.call(this, representativeValue);
      _this.left = left;
      _this.midpoint = midpoint;
      _this.right = right;
      return _this;
    }

    _createClass(LeftSCurveFuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership(value) {
        var midpoint = this.midpoint;
        var left = this.left;
        var right = this.right; // find DOM if the given value is left of the center or equal to the center

        if (value >= left && value <= midpoint) {
          return 1;
        } // find DOM if the given value is right of the midpoint


        if (value > midpoint && value <= right) {
          if (value >= (midpoint + right) / 2) {
            return 2 * Math.pow((value - right) / (midpoint - right), 2);
          } else {
            //todo test
            return 1 - 2 * Math.pow((value - midpoint) / (midpoint - right), 2);
          }
        } // out of range


        return 0;
      }
    }]);

    return LeftSCurveFuzzySet;
  }(FuzzySet);

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzySet
  */

  var RightShoulderFuzzySet = /*#__PURE__*/function (_FuzzySet) {
    _inherits(RightShoulderFuzzySet, _FuzzySet);

    var _super = _createSuper(RightShoulderFuzzySet);

    function RightShoulderFuzzySet(left, midpoint, right) {
      var _this;

      _classCallCheck(this, RightShoulderFuzzySet);

      // the representative value is the midpoint of the plateau of the shoulder
      var representativeValue = (midpoint + right) / 2;
      _this = _super.call(this, representativeValue);
      _this.left = left;
      _this.midpoint = midpoint;
      _this.right = right;
      return _this;
    }

    _createClass(RightShoulderFuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership(value) {
        var midpoint = this.midpoint;
        var left = this.left;
        var right = this.right; // find DOM if the given value is left of the center or equal to the center

        if (value >= left && value <= midpoint) {
          var grad = 1 / (midpoint - left);
          return grad * (value - left);
        } // find DOM if the given value is right of the midpoint


        if (value > midpoint && value <= right) {
          return 1;
        } // out of range


        return 0;
      }
    }]);

    return RightShoulderFuzzySet;
  }(FuzzySet);

  /**
  * @author {@link https://github.com/robp94|robp94}
  * @augments FuzzySet
  */

  var RightSCurveFuzzySet = /*#__PURE__*/function (_FuzzySet) {
    _inherits(RightSCurveFuzzySet, _FuzzySet);

    var _super = _createSuper(RightSCurveFuzzySet);

    function RightSCurveFuzzySet(left, midpoint, right) {
      var _this;

      _classCallCheck(this, RightSCurveFuzzySet);

      // the representative value is the midpoint of the plateau of the shoulder
      var representativeValue = (midpoint + right) / 2;
      _this = _super.call(this, representativeValue);
      _this.left = left;
      _this.midpoint = midpoint;
      _this.right = right;
      return _this;
    }

    _createClass(RightSCurveFuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership(value) {
        var midpoint = this.midpoint;
        var left = this.left;
        var right = this.right; // find DOM if the given value is left of the center or equal to the center

        if (value >= left && value <= midpoint) {
          if (value <= (left + midpoint) / 2) {
            return 2 * Math.pow((value - left) / (midpoint - left), 2);
          } else {
            return 1 - 2 * Math.pow((value - midpoint) / (midpoint - left), 2);
          }
        } // find DOM if the given value is right of the midpoint


        if (value > midpoint && value <= right) {
          return 1;
        } // out of range


        return 0;
      }
    }]);

    return RightSCurveFuzzySet;
  }(FuzzySet);

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzySet
  */

  var TriangularFuzzySet = /*#__PURE__*/function (_FuzzySet) {
    _inherits(TriangularFuzzySet, _FuzzySet);

    var _super = _createSuper(TriangularFuzzySet);

    function TriangularFuzzySet(left, midpoint, right) {
      var _this;

      _classCallCheck(this, TriangularFuzzySet);

      _this = _super.call(this, midpoint);
      _this.left = left;
      _this.midpoint = midpoint;
      _this.right = right;
      return _this;
    }

    _createClass(TriangularFuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership(value) {
        var midpoint = this.midpoint;
        var left = this.left;
        var right = this.right; // find DOM if the given value is left of the center or equal to the center

        if (value >= left && value <= midpoint) {
          var grad = 1 / (midpoint - left);
          return grad * (value - left);
        } // find DOM if the given value is right of the center


        if (value > midpoint && value <= right) {
          var _grad = 1 / (right - midpoint);

          return _grad * (right - value);
        } // out of range


        return 0;
      }
    }]);

    return TriangularFuzzySet;
  }(FuzzySet);

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzySet
  */

  var SingletonFuzzySet = /*#__PURE__*/function (_FuzzySet) {
    _inherits(SingletonFuzzySet, _FuzzySet);

    var _super = _createSuper(SingletonFuzzySet);

    function SingletonFuzzySet(left, midpoint, right) {
      var _this;

      _classCallCheck(this, SingletonFuzzySet);

      _this = _super.call(this, midpoint);
      _this.left = left;
      _this.midpoint = midpoint;
      _this.right = right;
      return _this;
    }

    _createClass(SingletonFuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership(value) {
        var left = this.left;
        var right = this.right;
        return value >= left && value <= right ? 1 : 0;
      }
    }]);

    return SingletonFuzzySet;
  }(FuzzySet);

  /**
  * @author {@link https://github.com/robp94|robp94}
  * @augments FuzzySet
  */

  var NormalDistFuzzySet = /*#__PURE__*/function (_FuzzySet) {
    _inherits(NormalDistFuzzySet, _FuzzySet);

    var _super = _createSuper(NormalDistFuzzySet);

    function NormalDistFuzzySet(left, midpoint, right, standardDeviation) {
      var _this;

      _classCallCheck(this, NormalDistFuzzySet);

      _this = _super.call(this, midpoint);
      _this.left = left;
      _this.midpoint = midpoint;
      _this.right = right;
      _this.standardDeviation = standardDeviation;
      _this._cache = {};
      return _this;
    }

    _createClass(NormalDistFuzzySet, [{
      key: "computeDegreeOfMembership",
      value: function computeDegreeOfMembership(value) {
        this._updateCache();

        if (value >= this.right || value <= this.left) {
          return 0;
        }

        return ProbabilityDensity(value, this.midpoint, this._cache.variance) / this._cache.normalizationFactor;
      }
    }, {
      key: "_updateCache",
      value: function _updateCache() {
        var cache = this._cache;
        var midpoint = this.midpoint;
        var standardDeviation = this.standardDeviation;

        if (midpoint !== cache.midpoint || standardDeviation !== cache.standardDeviation) {
          var variance = standardDeviation * standardDeviation;
          cache.midpoint = midpoint;
          cache.standardDeviation = standardDeviation;
          cache.variance = variance; // this value is used to ensure the DOM lies in the range of [0,1]

          cache.normalizationFactor = ProbabilityDensity(midpoint, midpoint, variance);
        }

        return this;
      }
    }]);

    return NormalDistFuzzySet;
  }(FuzzySet);

  var ProbabilityDensity = function ProbabilityDensity(x, mean, variance) {
    return 1 / Math.sqrt(2 * Math.PI * variance) * Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
  };

  var FuzzySetClasses = {
    leftShoulder: LeftShoulderFuzzySet,
    leftSCurve: LeftSCurveFuzzySet,
    rightShoulder: RightShoulderFuzzySet,
    rightSCurve: RightSCurveFuzzySet,
    triangular: TriangularFuzzySet,
    singleton: SingletonFuzzySet,
    normal: NormalDistFuzzySet
  };

  var BuildFuzzySet = function BuildFuzzySet(config, partType) {
    var setType = config.type;

    if (setType === undefined) {
      setType = partType === 0 ? 'leftShoulder' : // Left part
      partType === 2 ? 'rightShoulder' : // Right part
      'triangular'; // Middle part
    }

    var fuzzySet = _construct(FuzzySetClasses[setType], _toConsumableArray(config.parameters));

    return fuzzySet;
  };

  var BuildFuzzyVariable = function BuildFuzzyVariable(setsConfig) {
    var flv = new FuzzyVariable();

    for (var i = 0, cnt = setsConfig.length; i < cnt; i++) {
      var flvConfig = setsConfig[i]; // [setName, setType, left, middle, right, arg0]

      var fuzzySet = BuildFuzzySet(flvConfig, i === 0 ? 0 : i == cnt - 1 ? 2 : 3);
      fuzzySet.name = flvConfig.name;
      flv.add(fuzzySet);
    }

    return flv;
  };

  var global$1 = (typeof global !== "undefined" ? global :
              typeof self !== "undefined" ? self :
              typeof window !== "undefined" ? window : {});

  // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  var cachedSetTimeout = defaultSetTimout;
  var cachedClearTimeout = defaultClearTimeout;
  if (typeof global$1.setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
  }
  if (typeof global$1.clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  function nextTick(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  }
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  var title = 'browser';
  var platform = 'browser';
  var browser = true;
  var env = {};
  var argv = [];
  var version = ''; // empty string to avoid regexp issues
  var versions = {};
  var release = {};
  var config = {};

  function noop() {}

  var on = noop;
  var addListener = noop;
  var once = noop;
  var off = noop;
  var removeListener = noop;
  var removeAllListeners = noop;
  var emit = noop;

  function binding(name) {
      throw new Error('process.binding is not supported');
  }

  function cwd () { return '/' }
  function chdir (dir) {
      throw new Error('process.chdir is not supported');
  }function umask() { return 0; }

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance = global$1.performance || {};
  var performanceNow =
    performance.now        ||
    performance.mozNow     ||
    performance.msNow      ||
    performance.oNow       ||
    performance.webkitNow  ||
    function(){ return (new Date()).getTime() };

  // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime
  function hrtime(previousTimestamp){
    var clocktime = performanceNow.call(performance)*1e-3;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor((clocktime%1)*1e9);
    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0];
      nanoseconds = nanoseconds - previousTimestamp[1];
      if (nanoseconds<0) {
        seconds--;
        nanoseconds += 1e9;
      }
    }
    return [seconds,nanoseconds]
  }

  var startTime = new Date();
  function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
  }

  var process = {
    nextTick: nextTick,
    title: title,
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
  };

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var empty = {};

  var empty$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': empty
  });

  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  // resolves . and .. elements in a path array with directory names there
  // must be no slashes, empty elements, or device names (c:\) in the array
  // (so also no leading and trailing slashes - it does not distinguish
  // relative and absolute paths)
  function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === '.') {
        parts.splice(i, 1);
      } else if (last === '..') {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (; up--; up) {
        parts.unshift('..');
      }
    }

    return parts;
  }

  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function(filename) {
    return splitPathRe.exec(filename).slice(1);
  };

  // path.resolve([from ...], to)
  // posix version
  function resolve() {
    var resolvedPath = '',
        resolvedAbsolute = false;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? arguments[i] : '/';

      // Skip empty and invalid entries
      if (typeof path !== 'string') {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
      return !!p;
    }), !resolvedAbsolute).join('/');

    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  }
  // path.normalize(path)
  // posix version
  function normalize(path) {
    var isPathAbsolute = isAbsolute(path),
        trailingSlash = substr(path, -1) === '/';

    // Normalize the path
    path = normalizeArray(filter(path.split('/'), function(p) {
      return !!p;
    }), !isPathAbsolute).join('/');

    if (!path && !isPathAbsolute) {
      path = '.';
    }
    if (path && trailingSlash) {
      path += '/';
    }

    return (isPathAbsolute ? '/' : '') + path;
  }
  // posix version
  function isAbsolute(path) {
    return path.charAt(0) === '/';
  }

  // posix version
  function join() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return normalize(filter(paths, function(p, index) {
      if (typeof p !== 'string') {
        throw new TypeError('Arguments to path.join must be strings');
      }
      return p;
    }).join('/'));
  }


  // path.relative(from, to)
  // posix version
  function relative(from, to) {
    from = resolve(from).substr(1);
    to = resolve(to).substr(1);

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('/');
  }

  var sep = '/';
  var delimiter = ':';

  function dirname(path) {
    var result = splitPath(path),
        root = result[0],
        dir = result[1];

    if (!root && !dir) {
      // No dirname whatsoever
      return '.';
    }

    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1);
    }

    return root + dir;
  }

  function basename(path, ext) {
    var f = splitPath(path)[2];
    // TODO: make this comparison case-insensitive on windows?
    if (ext && f.substr(-1 * ext.length) === ext) {
      f = f.substr(0, f.length - ext.length);
    }
    return f;
  }


  function extname(path) {
    return splitPath(path)[3];
  }
  var path = {
    extname: extname,
    basename: basename,
    dirname: dirname,
    sep: sep,
    delimiter: delimiter,
    relative: relative,
    join: join,
    isAbsolute: isAbsolute,
    normalize: normalize,
    resolve: resolve
  };
  function filter (xs, f) {
      if (xs.filter) return xs.filter(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
          if (f(xs[i], i, xs)) res.push(xs[i]);
      }
      return res;
  }

  // String.prototype.substr - negative index don't work in IE8
  var substr = 'ab'.substr(-1) === 'b' ?
      function (str, start, len) { return str.substr(start, len) } :
      function (str, start, len) {
          if (start < 0) start = str.length + start;
          return str.substr(start, len);
      }
  ;

  var path$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    resolve: resolve,
    normalize: normalize,
    isAbsolute: isAbsolute,
    join: join,
    relative: relative,
    sep: sep,
    delimiter: delimiter,
    dirname: dirname,
    basename: basename,
    extname: extname,
    'default': path
  });

  var require$$0 = getCjsExportFromNamespace(empty$1);

  var require$$1 = getCjsExportFromNamespace(path$1);

  var parser_1 = createCommonjsModule(function (module, exports) {
    /* parser generated by jison 0.4.18 */

    /*
      Returns a Parser object of the following structure:
    
      Parser: {
        yy: {}
      }
    
      Parser.prototype: {
        yy: {},
        trace: function(),
        symbols_: {associative list: name ==> number},
        terminals_: {associative list: number ==> name},
        productions_: [...],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
        table: [...],
        defaultActions: {...},
        parseError: function(str, hash),
        parse: function(input),
    
        lexer: {
            EOF: 1,
            parseError: function(str, hash),
            setInput: function(input),
            input: function(),
            unput: function(str),
            more: function(),
            less: function(n),
            pastInput: function(),
            upcomingInput: function(),
            showPosition: function(),
            test_match: function(regex_match_array, rule_index),
            next: function(),
            lex: function(),
            begin: function(condition),
            popState: function(),
            _currentRules: function(),
            topState: function(),
            pushState: function(condition),
    
            options: {
                ranges: boolean           (optional: true ==> token location info will include a .range[] member)
                flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
                backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
            },
    
            performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
            rules: [...],
            conditions: {associative list: name ==> set},
        }
      }
    
    
      token location info (@$, _$, etc.): {
        first_line: n,
        last_line: n,
        first_column: n,
        last_column: n,
        range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
      }
    
    
      the parseError function receives a 'hash' object with these members for lexer and parser errors: {
        text:        (matched text)
        token:       (the produced terminal token, if any)
        line:        (yylineno)
      }
      while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
        loc:         (yylloc)
        expected:    (string describing the set of expected tokens)
        recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
      }
    */
    var parser = function () {
      var o = function o(k, v, _o, l) {
        for (_o = _o || {}, l = k.length; l--; _o[k[l]] = v) {
        }

        return _o;
      },
          $V0 = [1, 5],
          $V1 = [1, 6],
          $V2 = [1, 7],
          $V3 = [1, 10],
          $V4 = [1, 11],
          $V5 = [1, 12],
          $V6 = [2, 14],
          $V7 = [1, 15],
          $V8 = [5, 16, 17],
          $V9 = [5, 13, 14, 16, 17];

      var parser = {
        trace: function trace() {},
        yy: {},
        symbols_: {
          "error": 2,
          "expressions": 3,
          "varExp": 4,
          "EOF": 5,
          "ruleExp": 6,
          "NAME": 7,
          ":": 8,
          "NUMBER": 9,
          ",": 10,
          "VERY": 11,
          "FAIRLY": 12,
          "AND": 13,
          "OR": 14,
          "(": 15,
          ")": 16,
          "=>": 17,
          "$accept": 0,
          "$end": 1
        },
        terminals_: {
          2: "error",
          5: "EOF",
          7: "NAME",
          8: ":",
          9: "NUMBER",
          10: ",",
          11: "VERY",
          12: "FAIRLY",
          13: "AND",
          14: "OR",
          15: "(",
          16: ")",
          17: "=>"
        },
        productions_: [0, [3, 2], [3, 2], [4, 11], [4, 9], [4, 7], [4, 5], [4, 7], [6, 2], [6, 2], [6, 3], [6, 3], [6, 3], [6, 3], [6, 1]],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate
        /* action[1] */
        , $$
        /* vstack */
        , _$
        /* lstack */
        ) {
          /* this == yyval */
          var $0 = $$.length - 1;

          switch (yystate) {
            case 1:
            case 2:
              return $$[$0 - 1];

            case 3:
              var setName = $$[$0 - 10],
                  setType = $$[$0];
              var left = Number($$[$0 - 8]),
                  middle = Number($$[$0 - 6]),
                  right = Number($$[$0 - 4]),
                  arg0 = Number($$[$0 - 2]);
              this.$ = {
                name: setName,
                type: setType,
                parameters: [left, middle, right, arg0]
              };
              break;

            case 4:
              var setName = $$[$0 - 8],
                  setType = $$[$0];
              var left = Number($$[$0 - 6]),
                  middle = Number($$[$0 - 4]),
                  right = Number($$[$0 - 2]);
              this.$ = {
                name: setName,
                type: setType,
                parameters: [left, middle, right]
              };
              break;

            case 5:
              var setName = $$[$0 - 6],
                  setType = undefined;
              var left = Number($$[$0 - 4]),
                  middle = Number($$[$0 - 2]),
                  right = Number($$[$0]);
              this.$ = {
                name: setName,
                type: setType,
                parameters: [left, middle, right]
              };
              break;

            case 6:
              var setName = $$[$0 - 4],
                  setType = undefined;
              var left = Number($$[$0 - 2]),
                  right = Number($$[$0]),
                  middle = (left + right) / 2;
              this.$ = {
                name: setName,
                type: setType,
                parameters: [left, middle, right]
              };
              break;

            case 7:
              var setName = $$[$0 - 6],
                  setType = $$[$0];
              var left = Number($$[$0 - 4]),
                  right = Number($$[$0 - 2]),
                  middle = (left + right) / 2;
              this.$ = {
                name: setName,
                type: setType,
                parameters: [left, middle, right]
              };
              break;

            case 8:
            case 9:
              this.$ = GetOperator1($$[$0 - 1], $$[$0]);
              break;

            case 10:
            case 11:
              this.$ = GetOperator2($$[$0 - 1], $$[$0 - 2], $$[$0]);
              break;

            case 12:
              this.$ = $$[$0 - 1];
              break;

            case 13:
              this.$ = ['=>', $$[$0 - 2], $$[$0]];
              break;

            case 14:
              this.$ = $$[$0];
              break;
          }
        },
        table: [{
          3: 1,
          4: 2,
          6: 3,
          7: [1, 4],
          11: $V0,
          12: $V1,
          15: $V2
        }, {
          1: [3]
        }, {
          5: [1, 8]
        }, {
          5: [1, 9],
          13: $V3,
          14: $V4,
          17: $V5
        }, o([5, 13, 14, 17], $V6, {
          8: [1, 13]
        }), {
          6: 14,
          7: $V7,
          11: $V0,
          12: $V1,
          15: $V2
        }, {
          6: 16,
          7: $V7,
          11: $V0,
          12: $V1,
          15: $V2
        }, {
          6: 17,
          7: $V7,
          11: $V0,
          12: $V1,
          15: $V2
        }, {
          1: [2, 1]
        }, {
          1: [2, 2]
        }, {
          6: 18,
          7: $V7,
          11: $V0,
          12: $V1,
          15: $V2
        }, {
          6: 19,
          7: $V7,
          11: $V0,
          12: $V1,
          15: $V2
        }, {
          7: [1, 20]
        }, {
          9: [1, 21]
        }, o($V8, [2, 8], {
          13: $V3,
          14: $V4
        }), o($V9, $V6), o($V8, [2, 9], {
          13: $V3,
          14: $V4
        }), {
          13: $V3,
          14: $V4,
          16: [1, 22],
          17: $V5
        }, o([5, 13, 16, 17], [2, 10], {
          14: $V4
        }), o($V9, [2, 11]), o($V9, [2, 13]), {
          10: [1, 23]
        }, o($V9, [2, 12]), {
          9: [1, 24]
        }, {
          5: [2, 6],
          10: [1, 25]
        }, {
          7: [1, 27],
          9: [1, 26]
        }, {
          5: [2, 5],
          10: [1, 28]
        }, {
          5: [2, 7]
        }, {
          7: [1, 30],
          9: [1, 29]
        }, {
          10: [1, 31]
        }, {
          5: [2, 4]
        }, {
          7: [1, 32]
        }, {
          5: [2, 3]
        }],
        defaultActions: {
          8: [2, 1],
          9: [2, 2],
          27: [2, 7],
          30: [2, 4],
          32: [2, 3]
        },
        parseError: function parseError(str, hash) {
          if (hash.recoverable) {
            this.trace(str);
          } else {
            var error = new Error(str);
            error.hash = hash;
            throw error;
          }
        },
        parse: function parse(input) {
          var self = this,
              stack = [0],
              vstack = [null],
              lstack = [],
              table = this.table,
              yytext = '',
              yylineno = 0,
              yyleng = 0,
              TERROR = 2,
              EOF = 1;
          var args = lstack.slice.call(arguments, 1);
          var lexer = Object.create(this.lexer);
          var sharedState = {
            yy: {}
          };

          for (var k in this.yy) {
            if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
              sharedState.yy[k] = this.yy[k];
            }
          }

          lexer.setInput(input, sharedState.yy);
          sharedState.yy.lexer = lexer;
          sharedState.yy.parser = this;

          if (typeof lexer.yylloc == 'undefined') {
            lexer.yylloc = {};
          }

          var yyloc = lexer.yylloc;
          lstack.push(yyloc);
          var ranges = lexer.options && lexer.options.ranges;

          if (typeof sharedState.yy.parseError === 'function') {
            this.parseError = sharedState.yy.parseError;
          } else {
            this.parseError = Object.getPrototypeOf(this).parseError;
          }

          var lex = function lex() {
            var token;
            token = lexer.lex() || EOF;

            if (typeof token !== 'number') {
              token = self.symbols_[token] || token;
            }

            return token;
          };

          var symbol,
              state,
              action,
              r,
              yyval = {},
              p,
              len,
              newState,
              expected;

          while (true) {
            state = stack[stack.length - 1];

            if (this.defaultActions[state]) {
              action = this.defaultActions[state];
            } else {
              if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
              }

              action = table[state] && table[state][symbol];
            }

            if (typeof action === 'undefined' || !action.length || !action[0]) {
              var errStr = '';
              expected = [];

              for (p in table[state]) {
                if (this.terminals_[p] && p > TERROR) {
                  expected.push('\'' + this.terminals_[p] + '\'');
                }
              }

              if (lexer.showPosition) {
                errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
              } else {
                errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
              }

              this.parseError(errStr, {
                text: lexer.match,
                token: this.terminals_[symbol] || symbol,
                line: lexer.yylineno,
                loc: yyloc,
                expected: expected
              });
            }

            if (action[0] instanceof Array && action.length > 1) {
              throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
            }

            switch (action[0]) {
              case 1:
                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]);
                symbol = null;

                {
                  yyleng = lexer.yyleng;
                  yytext = lexer.yytext;
                  yylineno = lexer.yylineno;
                  yyloc = lexer.yylloc;
                }

                break;

              case 2:
                len = this.productions_[action[1]][1];
                yyval.$ = vstack[vstack.length - len];
                yyval._$ = {
                  first_line: lstack[lstack.length - (len || 1)].first_line,
                  last_line: lstack[lstack.length - 1].last_line,
                  first_column: lstack[lstack.length - (len || 1)].first_column,
                  last_column: lstack[lstack.length - 1].last_column
                };

                if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                }

                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                  return r;
                }

                if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
                }

                stack.push(this.productions_[action[1]][0]);
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                stack.push(newState);
                break;

              case 3:
                return true;
            }
          }

          return true;
        }
      };

      function GetOperator1(operator, op1) {
        operator = operator.toLowerCase();
        return [operator, op1];
      }

      function GetOperator2(operator, op1, op2) {
        operator = operator.toLowerCase();
        var result = [operator];

        if (Array.isArray(op1) && op1[0] === operator) {
          for (var i = 1, cnt = op1.length; i < cnt; i++) {
            result.push(op1[i]);
          }
        } else {
          result.push(op1);
        }

        if (Array.isArray(op2) && op2[0] === operator) {
          for (var i = 1, cnt = op2.length; i < cnt; i++) {
            result.push(op2[i]);
          }
        } else {
          result.push(op2);
        }

        return result;
      }
      /* generated by jison-lex 0.3.4 */


      var lexer = function () {
        var lexer = {
          EOF: 1,
          parseError: function parseError(str, hash) {
            if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
            } else {
              throw new Error(str);
            }
          },
          // resets the lexer, sets new input
          setInput: function setInput(input, yy) {
            this.yy = yy || this.yy || {};
            this._input = input;
            this._more = this._backtrack = this.done = false;
            this.yylineno = this.yyleng = 0;
            this.yytext = this.matched = this.match = '';
            this.conditionStack = ['INITIAL'];
            this.yylloc = {
              first_line: 1,
              first_column: 0,
              last_line: 1,
              last_column: 0
            };

            if (this.options.ranges) {
              this.yylloc.range = [0, 0];
            }

            this.offset = 0;
            return this;
          },
          // consumes and returns one char from the input
          input: function input() {
            var ch = this._input[0];
            this.yytext += ch;
            this.yyleng++;
            this.offset++;
            this.match += ch;
            this.matched += ch;
            var lines = ch.match(/(?:\r\n?|\n).*/g);

            if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
            } else {
              this.yylloc.last_column++;
            }

            if (this.options.ranges) {
              this.yylloc.range[1]++;
            }

            this._input = this._input.slice(1);
            return ch;
          },
          // unshifts one char (or a string) into the input
          unput: function unput(ch) {
            var len = ch.length;
            var lines = ch.split(/(?:\r\n?|\n)/g);
            this._input = ch + this._input;
            this.yytext = this.yytext.substr(0, this.yytext.length - len); //this.yyleng -= len;

            this.offset -= len;
            var oldLines = this.match.split(/(?:\r\n?|\n)/g);
            this.match = this.match.substr(0, this.match.length - 1);
            this.matched = this.matched.substr(0, this.matched.length - 1);

            if (lines.length - 1) {
              this.yylineno -= lines.length - 1;
            }

            var r = this.yylloc.range;
            this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
            };

            if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
            }

            this.yyleng = this.yytext.length;
            return this;
          },
          // When called from action, caches matched text and appends it on next action
          more: function more() {
            this._more = true;
            return this;
          },
          // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
          reject: function reject() {
            if (this.options.backtrack_lexer) {
              this._backtrack = true;
            } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
              });
            }

            return this;
          },
          // retain first n characters of the match
          less: function less(n) {
            this.unput(this.match.slice(n));
          },
          // displays already matched input, i.e. for error messages
          pastInput: function pastInput() {
            var past = this.matched.substr(0, this.matched.length - this.match.length);
            return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
          },
          // displays upcoming input, i.e. for error messages
          upcomingInput: function upcomingInput() {
            var next = this.match;

            if (next.length < 20) {
              next += this._input.substr(0, 20 - next.length);
            }

            return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
          },
          // displays the character position where the lexing error occurred, i.e. for error messages
          showPosition: function showPosition() {
            var pre = this.pastInput();
            var c = new Array(pre.length + 1).join("-");
            return pre + this.upcomingInput() + "\n" + c + "^";
          },
          // test the lexed token: return FALSE when not a match, otherwise return token
          test_match: function test_match(match, indexed_rule) {
            var token, lines, backup;

            if (this.options.backtrack_lexer) {
              // save context
              backup = {
                yylineno: this.yylineno,
                yylloc: {
                  first_line: this.yylloc.first_line,
                  last_line: this.last_line,
                  first_column: this.yylloc.first_column,
                  last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
              };

              if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
              }
            }

            lines = match[0].match(/(?:\r\n?|\n).*/g);

            if (lines) {
              this.yylineno += lines.length;
            }

            this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
            };
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;

            if (this.options.ranges) {
              this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }

            this._more = false;
            this._backtrack = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);

            if (this.done && this._input) {
              this.done = false;
            }

            if (token) {
              return token;
            } else if (this._backtrack) {
              // recover context
              for (var k in backup) {
                this[k] = backup[k];
              }

              return false; // rule action called reject() implying the next rule should be tested instead.
            }

            return false;
          },
          // return next match in input
          next: function next() {
            if (this.done) {
              return this.EOF;
            }

            if (!this._input) {
              this.done = true;
            }

            var token, match, tempMatch, index;

            if (!this._more) {
              this.yytext = '';
              this.match = '';
            }

            var rules = this._currentRules();

            for (var i = 0; i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);

              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;

                if (this.options.backtrack_lexer) {
                  token = this.test_match(tempMatch, rules[i]);

                  if (token !== false) {
                    return token;
                  } else if (this._backtrack) {
                    match = false;
                    continue; // rule action called reject() implying a rule MISmatch.
                  } else {
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                  }
                } else if (!this.options.flex) {
                  break;
                }
              }
            }

            if (match) {
              token = this.test_match(match, rules[index]);

              if (token !== false) {
                return token;
              } // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)


              return false;
            }

            if (this._input === "") {
              return this.EOF;
            } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
              });
            }
          },
          // return next match that has a token
          lex: function lex() {
            var r = this.next();

            if (r) {
              return r;
            } else {
              return this.lex();
            }
          },
          // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
          begin: function begin(condition) {
            this.conditionStack.push(condition);
          },
          // pop the previously active lexer condition state off the condition stack
          popState: function popState() {
            var n = this.conditionStack.length - 1;

            if (n > 0) {
              return this.conditionStack.pop();
            } else {
              return this.conditionStack[0];
            }
          },
          // produce the lexer rule set which is active for the currently active lexer condition state
          _currentRules: function _currentRules() {
            if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
              return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
            } else {
              return this.conditions["INITIAL"].rules;
            }
          },
          // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
          topState: function topState(n) {
            n = this.conditionStack.length - 1 - Math.abs(n || 0);

            if (n >= 0) {
              return this.conditionStack[n];
            } else {
              return "INITIAL";
            }
          },
          // alias for begin(condition)
          pushState: function pushState(condition) {
            this.begin(condition);
          },
          // return the number of states currently on the stack
          stateStackSize: function stateStackSize() {
            return this.conditionStack.length;
          },
          options: {},
          performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

            switch ($avoiding_name_collisions) {
              case 0:
                /* skip whitespace */
                break;

              case 1:
                return ":";

              case 2:
                return ",";

              case 3:
                return 17;

              case 4:
                return 14;

              case 5:
                return 14;

              case 6:
                return 13;

              case 7:
                return 13;

              case 8:
                return 11;

              case 9:
                return 11;

              case 10:
                return 12;

              case 11:
                return 12;

              case 12:
                return 15;

              case 13:
                return 16;

              case 14:
                return 9;

              case 15:
                return 7;

              case 16:
                return 5;

              case 17:
                return 'INVALID';
            }
          },
          rules: [/^(?:\s+)/, /^(?::)/, /^(?:,)/, /^(?:=>)/, /^(?:or\b)/, /^(?:OR\b)/, /^(?:and\b)/, /^(?:AND\b)/, /^(?:very\b)/, /^(?:VERY\b)/, /^(?:fairly\b)/, /^(?:FAIRLY\b)/, /^(?:\()/, /^(?:\))/, /^(?:[0-9]+(\.[0-9]+)?\b)/, /^(?:[0-9a-zA-Z_.]+[+-]*)/, /^(?:$)/, /^(?:.)/],
          conditions: {
            "INITIAL": {
              "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
              "inclusive": true
            }
          }
        };
        return lexer;
      }();

      parser.lexer = lexer;

      function Parser() {
        this.yy = {};
      }

      Parser.prototype = parser;
      parser.Parser = Parser;
      return new Parser();
    }();

    if (typeof commonjsRequire !== 'undefined' && 'object' !== 'undefined') {
      exports.parser = parser;
      exports.Parser = parser.Parser;

      exports.parse = function () {
        return parser.parse.apply(parser, arguments);
      };

      exports.main = function commonjsMain(args) {
        if (!args[1]) {
          console.log('Usage: ' + args[0] + ' FILE');
          process.exit(1);
        }

        var source = require$$0.readFileSync(require$$1.normalize(args[1]), "utf8");
        return exports.parser.parse(source);
      };

      if (commonjsRequire.main === module) {
        exports.main(process.argv.slice(1));
      }
    }
  });
  parser_1.parser;
  parser_1.Parser;
  parser_1.parse;
  parser_1.main;

  var Parser = new parser_1.Parser();

  var Parse = function Parse(input) {
    return Parser.parse(input);
  };

  var IsInvalidLine = function IsInvalidLine(line) {
    // Is empty line
    if (line.length === 0 || !line.trim()) {
      return true;
    } // Is comment line


    if (line.trimStart().substring(0, 2) === '//') {
      return true;
    }
  };

  var BuildFuzzyVariables = function BuildFuzzyVariables(fuzzyModule, variables) {
    // String -> FuzzySets array
    if (typeof variables === 'string') {
      variables = variables.split('\n');
    } // FuzzySets array -> Variables dictionary


    if (Array.isArray(variables)) {
      // Fuzzy sets in array
      var lines = variables;
      variables = [];

      for (var i = 0, cnt = lines.length; i < cnt; i++) {
        var line = lines[i];

        if (typeof line !== 'string') {
          variables.push(line);
          continue;
        } // Fuzzy set might be string


        if (IsInvalidLine(line)) {
          continue;
        }

        variables.push(Parse(line));
      } // Bind fuzzy set to variables


      variables = BindFuzzySets(variables);
    }

    for (var name in variables) {
      var flv = BuildFuzzyVariable(variables[name]);
      fuzzyModule.addFLV(name, flv);
    }
  };

  var BindFuzzySets = function BindFuzzySets(fuzzySets) {
    var variables = {};

    for (var i = 0, cnt = fuzzySets.length; i < cnt; i++) {
      var fuzzySet = fuzzySets[i];
      var variableName = GetVariableName(fuzzySet.name);

      if (!variables.hasOwnProperty(variableName)) {
        variables[variableName] = [];
      }

      variables[variableName].push(fuzzySet);
    }

    return variables;
  };

  var GetAllFuzzySets = function GetAllFuzzySets(fuzzyModule) {
    var allFuzzySets = {};
    var flvs = fuzzyModule.flvs;

    for (var name in flvs) {
      var FLVFuzzySets = flvs[name].fuzzySets;

      for (var i = 0, cnt = FLVFuzzySets.length; i < cnt; i++) {
        var fuzzySet = FLVFuzzySets[i];
        allFuzzySets[fuzzySet.name] = fuzzySet;
      }
    }

    return allFuzzySets;
  };

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  */
  var FuzzyRule = /*#__PURE__*/function () {
    function FuzzyRule(antecedent, consequence) {
      _classCallCheck(this, FuzzyRule);

      this.antecedent = antecedent;
      this.consequence = consequence;
    }

    _createClass(FuzzyRule, [{
      key: "initConsequence",
      value: function initConsequence() {
        this.consequence.clearDegreeOfMembership();
        return this;
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.consequence.updateDegreeOfMembership(this.antecedent.getDegreeOfMembership());
        return this;
      }
    }]);

    return FuzzyRule;
  }();

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzyTerm
  */
  var FuzzyCompositeTerm = /*#__PURE__*/function () {
    function FuzzyCompositeTerm(terms) {
      _classCallCheck(this, FuzzyCompositeTerm);

      this.terms = terms;
    }

    _createClass(FuzzyCompositeTerm, [{
      key: "clearDegreeOfMembership",
      value: function clearDegreeOfMembership() {
        var terms = this.terms;

        for (var i = 0, l = terms.length; i < l; i++) {
          terms[i].clearDegreeOfMembership();
        }

        return this;
      }
    }, {
      key: "updateDegreeOfMembership",
      value: function updateDegreeOfMembership(value) {
        var terms = this.terms;

        for (var i = 0, l = terms.length; i < l; i++) {
          terms[i].updateDegreeOfMembership(value);
        }

        return this;
      }
    }]);

    return FuzzyCompositeTerm;
  }();

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzyCompositeTerm
  */

  var FuzzyAND = /*#__PURE__*/function (_FuzzyCompositeTerm) {
    _inherits(FuzzyAND, _FuzzyCompositeTerm);

    var _super = _createSuper(FuzzyAND);

    function FuzzyAND() {
      _classCallCheck(this, FuzzyAND);

      var terms = Array.from(arguments);
      return _super.call(this, terms);
    }

    _createClass(FuzzyAND, [{
      key: "getDegreeOfMembership",
      value: function getDegreeOfMembership() {
        var terms = this.terms;
        var minDOM = Infinity;

        for (var i = 0, l = terms.length; i < l; i++) {
          var currentDOM = terms[i].getDegreeOfMembership();

          if (currentDOM < minDOM) {
            minDOM = currentDOM;
          }
        }

        return minDOM;
      }
    }]);

    return FuzzyAND;
  }(FuzzyCompositeTerm);

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzyCompositeTerm
  */

  var FuzzyOR = /*#__PURE__*/function (_FuzzyCompositeTerm) {
    _inherits(FuzzyOR, _FuzzyCompositeTerm);

    var _super = _createSuper(FuzzyOR);

    function FuzzyOR() {
      _classCallCheck(this, FuzzyOR);

      var terms = Array.from(arguments);
      return _super.call(this, terms);
    }

    _createClass(FuzzyOR, [{
      key: "getDegreeOfMembership",
      value: function getDegreeOfMembership() {
        var terms = this.terms;
        var maxDOM = -Infinity;

        for (var i = 0, l = terms.length; i < l; i++) {
          var currentDOM = terms[i].getDegreeOfMembership();

          if (currentDOM > maxDOM) {
            maxDOM = currentDOM;
          }
        }

        return maxDOM;
      }
    }]);

    return FuzzyOR;
  }(FuzzyCompositeTerm);

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzyCompositeTerm
  */

  var FuzzyFAIRLY = /*#__PURE__*/function (_FuzzyCompositeTerm) {
    _inherits(FuzzyFAIRLY, _FuzzyCompositeTerm);

    var _super = _createSuper(FuzzyFAIRLY);

    function FuzzyFAIRLY(fuzzyTerm) {
      _classCallCheck(this, FuzzyFAIRLY);

      return _super.call(this, [fuzzyTerm]);
    }

    _createClass(FuzzyFAIRLY, [{
      key: "clearDegreeOfMembership",
      value: function clearDegreeOfMembership() {
        this.terms[0].clearDegreeOfMembership();
        return this;
      }
    }, {
      key: "getDegreeOfMembership",
      value: function getDegreeOfMembership() {
        var dom = this.terms[0].getDegreeOfMembership();
        return Math.sqrt(dom);
      }
    }, {
      key: "updateDegreeOfMembership",
      value: function updateDegreeOfMembership(value) {
        this.terms[0].updateDegreeOfMembership(Math.sqrt(value));
        return this;
      }
    }]);

    return FuzzyFAIRLY;
  }(FuzzyCompositeTerm);

  /**
  * @author {@link https://github.com/Mugen87|Mugen87}
  * @augments FuzzyCompositeTerm
  */

  var FuzzyVERY = /*#__PURE__*/function (_FuzzyCompositeTerm) {
    _inherits(FuzzyVERY, _FuzzyCompositeTerm);

    var _super = _createSuper(FuzzyVERY);

    function FuzzyVERY() {
      var fuzzyTerm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, FuzzyVERY);

      return _super.call(this, [fuzzyTerm]);
    }

    _createClass(FuzzyVERY, [{
      key: "clearDegreeOfMembership",
      value: function clearDegreeOfMembership() {
        this.terms[0].clearDegreeOfMembership();
        return this;
      }
    }, {
      key: "getDegreeOfMembership",
      value: function getDegreeOfMembership() {
        var dom = this.terms[0].getDegreeOfMembership();
        return dom * dom;
      }
    }, {
      key: "updateDegreeOfMembership",
      value: function updateDegreeOfMembership(value) {
        this.terms[0].updateDegreeOfMembership(value * value);
        return this;
      }
    }]);

    return FuzzyVERY;
  }(FuzzyCompositeTerm);

  var BuildFuzzyRule = function BuildFuzzyRule(ruleInput, fuzzySets) {
    var ruleJson = Parse(ruleInput);
    var antecedent = BuildFuzzyCompositeTerm(ruleJson[1], fuzzySets);
    var consequence = fuzzySets[ruleJson[2]];
    var rule = new FuzzyRule(antecedent, consequence);
    return rule;
  };

  var BuildFuzzyCompositeTerm = function BuildFuzzyCompositeTerm(terms, fuzzySets) {
    // terms: undefined, string, or array
    if (!terms) {
      return null;
    } else if (typeof terms === 'string') {
      if (!fuzzySets.hasOwnProperty(terms)) {
        throw "Can't find fuzzy set ".concat(terms);
      }

      return fuzzySets[terms];
    } // Array


    var operations = [];

    for (var i = 1, cnt = terms.length; i < cnt; i++) {
      operations.push(BuildFuzzyCompositeTerm(terms[i], fuzzySets));
    }

    var operatorClass = OperatorClasses[terms[0]];

    var operator = _construct(operatorClass, operations);

    return operator;
  };

  var OperatorClasses = {
    and: FuzzyAND,
    or: FuzzyOR,
    fairly: FuzzyFAIRLY,
    very: FuzzyVERY
  };

  var BuildFuzzyRules = function BuildFuzzyRules(fuzzyModule, rules, fuzzySets) {
    if (typeof rules === 'string') {
      rules = rules.split('\n');
    }

    for (var i = 0, cnt = rules.length; i < cnt; i++) {
      var rule = rules[i];

      if (IsInvalidLine(rule)) {
        continue;
      }

      fuzzyModule.addRule(BuildFuzzyRule(rule, fuzzySets));
    }
  };

  var BuildFuzzyModule = function BuildFuzzyModule(config) {
    if (typeof config === 'string') {
      var variables = [];
      var rules = [];
      var lines = config.split('\n');

      for (var i = 0, cnt = lines.length; i < cnt; i++) {
        var line = lines[i];

        if (IsInvalidLine(line)) {
          continue;
        }

        if (line.indexOf('=>') !== -1) {
          rules.push(line);
        } else {
          variables.push(line);
        }
      }

      config = {
        variables: variables,
        rules: rules
      };
    }

    var fuzzyModule = new FuzzyModule();
    BuildFuzzyVariables(fuzzyModule, config.variables);
    BuildFuzzyRules(fuzzyModule, config.rules, GetAllFuzzySets(fuzzyModule));
    return fuzzyModule;
  };

  var FuzzyPlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(FuzzyPlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(FuzzyPlugin);

    function FuzzyPlugin(pluginManager) {
      _classCallCheck(this, FuzzyPlugin);

      return _super.call(this, pluginManager);
    }

    _createClass(FuzzyPlugin, [{
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
      }
    }, {
      key: "add",
      value: function add(config) {
        return BuildFuzzyModule(config);
      }
    }]);

    return FuzzyPlugin;
  }(Phaser.Plugins.BasePlugin);

  return FuzzyPlugin;

}));
