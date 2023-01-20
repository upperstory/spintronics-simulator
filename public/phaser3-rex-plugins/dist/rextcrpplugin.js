(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rextcrpplugin = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

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

  var SceneClass = Phaser.Scene;

  var IsSceneObject = function IsSceneObject(object) {
    return object instanceof SceneClass;
  };

  var GetSceneObject = function GetSceneObject(object) {
    if (object == null || _typeof(object) !== 'object') {
      return null;
    } else if (IsSceneObject(object)) {
      // object = scene
      return object;
    } else if (object.scene && IsSceneObject(object.scene)) {
      // object = game object
      return object.scene;
    } else if (object.parent && object.parent.scene && IsSceneObject(object.parent.scene)) {
      // parent = bob object
      return object.parent.scene;
    }
  };

  var GetValue$5 = Phaser.Utils.Objects.GetValue;

  var ComponentBase = /*#__PURE__*/function () {
    function ComponentBase(parent, config) {
      _classCallCheck(this, ComponentBase);

      this.parent = parent; // gameObject or scene

      this.scene = GetSceneObject(parent);
      this.isShutdown = false; // Event emitter, default is private event emitter

      this.setEventEmitter(GetValue$5(config, 'eventEmitter', true)); // Register callback of parent destroy event, also see `shutdown` method

      if (this.parent && this.parent === this.scene) {
        // parent is a scene
        this.scene.sys.events.once('shutdown', this.onSceneDestroy, this);
      } else if (this.parent && this.parent.once) {
        // bob object does not have event emitter
        this.parent.once('destroy', this.onParentDestroy, this);
      }
    }

    _createClass(ComponentBase, [{
      key: "shutdown",
      value: function shutdown(fromScene) {
        // Already shutdown
        if (this.isShutdown) {
          return;
        } // parent might not be shutdown yet


        if (this.parent && this.parent === this.scene) {
          // parent is a scene
          this.scene.sys.events.off('shutdown', this.onSceneDestroy, this);
        } else if (this.parent && this.parent.once) {
          // bob object does not have event emitter
          this.parent.off('destroy', this.onParentDestroy, this);
        }

        this.destroyEventEmitter();
        this.parent = undefined;
        this.scene = undefined;
        this.isShutdown = true;
      }
    }, {
      key: "destroy",
      value: function destroy(fromScene) {
        this.shutdown(fromScene);
      }
    }, {
      key: "onSceneDestroy",
      value: function onSceneDestroy() {
        this.destroy(true);
      }
    }, {
      key: "onParentDestroy",
      value: function onParentDestroy(parent, fromScene) {
        this.destroy(fromScene);
      }
    }]);

    return ComponentBase;
  }();
  Object.assign(ComponentBase.prototype, EventEmitterMethods);

  var GetValue$4 = Phaser.Utils.Objects.GetValue;

  var TickTask = /*#__PURE__*/function (_ComponentBase) {
    _inherits(TickTask, _ComponentBase);

    var _super = _createSuper(TickTask);

    function TickTask(parent, config) {
      var _this;

      _classCallCheck(this, TickTask);

      _this = _super.call(this, parent, config);
      _this._isRunning = false;
      _this.isPaused = false;
      _this.tickingState = false;

      _this.setTickingMode(GetValue$4(config, 'tickingMode', 1)); // boot() later


      return _this;
    } // override


    _createClass(TickTask, [{
      key: "boot",
      value: function boot() {
        if (this.tickingMode === 2 && !this.tickingState) {
          this.startTicking();
        }
      } // override

    }, {
      key: "shutdown",
      value: function shutdown(fromScene) {
        // Already shutdown
        if (this.isShutdown) {
          return;
        }

        this.stop();

        if (this.tickingState) {
          this.stopTicking();
        }

        _get(_getPrototypeOf(TickTask.prototype), "shutdown", this).call(this, fromScene);
      }
    }, {
      key: "setTickingMode",
      value: function setTickingMode(mode) {
        if (typeof mode === 'string') {
          mode = TICKINGMODE[mode];
        }

        this.tickingMode = mode;
      } // override

    }, {
      key: "startTicking",
      value: function startTicking() {
        this.tickingState = true;
      } // override

    }, {
      key: "stopTicking",
      value: function stopTicking() {
        this.tickingState = false;
      }
    }, {
      key: "isRunning",
      get: function get() {
        return this._isRunning;
      },
      set: function set(value) {
        if (this._isRunning === value) {
          return;
        }

        this._isRunning = value;

        if (this.tickingMode === 1 && value != this.tickingState) {
          if (value) {
            this.startTicking();
          } else {
            this.stopTicking();
          }
        }
      }
    }, {
      key: "start",
      value: function start() {
        this.isPaused = false;
        this.isRunning = true;
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        // Only can ba paused in running state
        if (this.isRunning) {
          this.isPaused = true;
          this.isRunning = false;
        }

        return this;
      }
    }, {
      key: "resume",
      value: function resume() {
        // Only can ba resumed in paused state (paused from running state)
        if (this.isPaused) {
          this.isRunning = true;
        }

        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        this.isPaused = false;
        this.isRunning = false;
        return this;
      }
    }, {
      key: "complete",
      value: function complete() {
        this.isPaused = false;
        this.isRunning = false;
        this.emit('complete', this.parent, this);
      }
    }]);

    return TickTask;
  }(ComponentBase);

  var TICKINGMODE = {
    'no': 0,
    'lazy': 1,
    'always': 2
  };

  var GetValue$3 = Phaser.Utils.Objects.GetValue;

  var BaseClock = /*#__PURE__*/function (_TickTask) {
    _inherits(BaseClock, _TickTask);

    var _super = _createSuper(BaseClock);

    function BaseClock(parent, config) {
      var _this;

      _classCallCheck(this, BaseClock);

      _this = _super.call(this, parent, config);

      _this.resetFromJSON(config);

      _this.boot();

      return _this;
    }

    _createClass(BaseClock, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        this.isRunning = GetValue$3(o, 'isRunning', false);
        this.timeScale = GetValue$3(o, 'timeScale', 1);
        this.now = GetValue$3(o, 'now', 0);
        return this;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          isRunning: this.isRunning,
          timeScale: this.timeScale,
          now: this.now,
          tickingMode: this.tickingMode
        };
      } // Override
      // startTicking() { }
      // Override
      // stopTicking() {}

    }, {
      key: "start",
      value: function start(startAt) {
        if (startAt === undefined) {
          startAt = 0;
        }

        this.delta = 0;
        this.now = startAt;

        _get(_getPrototypeOf(BaseClock.prototype), "start", this).call(this);

        return this;
      }
    }, {
      key: "seek",
      value: function seek(time) {
        this.now = time;
        return this;
      }
    }, {
      key: "setTimeScale",
      value: function setTimeScale(value) {
        this.timeScale = value;
        return this;
      }
    }, {
      key: "tick",
      value: function tick(delta) {
        delta *= this.timeScale;
        this.now += delta;
        this.delta = delta;
        this.emit('update', this.now, this.delta);
        return this;
      }
    }]);

    return BaseClock;
  }(TickTask);

  var Clock = /*#__PURE__*/function (_BaseClock) {
    _inherits(Clock, _BaseClock);

    var _super = _createSuper(Clock);

    function Clock() {
      _classCallCheck(this, Clock);

      return _super.apply(this, arguments);
    }

    _createClass(Clock, [{
      key: "startTicking",
      value: function startTicking() {
        _get(_getPrototypeOf(Clock.prototype), "startTicking", this).call(this);

        this.scene.sys.events.on('update', this.update, this);
      }
    }, {
      key: "stopTicking",
      value: function stopTicking() {
        _get(_getPrototypeOf(Clock.prototype), "stopTicking", this).call(this);

        if (this.scene) {
          // Scene might be destoryed
          this.scene.sys.events.off('update', this.update, this);
        }
      }
    }, {
      key: "update",
      value: function update(time, delta) {
        if (!this.isRunning || this.timeScale === 0) {
          return this;
        }

        this.tick(delta);
        return this;
      }
    }]);

    return Clock;
  }(BaseClock);

  var Clear = function Clear(obj) {
    if (_typeof(obj) !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      obj.length = 0;
    } else {
      for (var key in obj) {
        delete obj[key];
      }
    }

    return obj;
  };

  /**
   * Shallow Object Clone. Will not out nested objects.
   * @param {object} obj JSON object
   * @param {object} ret JSON object to return, set null to return a new object
   * @returns {object} this object
   */

  var Clone = function Clone(obj, out) {
    var objIsArray = Array.isArray(obj);

    if (out === undefined) {
      out = objIsArray ? [] : {};
    } else {
      Clear(out);
    }

    if (objIsArray) {
      out.length = obj.length;

      for (var i = 0, cnt = obj.length; i < cnt; i++) {
        out[i] = obj[i];
      }
    } else {
      for (var key in obj) {
        out[key] = obj[key];
      }
    }

    return out;
  };

  var GetValue$2 = Phaser.Utils.Objects.GetValue;

  var Recorder$1 = /*#__PURE__*/function (_ComponentBase) {
    _inherits(Recorder, _ComponentBase);

    var _super = _createSuper(Recorder);

    function Recorder(parent, config) {
      var _this;

      _classCallCheck(this, Recorder);

      _this = _super.call(this, parent, config);
      var clock = GetValue$2(config, 'clock', undefined);

      if (!clock) {
        clock = new Clock(parent);
      }

      _this.clock = clock;

      _this.resetFromJSON(config); // This function had been called in super(config)


      return _this;
    }

    _createClass(Recorder, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        this.clock.resetFromJSON(GetValue$2(o, 'clock', undefined));
        this.commands = GetValue$2(o, 'commands', []); // [[time, cmd], [time, cmd], ...]

        return this;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          clock: this.clock.toJSON(),
          commands: this.commands
        };
      }
    }, {
      key: "shutdown",
      value: function shutdown(fromScene) {
        // Already shutdown
        if (this.isShutdown) {
          return;
        }

        this.commands = undefined;
        this.clock.shutdown(fromScene);

        _get(_getPrototypeOf(Recorder.prototype), "shutdown", this).call(this, fromScene);
      }
    }, {
      key: "start",
      value: function start(startAt) {
        this.clear();
        this.clock.start(startAt);
        this.emit('start', this.parent, this);
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        this.clock.pause();
        this.emit('pause', this.parent, this);
        return this;
      }
    }, {
      key: "resume",
      value: function resume() {
        this.clock.resume();
        this.emit('resume', this.parent, this);
        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        this.clock.stop();
        this.emit('stop', this.parent, this);
        return this;
      }
    }, {
      key: "seek",
      value: function seek(time) {
        this.clock.seek(time);
        return this;
      }
    }, {
      key: "isRecording",
      get: function get() {
        return this.clock.isRunning;
      }
    }, {
      key: "timeScale",
      get: function get() {
        return this.clock.timeScale;
      },
      set: function set(timeScale) {
        this.clock.timeScale = timeScale;
      }
    }, {
      key: "setTimeScale",
      value: function setTimeScale(timeScale) {
        this.timeScale = timeScale;
        return this;
      }
    }, {
      key: "now",
      get: function get() {
        return this.clock.now;
      }
    }, {
      key: "addCommand",
      value: function addCommand(command, offset) {
        if (!this.isRecording) {
          return this;
        }

        if (offset === undefined) {
          offset = 0;
        }

        var time = this.clock.now + offset;
        this.commands.push([time, command]);
        return this;
      }
    }, {
      key: "getCommands",
      value: function getCommands(isRef) {
        if (isRef === undefined) {
          isRef = false;
        }

        var commands;

        if (isRef) {
          commands = this.commands;
        } else {
          commands = Clone(this.commands);
        }

        return commands;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.commands.length = 0;
        return this;
      }
    }]);

    return Recorder;
  }(ComponentBase);

  var Copy = function Copy(dest, src, startIdx, endIdx) {
    if (startIdx === undefined) {
      startIdx = 0;
    }

    if (endIdx === undefined) {
      endIdx = src.length;
    }

    dest.length = endIdx - startIdx;

    for (var i = 0, len = dest.length; i < len; i++) {
      dest[i] = src[i + startIdx];
    }

    return dest;
  };

  var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

  var convert = function convert(s) {
    if (typeof s !== 'string') {
      return s;
    }

    if (s === '') {
      s = null;
    } else if (FLOAT.test(s)) {
      s = parseFloat(s);
    } else {
      if (s === 'false') {
        s = false;
      } else if (s === 'true') {
        s = true;
      }
    }

    return s;
  };

  var IsArray = function IsArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  var GetValue$1 = Phaser.Utils.Objects.GetValue;

  var RunCommands = function RunCommands(queue, scope, config) {
    var reverse = GetValue$1(config, 'reverse', false);
    var retVal;

    if (IsArray(queue[0])) {
      if (!reverse) {
        for (var i = 0, len = queue.length; i < len; i++) {
          retVal = RunCommands(queue[i], scope, config);
        }
      } else {
        for (var len = queue.length, i = len - 1; i >= 0; i--) {
          retVal = RunCommands(queue[i], scope, config);
        }
      }
    } else {
      retVal = RunCommand(queue, scope, config);
    }

    return retVal;
  };

  var RunCommand = function RunCommand(cmd, scope, config) {
    var argsConvert = GetValue$1(config, 'argsConvert', undefined);
    var argsConvertScope = GetValue$1(config, 'argsConvertScope', undefined);
    var fnName = cmd[0];
    ARGS = Copy(ARGS, cmd, 1);

    if (argsConvert) {
      // convert string to floating number, boolean, null, or string        
      if (argsConvert === true) {
        argsConvert = convert;
        argsConvertScope = undefined;
      }

      for (var i = 0, len = ARGS.length; i < len; i++) {
        if (argsConvertScope) {
          ARGS[i] = argsConvert.call(argsConvertScope, ARGS[i], cmd);
        } else {
          ARGS[i] = argsConvert(ARGS[i], cmd);
        }
      }
    }

    var fn;

    if (typeof fnName === 'string') {
      fn = scope[fnName];

      if (fn == null) {
        fn = GetValue$1(scope, fnName, null);
      }
    } else {
      fn = fnName;
    }

    var retValue = fn.apply(scope, ARGS);
    return retValue;
  };

  var ARGS = []; // reuse this array

  var GetValue = Phaser.Utils.Objects.GetValue;

  var Player$1 = /*#__PURE__*/function (_ComponentBase) {
    _inherits(Player, _ComponentBase);

    var _super = _createSuper(Player);

    function Player(parent, config) {
      var _this;

      _classCallCheck(this, Player);

      _this = _super.call(this, parent, config);
      var clock = GetValue(config, 'clock', undefined);

      if (!clock) {
        clock = new Clock(parent);
      }

      _this.clock = clock;

      _this.clock.on('update', _this.update, _assertThisInitialized(_this));

      _this.resetFromJSON(config); // this function had been called in super(config)


      return _this;
    }

    _createClass(Player, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        this.clock.resetFromJSON(GetValue(o, 'clock', undefined));
        this.state = GetValue(o, 'state', 0); // 0=idle, 1=run, 2=completed

        this.commands = GetValue(o, 'commands', []); // [[time, cmds], [time, cmds], ...]

        this.scope = GetValue(o, 'scope', undefined);
        this.setTimeUnit(GetValue(o, 'timeUnit', 0));
        this.setDtMode(GetValue(o, 'dtMode', 0));
        this.index = GetValue(o, 'index', 0);
        this.nextTime = GetValue(o, 'nextTime', 0);
        return this;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          clock: this.clock.toJSON(),
          state: this.state,
          commands: this.commands,
          scope: this.scope,
          timeUnit: this.timeUnit,
          dtMode: this.dtMode,
          index: this.index,
          nextTime: this.nextTime
        };
      }
    }, {
      key: "shutdown",
      value: function shutdown(fromScene) {
        // Already shutdown
        if (this.isShutdown) {
          return;
        }

        this.clock.shutdown(fromScene);
        this.commands = undefined;

        _get(_getPrototypeOf(Player.prototype), "shutdown", this).call(this, fromScene);
      }
    }, {
      key: "load",
      value: function load(commands, scope, config) {
        this.stop();
        var timeUnit = GetValue(config, 'timeUnit', undefined);

        if (timeUnit !== undefined) {
          this.setTimeUnit(timeUnit);
        }

        var dtMode = GetValue(config, 'dtMode', undefined);

        if (dtMode !== undefined) {
          this.setDtMode(dtMode);
        }

        commands = commands.filter(function (item) {
          var dt = item[0];
          return !isNaN(dt);
        }).map(function (item) {
          var dt = item[0];

          if (typeof dt === 'string') {
            item[0] = parseFloat(item[0]);
          }

          return item;
        });

        if (this.dtMode === 0) {
          commands.sort(function (itemA, itemB) {
            var dtA = itemA[0],
                dtB = itemB[0];
            return dtA > dtB ? 1 : dtA < dtB ? -1 : 0;
          });
        }

        this.commands = commands;
        this.scope = scope;
        return this;
      }
    }, {
      key: "start",
      value: function start(startAt) {
        if (startAt === undefined) {
          startAt = 0;
        }

        this.stop();
        this.index = 0;
        this.state = 1;
        this.nextTime = this.getNextDt(0);
        this.clock.start(startAt);
        this.update(startAt);
        this.emit('start', this.parent, this);
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        this.clock.pause();
        this.emit('pause', this.parent, this);
        return this;
      }
    }, {
      key: "resume",
      value: function resume() {
        this.clock.resume();
        this.emit('resume', this.parent, this);
        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        this.clock.stop();
        this.state = 0;
        this.emit('stop', this.parent, this);
        return this;
      }
    }, {
      key: "seek",
      value: function seek(time) {
        this.clock.seek(time);
        return this;
      }
    }, {
      key: "isPlaying",
      get: function get() {
        return this.clock.isRunning;
      }
    }, {
      key: "completed",
      get: function get() {
        return this.state === 2;
      }
    }, {
      key: "timeScale",
      get: function get() {
        return this.clock.timeScale;
      },
      set: function set(timeScale) {
        this.clock.timeScale = timeScale;
      }
    }, {
      key: "setTimeScale",
      value: function setTimeScale(timeScale) {
        this.timeScale = timeScale;
        return this;
      }
    }, {
      key: "now",
      get: function get() {
        return this.clock.now;
      }
    }, {
      key: "update",
      value: function update(now) {
        if (this.nextTime > now) {
          return this;
        }

        var lastCommandIndex = this.commands.length - 1;

        while (1) {
          // Execute a command
          var item = this.commands[this.index];
          var command = item[1];

          if (!IsArray(command)) {
            // [dt, fnName, param0, param1, ...]
            command = Copy(CMD, item, 1);
          }

          RunCommands(command, this.scope);
          this.emit('runcommand', command, this.scope); // Execute a command

          if (this.index === lastCommandIndex) {
            this.complete();
            return this;
          } else {
            // Get next time
            this.index++; // Point to next command

            this.nextTime = this.getNextDt(this.nextTime);

            if (this.nextTime > now) {
              return this;
            } // Get next time

          }
        }
      }
    }, {
      key: "complete",
      value: function complete() {
        this.clock.stop();
        this.state = 2;
        this.emit('complete', this.parent, this);
      }
    }, {
      key: "getNextDt",
      value: function getNextDt(currentDt) {
        var time = this.commands[this.index][0];

        if (this.timeUnit === 1) {
          // Second mode
          time = time * 1000;
        }

        if (this.dtMode === 1) {
          time += currentDt;
        }

        return time;
      }
    }, {
      key: "setDtMode",
      value: function setDtMode(dtMode) {
        if (typeof dtMode === 'string') {
          dtMode = DTMODE[dtMode];
        }

        this.dtMode = dtMode;
        return this;
      }
    }, {
      key: "setTimeUnit",
      value: function setTimeUnit(timeUnit) {
        if (typeof timeUnit === 'string') {
          timeUnit = TIMEUNITMODE[timeUnit];
        }

        this.timeUnit = timeUnit;
        return this;
      }
    }]);

    return Player;
  }(ComponentBase);

  var CMD = []; // reuse this array

  var TIMEUNITMODE = {
    ms: 0,
    s: 1,
    sec: 1
  };
  var DTMODE = {
    abs: 0,
    absolute: 0,
    inc: 1,
    increment: 1
  };

  var TCRP = {
    Recorder: Recorder$1,
    Player: Player$1,
    RunCommands: RunCommands
  };

  var Recorder = TCRP.Recorder;
  var Player = TCRP.Player;

  var TCRPPlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(TCRPPlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(TCRPPlugin);

    function TCRPPlugin(pluginManager) {
      _classCallCheck(this, TCRPPlugin);

      return _super.call(this, pluginManager);
    }

    _createClass(TCRPPlugin, [{
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
      }
    }, {
      key: "addRecorder",
      value: function addRecorder(parent, config) {
        return new Recorder(parent, config);
      }
    }, {
      key: "addPlayer",
      value: function addPlayer(parent, config) {
        return new Player(parent, config);
      }
    }]);

    return TCRPPlugin;
  }(Phaser.Plugins.BasePlugin);

  var methods = {
    runCommands: TCRP.RunCommands
  };
  Object.assign(TCRPPlugin.prototype, methods);

  return TCRPPlugin;

}));
