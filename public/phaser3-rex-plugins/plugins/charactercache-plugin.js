import CharacterCache from './charactercache.js';

class CharacterCachePlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
    }

    add(scene, config) {
        return new CharacterCache(scene, config);
    }
}

export default CharacterCachePlugin;