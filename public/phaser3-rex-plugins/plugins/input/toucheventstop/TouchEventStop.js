import ComponentBase from '../../utils/componentbase/ComponentBase.js';

const GetValue = Phaser.Utils.Objects.GetValue;

class TouchEventStop extends ComponentBase {
    constructor(gameObject, config) {
        super(gameObject, { eventEmitter: false });
        // No event emitter
        // this.parent = gameObject;

        this.resetFromJSON(config);
        this.boot();
    }

    resetFromJSON(o) {
        this.setHitAreaMode(GetValue(o, 'hitAreaMode', 0));
        this.setEnable(GetValue(o, "enable", true));
        return this;
    }

    boot() {
        this.parent
            .on('pointerdown', function (pointer, localX, localY, event) {
                event.stopPropagation();
            })
            .on('pointerup', function (pointer, localX, localY, event) {
                event.stopPropagation();
            })
            .on('pointermove', function (pointer, localX, localY, event) {
                event.stopPropagation();
            })
            .on('pointerover', function (pointer, localX, localY, event) {
                event.stopPropagation();
            })
            .on('pointerout', function (pointer, event) {
                event.stopPropagation();
            })
    }

    setHitAreaMode(mode) {
        if (typeof (mode) === 'string') {
            mode = HitAreaMode[mode];
        }

        var gameObject = this.parent;
        if (gameObject.input) {
            gameObject.removeInteractive();
        }

        if (mode === 0) {
            gameObject.setInteractive();
        } else {
            gameObject.setInteractive({
                hitArea: {},
                hitAreaCallback: function () { return true; }
            });
        }

        return this;
    }

    setEnable(e) {
        if (e === undefined) {
            e = true;
        }

        if (e) {
            this.parent.setInteractive();
        } else {
            this.parent.disableInteractive();
        }

        this.enable = e;
        return this;
    }

    toggleEnable() {
        this.setEnable(!this.enable);
        return this;
    }
}

var HitAreaMode = {
    default: 0,
    fullWindow: 1
}

export default TouchEventStop;