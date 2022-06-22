(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexpolarcoordinateplugin = factory());
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

  var PolarToCartesian = function PolarToCartesian(ox, oy, rotation, radius, out) {
    if (out === undefined) {
      out = {};
    } else if (out === true) {
      out = globOut;
    }

    out.x = radius * Math.cos(rotation) + ox;
    out.y = radius * Math.sin(rotation) + oy;
    return out;
  };

  var globOut = {};

  var DegToRad = Phaser.Math.DegToRad;
  var RadToDeg = Phaser.Math.RadToDeg;

  var AddPolarCoordinateProperties = function AddPolarCoordinateProperties(gameObject, ox, oy, rotation, radius) {
    // Don't attach properties again
    if (gameObject.hasOwnProperty('polarOX')) {
      return gameObject;
    }

    if (ox === undefined) {
      ox = 0;
    }

    if (oy === undefined) {
      oy = 0;
    }

    if (rotation === undefined) {
      rotation = 0;
    }

    if (radius === undefined) {
      radius = 0;
    }

    Object.defineProperty(gameObject, 'polarOX', {
      get: function get() {
        return ox;
      },
      set: function set(value) {
        if (ox !== value) {
          ox = value;
          PolarToCartesian(ox, oy, rotation, radius, gameObject);
        }
      }
    });
    Object.defineProperty(gameObject, 'polarOY', {
      get: function get() {
        return oy;
      },
      set: function set(value) {
        if (oy !== value) {
          oy = value;
          PolarToCartesian(ox, oy, rotation, radius, gameObject);
        }
      }
    });
    Object.defineProperty(gameObject, 'polarRotation', {
      get: function get() {
        return rotation;
      },
      set: function set(value) {
        if (rotation !== value) {
          rotation = value;
          PolarToCartesian(ox, oy, rotation, radius, gameObject);
        }
      }
    });
    Object.defineProperty(gameObject, 'polarAngle', {
      get: function get() {
        return RadToDeg(rotation);
      },
      set: function set(value) {
        this.polarRotation = DegToRad(value);
      }
    });
    Object.defineProperty(gameObject, 'polarRadius', {
      get: function get() {
        return radius;
      },
      set: function set(value) {
        if (radius !== value) {
          radius = value;
          PolarToCartesian(ox, oy, rotation, radius, gameObject);
        }
      }
    });
    PolarToCartesian(ox, oy, rotation, radius, gameObject);
  };

  var PolarCoordinatePlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(PolarCoordinatePlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(PolarCoordinatePlugin);

    function PolarCoordinatePlugin(pluginManager) {
      _classCallCheck(this, PolarCoordinatePlugin);

      return _super.call(this, pluginManager);
    }

    _createClass(PolarCoordinatePlugin, [{
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
      }
    }, {
      key: "add",
      value: function add(gameObject, ox, oy, rotation, radius) {
        return AddPolarCoordinateProperties(gameObject, ox, oy, rotation, radius);
      }
    }]);

    return PolarCoordinatePlugin;
  }(Phaser.Plugins.BasePlugin);

  return PolarCoordinatePlugin;

}));
