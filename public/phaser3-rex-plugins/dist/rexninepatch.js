(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexninepatch = factory());
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

  var SetGetFrameNameCallback = function SetGetFrameNameCallback(callback) {
    if (callback === undefined) {
      callback = DefaultGetFrameNameCallback;
    }

    this.getFrameNameCallback = callback;
    return this;
  };

  var DefaultGetFrameNameCallback = function DefaultGetFrameNameCallback(colIndex, rowIndex, baseFrameName) {
    if (baseFrameName === '__BASE') {
      return "".concat(colIndex, ",").concat(rowIndex);
    } else {
      return "".concat(baseFrameName, "_").concat(colIndex, ",").concat(rowIndex);
    }
  };

  var DeepClone = function DeepClone(inObject) {
    var outObject;
    var value;
    var key;

    if (_typeof(inObject) !== 'object' || inObject === null) {
      //  inObject is not an object
      return inObject;
    } //  Create an array or object to hold the values


    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key]; //  Recursively (deep) copy for nested objects, including arrays

      outObject[key] = DeepClone(value);
    }

    return outObject;
  };

  var SetTexture = function SetTexture(key, baseFrameName, columns, rows) {
    if (Array.isArray(baseFrameName)) {
      rows = columns;
      columns = baseFrameName;
      baseFrameName = undefined;
    }

    if (baseFrameName === undefined) {
      baseFrameName = '__BASE';
    }

    columns = DeepClone(columns);
    rows = DeepClone(rows);
    this.textureKey = key;
    this.baseFrameName = baseFrameName;
    this.columns.data = columns;
    this.columns.count = columns ? columns.length : 0;
    this.columns.stretch = 0;
    this.columns.minWidth = 0;
    this.columns.scale = 1;
    this.rows.data = rows;
    this.rows.count = rows ? rows.length : 0;
    this.rows.stretch = 0;
    this.rows.minHeight = 0;
    this.rows.scale = 1;
    var texture = this.scene.sys.textures.get(key);

    if (!texture) {
      this.clear();
      return this;
    }

    if (!columns || !rows) {
      this.clear();
      return this;
    } // Get remainder width/height for unknown width/height


    var baseFrame = texture.frames[baseFrameName];
    var remainderTextureWidth = baseFrame.width;
    var unknownColumnWidthCount = 0;

    for (var i = 0, cnt = columns.length; i < cnt; i++) {
      if (columns[i] === undefined) {
        unknownColumnWidthCount++;
      } else if (typeof columns[i] === 'number') {
        remainderTextureWidth -= columns[i];
      } else {
        remainderTextureWidth -= columns[i].width;
      }
    }

    var unknownColumnWidth = remainderTextureWidth / unknownColumnWidthCount;
    var remainderTextureHeight = baseFrame.height;
    var unknownRowHeightCount = 0;

    for (var i = 0, cnt = rows.length; i < cnt; i++) {
      if (rows[i] === undefined) {
        unknownRowHeightCount++;
      } else if (typeof rows[i] === 'number') {
        remainderTextureHeight -= rows[i];
      } else {
        remainderTextureHeight -= rows[i].width;
      }
    }

    var unknownRowHeight = remainderTextureHeight / unknownRowHeightCount;
    var row, col, rowHeight, colWidth, frameName;
    var offsetX = 0,
        offsetY = 0;

    for (var j = 0, jcnt = rows.length; j < jcnt; j++) {
      // Unknown height
      if (rows[j] === undefined) {
        rows[j] = unknownRowHeight;
      }

      if (typeof rows[j] === 'number') {
        rows[j] = {
          height: rows[j],
          stretch: j % 2
        };
      }

      row = rows[j];
      rowHeight = row.height;
      this.rows.stretch += row.stretch | 0;
      this.rows.minHeight += row.stretch > 0 ? 0 : rowHeight;
      offsetX = 0;

      for (var i = 0, icnt = columns.length; i < icnt; i++) {
        // Unknown width
        if (columns[i] === undefined) {
          columns[i] = unknownColumnWidth;
        }

        if (typeof columns[i] === 'number') {
          columns[i] = {
            width: columns[i],
            stretch: i % 2
          };
        }

        col = columns[i];
        colWidth = col.width;

        if (j === 0) {
          this.columns.stretch += col.stretch | 0;
          this.columns.minWidth += col.stretch > 0 ? 0 : colWidth;
        }

        if (colWidth >= 1 && rowHeight >= 1) {
          frameName = this.getFrameNameCallback(i, j, baseFrameName);

          var frameNameType = _typeof(frameName);

          if (frameNameType === 'string' || frameNameType === 'number') {
            texture.add(frameName, 0, offsetX + baseFrame.cutX, offsetY + baseFrame.cutY, colWidth, rowHeight); // Do nothing if frameName is existed
          }
        }

        offsetX += colWidth;
      }

      offsetY += rowHeight;
    }

    this.updateTexture();
    return this;
  };

  var UpdateTexture = function UpdateTexture() {
    this.clear();

    if (this.textureKey === undefined) {
      return this;
    }

    var texture = this.scene.sys.textures.get(this.textureKey);

    if (!texture) {
      return this;
    }

    var minWidth = this.columns.minWidth * this.maxFixedPartScaleX; // Fixed-part width

    var minHeight = this.rows.minHeight * this.maxFixedPartScaleY; // Fixed-part height

    var stretchWidth = this.width - minWidth;
    var stretchHeight = this.height - minHeight;
    var fixedPartScaleX = stretchWidth >= 0 ? this.maxFixedPartScaleX : this.width / minWidth;
    var fixedPartScaleY = stretchHeight >= 0 ? this.maxFixedPartScaleY : this.height / minHeight;

    if (this.preserveRatio) {
      var minScale = Math.min(fixedPartScaleX, fixedPartScaleY);

      if (fixedPartScaleX > minScale) {
        var compensationWidth = (fixedPartScaleX - minScale) * minWidth;

        if (stretchWidth >= 0) {
          stretchWidth += compensationWidth;
        } else {
          stretchWidth = compensationWidth;
        }

        fixedPartScaleX = minScale;
      }

      if (fixedPartScaleY > minScale) {
        var compensationHeight = (fixedPartScaleY - minScale) * minHeight;

        if (stretchHeight >= 0) {
          stretchHeight += compensationHeight;
        } else {
          stretchHeight = compensationHeight;
        }

        fixedPartScaleY = minScale;
      }
    }

    this.columns.scale = fixedPartScaleX;
    this.rows.scale = fixedPartScaleY;
    var proportionWidth;

    if (stretchWidth > 0) {
      proportionWidth = this.columns.stretch > 0 ? stretchWidth / this.columns.stretch : 0;
    } else {
      proportionWidth = 0;
    }

    var proportionHeight;

    if (stretchHeight > 0) {
      proportionHeight = this.rows.stretch > 0 ? stretchHeight / this.rows.stretch : 0;
    } else {
      proportionHeight = 0;
    }

    var frameName, col, row, colWidth, rowHeight;
    var offsetX = 0,
        offsetY = 0;
    var imageType;

    for (var j = 0, jcnt = this.rows.count; j < jcnt; j++) {
      row = this.rows.data[j];
      rowHeight = row.stretch === 0 ? row.height * fixedPartScaleY : proportionHeight * row.stretch;
      offsetX = 0;

      for (var i = 0, icnt = this.columns.count; i < icnt; i++) {
        col = this.columns.data[i];
        colWidth = col.stretch === 0 ? col.width * fixedPartScaleX : proportionWidth * col.stretch;
        frameName = this.getFrameNameCallback(i, j, this.baseFrameName);

        if (texture.has(frameName) && colWidth > 0 && rowHeight > 0) {
          if (row.stretch === 0 && col.stretch === 0) {
            // Fixed parts
            imageType = 0; // Draw image
          } else {
            // Stretchable parts
            if (this.getStretchMode(i, j) === 0) {
              // Scaled image
              imageType = 0; // Draw scaled image
            } else {
              // Repeat tile-sprite
              imageType = 1; // Draw tile-sprite
            }
          }

          if (imageType === 0) {
            this._drawImage(this.textureKey, frameName, offsetX, offsetY, colWidth, rowHeight);
          } else {
            this._drawTileSprite(this.textureKey, frameName, offsetX, offsetY, colWidth, rowHeight);
          }
        }

        offsetX += colWidth;
      }

      offsetY += rowHeight;
    }
  };

  var IsPlainObject$1 = Phaser.Utils.Objects.IsPlainObject;
  var GetValue$1 = Phaser.Utils.Objects.GetValue;

  var SetStretchMode = function SetStretchMode(mode) {
    if (IsPlainObject$1(mode)) {
      this.stretchMode.edge = parseMode(GetValue$1(mode, 'edge', 0));
      this.stretchMode.internal = parseMode(GetValue$1(mode, 'internal', 0));
    } else {
      mode = parseMode(mode);
      this.stretchMode.edge = mode;
      this.stretchMode.internal = mode;
    }

    return this;
  };

  var parseMode = function parseMode(mode) {
    if (typeof mode === 'string') {
      mode = EXTENDMODE[mode];
    }

    return mode;
  };

  var EXTENDMODE = {
    scale: 0,
    repeat: 1
  };

  var IsEdge = function IsEdge(colIndex, rowIndex) {
    return colIndex === 0 || colIndex === this.columns.count - 1 || rowIndex === 0 || rowIndex === this.rows.count - 1;
  };

  var GetStretchMode = function GetStretchMode(colIndex, rowIndex) {
    return IsEdge.call(this, colIndex, rowIndex) ? this.stretchMode.edge : this.stretchMode.internal;
  };

  var SetPreserveRatio = function SetPreserveRatio(enable) {
    if (enable == undefined) {
      enable = true;
    }

    this.preserveRatio = enable;
    return this;
  };

  var SetMaxFixedPartScale = function SetMaxFixedPartScale(scaleX, scaleY) {
    if (scaleY === undefined) {
      scaleY = scaleX;
    }

    this.maxFixedPartScaleX = scaleX;
    this.maxFixedPartScaleY = scaleY;
    return this;
  };

  var NOOP = function NOOP() {//  NOOP
  };

  var Methods$1 = {
    _drawImage: NOOP,
    _drawTileSprite: NOOP,
    setGetFrameNameCallback: SetGetFrameNameCallback,
    setTexture: SetTexture,
    updateTexture: UpdateTexture,
    setStretchMode: SetStretchMode,
    getStretchMode: GetStretchMode,
    setPreserveRatio: SetPreserveRatio,
    setMaxFixedPartScale: SetMaxFixedPartScale
  };

  var IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
  var GetValue = Phaser.Utils.Objects.GetValue;

  var NinePatchBase = function NinePatchBase(GOClass, type) {
    var NinePatch = /*#__PURE__*/function (_GOClass) {
      _inherits(NinePatch, _GOClass);

      var _super = _createSuper(NinePatch);

      function NinePatch(scene, x, y, width, height, key, baseFrame, columns, rows, config) {
        var _this;

        _classCallCheck(this, NinePatch);

        if (IsPlainObject(x)) {
          config = x;
          x = GetValue(config, 'x', 0);
          y = GetValue(config, 'y', 0);
          width = GetValue(config, 'width', 1);
          height = GetValue(config, 'height', 1);
          key = GetValue(config, 'key', undefined);
          baseFrame = GetValue(config, 'baseFrame', undefined);
          columns = GetValue(config, 'columns', undefined);
          rows = GetValue(config, 'rows', undefined);
        } else if (IsPlainObject(width)) {
          config = width;
          width = GetValue(config, 'width', 1);
          height = GetValue(config, 'height', 1);
          key = GetValue(config, 'key', undefined);
          baseFrame = GetValue(config, 'baseFrame', undefined);
          columns = GetValue(config, 'columns', undefined);
          rows = GetValue(config, 'rows', undefined);
        } else if (IsPlainObject(key)) {
          config = key;
          key = GetValue(config, 'key', undefined);
          baseFrame = GetValue(config, 'baseFrame', undefined);
          columns = GetValue(config, 'columns', undefined);
          rows = GetValue(config, 'rows', undefined);
        } else if (IsPlainObject(baseFrame)) {
          config = baseFrame;
          baseFrame = GetValue(config, 'baseFrame', undefined);
          columns = GetValue(config, 'columns', undefined);
          rows = GetValue(config, 'rows', undefined);
        } else if (Array.isArray(baseFrame)) {
          config = rows;
          rows = columns;
          columns = baseFrame;
          baseFrame = GetValue(config, 'baseFrame', undefined);
        } else if (IsPlainObject(columns)) {
          config = columns;
          columns = GetValue(config, 'columns', undefined);
          rows = GetValue(config, 'rows', undefined);
        }

        _this = _super.call(this, scene);
        _this.type = type;

        _this.setPosition(x, y).setSize(width, height).setOrigin(0.5, 0.5);

        _this.columns = {};
        _this.rows = {};
        _this.stretchMode = {};
        _this._tileSprite = undefined; // Reserved for drawing image

        _this._image = undefined; // Reserved for drawing image

        _this.setGetFrameNameCallback(GetValue(config, 'getFrameNameCallback', undefined));

        _this.setStretchMode(GetValue(config, 'stretchMode', 0));

        _this.setPreserveRatio(GetValue(config, 'preserveRatio', true));

        var maxFixedPartScale = GetValue(config, 'maxFixedPartScale', 1);
        var maxFixedPartScaleX = GetValue(config, 'maxFixedPartScaleX', maxFixedPartScale);
        var maxFixedPartScaleY = GetValue(config, 'maxFixedPartScaleY', undefined);

        _this.setMaxFixedPartScale(maxFixedPartScaleX, maxFixedPartScaleY);

        _this.setTexture(key, baseFrame, columns, rows);

        return _this;
      }

      _createClass(NinePatch, [{
        key: "minWidth",
        get: function get() {
          return this.columns.minWidth;
        }
      }, {
        key: "minHeight",
        get: function get() {
          return this.rows.minHeight;
        }
      }, {
        key: "fixedPartScaleX",
        get: function get() {
          return this.columns.scale;
        }
      }, {
        key: "fixedPartScaleY",
        get: function get() {
          return this.rows.scale;
        }
      }, {
        key: "resize",
        value: function resize(width, height) {
          if (this.width === width && this.height === height) {
            return this;
          }

          _get(_getPrototypeOf(NinePatch.prototype), "resize", this).call(this, width, height);

          this.updateTexture();
          return this;
        }
      }]);

      return NinePatch;
    }(GOClass);

    Object.assign(NinePatch.prototype, Methods$1);
    return NinePatch;
  };

  var MakeChildImageGameObject = function MakeChildImageGameObject(parent, key, className) {
    if (className === undefined) {
      className = 'image';
    }

    if (!parent[key]) {
      parent[key] = parent.scene.make[className]({
        add: false,
        origin: {
          x: 0,
          y: 0
        }
      });
      parent.once('destroy', function () {
        if (parent[key]) {
          parent[key].destroy();
          parent[key] = undefined;
        }
      });
    }

    return parent[key];
  };

  var DrawImage = function DrawImage(key, frame, x, y, width, height) {
    var gameObject = MakeChildImageGameObject(this, '_image', 'image').setTexture(key, frame).setDisplaySize(width, height);
    this.draw(gameObject, x, y);
  };

  var DrawTileSprite = function DrawTileSprite(key, frame, x, y, width, height) {
    var gameObject = MakeChildImageGameObject(this, '_tileSprite', 'tileSprite').setTexture(key, frame).setSize(width, height);
    this.draw(gameObject, x, y);
  };

  var Methods = {
    _drawImage: DrawImage,
    _drawTileSprite: DrawTileSprite
  };

  var RenderTexture = Phaser.GameObjects.RenderTexture;

  var NinePatch = /*#__PURE__*/function (_NinePatchBase) {
    _inherits(NinePatch, _NinePatchBase);

    var _super = _createSuper(NinePatch);

    function NinePatch() {
      _classCallCheck(this, NinePatch);

      return _super.apply(this, arguments);
    }

    return _createClass(NinePatch);
  }(NinePatchBase(RenderTexture, 'rexNinePatch'));

  Object.assign(NinePatch.prototype, Methods);

  return NinePatch;

}));
