import TickTask from './TickTask.js';

class SceneUpdateTickTask extends TickTask {
    startTicking() {
        super.startTicking();
        this.scene.sys.events.on('update', this.update, this);
    }

    stopTicking() {
        super.stopTicking();
        if (this.scene) { // Scene might be destoryed
            this.scene.sys.events.off('update', this.update, this);
        }
    }

    // update(time, delta) {
    //     
    // }

}

export default SceneUpdateTickTask;