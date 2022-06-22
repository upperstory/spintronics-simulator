import GetLocalState from './utils/GetLocalState.js';

export default {
    updateChildScrollFactor(child) {
        var localState = GetLocalState(child);
        var parent = localState.parent;
        child.setScrollFactor(parent.scrollFactorX, parent.scrollFactorY);
        return this;
    },

    syncScrollFactor() {
        if (this.syncChildrenEnable) {
            this.children.forEach(this.updateChildScrollFactor, this);
        }
        return this;
    },

};