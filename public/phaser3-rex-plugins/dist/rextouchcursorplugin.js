(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rextouchcursorplugin = factory());
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

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }

        return desc.value;
      };
    }

    return _get.apply(this, arguments);
  }

  var Key = Phaser.Input.Keyboard.Key;
  var KeyCodes = Phaser.Input.Keyboard.KeyCodes;

  var CursorKeys = /*#__PURE__*/function () {
    function CursorKeys(scene) {
      _classCallCheck(this, CursorKeys);

      // scene: scene instance, or undefined
      this.cursorKeys = {
        up: new Key(scene, KeyCodes.UP),
        down: new Key(scene, KeyCodes.DOWN),
        left: new Key(scene, KeyCodes.LEFT),
        right: new Key(scene, KeyCodes.RIGHT)
      };
      this.noKeyDown = true;
    }

    _createClass(CursorKeys, [{
      key: "shutdown",
      value: function shutdown(fromScene) {
        for (var key in this.cursorKeys) {
          this.cursorKeys[key].destroy();
        }

        this.cursorKeys = undefined;
      }
    }, {
      key: "destroy",
      value: function destroy(fromScene) {
        shutdown(fromScene);
      }
    }, {
      key: "createCursorKeys",
      value: function createCursorKeys() {
        return this.cursorKeys;
      }
    }, {
      key: "setKeyState",
      value: function setKeyState(keyName, isDown) {
        var key = this.cursorKeys[keyName];

        if (!key.enabled) {
          return this;
        }

        if (isDown) {
          this.noKeyDown = false;
        }

        if (key.isDown !== isDown) {
          FakeEvent.timeStamp = Date.now();
          FakeEvent.keyCode = key.keyCode;

          if (isDown) {
            key.onDown(FakeEvent);
          } else {
            key.onUp(FakeEvent);
          }
        }

        return this;
      }
    }, {
      key: "clearAllKeysState",
      value: function clearAllKeysState() {
        this.noKeyDown = true;

        for (var keyName in this.cursorKeys) {
          this.setKeyState(keyName, false);
        }

        return this;
      }
    }, {
      key: "getKeyState",
      value: function getKeyState(keyName) {
        return this.cursorKeys[keyName];
      }
    }, {
      key: "upKeyDown",
      get: function get() {
        return this.cursorKeys.up.isDown;
      }
    }, {
      key: "downKeyDown",
      get: function get() {
        return this.cursorKeys.down.isDown;
      }
    }, {
      key: "leftKeyDown",
      get: function get() {
        return this.cursorKeys.left.isDown;
      }
    }, {
      key: "rightKeyDown",
      get: function get() {
        return this.cursorKeys.right.isDown;
      }
    }, {
      key: "anyKeyDown",
      get: function get() {
        return !this.noKeyDown;
      }
    }]);

    return CursorKeys;
  }();

  var FakeEvent = {
    timeStamp: 0,
    keyCode: 0,
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    location: 0
  };

  /**
   * @author       Richard Davey <rich@photonstorm.com>
   * @copyright    2018 Photon Storm Ltd.
   * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
   */
  var RAD_TO_DEG = 180 / Math.PI;
  /**
   * Convert the given angle in radians, to the equivalent angle in degrees.
   *
   * @function Phaser.Math.RadToDeg
   * @since 3.0.0
   *
   * @param {number} radians - The angle in radians to convert ot degrees.
   *
   * @return {integer} The given angle converted to degrees.
   */

  var RadToDeg = function RadToDeg(radians) {
    return radians * RAD_TO_DEG;
  };

  var DIRMODE = {
    'up&down': 0,
    'left&right': 1,
    '4dir': 2,
    '8dir': 3
  };

  var AngleToDirections = function AngleToDirections(angle, dirMode, out) {
    if (out === undefined) {
      out = {};
    } else if (out === true) {
      out = globOut;
    }

    out.left = false;
    out.right = false;
    out.up = false;
    out.down = false;
    angle = (angle + 360) % 360;

    switch (dirMode) {
      case 0:
        // up & down
        if (angle < 180) {
          out.down = true;
        } else {
          out.up = true;
        }

        break;

      case 1:
        // left & right
        if (angle > 90 && angle <= 270) {
          out.left = true;
        } else {
          out.right = true;
        }

        break;

      case 2:
        // 4 dir
        if (angle > 45 && angle <= 135) {
          out.down = true;
        } else if (angle > 135 && angle <= 225) {
          out.left = true;
        } else if (angle > 225 && angle <= 315) {
          out.up = true;
        } else {
          out.right = true;
        }

        break;

      case 3:
        // 8 dir
        if (angle > 22.5 && angle <= 67.5) {
          out.down = true;
          out.right = true;
        } else if (angle > 67.5 && angle <= 112.5) {
          out.down = true;
        } else if (angle > 112.5 && angle <= 157.5) {
          out.down = true;
          out.left = true;
        } else if (angle > 157.5 && angle <= 202.5) {
          out.left = true;
        } else if (angle > 202.5 && angle <= 247.5) {
          out.left = true;
          out.up = true;
        } else if (angle > 247.5 && angle <= 292.5) {
          out.up = true;
        } else if (angle > 292.5 && angle <= 337.5) {
          out.up = true;
          out.right = true;
        } else {
          out.right = true;
        }

        break;
    }

    return out;
  };

  var globOut = {};

  var GetValue$1 = Phaser.Utils.Objects.GetValue;
  var GetDist = Phaser.Math.Distance.Between;
  var GetAngle = Phaser.Math.Angle.Between;

  var VectorToCursorKeys = /*#__PURE__*/function (_CursorKeys) {
    _inherits(VectorToCursorKeys, _CursorKeys);

    var _super = _createSuper(VectorToCursorKeys);

    function VectorToCursorKeys(scene, config) {
      var _this;

      _classCallCheck(this, VectorToCursorKeys);

      _this = _super.call(this, scene);

      _this.resetFromJSON(config);

      return _this;
    }

    _createClass(VectorToCursorKeys, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        if (this.start == undefined) {
          this.start = {
            x: 0,
            y: 0
          };
        }

        if (this.end == undefined) {
          this.end = {
            x: 0,
            y: 0
          };
        }

        this._enable = undefined;
        this.setEnable(GetValue$1(o, 'enable', true));
        this.setMode(GetValue$1(o, 'dir', '8dir'));
        this.setDistanceThreshold(GetValue$1(o, 'forceMin', 16));
        var startX = GetValue$1(o, "start.x", null);
        var startY = GetValue$1(o, "start.y", null);
        var endX = GetValue$1(o, "end.x", null);
        var endY = GetValue$1(o, "end.y", null);
        this.setVector(startX, startY, endX, endY);
        return this;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          enable: this.enable,
          dir: this.dirMode,
          forceMin: this.forceMin,
          start: {
            x: this.start.x,
            y: this.start.y
          },
          end: {
            x: this.end.x,
            y: this.end.y
          }
        };
      }
    }, {
      key: "setMode",
      value: function setMode(m) {
        if (typeof m === 'string') {
          m = DIRMODE[m];
        }

        this.dirMode = m;
        return this;
      }
    }, {
      key: "enable",
      get: function get() {
        return this._enable;
      },
      set: function set(e) {
        if (this._enable === e) {
          return;
        }

        if (!e) {
          this.clearVector();
        }

        this._enable = e;
        return this;
      }
    }, {
      key: "setEnable",
      value: function setEnable(e) {
        if (e === undefined) {
          e = true;
        }

        this.enable = e;
        return this;
      }
    }, {
      key: "toggleEnable",
      value: function toggleEnable() {
        this.setEnable(!this.enable);
        return this;
      }
    }, {
      key: "setDistanceThreshold",
      value: function setDistanceThreshold(d) {
        if (d < 0) {
          d = 0;
        }

        this.forceMin = d;
        return this;
      }
    }, {
      key: "clearVector",
      value: function clearVector() {
        this.start.x = 0;
        this.start.y = 0;
        this.end.x = 0;
        this.end.y = 0;
        this.clearAllKeysState();
        return this;
      }
    }, {
      key: "setVector",
      value: function setVector(x0, y0, x1, y1) {
        if (!this.enable) {
          // Do nothing
          return this;
        }

        if (x0 === null) {
          // Clear all keys' state
          this.clearVector();
          return this;
        } // (0,0) -> (x0, y0)


        if (x1 === undefined) {
          x1 = x0;
          x0 = 0;
          y1 = y0;
          y0 = 0;
        }

        this.start.x = x0;
        this.start.y = y0;
        this.end.x = x1;
        this.end.y = y1;

        if (this.forceMin > 0 && this.force < this.forceMin) {
          // No key pressed
          this.clearVector();
          return this;
        } // Update keys' state


        this.noKeyDown = true;
        var dirStates = AngleToDirections(this.angle, this.dirMode, true);

        for (var dir in dirStates) {
          this.setKeyState(dir, dirStates[dir]);
        }

        return this;
      }
    }, {
      key: "forceX",
      get: function get() {
        return this.end.x - this.start.x;
      }
    }, {
      key: "forceY",
      get: function get() {
        return this.end.y - this.start.y;
      }
    }, {
      key: "force",
      get: function get() {
        return GetDist(this.start.x, this.start.y, this.end.x, this.end.y);
      }
    }, {
      key: "rotation",
      get: function get() {
        return GetAngle(this.start.x, this.start.y, this.end.x, this.end.y);
      }
    }, {
      key: "angle",
      get: function get() {
        return RadToDeg(this.rotation); // -180 ~ 180
      }
    }, {
      key: "octant",
      get: function get() {
        var octant = 0;

        if (this.rightKeyDown) {
          octant = this.downKeyDown ? 45 : 0;
        } else if (this.downKeyDown) {
          octant = this.leftKeyDown ? 135 : 90;
        } else if (this.leftKeyDown) {
          octant = this.upKeyDown ? 225 : 180;
        } else if (this.upKeyDown) {
          octant = this.rightKeyDown ? 315 : 270;
        }

        return octant;
      }
    }]);

    return VectorToCursorKeys;
  }(CursorKeys);

  var EventEmitterMethods = {
    setEventEmitter: function setEventEmitter(eventEmitter, EventEmitterClass) {
      if (EventEmitterClass === undefined) {
        EventEmitterClass = Phaser.Events.EventEmitter; // Use built-in EventEmitter class by default
      }

      this._privateEE = eventEmitter === true || eventEmitter === undefined;
      this._eventEmitter = this._privateEE ? new EventEmitterClass() : eventEmitter;
      return this;
    },
    destroyEventEmitter: function destroyEventEmitter() {
      if (this._eventEmitter && this._privateEE) {
        this._eventEmitter.shutdown();
      }

      return this;
    },
    getEventEmitter: function getEventEmitter() {
      return this._eventEmitter;
    },
    on: function on() {
      if (this._eventEmitter) {
        this._eventEmitter.on.apply(this._eventEmitter, arguments);
      }

      return this;
    },
    once: function once() {
      if (this._eventEmitter) {
        this._eventEmitter.once.apply(this._eventEmitter, arguments);
      }

      return this;
    },
    off: function off() {
      if (this._eventEmitter) {
        this._eventEmitter.off.apply(this._eventEmitter, arguments);
      }

      return this;
    },
    emit: function emit(event) {
      if (this._eventEmitter && event) {
        this._eventEmitter.emit.apply(this._eventEmitter, arguments);
      }

      return this;
    },
    addListener: function addListener() {
      if (this._eventEmitter) {
        this._eventEmitter.addListener.apply(this._eventEmitter, arguments);
      }

      return this;
    },
    removeListener: function removeListener() {
      if (this._eventEmitter) {
        this._eventEmitter.removeListener.apply(this._eventEmitter, arguments);
      }

      return this;
    },
    removeAllListeners: function removeAllListeners() {
      if (this._eventEmitter) {
        this._eventEmitter.removeAllListeners.apply(this._eventEmitter, arguments);
      }

      return this;
    },
    listenerCount: function listenerCount() {
      if (this._eventEmitter) {
        return this._eventEmitter.listenerCount.apply(this._eventEmitter, arguments);
      }

      return 0;
    },
    listeners: function listeners() {
      if (this._eventEmitter) {
        return this._eventEmitter.listeners.apply(this._eventEmitter, arguments);
      }

      return [];
    },
    eventNames: function eventNames() {
      if (this._eventEmitter) {
        return this._eventEmitter.eventNames.apply(this._eventEmitter, arguments);
      }

      return [];
    }
  };

  var ScreenXYToWorldXY = function ScreenXYToWorldXY(screenX, screenY, camera, out) {
    if (out === undefined) {
      out = {};
    } else if (out === true) {
      out = globalOut;
    }

    camera.getWorldPoint(screenX, screenY, out);
    return out;
  };

  var globalOut = {};

  var GetValue = Phaser.Utils.Objects.GetValue;
  var CircleClass = Phaser.Geom.Circle;
  var CircleContains = Phaser.Geom.Circle.Contains;

  var TouchCursor = /*#__PURE__*/function (_VectorToCursorKeys) {
    _inherits(TouchCursor, _VectorToCursorKeys);

    var _super = _createSuper(TouchCursor);

    function TouchCursor(gameObject, config) {
      var _this;

      _classCallCheck(this, TouchCursor);

      var scene = gameObject.scene;
      _this = _super.call(this, scene, config); //this.resetFromJSON(config); // this function had been called in super(config)
      // Event emitter

      var eventEmitter = GetValue(config, 'eventEmitter', undefined);
      var EventEmitterClass = GetValue(config, 'EventEmitterClass', undefined);

      _this.setEventEmitter(eventEmitter, EventEmitterClass);

      _this.scene = scene;
      _this.mainCamera = scene.sys.cameras.main;
      _this.pointer = undefined;
      _this.gameObject = gameObject;
      _this.radius = GetValue(config, 'radius', 100);
      gameObject.setInteractive(new CircleClass(gameObject.displayOriginX, gameObject.displayOriginY, _this.radius), CircleContains);

      _this.boot();

      return _this;
    }

    _createClass(TouchCursor, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        _get(_getPrototypeOf(TouchCursor.prototype), "resetFromJSON", this).call(this, o);

        this.pointer = undefined;
        return this;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var o = _get(_getPrototypeOf(TouchCursor.prototype), "toJSON", this).call(this);

        o.radius = this.radius;
        return o;
      }
    }, {
      key: "boot",
      value: function boot() {
        this.gameObject.on('pointerdown', this.onKeyDownStart, this);
        this.gameObject.on('pointerover', this.onKeyDownStart, this);
        this.scene.input.on('pointermove', this.onKeyDown, this);
        this.scene.input.on('pointerup', this.onKeyUp, this);
        this.gameObject.once('destroy', this.onParentDestroy, this);
      }
    }, {
      key: "shutdown",
      value: function shutdown(fromScene) {
        if (!this.scene) {
          return;
        } // gameObject events will be removed when this gameObject destroyed 
        // this.gameObject.off('pointerdown', this.onKeyDownStart, this);
        // this.gameObject.off('pointerover', this.onKeyDownStart, this);


        this.scene.input.off('pointermove', this.onKeyDown, this);
        this.scene.input.off('pointerup', this.onKeyUp, this);
        this.destroyEventEmitter();
        this.scene = undefined;
        this.mainCamera = undefined;
        this.pointer = undefined;
        this.gameObject = undefined;

        _get(_getPrototypeOf(TouchCursor.prototype), "shutdown", this).call(this);
      }
    }, {
      key: "destroy",
      value: function destroy(fromScene) {
        this.shutdown(fromScene);
      }
    }, {
      key: "onParentDestroy",
      value: function onParentDestroy(parent, fromScene) {
        this.destroy(fromScene);
      }
    }, {
      key: "onKeyDownStart",
      value: function onKeyDownStart(pointer) {
        if (!pointer.isDown || this.pointer !== undefined) {
          return;
        }

        this.pointer = pointer;
        this.onKeyDown(pointer);
      }
    }, {
      key: "onKeyDown",
      value: function onKeyDown(pointer) {
        if (this.pointer !== pointer) {
          return;
        }

        var camera = pointer.camera;

        if (!camera) {
          // Pointer is outside of any camera, no worldX/worldY available
          return;
        } // Vector of world position


        var gameObject = this.gameObject;
        var worldXY = this.end; // Note: pointer.worldX, pointer.worldY might not be the world position of this camera,
        // if this camera is not main-camera

        if (camera !== this.mainCamera) {
          worldXY = ScreenXYToWorldXY(pointer.x, pointer.y, camera, worldXY);
        } else {
          worldXY.x = pointer.worldX;
          worldXY.y = pointer.worldY;
        }

        this.setVector(gameObject.x + camera.scrollX, gameObject.y + camera.scrollY, worldXY.x, worldXY.y);
        this.emit('update');
      }
    }, {
      key: "onKeyUp",
      value: function onKeyUp(pointer) {
        if (this.pointer !== pointer) {
          return;
        }

        this.pointer = undefined;
        this.clearVector();
        this.emit('update');
      }
    }]);

    return TouchCursor;
  }(VectorToCursorKeys);

  Object.assign(TouchCursor.prototype, EventEmitterMethods);

  var TouchCursorPlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(TouchCursorPlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(TouchCursorPlugin);

    function TouchCursorPlugin(pluginManager) {
      _classCallCheck(this, TouchCursorPlugin);

      return _super.call(this, pluginManager);
    }

    _createClass(TouchCursorPlugin, [{
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
      }
    }, {
      key: "add",
      value: function add(gameObject, config) {
        return new TouchCursor(gameObject, config);
      }
    }]);

    return TouchCursorPlugin;
  }(Phaser.Plugins.BasePlugin);

  return TouchCursorPlugin;

}));
