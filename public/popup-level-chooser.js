import { ToggleButton } from './toggle-button.js';

export class PopupLevelChooser extends Phaser.GameObjects.Container {

    popupX = 0;
    popupY = 0;
    buttonCount = 0;
    buttons = [];
    selectableButtons = [];
    optionSelectedCallback = null;
    buttonWidth = 0;
    buttonHeight = 0;
    thisScene = null;

    // selectableLevels starts at 0 and goes up. That is, bottom level is '0'
    constructor(scene, x, y, buttonWidth, buttonHeight, levelCount, selectableLevels, optionSelectedCallback)
    {
        super(scene, 0, 0);
        // Add this container to the scene
        scene.add.existing(this);
        this.thisScene = scene;

        this.popupX = x;
        this.popupY = y;
        this.buttonCount = levelCount;
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
        this.selectableButtons = selectableLevels;
        this.optionSelectedCallback = optionSelectedCallback;

        // Fill the scene with the container.
        this.setPosition(scene.cameras.main.centerX,scene.cameras.main.centerY);
        this.setSize(scene.cameras.main.width,scene.cameras.main.height);
        this.setInteractive();
        this.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));

        // Create the dark gray backdrop
        this.backdrop = scene.add.graphics();
        this.backdrop.fillStyle(0x000000, 0.2);
        this.backdrop.fillRect(-scene.cameras.main.centerX,-scene.cameras.main.centerY, scene.cameras.main.width, scene.cameras.main.height);
        this.add(this.backdrop);

        let textureNames = ['1', '2', '3', '4', '5'];

        // Create bitmaps for the buttons
        let graphics = scene.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
        graphics.generateTexture('level-button-default-background', buttonWidth, buttonHeight);
        graphics.destroy();

        graphics = scene.add.graphics();
        graphics.fillStyle(0xF1F2F2, 1);
        graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
        graphics.generateTexture('level-button-hover-background', buttonWidth, buttonHeight);
        graphics.destroy();

        graphics = scene.add.graphics();
        graphics.fillStyle(0xEEEEEE, 1);
        graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
        graphics.generateTexture('level-button-disabled-background', buttonWidth, buttonHeight);
        graphics.destroy();

        graphics = scene.add.graphics();
        graphics.fillStyle(0x0097B3, 1);
        graphics.lineStyle(2,0x111111, 0.8);
        graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
        graphics.strokeRoundedRect(1, 1, buttonWidth-2, buttonHeight-2, 5);
        graphics.generateTexture('level-button-selected-background', buttonWidth, buttonHeight);
        graphics.destroy();

        // Now create some buttons
        let buttonTop = 0;
        for (let i = 0; i < this.buttonCount; i++)
        {
            let desiredPos = {
                x: (this.popupX - this.thisScene.cameras.main.centerX)/* + (this.buttonWidth/2)*/,
                y: ((this.popupY + buttonTop) - this.thisScene.cameras.main.centerY) + (this.buttonHeight/2) + 3};
            this.buttons[i] = new ToggleButton(scene, (this.buttonCount - i).toString(), desiredPos.x, desiredPos.y, buttonWidth, buttonHeight, 'level-button-default-background', 'level-button-hover-background', 'level-button-selected-background', textureNames[this.buttonCount - i - 1], this.onButtonPressed, 'level-button-disabled-background');
            this.add(this.buttons[i]);

            buttonTop += this.buttonHeight + 5;

            let selectable = false;
            for (let j = 0; j < selectableLevels.length; j++)
            {
                if (this.buttonCount - i - 1 == selectableLevels[j])
                {
                    selectable = true;
                    break;
                }
            }

            if (!selectable)
                this.buttons[i].setDisabled(true);
        }
    }

    onPointerDown(pointer, localx, localy, event)
    {
        // Clicking anywhere outside the button will cause this popup to be canceled.
        this.cancelPopup();
        event.stopPropagation();
    }

    onPointerMove(pointer, localx, localy, event)
    {
        event.stopPropagation();
    }

    onButtonPressed(name, statePressed)
    {
        for (let i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].destroy();
        }
        this.optionSelectedCallback.bind(this.parentContainer)(parseInt(name) - 1);
        this.backdrop.destroy();
        this.destroy();
    }

    cancelPopup()
    {
        for (let i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].destroy();
        }
        this.optionSelectedCallback.bind(this.parentContainer)(-1);
        this.backdrop.destroy();
        this.destroy();
    }
}