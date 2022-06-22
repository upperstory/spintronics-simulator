import { TextEdit, Edit } from './textedit.js';

class TextEditPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
    }

    add(gameObject) {
        return new TextEdit(gameObject);
    }
}

var methods = {
    edit: Edit
};
Object.assign(
    TextEditPlugin.prototype,
    methods
);

export default TextEditPlugin;