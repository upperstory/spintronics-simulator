import EaseValueTask from './EaseValueTask.js';

const Percent = Phaser.Math.Percent;

var SetEaseValuePropName = function (name) {
    this.easeValuePropName = name;
    return this;
}

var SetEaseValueDuration = function (duration) {
    this.easeValueDuration = duration;
    return this;
}

var SetEaseValueFunction = function (ease) {
    this.easeFunction = ease;
    return this;
}

var StopEaseValue = function () {
    if (this.easeValueTask) {
        this.easeValueTask.stop();
    }
    return this;
}

var EaseValueTo = function (value, min, max) {
    if ((value === undefined) || (value === null)) {
        return this;
    }

    if (min !== undefined) {
        value = Percent(value, min, max);
    }

    if (this.easeValueTask === undefined) {
        this.easeValueTask = new EaseValueTask(this, { eventEmitter: null })
    }

    this.easeValueTask.restart({
        key: this.easeValuePropName,
        to: value,
        duration: this.easeValueDuration,
        ease: this.easeFunction
    });

    return this;
}

export default {
    setEaseValuePropName: SetEaseValuePropName,
    setEaseValueDuration: SetEaseValueDuration,
    setEaseValueFunction: SetEaseValueFunction,
    stopEaseValue: StopEaseValue,
    easeValueTo: EaseValueTo
}