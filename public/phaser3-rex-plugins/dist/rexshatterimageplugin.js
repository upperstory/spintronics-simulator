(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexshatterimageplugin = factory());
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

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var delaunay = createCommonjsModule(function (module) {
    // https://github.com/darkskyapp/delaunay-fast/blob/master/delaunay.js
    var Delaunay;

    (function () {

      var EPSILON = 1.0 / 1048576.0;

      function supertriangle(vertices) {
        var xmin = Number.POSITIVE_INFINITY,
            ymin = Number.POSITIVE_INFINITY,
            xmax = Number.NEGATIVE_INFINITY,
            ymax = Number.NEGATIVE_INFINITY,
            i,
            dx,
            dy,
            dmax,
            xmid,
            ymid;

        for (i = vertices.length; i--;) {
          if (vertices[i][0] < xmin) xmin = vertices[i][0];
          if (vertices[i][0] > xmax) xmax = vertices[i][0];
          if (vertices[i][1] < ymin) ymin = vertices[i][1];
          if (vertices[i][1] > ymax) ymax = vertices[i][1];
        }

        dx = xmax - xmin;
        dy = ymax - ymin;
        dmax = Math.max(dx, dy);
        xmid = xmin + dx * 0.5;
        ymid = ymin + dy * 0.5;
        return [[xmid - 20 * dmax, ymid - dmax], [xmid, ymid + 20 * dmax], [xmid + 20 * dmax, ymid - dmax]];
      }

      function circumcircle(vertices, i, j, k) {
        var x1 = vertices[i][0],
            y1 = vertices[i][1],
            x2 = vertices[j][0],
            y2 = vertices[j][1],
            x3 = vertices[k][0],
            y3 = vertices[k][1],
            fabsy1y2 = Math.abs(y1 - y2),
            fabsy2y3 = Math.abs(y2 - y3),
            xc,
            yc,
            m1,
            m2,
            mx1,
            mx2,
            my1,
            my2,
            dx,
            dy;
        /* Check for coincident points */

        if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON) throw new Error("Eek! Coincident points!");

        if (fabsy1y2 < EPSILON) {
          m2 = -((x3 - x2) / (y3 - y2));
          mx2 = (x2 + x3) / 2.0;
          my2 = (y2 + y3) / 2.0;
          xc = (x2 + x1) / 2.0;
          yc = m2 * (xc - mx2) + my2;
        } else if (fabsy2y3 < EPSILON) {
          m1 = -((x2 - x1) / (y2 - y1));
          mx1 = (x1 + x2) / 2.0;
          my1 = (y1 + y2) / 2.0;
          xc = (x3 + x2) / 2.0;
          yc = m1 * (xc - mx1) + my1;
        } else {
          m1 = -((x2 - x1) / (y2 - y1));
          m2 = -((x3 - x2) / (y3 - y2));
          mx1 = (x1 + x2) / 2.0;
          mx2 = (x2 + x3) / 2.0;
          my1 = (y1 + y2) / 2.0;
          my2 = (y2 + y3) / 2.0;
          xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
          yc = fabsy1y2 > fabsy2y3 ? m1 * (xc - mx1) + my1 : m2 * (xc - mx2) + my2;
        }

        dx = x2 - xc;
        dy = y2 - yc;
        return {
          i: i,
          j: j,
          k: k,
          x: xc,
          y: yc,
          r: dx * dx + dy * dy
        };
      }

      function dedup(edges) {
        var i, j, a, b, m, n;

        for (j = edges.length; j;) {
          b = edges[--j];
          a = edges[--j];

          for (i = j; i;) {
            n = edges[--i];
            m = edges[--i];

            if (a === m && b === n || a === n && b === m) {
              edges.splice(j, 2);
              edges.splice(i, 2);
              break;
            }
          }
        }
      }

      Delaunay = {
        triangulate: function triangulate(vertices, key) {
          var n = vertices.length,
              i,
              j,
              indices,
              st,
              open,
              closed,
              edges,
              dx,
              dy,
              a,
              b,
              c;
          /* Bail if there aren't enough vertices to form any triangles. */

          if (n < 3) return [];
          /* Slice out the actual vertices from the passed objects. (Duplicate the
           * array even if we don't, though, since we need to make a supertriangle
           * later on!) */

          vertices = vertices.slice(0);
          if (key) for (i = n; i--;) {
            vertices[i] = vertices[i][key];
          }
          /* Make an array of indices into the vertex array, sorted by the
           * vertices' x-position. */

          indices = new Array(n);

          for (i = n; i--;) {
            indices[i] = i;
          }

          indices.sort(function (i, j) {
            return vertices[j][0] - vertices[i][0];
          });
          /* Next, find the vertices of the supertriangle (which contains all other
           * triangles), and append them onto the end of a (copy of) the vertex
           * array. */

          st = supertriangle(vertices);
          vertices.push(st[0], st[1], st[2]);
          /* Initialize the open list (containing the supertriangle and nothing
           * else) and the closed list (which is empty since we havn't processed
           * any triangles yet). */

          open = [circumcircle(vertices, n + 0, n + 1, n + 2)];
          closed = [];
          edges = [];
          /* Incrementally add each vertex to the mesh. */

          for (i = indices.length; i--; edges.length = 0) {
            c = indices[i];
            /* For each open triangle, check to see if the current point is
             * inside it's circumcircle. If it is, remove the triangle and add
             * it's edges to an edge list. */

            for (j = open.length; j--;) {
              /* If this point is to the right of this triangle's circumcircle,
               * then this triangle should never get checked again. Remove it
               * from the open list, add it to the closed list, and skip. */
              dx = vertices[c][0] - open[j].x;

              if (dx > 0.0 && dx * dx > open[j].r) {
                closed.push(open[j]);
                open.splice(j, 1);
                continue;
              }
              /* If we're outside the circumcircle, skip this triangle. */


              dy = vertices[c][1] - open[j].y;
              if (dx * dx + dy * dy - open[j].r > EPSILON) continue;
              /* Remove the triangle and add it's edges to the edge list. */

              edges.push(open[j].i, open[j].j, open[j].j, open[j].k, open[j].k, open[j].i);
              open.splice(j, 1);
            }
            /* Remove any doubled edges. */


            dedup(edges);
            /* Add a new triangle for each edge. */

            for (j = edges.length; j;) {
              b = edges[--j];
              a = edges[--j];
              open.push(circumcircle(vertices, a, b, c));
            }
          }
          /* Copy any remaining open triangles to the closed list, and then
           * remove any triangles that share a vertex with the supertriangle,
           * building a list of triplets that represent triangles. */


          for (i = open.length; i--;) {
            closed.push(open[i]);
          }

          open.length = 0;

          for (i = closed.length; i--;) {
            if (closed[i].i < n && closed[i].j < n && closed[i].k < n) open.push(closed[i].i, closed[i].j, closed[i].k);
          }
          /* Yay, we're done! */


          return open;
        },
        contains: function contains(tri, p) {
          /* Bounding box test first, for quick rejections. */
          if (p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0] || p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0] || p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1] || p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]) return null;
          var a = tri[1][0] - tri[0][0],
              b = tri[2][0] - tri[0][0],
              c = tri[1][1] - tri[0][1],
              d = tri[2][1] - tri[0][1],
              i = a * d - b * c;
          /* Degenerate tri. */

          if (i === 0.0) return null;
          var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
              v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;
          /* If we're outside the tri, fail. */

          if (u < 0.0 || v < 0.0 || u + v > 1.0) return null;
          return [u, v];
        }
      };
      module.exports = Delaunay;
    })();
  });

  var Triangle = Phaser.Geom.Triangle;

  var Triangulate = function Triangulate(vertices, triangleResult) {
    if (triangleResult === undefined) {
      triangleResult = true;
    }

    var indices = delaunay.triangulate(vertices);

    if (triangleResult) {
      var triangles = [];

      for (var i = 0, cnt = indices.length; i < cnt; i += 3) {
        var p0 = vertices[indices[i + 0]];
        var p1 = vertices[indices[i + 1]];
        var p2 = vertices[indices[i + 2]];
        var triangle = new Triangle(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1]);
        triangles.push(triangle);
      }

      return triangles;
    } else {
      return {
        vertices: vertices,
        indices: indices
      };
    }
  };

  var GetValue$2 = Phaser.Utils.Objects.GetValue;
  var Clamp = Phaser.Math.Clamp;

  var ShatterRectangleToTriangles = function ShatterRectangleToTriangles(config) {
    var left, right, top, bottom, width, height;
    var rectangle = config.rectangle;

    if (rectangle) {
      left = rectangle.x;
      top = rectangle.y;
      width = rectangle.width;
      height = rectangle.height;
    } else {
      left = 0;
      top = 0;
      width = config.width;
      height = config.height;
    }

    right = left + width;
    bottom = top + height;
    var center = config.center;
    var centerX, centerY;

    if (center === undefined) {
      centerX = (left + right) / 2;
      centerY = (top + bottom) / 2;
    } else {
      centerX = Clamp(center.x, left, right);
      centerY = Clamp(center.y, top, bottom);
    }

    var vertices = [];
    vertices.push([centerX, centerY]);
    var ringSamples = GetValue$2(config, 'samplesPerRing', 12);
    var variation = GetValue$2(config, 'variation', 0.25);
    var radius = Math.min(width, height);
    var randMin = 1 - variation,
        randMax = 1 + variation;

    for (var i = 0; i < 3; i++) {
      // r = 1/27, 3/27, 9/27
      AddRingVertices(vertices, centerX, centerY, radius * Math.pow(3, i) / 27, ringSamples, randMin, randMax, left, right, top, bottom);
    } // r = 27/27


    var radius = Math.max(width, height) * 2;
    AddRingVertices(vertices, centerX, centerY, radius, ringSamples, randMin, randMax, left, right, top, bottom);
    var triangleOutput = GetValue$2(config, 'triangleOutput', true);
    return Triangulate(vertices, triangleOutput);
  };

  var TWO_PI = Math.PI * 2;

  var AddRingVertices = function AddRingVertices(vertices, centerX, centerY, radius, amount, randMin, randMax, leftBound, rightBound, topBound, bottomBound) {
    for (var i = 0; i < amount; i++) {
      var rad = i / amount * TWO_PI;
      var x = centerX + Math.cos(rad) * radius * RandomRange(randMin, randMax);
      var y = centerY + Math.sin(rad) * radius * RandomRange(randMin, randMax);
      x = Clamp(x, leftBound, rightBound);
      y = Clamp(y, topBound, bottomBound);
      vertices.push([x, y]);
    }

    return vertices;
  };

  var RandomRange = function RandomRange(min, max) {
    if (min === max) {
      return min;
    } else {
      return min + (max - min) * Math.random();
    }
  };

  var Base = Phaser.Geom.Mesh.Face;
  var DegToRad = Phaser.Math.DegToRad;
  var RadToDeg = Phaser.Math.RadToDeg;
  var RotateFace = Phaser.Geom.Mesh.RotateFace;

  var Face = /*#__PURE__*/function (_Base) {
    _inherits(Face, _Base);

    var _super = _createSuper(Face);

    function Face(vertex1, vertex2, vertex3) {
      var _this;

      _classCallCheck(this, Face);

      _this = _super.call(this, vertex1, vertex2, vertex3);
      _this._rotation = 0;
      return _this;
    }

    _createClass(Face, [{
      key: "rotation",
      get: function get() {
        return this._rotation;
      },
      set: function set(value) {
        RotateFace(this, value - this._rotation);
        this._rotation = value;
      }
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
      }
    }, {
      key: "setAlpha",
      value: function setAlpha(alpha) {
        this.alpha = alpha;
        return this;
      }
    }, {
      key: "tint",
      get: function get() {
        var tint1 = this.vertex1.color;
        var tint2 = this.vertex2.color;
        var tint3 = this.vertex3.color;
        return (((tint1 >> 0 & 0xff) + (tint2 >> 0 & 0xff) + (tint3 >> 0 & 0xff)) / 3 << 0) + (((tint1 >> 8 & 0xff) + (tint2 >> 8 & 0xff) + (tint3 >> 8 & 0xff)) / 3 << 8) + (((tint1 >> 16 & 0xff) + (tint2 >> 16 & 0xff) + (tint3 >> 16 & 0xff)) / 3 << 16);
      },
      set: function set(value) {
        this.vertex1.color = value;
        this.vertex2.color = value;
        this.vertex3.color = value;
      }
    }, {
      key: "setTint",
      value: function setTint(value) {
        this.tint = value;
        return this;
      }
    }]);

    return Face;
  }(Base);

  var RotateAround = Phaser.Math.RotateAround;

  var WorldXYToLocalXY = function WorldXYToLocalXY(gameObject, worldX, worldY) {
    var ox = gameObject.width / 2;
    var oy = gameObject.height / 2;
    out.x = worldX - gameObject.x;
    out.y = worldY - gameObject.y;
    out.x /= gameObject.scaleX;
    out.y /= gameObject.scaleY;
    RotateAround(out, ox, oy, -gameObject.rotation);
    out.x += ox;
    out.y += oy;
    return out;
  };

  var out = {
    x: 0,
    y: 0
  };

  var Mesh = Phaser.GameObjects.Mesh;
  var IsPlainObject$1 = Phaser.Utils.Objects.IsPlainObject;
  var GetValue$1 = Phaser.Utils.Objects.GetValue;
  var GenerateGridVerts = Phaser.Geom.Mesh.GenerateGridVerts;
  var Vertex = Phaser.Geom.Mesh.Vertex;
  var DistanceSquared = Phaser.Math.Distance.Squared;

  var ShatterImage = /*#__PURE__*/function (_Mesh) {
    _inherits(ShatterImage, _Mesh);

    var _super = _createSuper(ShatterImage);

    function ShatterImage(scene, x, y, key, frame, config) {
      var _this;

      _classCallCheck(this, ShatterImage);

      if (IsPlainObject$1(x)) {
        config = x;
        x = GetValue$1(config, 'x', 0);
        y = GetValue$1(config, 'y', 0);
        key = GetValue$1(config, 'key', null);
        frame = GetValue$1(config, 'frame', null);
      }

      _this = _super.call(this, scene, x, y, key, frame);
      _this.type = 'rexShatterImage';
      _this.hideCCW = false;

      _this.resetImage();

      _this.shatterCenter = {
        x: null,
        y: null
      };

      _this.setVariation(GetValue$1(config, 'variation', 0.25));

      _this.setSamplesPerRing(GetValue$1(config, 'samplesPerRing', 12));

      return _this;
    }

    _createClass(ShatterImage, [{
      key: "setVariation",
      value: function setVariation(variation) {
        this.variation = variation;
        return this;
      }
    }, {
      key: "setSamplesPerRing",
      value: function setSamplesPerRing(samples) {
        this.samplesPerRing = samples;
        return this;
      }
    }, {
      key: "resetImage",
      value: function resetImage() {
        this.setSizeToFrame();
        this.clear();
        this.dirtyCache[9] = -1;
        GenerateGridVerts({
          mesh: this,
          texture: this.texture.key,
          frame: this.frame.name,
          width: this.frame.cutWidth / this.height,
          height: this.frame.cutHeight / this.height,
          flipY: this.frame.source.isRenderTexture
        });
        this.setOrtho(this.width / this.height, 1);
        return this;
      }
    }, {
      key: "shatter",
      value: function shatter(centerX, centerY) {
        if (centerX === undefined) {
          centerX = this.width / 2;
          centerY = this.height / 2;
        } else {
          var worldXY = WorldXYToLocalXY(this, centerX, centerY);
          centerX = worldXY.x;
          centerY = worldXY.y;
        }

        this.shatterCenter.x = centerX;
        this.shatterCenter.y = centerY; // Clear faces and vertices

        this.clear();
        this.dirtyCache[9] = -1;

        if (this.width === 0 || this.height === 0) {
          return this;
        }

        var result = ShatterRectangleToTriangles({
          width: this.width,
          height: this.height,
          center: this.shatterCenter,
          triangleOutput: false,
          variation: this.variation,
          samplesPerRing: this.samplesPerRing
        });
        var vertices = result.vertices;
        var indices = result.indices; // Calculate vertex data

        var verticesData = [];
        var srcWidth = this.width;
        var srcHeight = this.height;
        var vHalfWidth = this.frame.cutWidth / srcHeight / 2;
        var vHalfHeight = this.frame.cutHeight / srcHeight / 2;
        var flipY = this.frame.source.isRenderTexture;
        var frameU0 = this.frame.u0;
        var frameU1 = this.frame.u1;
        var frameV0 = !flipY ? this.frame.v0 : this.frame.v1;
        var frameV1 = !flipY ? this.frame.v1 : this.frame.v0;
        var frameU = frameU1 - frameU0;
        var frameV = frameV1 - frameV0;

        for (var i = 0, cnt = vertices.length; i < cnt; i++) {
          var p = vertices[i];
          var px = p[0];
          var py = p[1];
          verticesData.push({
            g: DistanceSquared(centerX, centerY, px, py),
            x: px / srcHeight - vHalfWidth,
            y: py / srcHeight - vHalfHeight,
            u: frameU0 + frameU * (px / srcWidth),
            v: frameV0 + frameV * (py / srcHeight)
          });
        } // Build face


        for (var i = 0, cnt = indices.length; i < cnt; i += 3) {
          var v0 = verticesData[indices[i + 0]];
          var v1 = verticesData[indices[i + 1]];
          var v2 = verticesData[indices[i + 2]];
          var vert1 = new Vertex(v0.x, -v0.y, 0, v0.u, v0.v);
          var vert2 = new Vertex(v1.x, -v1.y, 0, v1.u, v1.v);
          var vert3 = new Vertex(v2.x, -v2.y, 0, v2.u, v2.v);
          var face = new Face(vert1, vert2, vert3);
          this.vertices.push(vert1, vert2, vert3);
          this.faces.push(face); // Sort faces from center

          face.g = Math.min(v0.g, v1.g, v2.g);
        } // Sort faces from center


        this.faces.sort(function (faceA, faceB) {
          return faceA.g - faceB.g;
        });
        return this;
      }
    }, {
      key: "startUpdate",
      value: function startUpdate() {
        this.ignoreDirtyCache = true;
        return this;
      }
    }, {
      key: "stopUpdate",
      value: function stopUpdate() {
        this.ignoreDirtyCache = false;
        return this;
      }
    }, {
      key: "tint",
      get: function get() {
        if (this.vertices.length === 0) {
          return 0xffffff;
        } else {
          return this.vertices[0].color;
        }
      },
      set: function set(value) {
        var vertices = this.vertices;

        for (var i = 0, cnt = vertices.length; i < cnt; i++) {
          vertices[i].color = value;
        }
      }
    }, {
      key: "setTint",
      value: function setTint(color) {
        this.tint = color;
        return this;
      }
    }]);

    return ShatterImage;
  }(Mesh);

  function ShatterImageFactory (x, y, texture, frame, config) {
    var gameObject = new ShatterImage(this.scene, x, y, texture, frame, config);
    this.scene.add.existing(gameObject);
    return gameObject;
  }

  var GetAdvancedValue$1 = Phaser.Utils.Objects.GetAdvancedValue;
  var BuildGameObject$1 = Phaser.GameObjects.BuildGameObject;
  function ShatterImageCreator (config, addToScene) {
    if (config === undefined) {
      config = {};
    }

    if (addToScene !== undefined) {
      config.add = addToScene;
    }

    var key = GetAdvancedValue$1(config, 'key', null);
    var frame = GetAdvancedValue$1(config, 'frame', null);
    var gameObject = new ShatterImage(this.scene, 0, 0, key, frame, config);
    BuildGameObject$1(this.scene, gameObject, config);
    return gameObject;
  }

  var RT = Phaser.GameObjects.RenderTexture;
  var IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
  var GetValue = Phaser.Utils.Objects.GetValue;

  var RenderTexture = /*#__PURE__*/function (_Image) {
    _inherits(RenderTexture, _Image);

    var _super = _createSuper(RenderTexture);

    function RenderTexture(scene, x, y, width, height, config) {
      var _this;

      _classCallCheck(this, RenderTexture);

      if (IsPlainObject(x)) {
        config = x;
        x = GetValue(config, 'x', 0);
        y = GetValue(config, 'y', 0);
        width = GetValue(config, 'width', 32);
        height = GetValue(config, 'height', 32);
      } // render-texture -> perspective-image


      var rt = new RT(scene, x, y, width, height).setOrigin(0.5);
      _this = _super.call(this, scene, x, y, rt.texture.key, null, config);
      _this.type = 'rexShatterRenderTexture';
      _this.rt = rt;
      return _this;
    }

    _createClass(RenderTexture, [{
      key: "destroy",
      value: function destroy(fromScene) {
        _get(_getPrototypeOf(RenderTexture.prototype), "destroy", this).call(this, fromScene);

        this.rt.destroy();
        this.rt = null;
      }
    }]);

    return RenderTexture;
  }(ShatterImage);

  function ShatterRenderTextureFactory (x, y, width, height, config) {
    var gameObject = new RenderTexture(this.scene, x, y, width, height, config);
    this.scene.add.existing(gameObject);
    return gameObject;
  }

  var GetAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;
  var BuildGameObject = Phaser.GameObjects.BuildGameObject;
  function ShatterRenderTextureCreator (config, addToScene) {
    if (config === undefined) {
      config = {};
    }

    if (addToScene !== undefined) {
      config.add = addToScene;
    }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 32);
    var height = GetAdvancedValue(config, 'height', 32);
    var gameObject = new RenderTexture(this.scene, x, y, width, height, config);
    BuildGameObject(this.scene, gameObject, config);
    return gameObject;
  }

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

  var ShatterImagePlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(ShatterImagePlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(ShatterImagePlugin);

    function ShatterImagePlugin(pluginManager) {
      var _this;

      _classCallCheck(this, ShatterImagePlugin);

      _this = _super.call(this, pluginManager); //  Register our new Game Object type

      pluginManager.registerGameObject('rexShatterImage', ShatterImageFactory, ShatterImageCreator);
      pluginManager.registerGameObject('rexShatterRenderTexture', ShatterRenderTextureFactory, ShatterRenderTextureCreator);
      return _this;
    }

    _createClass(ShatterImagePlugin, [{
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
      }
    }]);

    return ShatterImagePlugin;
  }(Phaser.Plugins.BasePlugin);

  SetValue(window, 'RexPlugins.GameObjects.ShatterImage', ShatterImage);
  SetValue(window, 'RexPlugins.GameObjects.ShatterRenderTexture', RenderTexture);

  return ShatterImagePlugin;

}));
