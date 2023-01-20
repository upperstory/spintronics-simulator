import BaseShapes from '../shapes/BaseShapes.js';
import { Arc, Circle } from '../shapes/geoms';
import EaseValueMethods from '../../../utils/ease/EaseValueMethods.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const Clamp = Phaser.Math.Clamp;
const Linear = Phaser.Math.Linear;
const Percent = Phaser.Math.Percent;

const DefaultStartAngle = Phaser.Math.DegToRad(270);
const RadToDeg = Phaser.Math.RadToDeg;

class CircularProgress extends BaseShapes {
    constructor(scene, x, y, radius, barColor, value, config) {
        if (IsPlainObject(x)) {
            config = x;
            x = GetValue(config, 'x', 0);
            y = GetValue(config, 'y', 0);
            radius = GetValue(config, 'radius', 1);
            barColor = GetValue(config, 'barColor', undefined);
            value = GetValue(config, 'value', 0);
        }
        var width = radius * 2;
        super(scene, x, y, width, width);
        this.type = 'rexCircularProgress';
        this.eventEmitter = GetValue(config, 'eventEmitter', this);

        this
            .addShape((new Circle()).setName('track'))
            .addShape((new Arc()).setName('bar'))
            .addShape((new Circle()).setName('center'))

        this.setRadius(radius);
        this.setTrackColor(GetValue(config, 'trackColor', undefined));
        this.setBarColor(barColor);
        this.setCenterColor(GetValue(config, 'centerColor', undefined));

        this.setThickness(GetValue(config, 'thickness', 0.2));
        this.setStartAngle(GetValue(config, 'startAngle', DefaultStartAngle));
        this.setAnticlockwise(GetValue(config, 'anticlockwise', false));

        var callback = GetValue(config, 'valuechangeCallback', null);
        if (callback !== null) {
            var scope = GetValue(config, 'valuechangeCallbackScope', undefined);
            this.eventEmitter.on('valuechange', callback, scope);
        }

        this
            .setEaseValuePropName('value')
            .setEaseValueDuration(GetValue(config, 'easeValue.duration', 0))
            .setEaseValueFunction(GetValue(config, 'easeValue.ease', 'Linear'))

        this.setValue(value);
    }

    resize(width, height) {
        width = Math.floor(Math.min(width, height));
        if (width === this.width) {
            return this;
        }

        super.resize(width, width);
        this.setRadius(width / 2);
        return this;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        value = Clamp(value, 0, 1);

        var oldValue = this._value;
        var valueChanged = (oldValue != value);
        this.dirty = this.dirty || valueChanged;
        this._value = value;

        if (valueChanged) {
            this.eventEmitter.emit('valuechange', this._value, oldValue, this.eventEmitter);
        }
    }

    setValue(value, min, max) {
        if ((value === undefined) || (value === null)) {
            return this;
        }

        if (min !== undefined) {
            value = Percent(value, min, max);
        }
        this.value = value;
        return this;
    }

    addValue(inc, min, max) {
        if (min !== undefined) {
            inc = Percent(inc, min, max);
        }
        this.value += inc;
        return this;
    }

    getValue(min, max) {
        var value = this.value;
        if (min !== undefined) {
            value = Linear(min, max, value);
        }
        return value;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this.dirty = this.dirty || (this._radius != value);
        this._radius = value;
        var width = value * 2;
        this.resize(width, width);
    }

    setRadius(radius) {
        this.radius = radius;
        return this;
    }

    get trackColor() {
        return this._trackColor;
    }

    set trackColor(value) {
        this.dirty = this.dirty || (this._trackColor != value);
        this._trackColor = value;
    }

    setTrackColor(color) {
        this.trackColor = color;
        return this;
    }

    get barColor() {
        return this._barColor;
    }

    set barColor(value) {
        this.dirty = this.dirty || (this._barColor != value);
        this._barColor = value;
    }

    setBarColor(color) {
        this.barColor = color;
        return this;
    }

    get startAngle() {
        return this._startAngle;
    }

    set startAngle(value) {
        this.dirty = this.dirty || (this._startAngle != value);
        this._startAngle = value;
    }

    setStartAngle(angle) {
        this.startAngle = angle;
        return this;
    }

    get anticlockwise() {
        return this._anticlockwise;
    }

    set anticlockwise(value) {
        this.dirty = this.dirty || (this._anticlockwise != value);
        this._anticlockwise = value;
    }

    setAnticlockwise(anticlockwise) {
        if (anticlockwise === undefined) {
            anticlockwise = true;
        }
        this.anticlockwise = anticlockwise;
        return this;
    }

    get thickness() {
        return this._thickness;
    }

    set thickness(value) {
        value = Clamp(value, 0, 1);
        this.dirty = this.dirty || (this._thickness != value);
        this._thickness = value;
    }

    setThickness(thickness) {
        this.thickness = thickness;
        return this;
    }

    get centerColor() {
        return this._centerColor;
    }

    set centerColor(value) {
        this.dirty = this.dirty || (this._centerColor != value);
        this._centerColor = value;
    }

    setCenterColor(color) {
        this.centerColor = color;
        return this;
    }

    updateShapes() {
        var x = this.radius;
        var lineWidth = this.thickness * this.radius;
        var barRadius = this.radius - (lineWidth / 2);
        var centerRadius = this.radius - lineWidth;

        // Track shape
        var trackShape = this.getShape('track');
        if ((this.trackColor != null) && (lineWidth > 0)) {
            trackShape
                .setCenterPosition(x, x)
                .setRadius(barRadius)
                .lineStyle(lineWidth, this.trackColor);
        } else {
            trackShape.reset();
        }

        // Bar shape
        var barShape = this.getShape('bar');
        if ((this.barColor != null) && (barRadius > 0)) {
            var anticlockwise, startAngle, endAngle;
            if (this.value === 1) {
                anticlockwise = false;
                startAngle = 0;
                endAngle = 361;  // overshoot 1
            } else {
                anticlockwise = this.anticlockwise;
                startAngle = RadToDeg(this.startAngle);
                var deltaAngle = 360 * ((anticlockwise) ? (1 - this.value) : this.value);
                endAngle = deltaAngle + startAngle;
            }
            barShape
                .setCenterPosition(x, x)
                .setRadius(barRadius)
                .setAngle(startAngle, endAngle, anticlockwise)
                .lineStyle(lineWidth, this.barColor);
        } else {
            barShape.reset();
        }

        // Center shape
        var centerShape = this.getShape('center');
        if (this.centerColor && (centerRadius > 0)) {
            centerShape
                .setCenterPosition(x, x)
                .setRadius(centerRadius)
                .fillStyle(this.centerColor);
        } else {
            centerShape.reset();
        }
    }
}

Object.assign(
    CircularProgress.prototype,
    EaseValueMethods
);

export default CircularProgress;