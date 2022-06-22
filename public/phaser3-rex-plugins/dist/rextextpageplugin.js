(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rextextpageplugin = factory());
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

  var GetValue$1 = Phaser.Utils.Objects.GetValue;

  var ComponentBase = /*#__PURE__*/function () {
    function ComponentBase(parent, config) {
      _classCallCheck(this, ComponentBase);

      this.parent = parent; // gameObject or scene

      this.scene = GetSceneObject(parent);
      this.isShutdown = false; // Event emitter, default is private event emitter

      this.setEventEmitter(GetValue$1(config, 'eventEmitter', true)); // Register callback of parent destroy event, also see `shutdown` method

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

  var TextKlass = Phaser.GameObjects.Text;

  var IsTextGameObject = function IsTextGameObject(gameObject) {
    return gameObject instanceof TextKlass;
  };

  var BitmapTextKlass = Phaser.GameObjects.BitmapText;

  var IsBitmapTextGameObject = function IsBitmapTextGameObject(gameObject) {
    return gameObject instanceof BitmapTextKlass;
  };

  var TextType = 0;
  var TagTextType = 1;
  var BitmapTextType = 2;

  var GetTextObjectType = function GetTextObjectType(textObject) {
    var textObjectType;

    if (IsBitmapTextGameObject(textObject)) {
      textObjectType = BitmapTextType;
    } else if (IsTextGameObject(textObject)) {
      textObjectType = TextType;
    } else {
      textObjectType = TagTextType;
    }

    return textObjectType;
  };

  var TextToLines = function TextToLines(textObject, text, lines) {
    var textObjectType = GetTextObjectType(textObject);

    switch (textObjectType) {
      case TextType:
        lines = textObject.getWrappedText(text); // Array of string

        break;

      case TagTextType:
        lines = textObject.getPenManager(text, lines); // Pens-manager

        break;

      case BitmapTextType:
        if (textObject.maxWidth > 0) {
          lines = textObject.setText(text).getTextBounds().wrappedText.split('\n');
        } else {
          lines = text.split('\n');
        }

        break;
    }

    return lines;
  };

  var GetLines = function GetLines(startLineIndex, endLineIdx) {
    if (startLineIndex === undefined) {
      startLineIndex = this.startLineIndex;
    }

    if (endLineIdx === undefined) {
      endLineIdx = startLineIndex + this.pageLinesCount;
    }

    var text;

    switch (this.textObjectType) {
      case TextType:
      case BitmapTextType:
        text = this.lines.slice(startLineIndex, endLineIdx).join('\n');
        break;

      case TagTextType:
        var startIdx = this.lines.getLineStartIndex(startLineIndex);
        var endIdx = this.lines.getLineEndIndex(endLineIdx - 1);
        text = this.lines.getSliceTagText(startIdx, endIdx, true);
        break;
    }

    return text;
  };

  var GetString = function GetString(text) {
    if (Array.isArray(text)) {
      text = text.join('\n');
    } else if (typeof text === 'number') {
      text = text.toString();
    }

    return text;
  };

  var SetContentMethods = {
    clearText: function clearText() {
      this.sections.length = 0;
      this.pageStartIndexes.length = 0;
      this.lines.length = 0;
      return this;
    },
    appendPage: function appendPage(text) {
      var pageStartIndex = this.totalLinesCount;
      this.sections.push(GetString(text));
      var text = this.sections.join('\n');
      this.lines = TextToLines(this.parent, text, this.lines);
      var newLinesCount = this.totalLinesCount - pageStartIndex;
      var pageCount = Math.ceil(newLinesCount / this.pageLinesCount);

      for (var i = 0; i < pageCount; i++) {
        this.pageStartIndexes.push(pageStartIndex + i * this.pageLinesCount);
      }

      return this;
    },
    setText: function setText(text, resetPageIdx) {
      if (resetPageIdx === undefined) {
        resetPageIdx = true;
      }

      if (resetPageIdx) {
        this.resetPageIdx();
      }

      this.clearText();
      var sections = GetString(text).split(this.pageBreak); // if (sections[sections.length - 1] === '') { // Last section is an empty string
      //     sections.length -= 1;
      // }

      for (var i = 0, cnt = sections.length; i < cnt; i++) {
        this.appendPage(sections[i]);
      }

      return this;
    },
    appendText: function appendText(text) {
      var content = this.content + GetString(text);
      this.setText(content, false);
      return this;
    }
  };

  var Clamp$1 = Phaser.Math.Clamp;
  var GetPageMethods = {
    getPage: function getPage(idx) {
      if (idx === undefined) {
        idx = this.pageIndex;
      }

      return this.setPageIndex(idx).getLines(this.startLineIndex, this.endLineIndex);
    },
    getNextPage: function getNextPage() {
      return this.getPage(this.pageIndex + 1);
    },
    getPreviousPage: function getPreviousPage() {
      return this.getPage(this.pageIndex - 1);
    },
    resetPageIdx: function resetPageIdx() {
      this.pageIndex = -1;
      return this;
    },
    setPageIndex: function setPageIndex(idx) {
      idx = Clamp$1(idx, 0, this.pageCount - 1);
      this.pageIndex = idx;
      this.startLineIndex = this.pageStartIndexes[idx];
      this.endLineIndex = this.pageStartIndexes[idx + 1];
      return this;
    }
  };

  var SetNoWrapText = function SetNoWrapText(textObject, text) {
    var textObjectType = GetTextObjectType(textObject);

    switch (textObjectType) {
      case TextType:
        // Store wrap properties
        var style = textObject.style;
        var wordWrapWidth = style.wordWrapWidth;
        var wordWrapCallback = style.wordWrapCallback; // Disable wrap

        style.wordWrapWidth = 0;
        style.wordWrapCallback = undefined; // Set text

        textObject.setText(text); // Restore wrap

        style.wordWrapWidth = wordWrapWidth;
        style.wordWrapCallback = wordWrapCallback;
        break;

      case TagTextType:
        // Store wrap properties
        var style = textObject.style;
        var wrapMode = style.wrapMode; // Disable wrap

        style.wrapMode = 0; // Set text

        textObject.setText(text); // Restore wrap

        style.wrapMode = wrapMode;
        break;

      case BitmapTextType:
        // Store wrap properties
        var maxWidth = textObject._maxWidth; // Disable wrap

        textObject._maxWidth = 0; // Set text

        textObject.setText(text); // Restore wrap

        textObject._maxWidth = maxWidth;
        break;
    }
  };

  var ShowMethods = {
    showPage: function showPage(idx) {
      this.displayText(this.getPage(idx));
      return this;
    },
    showNextPage: function showNextPage() {
      this.displayText(this.getNextPage());
      return this;
    },
    showPreviousPage: function showPreviousPage() {
      this.displayText(this.getPreviousPage());
      return this;
    },
    show: function show() {
      this.displayText(this.getLines());
      return this;
    },
    showNextLine: function showNextLine() {
      this.displayText(this.setStartLineIndex(this.startLineIndex + 1).getLines());
      return this;
    },
    showPreviousLine: function showPreviousLine() {
      this.displayText(this.setStartLineIndex(this.startLineIndex - 1).getLines());
      return this;
    },
    displayText: function displayText(text) {
      SetNoWrapText(this.parent, text);
    }
  };

  var Methods = {
    getLines: GetLines
  };
  Object.assign(Methods, SetContentMethods, GetPageMethods, ShowMethods);

  var GetValue = Phaser.Utils.Objects.GetValue;
  var Clamp = Phaser.Math.Clamp;

  var TextPage = /*#__PURE__*/function (_ComponentBase) {
    _inherits(TextPage, _ComponentBase);

    var _super = _createSuper(TextPage);

    function TextPage(gameObject, config) {
      var _this;

      _classCallCheck(this, TextPage);

      _this = _super.call(this, gameObject, {
        eventEmitter: false
      }); // No event emitter
      // this.parent = gameObject;

      _this.textObjectType = GetTextObjectType(_this.parent);
      _this.pageStartIndexes = []; // Text object : array of string
      // Tag text object : pens-manager
      // Bitmap text object : array of string

      _this.lines = TextToLines(_this.parent, '');
      _this.sections = [];

      _this.resetFromJSON(config);

      return _this;
    }

    _createClass(TextPage, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        this.setMaxLines(GetValue(o, 'maxLines', undefined));
        this.setPageBreak(GetValue(o, 'pageBreak', '\f\n'));
        this.setText(GetValue(o, 'text', ''));
        this.setStartLineIndex(GetValue(o, 'start', 0));
        this.setPageIndex(GetValue(o, 'page', -1));
        return this;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          maxLines: this.maxLines,
          text: this.content,
          start: this.startLineIndex,
          page: this.pageIndex,
          pageBreak: this.pageBreak
        };
      }
    }, {
      key: "shutdown",
      value: function shutdown(fromScene) {
        // Already shutdown
        if (this.isShutdown) {
          return;
        }

        switch (this.textObjectType) {
          case TextType:
            this.lines.length = 0;
            break;

          case TagTextType:
            this.lines.destroy();
            break;

          case BitmapTextType:
            this.lines.length = 0;
            break;
        }

        this.pageStartIndexes.length = 0;
        this.sections.length = 0;
        this.lines = undefined;
        this.pageStartIndexes = undefined;
        this.sections = undefined;

        _get(_getPrototypeOf(TextPage.prototype), "shutdown", this).call(this, fromScene);
      }
    }, {
      key: "setMaxLines",
      value: function setMaxLines(maxLines) {
        this.maxLines = maxLines;
        return this;
      }
    }, {
      key: "setPageBreak",
      value: function setPageBreak(pageBreak) {
        this.pageBreak = pageBreak;
        return this;
      }
    }, {
      key: "pageCount",
      get: function get() {
        return this.pageStartIndexes.length;
      }
    }, {
      key: "isFirstPage",
      get: function get() {
        return this.pageIndex <= 0;
      }
    }, {
      key: "isLastPage",
      get: function get() {
        return this.pageIndex >= this.pageCount - 1;
      }
    }, {
      key: "totalLinesCount",
      get: function get() {
        return this.lines ? this.lines.length : 0;
      }
    }, {
      key: "startLineIndex",
      get: function get() {
        return this._startLineIndex;
      },
      set: function set(value) {
        value = Clamp(value, 0, this.totalLinesCount - 1);
        this._startLineIndex = value;
      }
    }, {
      key: "setStartLineIndex",
      value: function setStartLineIndex(idx) {
        this.startLineIndex = idx;
        return this;
      }
    }, {
      key: "pageLinesCount",
      get: function get() {
        if (this.maxLines !== undefined) {
          return this.maxLines;
        } else {
          var count;

          switch (this.textObjectType) {
            case TextType:
            case TagTextType:
              var maxLines = this.parent.style.maxLines;

              if (maxLines > 0) {
                count = maxLines;
              } else {
                count = this.totalLinesCount;
              }

              break;

            case BitmapTextType:
              count = this.totalLinesCount;
              break;
          }

          return count;
        }
      }
    }, {
      key: "content",
      get: function get() {
        return this.sections.join(this.pageBreak);
      }
    }]);

    return TextPage;
  }(ComponentBase);

  Object.assign(TextPage.prototype, Methods);

  var TextPagePlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(TextPagePlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(TextPagePlugin);

    function TextPagePlugin(pluginManager) {
      _classCallCheck(this, TextPagePlugin);

      return _super.call(this, pluginManager);
    }

    _createClass(TextPagePlugin, [{
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
      }
    }, {
      key: "add",
      value: function add(gameObject, config) {
        return new TextPage(gameObject, config);
      }
    }]);

    return TextPagePlugin;
  }(Phaser.Plugins.BasePlugin);

  return TextPagePlugin;

}));
