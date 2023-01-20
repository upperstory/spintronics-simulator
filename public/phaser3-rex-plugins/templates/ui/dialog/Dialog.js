import Sizer from '../sizer/Sizer.js';
import Buttons from '../buttons/Buttons.js';
import FixWidthButtons from '../fixwidthbuttons/FixWidthButtons.js';
import GridButtons from '../gridbuttons/GridButtons.js';
import ButtonMethods from './ButtonMethods.js';

const GetValue = Phaser.Utils.Objects.GetValue;

class Dialog extends Sizer {
    constructor(scene, config) {
        if (config === undefined) {
            config = {};
        }
        // Create sizer        
        config.orientation = 1; // Top to bottom
        super(scene, config);
        this.type = 'rexDialog';
        this.eventEmitter = GetValue(config, 'eventEmitter', this);

        // Add elements
        var background = GetValue(config, 'background', undefined);
        var title = GetValue(config, 'title', undefined);
        var toolbar = GetValue(config, 'toolbar', undefined);
        var toolbarBackground = GetValue(config, 'toolbarBackground', undefined);
        var leftToolbar = GetValue(config, 'leftToolbar', undefined);
        var leftToolbarBackground = GetValue(config, 'leftToolbarBackground', undefined);
        var content = GetValue(config, 'content', undefined);
        var description = GetValue(config, 'description', undefined);
        var choicesSizer;
        var choices = GetValue(config, 'choices', undefined);
        var choicesBackground = GetValue(config, 'choicesBackground', undefined);
        var actionsSizer;
        var actions = GetValue(config, 'actions', undefined);
        var actionsBackground = GetValue(config, 'actionsBackground', undefined);
        var clickConfig = GetValue(config, 'click', undefined);

        if (background) {
            this.addBackground(background);
        }

        var toolbarSizer;
        if (toolbar) {
            toolbarSizer = new Buttons(scene, {
                groupName: 'toolbar',
                background: toolbarBackground,
                buttons: toolbar,
                orientation: 0, // Left-right
                space: { item: GetValue(config, 'space.toolbarItem', 0) },
                click: clickConfig,
                eventEmitter: this.eventEmitter,
            });
        }

        var leftToolbarSizer;
        if (leftToolbar) {
            leftToolbarSizer = new Buttons(scene, {
                groupName: 'leftToolbar',
                background: leftToolbarBackground,
                buttons: leftToolbar,
                orientation: 0, // Left-right
                space: { item: GetValue(config, 'space.leftToolbarItem', 0) },
                click: clickConfig,
                eventEmitter: this.eventEmitter,
            });
        }

        // title only
        if (title && !toolbar && !leftToolbar) {
            var align = GetValue(config, 'align.title', 'center');
            var titleSpace = GetValue(config, 'space.title', 0);
            var padding;
            if (content || description || choices || actions) {
                padding = { bottom: titleSpace };
            }
            var expand = GetValue(config, 'expand.title', true);
            this.add(
                title,
                { align: align, padding: padding, expand: expand }
            );
        }

        // toolbar only
        if (toolbar && !title && !leftToolbar) {
            var titleSpace = GetValue(config, 'space.title', 0);
            var padding;
            if (content || description || choices || actions) {
                padding = { bottom: titleSpace };
            }
            var expand = GetValue(config, 'expand.toolbar', true);
            this.add(
                toolbarSizer,
                { align: 'right', padding: padding, expand: expand }
            );
        }

        // leftToolbar only
        if (leftToolbar && !title && !toolbar) {
            var titleSpace = GetValue(config, 'space.title', 0);
            var padding;
            if (content || description || choices || actions) {
                padding = { bottom: titleSpace };
            }
            var expand = GetValue(config, 'expand.leftToolbar', true);
            this.add(
                leftToolbarSizer,
                { align: 'left', padding: padding, expand: expand }
            );
        }

        // tilte and (toolbar or leftToolbar)
        if (title && (toolbar || leftToolbar)) {
            var titleSizer = new Sizer(scene, {
                orientation: 0
            });
            // Add leftToolbar
            if (leftToolbarSizer) {
                titleSizer.add(
                    leftToolbarSizer,
                    { align: 'right', expand: false }
                );
            }
            // Add title
            var align = GetValue(config, 'align.title', 'left');
            var expand = GetValue(config, 'expand.title', true);
            // Add space if not expand
            if (
                !expand &&
                ((align === 'right') || (align === 'center'))
            ) {
                titleSizer.addSpace();
            }
            var padding = {
                left: GetValue(config, 'space.titleLeft', 0),
                right: GetValue(config, 'space.titleRight', 0)
            }
            var proportion = (expand) ? 1 : 0;
            titleSizer.add(
                title,
                { proportion: proportion, align: 'center', padding: padding, expand: expand }
            );
            // Add space if not expand
            if (
                !expand &&
                ((align === 'left') || (align === 'center'))
            ) {
                titleSizer.addSpace();
            }
            // Add toolbar
            if (toolbarSizer) {
                titleSizer.add(
                    toolbarSizer,
                    { align: 'right', expand: false }
                );
            }
            // Add sizer to dialog
            var titleSpace = GetValue(config, 'space.title', 0);
            var padding;
            if (content || description || choices || actions) {
                padding = { bottom: titleSpace };
            }
            this.add(
                titleSizer,
                { align: 'center', padding: padding, expand: true }
            );
        }

        if (content) {
            var align = GetValue(config, 'align.content', 'center');
            var contentSpace = GetValue(config, 'space.content', 0);
            var padding = {
                left: GetValue(config, 'space.contentLeft', 0),
                right: GetValue(config, 'space.contentRight', 0),
                bottom: ((description || choices || actions) ? contentSpace : 0)
            }
            var expand = GetValue(config, 'expand.content', true);
            this.add(
                content,
                { align: align, padding: padding, expand: expand }
            );
        }

        if (description) {
            var align = GetValue(config, 'align.description', 'center');
            var descriptionSpace = GetValue(config, 'space.description', 0);
            var padding = {
                left: GetValue(config, 'space.descriptionLeft', 0),
                right: GetValue(config, 'space.descriptionRight', 0),
                bottom: ((choices || actions) ? descriptionSpace : 0)
            }
            var expand = GetValue(config, 'expand.description', true);
            this.add(
                description,
                { align: align, padding: padding, expand: expand }
            );
        }

        if (choices) {
            var choicesType = GetValue(config, 'choicesType', '').split('-');
            var ButtonsClass = Contains(choicesType, 'wrap') ? FixWidthButtons :
                Contains(choicesType, 'grid') ? GridButtons :
                    Buttons;
            var buttonsType = Contains(choicesType, 'radio') ? 'radio' :
                Contains(choicesType, 'checkboxes') ? 'checkboxes' : undefined;

            var space = {
                left: GetValue(config, 'space.choicesBackgroundLeft', 0),
                right: GetValue(config, 'space.choicesBackgroundRight', 0),
                top: GetValue(config, 'space.choicesBackgroundTop', 0),
                bottom: GetValue(config, 'space.choicesBackgroundBottom', 0),
            };
            var itemSpace = GetValue(config, 'space.choice', 0);
            if (ButtonsClass === Buttons) {
                space.item = itemSpace;
            } else if (ButtonsClass === FixWidthButtons) {
                space.item = itemSpace;
                space.line = GetValue(config, 'space.choiceLine', itemSpace);
            } else {  // GridButtons
                space.column = GetValue(config, 'space.choiceColumn', itemSpace);
                space.row = GetValue(config, 'space.choiceRow', itemSpace);
            }

            var choicesConfig = {
                width: GetValue(config, 'choicesWidth', undefined),
                height: GetValue(config, 'choicesHeight', undefined),
                groupName: 'choices',
                buttonsType: buttonsType,
                background: choicesBackground,
                buttons: choices,
                space: space,
                click: clickConfig,
                eventEmitter: this.eventEmitter,
                setValueCallback: GetValue(config, 'choicesSetValueCallback', undefined),
                setValueCallbackScope: GetValue(config, 'choicesSetValueCallbackScope', undefined)
            };

            if (ButtonsClass === Buttons) {
                choicesConfig.orientation = Contains(choicesType, 'x') ? 0 : 1;
            }

            choicesSizer = new ButtonsClass(scene, choicesConfig);
            var choicesSpace = GetValue(config, 'space.choices', 0);
            var padding = {
                left: GetValue(config, 'space.choicesLeft', 0),
                right: GetValue(config, 'space.choicesRight', 0),
                bottom: ((actions) ? choicesSpace : 0)
            }
            var align = GetValue(config, 'align.choices', 'center');
            var expand = GetValue(config, 'expand.choices', true);
            this.add(
                choicesSizer,
                { align: align, padding: padding, expand: expand }
            );
        }

        if (actions) {
            actionsSizer = new Buttons(scene, {
                groupName: 'actions',
                background: actionsBackground,
                buttons: actions,
                orientation: 0, // Left-right
                space: { item: GetValue(config, 'space.action', 0) },
                expand: GetValue(config, 'expand.actions', false),
                align: GetValue(config, 'align.actions', 'center'),
                click: clickConfig,
                eventEmitter: this.eventEmitter,
            })
            var padding = {
                left: GetValue(config, 'space.actionsLeft', 0),
                right: GetValue(config, 'space.actionsRight', 0)
            }
            this.add(
                actionsSizer,
                { align: 'center', padding: padding, expand: true }
            );
        }

        this.addChildrenMap('background', background);
        this.addChildrenMap('title', title);
        this.addChildrenMap('toolbar', toolbar);
        this.addChildrenMap('leftToolbar', leftToolbar);
        this.addChildrenMap('content', content);
        this.addChildrenMap('description', description);
        this.addChildrenMap('choices', choices);
        this.addChildrenMap('actions', actions);
        this.addChildrenMap('choicesSizer', choicesSizer);
        this.addChildrenMap('actionsSizer', actionsSizer);
        this.addChildrenMap('toolbarSizer', toolbarSizer);
        this.addChildrenMap('leftToolbarSizer', leftToolbarSizer);
    }
}

var Contains = function (arr, item) {
    return arr.indexOf(item) !== -1;
}

Object.assign(
    Dialog.prototype,
    ButtonMethods
);

export default Dialog;