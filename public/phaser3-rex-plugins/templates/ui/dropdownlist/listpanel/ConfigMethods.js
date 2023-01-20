var methods = {
    setWrapEnable(enable) {
        if (enable === undefined) {
            enable = true;
        }

        this.listWrapEnable = enable;
        return this;
    },

    setCreateButtonCallback(callback) {
        this.listCreateButtonCallback = callback;
        return this;
    },

    setCreateBackgroundCallback(callback) {
        this.listCreateBackgroundCallback = callback;
        return this;
    },

    setButtonClickCallback(callback) {
        this.listOnButtonClick = callback;
        return this;
    },

    setButtonOverCallback(callback) {
        this.listOnButtonOver = callback;
        return this;
    },

    setButtonOutCallback(callback) {
        this.listOnButtonOut = callback;
        return this;
    },

    setListEaseOutDuration(duration) {
        if (duration === undefined) {
            duration = 0;
        }
        this.listEaseOutDuration = duration;
        return this;
    },

    setListBounds(bounds) {
        this.listBounds = bounds;
        return this;
    },

    setListWidth(width) {
        this.listWidth = width;
        return this;
    },

    setListHeight(height) {
        this.listHeight = height;
        return this;
    },

    setListSize(width, height) {
        this.setListWidth(width).setListHeight(height);
        return this;
    },

    setListAlignmentMode(mode) {
        this.listAlignMode = mode;
        return this;
    },

    setListEaseInDuration(duration) {
        if (duration === undefined) {
            duration = 0;
        }
        this.listEaseInDuration = duration;
        return this;
    },

    setListSpace(space) {
        if (space === undefined) {
            space = {};
        }
        this.listSpace = space;
        return this;
    },

    setListDraggable(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.listDraggable = enable;
        return this;
    },

}

export default methods;