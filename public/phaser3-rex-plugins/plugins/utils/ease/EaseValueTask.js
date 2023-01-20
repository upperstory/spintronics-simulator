import EaseValueTaskBase from '../componentbase/tweentask/EaseValueTaskBase.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const Linear = Phaser.Math.Linear;

class EaseValueTask extends EaseValueTaskBase {
    constructor(gameObject, config) {
        super(gameObject, config);
        // this.parent = gameObject;
        // this.timer

        this.resetFromJSON();
        this.boot();
    }

    start(config) {
        if (this.timer.isRunning) {
            return this;
        }

        var target = this.target;
        this.propertyKey = GetValue(config, 'key', 'value');
        var currentValue = target[this.propertyKey];
        this.fromValue = GetValue(config, 'from', currentValue);
        this.toValue = GetValue(config, 'to', currentValue);

        this.setEase(GetValue(config, 'ease', this.ease));
        this.setDuration(GetValue(config, 'duration', this.duration));

        this.timer.setDuration(this.duration);

        target[this.propertyKey] = this.fromValue;

        super.start();
        return this;
    }

    updateGameObject(target, timer) {
        var t = timer.t;
        t = this.easeFn(t);

        target[this.propertyKey] = Linear(this.fromValue, this.toValue, t);
    }
}

export default EaseValueTask;