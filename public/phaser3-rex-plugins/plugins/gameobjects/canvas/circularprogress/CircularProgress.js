import Canvas from '../canvas/Canvas.js';
import GetStyle from '../../../utils/canvas/GetStyle.js';
import DrawContent from './DrawContent.js';
import EaseValueMethods from '../../../utils/ease/EaseValueMethods.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const Clamp = Phaser.Math.Clamp;
const Linear = Phaser.Math.Linear;
const Percent = Phaser.Math.Percent;

const DefaultStartAngle = Phaser.Math.DegToRad(270);

class CircularProgress extends Canvas {
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
        this.type = 'rexCircularProgressCanvas';
        this.eventEmitter = GetValue(config, 'eventEmitter', this);

        this.setRadius(radius);
        this.setTrackColor(GetValue(config, 'trackColor', undefined));
        this.setBarColor(barColor);
        this.setCenterColor(GetValue(config, 'centerColor', undefined));

        this.setThickness(GetValue(config, 'thickness', 0.2));
        this.setStartAngle(GetValue(config, 'startAngle', DefaultStartAngle));
        this.setAnticlockwise(GetValue(config, 'anticlockwise', false));

        this.setTextColor(GetValue(config, 'textColor', undefined));
        this.setTextStrokeColor(
            GetValue(config, 'textStrokeColor', undefined),
            GetValue(config, 'textStrokeThickness', undefined)
        );

        var textFont = GetValue(config, 'textFont', undefined);
        if (textFont) {
            this.setTextFont(textFont);
        } else {
            this.setTextFont(
                GetValue(config, 'textSize', '16px'),
                GetValue(config, 'textFamily', 'Courier'),
                GetValue(config, 'textStyle', '')
            );
        }
        this.setTextFormatCallback(
            GetValue(config, 'textFormatCallback', undefined),
            GetValue(config, 'textFormatCallbackScope', undefined)
        );

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
        value = GetStyle(value, this.canvas, this.context);
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
        value = GetStyle(value, this.canvas, this.context);
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
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || (this._centerColor != value);
        this._centerColor = value;
    }

    get centerColor2() {
        return this._centerColor2;
    }

    set centerColor2(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || (this._centerColor2 != value);
        this._centerColor2 = value;
    }

    setCenterColor(color, color2) {
        this.centerColor = color;
        this.centerColor2 = color2;
        return this;
    }

    get textColor() {
        return this._textColor;
    }

    set textColor(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || (this._textColor != value);
        this._textColor = value;
    }

    setTextColor(color) {
        this.textColor = color;
        return this;
    }

    get textStrokeColor() {
        return this._textStrokeColor;
    }

    set textStrokeColor(value) {
        value = GetStyle(value, this.canvas, this.context);
        this.dirty = this.dirty || (this._textStrokeColor != value);
        this._textStrokeColor = value;
    }

    get textStrokeThickness() {
        return this._textStrokeThickness;
    }

    set textStrokeThickness(value) {
        this.dirty = this.dirty || (this._textStrokeThickness != value);
        this._textStrokeThickness = value;
    }

    setTextStrokeColor(color, thickness) {
        if (thickness === undefined) {
            thickness = 2;
        }
        this.textStrokeColor = color;
        this.textStrokeThickness = thickness;
        return this;
    }

    get textFont() {
        return this._textFont;
    }

    set textFont(value) {
        this.dirty = this.dirty || (this._textFont != value);
        this._textFont = value;
    }

    setTextFont(fontSize, fontFamily, fontStyle) {
        var font;
        if (fontFamily === undefined) {
            font = fontSize;
        } else {
            font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
        }
        this.textFont = font;
        return this;
    }

    setTextFormatCallback(callback, scope) {
        this.textFormatCallback = callback;
        this.textFormatCallbackScope = scope;
        return this;
    }

    updateTexture() {
        this.clear();
        DrawContent.call(this);
        super.updateTexture();
        return this;
    }

    getFormatText(value) {
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
}

Object.assign(
    CircularProgress.prototype,
    EaseValueMethods
);

export default CircularProgress;