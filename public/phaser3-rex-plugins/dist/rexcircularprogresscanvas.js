(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexcircularprogresscanvas = factory());
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

  // copy from Phaser.GameObjects.Text
  var Utils = Phaser.Renderer.WebGL.Utils;

  var WebGLRenderer = function WebGLRenderer(renderer, src, camera, parentMatrix) {
    if (src.dirty) {
      src.updateTexture();
      src.dirty = false;
    }

    if (src.width === 0 || src.height === 0) {
      return;
    }

    camera.addToRenderList(src);
    var frame = src.frame;
    var width = frame.width;
    var height = frame.height;
    var getTint = Utils.getTintAppendFloatAlpha;
    var pipeline = renderer.pipelines.set(src.pipeline, src);
    var textureUnit = pipeline.setTexture2D(frame.glTexture, src);
    renderer.pipelines.preBatch(src);
    pipeline.batchTexture(src, frame.glTexture, width, height, src.x, src.y, width / src.resolution, height / src.resolution, src.scaleX, src.scaleY, src.rotation, src.flipX, src.flipY, src.scrollFactorX, src.scrollFactorY, src.displayOriginX, src.displayOriginY, 0, 0, width, height, getTint(src.tintTopLeft, camera.alpha * src._alphaTL), getTint(src.tintTopRight, camera.alpha * src._alphaTR), getTint(src.tintBottomLeft, camera.alpha * src._alphaBL), getTint(src.tintBottomRight, camera.alpha * src._alphaBR), src.tintFill, 0, 0, camera, parentMatrix, false, textureUnit);
    renderer.pipelines.postBatch(src);
  };

  // copy from Phaser.GameObjects.Text
  var CanvasRenderer = function CanvasRenderer(renderer, src, camera, parentMatrix) {
    if (src.dirty) {
      src.updateTexture();
      src.dirty = false;
    }

    if (src.width === 0 || src.height === 0) {
      return;
    }

    camera.addToRenderList(src);
    renderer.batchSprite(src, src.frame, camera, parentMatrix);
  };

  var Render = {
    renderWebGL: WebGLRenderer,
    renderCanvas: CanvasRenderer
  };

  var Color = Phaser.Display.Color;
  var CanvasMethods = {
    clear: function clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.dirty = true;
      return this;
    },
    fill: function fill(color) {
      this.context.fillStyle = color;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.dirty = true;
      return this;
    },
    loadFromURL: function loadFromURL(url, callback) {
      var self = this;
      var img = new Image();

      img.onload = function () {
        if (self.width !== img.width || self.height !== img.height) {
          self.resize(img.width, img.height);
        } else {
          self.clear();
        }

        self.context.drawImage(img, 0, 0);
        self.updateTexture();

        if (callback) {
          callback();
        }

        img.onload = null;
        img.src = '';
        img.remove();
      };

      img.src = url;
      return this;
    },
    loadFromURLPromise: function loadFromURLPromise(url) {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.loadFromURL(url, resolve);
      });
    },
    getDataURL: function getDataURL(type, encoderOptions) {
      return this.canvas.toDataURL(type, encoderOptions);
    },
    getPixel: function getPixel(x, y, out) {
      if (out === undefined) {
        out = new Color();
      }

      var rgb = this.context.getImageData(x, y, 1, 1);
      out.setTo(rgb.data[0], rgb.data[1], rgb.data[2], rgb.data[3]);
      return out;
    },
    setPixel: function setPixel(x, y, r, g, b, a) {
      if (typeof r !== 'number') {
        var color = r;
        r = color.red;
        g = color.green;
        b = color.blue;
        a = color.alpha;
      }

      if (a === undefined) {
        a = r !== 0 || g !== 0 || b !== 0 ? 255 : 0;
      }

      var imgData = this.context.createImageData(1, 1);
      imgData.data[0] = r;
      imgData.data[1] = g;
      imgData.data[2] = b;
      imgData.data[3] = a;
      this.context.putImageData(imgData, x, y);
      this.dirty = true;
      return this;
    }
  };

  var CopyCanvasToTexture = function CopyCanvasToTexture(scene, srcCanvas, key, x, y, width, height) {
    var textures = scene.sys.textures;
    var renderer = scene.renderer;

    if (x === undefined) {
      x = 0;
    }

    if (y === undefined) {
      y = 0;
    }

    if (width === undefined) {
      width = srcCanvas.width;
    }

    if (height === undefined) {
      height = srcCanvas.height;
    }

    var texture;

    if (textures.exists(key)) {
      texture = textures.get(key);
    } else {
      texture = textures.createCanvas(key, width, height);
    }

    var destCanvas = texture.getSourceImage();

    if (destCanvas.width !== width) {
      destCanvas.width = width;
    }

    if (destCanvas.height !== height) {
      destCanvas.height = height;
    }

    var destCtx = destCanvas.getContext('2d');
    destCtx.clearRect(0, 0, width, height);
    destCtx.drawImage(srcCanvas, x, y, width, height);

    if (renderer.gl && texture) {
      renderer.canvasToTexture(destCanvas, texture.source[0].glTexture, true, 0);
    }
  };

  var TextureMethods = {
    updateTexture: function updateTexture(callback, scope) {
      if (callback) {
        if (scope) {
          callback.call(scope, this.canvas, this.context);
        } else {
          callback(this.canvas, this.context);
        }
      }

      if (this.canvas.width !== this.frame.width || this.canvas.height !== this.frame.height) {
        this.frame.setSize(this.canvas.width, this.canvas.height);
      }

      if (this.renderer.gl) {
        this.frame.source.glTexture = this.renderer.canvasToTexture(this.canvas, this.frame.source.glTexture, true);
        this.frame.glTexture = this.frame.source.glTexture;
      }

      this.dirty = false;
      var input = this.input;

      if (input && !input.customHitArea) {
        input.hitArea.width = this.width;
        input.hitArea.height = this.height;
      }

      return this;
    },
    generateTexture: function generateTexture(key, x, y, width, height) {
      var srcCanvas = this.canvas;

      if (width === undefined) {
        width = srcCanvas.width;
      } else {
        width *= this.resolution;
      }

      if (height === undefined) {
        height = srcCanvas.height;
      } else {
        height *= this.resolution;
      }

      CopyCanvasToTexture(this.scene, srcCanvas, key, x, y, width, height);
      return this;
    },
    loadTexture: function loadTexture(key, frame) {
      var textureFrame = this.scene.sys.textures.getFrame(key, frame);

      if (!textureFrame) {
        return this;
      }

      if (this.width !== textureFrame.cutWidth || this.height !== textureFrame.cutHeight) {
        this.setSize(textureFrame.cutWidth, textureFrame.cutHeight);
      } else {
        this.clear();
      }

      this.context.drawImage(textureFrame.source.image, textureFrame.cutX, textureFrame.cutY, textureFrame.cutWidth, textureFrame.cutHeight, 0, 0, this.canvas.width, this.canvas.height);
      this.dirty = true;
      return this;
    }
  };

  var CanvasPool = Phaser.Display.Canvas.CanvasPool;
  var GameObject = Phaser.GameObjects.GameObject;

  var Canvas = /*#__PURE__*/function (_GameObject) {
    _inherits(Canvas, _GameObject);

    var _super = _createSuper(Canvas);

    function Canvas(scene, x, y, width, height) {
      var _this;

      _classCallCheck(this, Canvas);

      if (x === undefined) {
        x = 0;
      }

      if (y === undefined) {
        y = 0;
      }

      if (width === undefined) {
        width = 1;
      }

      if (height === undefined) {
        height = 1;
      }

      _this = _super.call(this, scene, 'rexCanvas');
      _this.renderer = scene.sys.game.renderer;
      _this.resolution = 1;
      _this._width = width;
      _this._height = height;
      width = Math.max(Math.ceil(width * _this.resolution), 1);
      height = Math.max(Math.ceil(height * _this.resolution), 1);
      _this.canvas = CanvasPool.create(_assertThisInitialized(_this), width, height);
      _this.context = _this.canvas.getContext('2d');
      _this.dirty = false;

      _this.setPosition(x, y);

      _this.setOrigin(0.5, 0.5);

      _this.initPipeline();

      _this._crop = _this.resetCropObject(); //  Create a Texture for this Text object

      _this.texture = scene.sys.textures.addCanvas(null, _this.canvas, true); //  Get the frame

      _this.frame = _this.texture.get(); //  Set the resolution

      _this.frame.source.resolution = _this.resolution;

      if (_this.renderer && _this.renderer.gl) {
        //  Clear the default 1x1 glTexture, as we override it later
        _this.renderer.deleteTexture(_this.frame.source.glTexture);

        _this.frame.source.glTexture = null;
      }

      _this.dirty = true;
      scene.sys.game.events.on('contextrestored', _this.onContextRestored, _assertThisInitialized(_this));
      return _this;
    }

    _createClass(Canvas, [{
      key: "onContextRestored",
      value: function onContextRestored() {
        this.dirty = true;
      }
    }, {
      key: "preDestroy",
      value: function preDestroy() {
        this.scene.sys.game.events.off('contextrestored', this.onContextRestored, this);
        CanvasPool.remove(this.canvas);
        this.texture.destroy();
        this.canvas = null;
        this.context = null;
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        this.setSize(value, this._height);
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        this.setSize(this._width, value);
      }
    }, {
      key: "setSize",
      value: function setSize(width, height) {
        if (this._width === width && this._height === height) {
          return this;
        }

        this._width = width;
        this._height = height;
        this.updateDisplayOrigin();
        width = Math.max(Math.ceil(width * this.resolution), 1);
        height = Math.max(Math.ceil(height * this.resolution), 1);
        this.canvas.width = width;
        this.canvas.height = height;
        this.frame.setSize(width, height);
        this.dirty = true;
        return this;
      }
    }, {
      key: "displayWidth",
      get: function get() {
        return this.scaleX * this._width;
      },
      set: function set(value) {
        this.scaleX = value / this._width;
      }
    }, {
      key: "displayHeight",
      get: function get() {
        return this.scaleY * this._height;
      },
      set: function set(value) {
        this.scaleY = value / this._height;
      }
    }, {
      key: "setDisplaySize",
      value: function setDisplaySize(width, height) {
        this.displayWidth = width;
        this.displayHeight = height;
        return this;
      }
    }, {
      key: "getCanvas",
      value: function getCanvas(readOnly) {
        if (!readOnly) {
          this.dirty = true;
        }

        return this.canvas;
      }
    }, {
      key: "getContext",
      value: function getContext(readOnly) {
        if (!readOnly) {
          this.dirty = true;
        }

        return this.context;
      }
    }, {
      key: "needRedraw",
      value: function needRedraw() {
        this.dirty = true;
        return this;
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        this.setSize(width, height);
        return this;
      }
    }]);

    return Canvas;
  }(GameObject);

  var Components = Phaser.GameObjects.Components;
  Phaser.Class.mixin(Canvas, [Components.Alpha, Components.BlendMode, Components.Crop, Components.Depth, Components.Flip, Components.GetBounds, Components.Mask, Components.Origin, Components.Pipeline, Components.ScrollFactor, Components.Tint, Components.Transform, Components.Visible, Render, CanvasMethods, TextureMethods]);

  var Pad = Phaser.Utils.String.Pad;

  var GetStyle = function GetStyle(style, canvas, context) {
    if (style == null) {
      return style;
    }

    switch (_typeof(style)) {
      case 'string':
        return style;

      case 'number':
        return "#".concat(Pad(Math.floor(style).toString(16), 6, '0', 1));

      case 'function':
        return style(canvas, context);

      case 'object':
        if (style.hasOwnProperty('r')) {
          if (style.hasOwnProperty('a')) {
            // rgba
            return "rgba(".concat(style.r, ",").concat(style.g, ",").concat(style.b, ",").concat(style.a, ")");
          } else {
            // rgb
            return "rgb(".concat(style.r, ",").concat(style.g, ",").concat(style.b, ")");
          }
        } else if (style.hasOwnProperty('h')) {
          if (style.hasOwnProperty('a')) {
            // hsla
            return "hsla(".concat(style.h, ",").concat(style.s, ",").concat(style.l, ",").concat(style.a, ")");
          } else {
            // hsl
            return "hsl(".concat(style.h, ",").concat(style.s, ",").concat(style.l, ")");
          }
        } else {
          return style; // Not a valid input
        }

      default:
        return style;
    }
  };

  var DrawCircle = function DrawCircle(canvas, context, x, y, rx, ry, fillStyle, strokeStyle, lineWidth, startAngle, endAngle, anticlockwise) {
    if (startAngle === undefined) {
      startAngle = 0;
    }

    if (endAngle === undefined) {
      endAngle = 2 * Math.PI;
    }

    if (anticlockwise === undefined) {
      anticlockwise = false;
    }

    context.beginPath();
    context.ellipse(x, y, rx, ry, 0, startAngle, endAngle, anticlockwise);

    if (fillStyle != null) {
      context.fillStyle = fillStyle;
      context.fill();
    }

    if (strokeStyle != null) {
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.stroke();
    }
  };

  var DrawText = function DrawText(canvas, context, x, y, text, font, fillStyle, strokeStyle, lineWidth, textAlign, textBaseline) {
    if (lineWidth === undefined && strokeStyle != null) {
      lineWidth = 2;
    }

    if (textAlign === undefined) {
      textAlign = 'start';
    }

    if (textBaseline === undefined) {
      textBaseline = 'alphabetic';
    }

    context.font = font;
    context.textAlign = textAlign;
    context.textBaseline = textBaseline;
    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    if (strokeStyle != null && strokeStyle !== 'none' && lineWidth > 0) {
      context.strokeText(text, x, y);
    }

    if (fillStyle != null && fillStyle !== 'none') {
      context.fillText(text, x, y);
    }
  };

  var DrawContent = function DrawContent() {
    var x = this.radius;
    var lineWidth = this.thickness * this.radius;
    var barRadius = this.radius - lineWidth / 2;
    var centerRadius = this.radius - lineWidth;
    var canvas = this.canvas,
        context = this.context; // Draw track

    if (this.trackColor && lineWidth > 0) {
      context.save();
      DrawCircle(canvas, context, x, x, barRadius, barRadius, undefined, this.trackColor, lineWidth);
      context.restore();
    } // Draw bar


    if (this.barColor && barRadius > 0) {
      var anticlockwise, startAngle, endAngle;

      if (this.value === 1) {
        anticlockwise = false;
        startAngle = 0;
        endAngle = 2 * Math.PI;
      } else {
        anticlockwise = this.anticlockwise;
        startAngle = this.startAngle;
        var deltaAngle = 2 * Math.PI * (anticlockwise ? 1 - this.value : this.value);
        endAngle = deltaAngle + startAngle;
      }

      context.save();
      DrawCircle(canvas, context, x, x, barRadius, barRadius, undefined, this.barColor, lineWidth, startAngle, endAngle, anticlockwise);
      context.restore();
    } // Draw center


    if (this.centerColor && centerRadius > 0) {
      var fillStyle;

      if (this.centerColor2) {
        fillStyle = this.context.createRadialGradient(x, x, 0, x, x, centerRadius);
        fillStyle.addColorStop(0, this.centerColor);
        fillStyle.addColorStop(1, this.centerColor2);
      } else {
        fillStyle = this.centerColor;
      }

      context.save();
      DrawCircle(canvas, context, x, x, centerRadius, centerRadius, fillStyle);
      context.restore();
    } // Draw text


    if (this.textFormatCallback && (this.textColor || this.textStrokeColor)) {
      context.save();
      DrawText(canvas, context, x, x, this.getFormatText(), this.textFont, this.textColor, this.textStrokeColor, this.textStrokeThickness, 'center', // textAlign
      'middle' // textBaseline
      );
      context.restore();
    }
  };

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

  var SceneUpdateTickTask = /*#__PURE__*/function (_TickTask) {
    _inherits(SceneUpdateTickTask, _TickTask);

    var _super = _createSuper(SceneUpdateTickTask);

    function SceneUpdateTickTask() {
      _classCallCheck(this, SceneUpdateTickTask);

      return _super.apply(this, arguments);
    }

    _createClass(SceneUpdateTickTask, [{
      key: "startTicking",
      value: function startTicking() {
        _get(_getPrototypeOf(SceneUpdateTickTask.prototype), "startTicking", this).call(this);

        this.scene.sys.events.on('update', this.update, this);
      }
    }, {
      key: "stopTicking",
      value: function stopTicking() {
        _get(_getPrototypeOf(SceneUpdateTickTask.prototype), "stopTicking", this).call(this);

        if (this.scene) {
          // Scene might be destoryed
          this.scene.sys.events.off('update', this.update, this);
        }
      } // update(time, delta) {
      //     
      // }

    }]);

    return SceneUpdateTickTask;
  }(TickTask);

  var GetValue$3 = Phaser.Utils.Objects.GetValue;
  var Clamp$1 = Phaser.Math.Clamp;

  var Timer = /*#__PURE__*/function () {
    function Timer(config) {
      _classCallCheck(this, Timer);

      this.resetFromJSON(config);
    }

    _createClass(Timer, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        this.state = GetValue$3(o, 'state', IDLE);
        this.timeScale = GetValue$3(o, 'timeScale', 1);
        this.delay = GetValue$3(o, 'delay', 0);
        this.repeat = GetValue$3(o, 'repeat', 0);
        this.repeatCounter = GetValue$3(o, 'repeatCounter', 0);
        this.duration = GetValue$3(o, 'duration', 0);
        this.nowTime = GetValue$3(o, 'nowTime', 0);
        this.justRestart = GetValue$3(o, 'justRestart', false);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          state: this.state,
          timeScale: this.timeScale,
          delay: this.delay,
          repeat: this.repeat,
          repeatCounter: this.repeatCounter,
          duration: this.duration,
          nowTime: this.nowTime,
          justRestart: this.justRestart
        };
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }, {
      key: "setTimeScale",
      value: function setTimeScale(timeScale) {
        this.timeScale = timeScale;
        return this;
      }
    }, {
      key: "setDelay",
      value: function setDelay(delay) {
        if (delay === undefined) {
          delay = 0;
        }

        this.delay = delay;
        return this;
      }
    }, {
      key: "setDuration",
      value: function setDuration(duration) {
        this.duration = duration;
        return this;
      }
    }, {
      key: "setRepeat",
      value: function setRepeat(repeat) {
        this.repeat = repeat;
        return this;
      }
    }, {
      key: "setRepeatInfinity",
      value: function setRepeatInfinity() {
        this.repeat = -1;
        return this;
      }
    }, {
      key: "start",
      value: function start() {
        this.nowTime = this.delay > 0 ? -this.delay : 0;
        this.state = this.nowTime >= 0 ? COUNTDOWN : DELAY;
        this.repeatCounter = 0;
        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        this.state = IDLE;
        return this;
      }
    }, {
      key: "update",
      value: function update(time, delta) {
        if (this.state === IDLE || this.state === DONE || delta === 0 || this.timeScale === 0) {
          return;
        }

        this.nowTime += delta * this.timeScale;
        this.state = this.nowTime >= 0 ? COUNTDOWN : DELAY;
        this.justRestart = false;

        if (this.nowTime >= this.duration) {
          if (this.repeat === -1 || this.repeatCounter < this.repeat) {
            this.repeatCounter++;
            this.justRestart = true;
            this.nowTime -= this.duration;
          } else {
            this.nowTime = this.duration;
            this.state = DONE;
          }
        }
      }
    }, {
      key: "t",
      get: function get() {
        var t;

        switch (this.state) {
          case IDLE:
          case DELAY:
            t = 0;
            break;

          case COUNTDOWN:
            t = this.nowTime / this.duration;
            break;

          case DONE:
            t = 1;
            break;
        }

        return Clamp$1(t, 0, 1);
      },
      set: function set(value) {
        value = Clamp$1(value, -1, 1);

        if (value < 0) {
          this.state = DELAY;
          this.nowTime = -this.delay * value;
        } else {
          this.state = COUNTDOWN;
          this.nowTime = this.duration * value;

          if (value === 1 && this.repeat !== 0) {
            this.repeatCounter++;
          }
        }
      }
    }, {
      key: "setT",
      value: function setT(t) {
        this.t = t;
        return this;
      }
    }, {
      key: "isIdle",
      get: function get() {
        return this.state === IDLE;
      }
    }, {
      key: "isDelay",
      get: function get() {
        return this.state === DELAY;
      }
    }, {
      key: "isCountDown",
      get: function get() {
        return this.state === COUNTDOWN;
      }
    }, {
      key: "isRunning",
      get: function get() {
        return this.state === DELAY || this.state === COUNTDOWN;
      }
    }, {
      key: "isDone",
      get: function get() {
        return this.state === DONE;
      }
    }, {
      key: "isOddIteration",
      get: function get() {
        return (this.repeatCounter & 1) === 1;
      }
    }, {
      key: "isEvenIteration",
      get: function get() {
        return (this.repeatCounter & 1) === 0;
      }
    }]);

    return Timer;
  }();

  var IDLE = 0;
  var DELAY = 1;
  var COUNTDOWN = 2;
  var DONE = -1;

  var TimerTickTask = /*#__PURE__*/function (_TickTask) {
    _inherits(TimerTickTask, _TickTask);

    var _super = _createSuper(TimerTickTask);

    function TimerTickTask(parent, config) {
      var _this;

      _classCallCheck(this, TimerTickTask);

      _this = _super.call(this, parent, config);
      _this.timer = new Timer(); // boot() later 

      return _this;
    } // override


    _createClass(TimerTickTask, [{
      key: "shutdown",
      value: function shutdown(fromScene) {
        // Already shutdown
        if (this.isShutdown) {
          return;
        }

        _get(_getPrototypeOf(TimerTickTask.prototype), "shutdown", this).call(this, fromScene);

        this.timer.destroy();
        this.timer = undefined;
      }
    }, {
      key: "start",
      value: function start() {
        this.timer.start();

        _get(_getPrototypeOf(TimerTickTask.prototype), "start", this).call(this);

        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        this.timer.stop();

        _get(_getPrototypeOf(TimerTickTask.prototype), "stop", this).call(this);

        return this;
      }
    }, {
      key: "complete",
      value: function complete() {
        this.timer.stop();

        _get(_getPrototypeOf(TimerTickTask.prototype), "complete", this).call(this);

        return this;
      }
    }]);

    return TimerTickTask;
  }(SceneUpdateTickTask);

  var GetValue$2 = Phaser.Utils.Objects.GetValue;
  var GetAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;
  var GetEaseFunction = Phaser.Tweens.Builders.GetEaseFunction;

  var EaseValueTaskBase = /*#__PURE__*/function (_TickTask) {
    _inherits(EaseValueTaskBase, _TickTask);

    var _super = _createSuper(EaseValueTaskBase);

    function EaseValueTaskBase() {
      _classCallCheck(this, EaseValueTaskBase);

      return _super.apply(this, arguments);
    }

    _createClass(EaseValueTaskBase, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        this.timer.resetFromJSON(GetValue$2(o, 'timer'));
        this.setEnable(GetValue$2(o, 'enable', true));
        this.setTarget(GetValue$2(o, 'target', this.parent));
        this.setDelay(GetAdvancedValue(o, 'delay', 0));
        this.setDuration(GetAdvancedValue(o, 'duration', 1000));
        this.setEase(GetValue$2(o, 'ease', 'Linear'));
        this.setRepeat(GetValue$2(o, 'repeat', 0));
        return this;
      }
    }, {
      key: "setEnable",
      value: function setEnable(e) {
        if (e == undefined) {
          e = true;
        }

        this.enable = e;
        return this;
      }
    }, {
      key: "setTarget",
      value: function setTarget(target) {
        if (target === undefined) {
          target = this.parent;
        }

        this.target = target;
        return this;
      }
    }, {
      key: "setDelay",
      value: function setDelay(time) {
        this.delay = time;
        return this;
      }
    }, {
      key: "setDuration",
      value: function setDuration(time) {
        this.duration = time;
        return this;
      }
    }, {
      key: "setEase",
      value: function setEase(ease) {
        if (ease === undefined) {
          ease = 'Linear';
        }

        this.ease = ease;
        this.easeFn = GetEaseFunction(ease);
        return this;
      }
    }, {
      key: "setRepeat",
      value: function setRepeat(repeat) {
        this.repeat = repeat;
        return this;
      } // Override

    }, {
      key: "start",
      value: function start() {
        // Ignore start if timer is running, i.e. in DELAY, o RUN state
        if (this.timer.isRunning) {
          return this;
        }

        _get(_getPrototypeOf(EaseValueTaskBase.prototype), "start", this).call(this);

        return this;
      }
    }, {
      key: "restart",
      value: function restart() {
        this.timer.stop();
        this.start.apply(this, arguments);
        return this;
      }
    }, {
      key: "stop",
      value: function stop(toEnd) {
        if (toEnd === undefined) {
          toEnd = false;
        }

        _get(_getPrototypeOf(EaseValueTaskBase.prototype), "stop", this).call(this);

        if (toEnd) {
          this.timer.setT(1);
          this.updateGameObject(this.target, this.timer);
          this.complete();
        }

        return this;
      }
    }, {
      key: "update",
      value: function update(time, delta) {
        if (!this.isRunning || !this.enable || !this.parent.active) {
          return this;
        }

        var target = this.target,
            timer = this.timer;
        timer.update(time, delta); // isDelay, isCountDown, isDone

        if (!timer.isDelay) {
          this.updateGameObject(target, timer);
        }

        this.emit('update', target, this);

        if (timer.isDone) {
          this.complete();
        }

        return this;
      } // Override

    }, {
      key: "updateGameObject",
      value: function updateGameObject(target, timer) {}
    }]);

    return EaseValueTaskBase;
  }(TimerTickTask);

  var GetValue$1 = Phaser.Utils.Objects.GetValue;
  var Linear$1 = Phaser.Math.Linear;

  var EaseValueTask = /*#__PURE__*/function (_EaseValueTaskBase) {
    _inherits(EaseValueTask, _EaseValueTaskBase);

    var _super = _createSuper(EaseValueTask);

    function EaseValueTask(gameObject, config) {
      var _this;

      _classCallCheck(this, EaseValueTask);

      _this = _super.call(this, gameObject, config); // this.parent = gameObject;
      // this.timer

      _this.resetFromJSON();

      _this.boot();

      return _this;
    }

    _createClass(EaseValueTask, [{
      key: "start",
      value: function start(config) {
        if (this.timer.isRunning) {
          return this;
        }

        var target = this.target;
        this.propertyKey = GetValue$1(config, 'key', 'value');
        var currentValue = target[this.propertyKey];
        this.fromValue = GetValue$1(config, 'from', currentValue);
        this.toValue = GetValue$1(config, 'to', currentValue);
        this.setEase(GetValue$1(config, 'ease', this.ease));
        this.setDuration(GetValue$1(config, 'duration', this.duration));
        this.timer.setDuration(this.duration);
        target[this.propertyKey] = this.fromValue;

        _get(_getPrototypeOf(EaseValueTask.prototype), "start", this).call(this);

        return this;
      }
    }, {
      key: "updateGameObject",
      value: function updateGameObject(target, timer) {
        var t = timer.t;
        t = this.easeFn(t);
        target[this.propertyKey] = Linear$1(this.fromValue, this.toValue, t);
      }
    }]);

    return EaseValueTask;
  }(EaseValueTaskBase);

  var Percent$1 = Phaser.Math.Percent;

  var SetEaseValuePropName = function SetEaseValuePropName(name) {
    this.easeValuePropName = name;
    return this;
  };

  var SetEaseValueDuration = function SetEaseValueDuration(duration) {
    this.easeValueDuration = duration;
    return this;
  };

  var SetEaseValueFunction = function SetEaseValueFunction(ease) {
    this.easeFunction = ease;
    return this;
  };

  var StopEaseValue = function StopEaseValue() {
    if (this.easeValueTask) {
      this.easeValueTask.stop();
    }

    return this;
  };

  var EaseValueTo = function EaseValueTo(value, min, max) {
    if (value === undefined || value === null) {
      return this;
    }

    if (min !== undefined) {
      value = Percent$1(value, min, max);
    }

    if (this.easeValueTask === undefined) {
      this.easeValueTask = new EaseValueTask(this, {
        eventEmitter: null
      });
    }

    this.easeValueTask.restart({
      key: this.easeValuePropName,
      to: value,
      duration: this.easeValueDuration,
      ease: this.easeFunction
    });
    return this;
  };

  var EaseValueMethods = {
    setEaseValuePropName: SetEaseValuePropName,
    setEaseValueDuration: SetEaseValueDuration,
    setEaseValueFunction: SetEaseValueFunction,
    stopEaseValue: StopEaseValue,
    easeValueTo: EaseValueTo
  };

  var GetValue = Phaser.Utils.Objects.GetValue;
  var IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
  var Clamp = Phaser.Math.Clamp;
  var Linear = Phaser.Math.Linear;
  var Percent = Phaser.Math.Percent;
  var DefaultStartAngle = Phaser.Math.DegToRad(270);

  var CircularProgress = /*#__PURE__*/function (_Canvas) {
    _inherits(CircularProgress, _Canvas);

    var _super = _createSuper(CircularProgress);

    function CircularProgress(scene, x, y, radius, barColor, value, config) {
      var _this;

      _classCallCheck(this, CircularProgress);

      if (IsPlainObject(x)) {
        config = x;
        x = GetValue(config, 'x', 0);
        y = GetValue(config, 'y', 0);
        radius = GetValue(config, 'radius', 1);
        barColor = GetValue(config, 'barColor', undefined);
        value = GetValue(config, 'value', 0);
      }

      var width = radius * 2;
      _this = _super.call(this, scene, x, y, width, width);
      _this.type = 'rexCircularProgressCanvas';
      _this.eventEmitter = GetValue(config, 'eventEmitter', _assertThisInitialized(_this));

      _this.setRadius(radius);

      _this.setTrackColor(GetValue(config, 'trackColor', undefined));

      _this.setBarColor(barColor);

      _this.setCenterColor(GetValue(config, 'centerColor', undefined));

      _this.setThickness(GetValue(config, 'thickness', 0.2));

      _this.setStartAngle(GetValue(config, 'startAngle', DefaultStartAngle));

      _this.setAnticlockwise(GetValue(config, 'anticlockwise', false));

      _this.setTextColor(GetValue(config, 'textColor', undefined));

      _this.setTextStrokeColor(GetValue(config, 'textStrokeColor', undefined), GetValue(config, 'textStrokeThickness', undefined));

      var textFont = GetValue(config, 'textFont', undefined);

      if (textFont) {
        _this.setTextFont(textFont);
      } else {
        _this.setTextFont(GetValue(config, 'textSize', '16px'), GetValue(config, 'textFamily', 'Courier'), GetValue(config, 'textStyle', ''));
      }

      _this.setTextFormatCallback(GetValue(config, 'textFormatCallback', undefined), GetValue(config, 'textFormatCallbackScope', undefined));

      var callback = GetValue(config, 'valuechangeCallback', null);

      if (callback !== null) {
        var scope = GetValue(config, 'valuechangeCallbackScope', undefined);

        _this.eventEmitter.on('valuechange', callback, scope);
      }

      _this.setEaseValuePropName('value').setEaseValueDuration(GetValue(config, 'easeValue.duration', 0)).setEaseValueFunction(GetValue(config, 'easeValue.ease', 'Linear'));

      _this.setValue(value);

      return _this;
    }

    _createClass(CircularProgress, [{
      key: "resize",
      value: function resize(width, height) {
        width = Math.floor(Math.min(width, height));

        if (width === this.width) {
          return this;
        }

        _get(_getPrototypeOf(CircularProgress.prototype), "resize", this).call(this, width, width);

        this.setRadius(width / 2);
        return this;
      }
    }, {
      key: "value",
      get: function get() {
        return this._value;
      },
      set: function set(value) {
        value = Clamp(value, 0, 1);
        var oldValue = this._value;
        var valueChanged = oldValue != value;
        this.dirty = this.dirty || valueChanged;
        this._value = value;

        if (valueChanged) {
          this.eventEmitter.emit('valuechange', this._value, oldValue, this.eventEmitter);
        }
      }
    }, {
      key: "setValue",
      value: function setValue(value, min, max) {
        if (value === undefined || value === null) {
          return this;
        }

        if (min !== undefined) {
          value = Percent(value, min, max);
        }

        this.value = value;
        return this;
      }
    }, {
      key: "addValue",
      value: function addValue(inc, min, max) {
        if (min !== undefined) {
          inc = Percent(inc, min, max);
        }

        this.value += inc;
        return this;
      }
    }, {
      key: "getValue",
      value: function getValue(min, max) {
        var value = this.value;

        if (min !== undefined) {
          value = Linear(min, max, value);
        }

        return value;
      }
    }, {
      key: "radius",
      get: function get() {
        return this._radius;
      },
      set: function set(value) {
        this.dirty = this.dirty || this._radius != value;
        this._radius = value;
        var width = value * 2;
        this.resize(width, width);
      }
    }, {
      key: "setRadius",
      value: function setRadius(radius) {
        this.radius = radius;
        return this;
      }
    }, {
      key: "trackColor",
      get: function get() {
        return this._trackColor;
      },
      set: function set(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || this._trackColor != value;
        this._trackColor = value;
      }
    }, {
      key: "setTrackColor",
      value: function setTrackColor(color) {
        this.trackColor = color;
        return this;
      }
    }, {
      key: "barColor",
      get: function get() {
        return this._barColor;
      },
      set: function set(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || this._barColor != value;
        this._barColor = value;
      }
    }, {
      key: "setBarColor",
      value: function setBarColor(color) {
        this.barColor = color;
        return this;
      }
    }, {
      key: "startAngle",
      get: function get() {
        return this._startAngle;
      },
      set: function set(value) {
        this.dirty = this.dirty || this._startAngle != value;
        this._startAngle = value;
      }
    }, {
      key: "setStartAngle",
      value: function setStartAngle(angle) {
        this.startAngle = angle;
        return this;
      }
    }, {
      key: "anticlockwise",
      get: function get() {
        return this._anticlockwise;
      },
      set: function set(value) {
        this.dirty = this.dirty || this._anticlockwise != value;
        this._anticlockwise = value;
      }
    }, {
      key: "setAnticlockwise",
      value: function setAnticlockwise(anticlockwise) {
        if (anticlockwise === undefined) {
          anticlockwise = true;
        }

        this.anticlockwise = anticlockwise;
        return this;
      }
    }, {
      key: "thickness",
      get: function get() {
        return this._thickness;
      },
      set: function set(value) {
        value = Clamp(value, 0, 1);
        this.dirty = this.dirty || this._thickness != value;
        this._thickness = value;
      }
    }, {
      key: "setThickness",
      value: function setThickness(thickness) {
        this.thickness = thickness;
        return this;
      }
    }, {
      key: "centerColor",
      get: function get() {
        return this._centerColor;
      },
      set: function set(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || this._centerColor != value;
        this._centerColor = value;
      }
    }, {
      key: "centerColor2",
      get: function get() {
        return this._centerColor2;
      },
      set: function set(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || this._centerColor2 != value;
        this._centerColor2 = value;
      }
    }, {
      key: "setCenterColor",
      value: function setCenterColor(color, color2) {
        this.centerColor = color;
        this.centerColor2 = color2;
        return this;
      }
    }, {
      key: "textColor",
      get: function get() {
        return this._textColor;
      },
      set: function set(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || this._textColor != value;
        this._textColor = value;
      }
    }, {
      key: "setTextColor",
      value: function setTextColor(color) {
        this.textColor = color;
        return this;
      }
    }, {
      key: "textStrokeColor",
      get: function get() {
        return this._textStrokeColor;
      },
      set: function set(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || this._textStrokeColor != value;
        this._textStrokeColor = value;
      }
    }, {
      key: "textStrokeThickness",
      get: function get() {
        return this._textStrokeThickness;
      },
      set: function set(value) {
        this.dirty = this.dirty || this._textStrokeThickness != value;
        this._textStrokeThickness = value;
      }
    }, {
      key: "setTextStrokeColor",
      value: function setTextStrokeColor(color, thickness) {
        if (thickness === undefined) {
          thickness = 2;
        }

        this.textStrokeColor = color;
        this.textStrokeThickness = thickness;
        return this;
      }
    }, {
      key: "textFont",
      get: function get() {
        return this._textFont;
      },
      set: function set(value) {
        this.dirty = this.dirty || this._textFont != value;
        this._textFont = value;
      }
    }, {
      key: "setTextFont",
      value: function setTextFont(fontSize, fontFamily, fontStyle) {
        var font;

        if (fontFamily === undefined) {
          font = fontSize;
        } else {
          font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
        }

        this.textFont = font;
        return this;
      }
    }, {
      key: "setTextFormatCallback",
      value: function setTextFormatCallback(callback, scope) {
        this.textFormatCallback = callback;
        this.textFormatCallbackScope = scope;
        return this;
      }
    }, {
      key: "updateTexture",
      value: function updateTexture() {
        this.clear();
        DrawContent.call(this);

        _get(_getPrototypeOf(CircularProgress.prototype), "updateTexture", this).call(this);

        return this;
      }
    }, {
      key: "getFormatText",
      value: function getFormatText(value) {
        if (value === undefined) {
          value = this.value;
        }

        var text;

        if (this.textFormatCallbackScope) {
          text = this.textFormatCallback(value);
        } else {
          text = this.textFormatCallback.call(this.textFormatCallbackScope, value);
        }

        return text;
      }
    }]);

    return CircularProgress;
  }(Canvas);

  Object.assign(CircularProgress.prototype, EaseValueMethods);

  return CircularProgress;

}));
