(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexsplitpipelineplugin = factory());
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

  var frag = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n#define highmedp highp\n#else\n#define highmedp mediump\n#endif\nprecision highmedp float;\n\n// Scene buffer\nuniform sampler2D uMainSampler; \nvarying vec2 outTexCoord;\n\n// Effect parameters\nuniform vec2 texSize;\nuniform vec2 split;\nuniform float spaceLeft;\nuniform float spaceRight;\nuniform float spaceTop;\nuniform float spaceBottom;\nuniform float angle;\nuniform float shiftEnable;\n\nvec2 rotate(vec2 uv, float angle) {\n  float s = sin(angle);\n  float c = cos(angle);\n  return vec2(\n    uv.x * c + uv.y * s,\n    uv.y * c - uv.x * s\n  );\n}\n\nvoid main (void) {\n  vec2 tc = outTexCoord * texSize;  \n  tc -= split;\n  tc = rotate(tc, -angle);\n\n  if (\n    ((tc.x > -spaceLeft) && (tc.x < spaceRight)) ||\n    ((tc.y > -spaceTop) && (tc.y < spaceBottom))\n  ) {\n    gl_FragColor = vec4(0,0,0,0);\n  } else {\n    if (shiftEnable > 0.0) {\n      tc.x += (tc.x < 0.0)? spaceLeft: -spaceRight;\n      tc.y += (tc.y < 0.0)? spaceTop: -spaceBottom;\n    }\n\n    tc = rotate(tc, angle);\n    tc += split;\n    gl_FragColor = texture2D(uMainSampler, tc / texSize);\n  }\n\n}\n";

  var PostFXPipeline = Phaser.Renderer.WebGL.Pipelines.PostFXPipeline;
  var GetValue = Phaser.Utils.Objects.GetValue;
  var DegToRad = Phaser.Math.DegToRad;
  var RadToDeg = Phaser.Math.RadToDeg;

  var SplitPostFxPipeline = /*#__PURE__*/function (_PostFXPipeline) {
    _inherits(SplitPostFxPipeline, _PostFXPipeline);

    var _super = _createSuper(SplitPostFxPipeline);

    function SplitPostFxPipeline(game) {
      var _this;

      _classCallCheck(this, SplitPostFxPipeline);

      _this = _super.call(this, {
        name: 'rexSplitPostFx',
        game: game,
        renderTarget: true,
        fragShader: frag
      });
      _this.splitX = 0;
      _this.splitY = 0;
      _this.spaceLeft = 0;
      _this.spaceRight = 0;
      _this.spaceTop = 0;
      _this.spaceBottom = 0;
      _this.rotation = 0;
      _this.shiftEnable = true;
      return _this;
    }

    _createClass(SplitPostFxPipeline, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        var splittedWidth = GetValue(o, 'width', undefined);

        if (splittedWidth === undefined) {
          this.spaceLeft = GetValue(o, 'left', 0);
          this.spaceRight = GetValue(o, 'right', 0);
        } else {
          this.splittedWidth = splittedWidth;
        }

        var splittedHeight = GetValue(o, 'height', undefined);

        if (splittedHeight === undefined) {
          this.spaceTop = GetValue(o, 'top', 0);
          this.spaceBottom = GetValue(o, 'bottom', 0);
        } else {
          this.splittedHeight = splittedHeight;
        }

        this.splitX = GetValue(o, 'x', this.renderer.width / 2);
        this.splitY = GetValue(o, 'Y', this.renderer.height / 2);
        var rotation = GetValue(o, 'rotation', undefined);

        if (rotation === undefined) {
          this.setAngle(GetValue(o, 'angle', 0));
        } else {
          this.setRotation(rotation);
        }

        this.shiftEnable = GetValue(o, 'shiftEnable', true);
        return this;
      }
    }, {
      key: "onPreRender",
      value: function onPreRender() {
        var texWidth = this.renderer.width,
            textHeight = this.renderer.height;
        this.set2f('split', this.splitX, textHeight - this.splitY);
        this.set1f('angle', this.rotation);
        this.set2f('texSize', texWidth, textHeight);
        this.set1f('spaceLeft', this.spaceLeft);
        this.set1f('spaceRight', this.spaceRight);
        this.set1f('spaceTop', this.spaceTop);
        this.set1f('spaceBottom', this.spaceBottom);
        this.set1f('shiftEnable', this.shiftEnable ? 1 : 0);
      } // split

    }, {
      key: "setSplit",
      value: function setSplit(x, y) {
        if (x === undefined) {
          x = 0;
        }

        if (y === undefined) {
          y = 0;
        }

        this.splitX = x;
        this.splitY = y;
        return this;
      }
    }, {
      key: "splitAtCenter",
      value: function splitAtCenter(width, height) {
        this.setSplit(this.renderer.width / 2, this.renderer.height / 2);

        if (width !== undefined) {
          this.setSplittedWidth(width);
        }

        if (height !== undefined) {
          this.setSplittedHeight(height);
        }

        return this;
      } // rotation

    }, {
      key: "setRotation",
      value: function setRotation(value) {
        this.rotation = value;
        return this;
      }
    }, {
      key: "angle",
      get: function get() {
        return RadToDeg(this.rotation);
      },
      set: function set(value) {
        this.rotation = DegToRad(value);
      }
    }, {
      key: "setAngle",
      value: function setAngle(value) {
        this.angle = value;
        return this;
      } // space

    }, {
      key: "setSpace",
      value: function setSpace(left, right, top, bottom) {
        if (left === undefined) {
          left = 0;
        }

        if (right === undefined) {
          right = 0;
        }

        if (top === undefined) {
          top = 0;
        }

        if (bottom === undefined) {
          bottom = 0;
        }

        this.spaceLeft = left;
        this.spaceRight = right;
        this.spaceTop = top;
        this.spaceBottom = bottom;
        return this;
      }
    }, {
      key: "splittedWidth",
      get: function get() {
        return this.spaceLeft + this.spaceRight;
      },
      set: function set(value) {
        this.spaceLeft = value / 2;
        this.spaceRight = this.spaceLeft;
      }
    }, {
      key: "setSplittedWidth",
      value: function setSplittedWidth(width) {
        if (width === undefined) {
          width = 0;
        }

        this.splittedWidth = width;
        return this;
      }
    }, {
      key: "splittedHeight",
      get: function get() {
        return this.spaceTop + this.spaceBottom;
      },
      set: function set(value) {
        this.spaceTop = value / 2;
        this.spaceBottom = this.spaceTop;
      }
    }, {
      key: "setSplittedHeight",
      value: function setSplittedHeight(height) {
        if (height === undefined) {
          height = 0;
        }

        this.splittedHeight = height;
        return this;
      } // shiftEnable

    }, {
      key: "setShiftEnable",
      value: function setShiftEnable(enable) {
        if (enable === undefined) {
          enable = true;
        }

        this.shiftEnable = enable;
        return true;
      }
    }]);

    return SplitPostFxPipeline;
  }(PostFXPipeline);

  var SpliceOne = Phaser.Utils.Array.SpliceOne;

  var BasePostFxPipelinePlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(BasePostFxPipelinePlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(BasePostFxPipelinePlugin);

    function BasePostFxPipelinePlugin() {
      _classCallCheck(this, BasePostFxPipelinePlugin);

      return _super.apply(this, arguments);
    }

    _createClass(BasePostFxPipelinePlugin, [{
      key: "setPostPipelineClass",
      value: function setPostPipelineClass(PostFxPipelineClass, postFxPipelineName) {
        this.PostFxPipelineClass = PostFxPipelineClass;
        this.postFxPipelineName = postFxPipelineName;
        return this;
      }
    }, {
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.once('destroy', this.destroy, this);
        this.game.renderer.pipelines.addPostPipeline(this.postFxPipelineName, this.PostFxPipelineClass);
      }
    }, {
      key: "add",
      value: function add(gameObject, config) {
        if (config === undefined) {
          config = {};
        }

        gameObject.setPostPipeline(this.PostFxPipelineClass);
        var pipeline = gameObject.postPipelines[gameObject.postPipelines.length - 1];
        pipeline.resetFromJSON(config);

        if (config.name) {
          pipeline.name = config.name;
        }

        return pipeline;
      }
    }, {
      key: "remove",
      value: function remove(gameObject, name) {
        var PostFxPipelineClass = this.PostFxPipelineClass;

        if (name === undefined) {
          var pipelines = gameObject.postPipelines;

          for (var i = pipelines.length - 1; i >= 0; i--) {
            var instance = pipelines[i];

            if (instance instanceof PostFxPipelineClass) {
              instance.destroy();
              SpliceOne(pipelines, i);
            }
          }
        } else {
          var pipelines = gameObject.postPipelines;

          for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
            var instance = pipelines[i];

            if (instance instanceof PostFxPipelineClass && instance.name === name) {
              instance.destroy();
              SpliceOne(pipelines, i);
            }
          }
        }

        return this;
      }
    }, {
      key: "get",
      value: function get(gameObject, name) {
        var PostFxPipelineClass = this.PostFxPipelineClass;

        if (name === undefined) {
          var result = [];
          var pipelines = gameObject.postPipelines;

          for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
            var instance = pipelines[i];

            if (instance instanceof PostFxPipelineClass) {
              result.push(instance);
            }
          }

          return result;
        } else {
          var pipelines = gameObject.postPipelines;

          for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
            var instance = pipelines[i];

            if (instance instanceof PostFxPipelineClass && instance.name === name) {
              return instance;
            }
          }
        }
      }
    }]);

    return BasePostFxPipelinePlugin;
  }(Phaser.Plugins.BasePlugin);

  var IsInValidKey = function IsInValidKey(keys) {
    return keys == null || keys === '' || keys.length === 0;
  };

  var GetEntry = function GetEntry(target, keys, defaultEntry) {
    var entry = target;

    if (IsInValidKey(keys)) ; else {
      if (typeof keys === 'string') {
        keys = keys.split('.');
      }

      var key;

      for (var i = 0, cnt = keys.length; i < cnt; i++) {
        key = keys[i];

        if (entry[key] == null || _typeof(entry[key]) !== 'object') {
          var newEntry;

          if (i === cnt - 1) {
            if (defaultEntry === undefined) {
              newEntry = {};
            } else {
              newEntry = defaultEntry;
            }
          } else {
            newEntry = {};
          }

          entry[key] = newEntry;
        }

        entry = entry[key];
      }
    }

    return entry;
  };

  var SetValue = function SetValue(target, keys, value, delimiter) {
    if (delimiter === undefined) {
      delimiter = '.';
    } // no object


    if (_typeof(target) !== 'object') {
      return;
    } // invalid key
    else if (IsInValidKey(keys)) {
      // don't erase target
      if (value == null) {
        return;
      } // set target to another object
      else if (_typeof(value) === 'object') {
        target = value;
      }
    } else {
      if (typeof keys === 'string') {
        keys = keys.split(delimiter);
      }

      var lastKey = keys.pop();
      var entry = GetEntry(target, keys);
      entry[lastKey] = value;
    }

    return target;
  };

  var SplitPipelinePlugin = /*#__PURE__*/function (_BasePostFxPipelinePl) {
    _inherits(SplitPipelinePlugin, _BasePostFxPipelinePl);

    var _super = _createSuper(SplitPipelinePlugin);

    function SplitPipelinePlugin(pluginManager) {
      var _this;

      _classCallCheck(this, SplitPipelinePlugin);

      _this = _super.call(this, pluginManager);

      _this.setPostPipelineClass(SplitPostFxPipeline, 'rexSplitPostFx');

      return _this;
    }

    return _createClass(SplitPipelinePlugin);
  }(BasePostFxPipelinePlugin);

  SetValue(window, 'RexPlugins.Pipelines.SplitPostFx', SplitPostFxPipeline);

  return SplitPipelinePlugin;

}));
