export class PopupConfirmButton extends Phaser.GameObjects.Container {
    thisScene = null;

    constructor(scene, name, x, y, width, height, textureDefault, textureHover, texturePressed, textureIcon, pressedCallback, textureDisabled = null) {

        super(scene, x, y);
        this.thisScene = scene;
        this.name = name;
        this.textureDefault = textureDefault;
        this.textureHover = textureHover;
        this.texturePressed = texturePressed;
        // this.textureIcon = textureIcon;
        this.confirmCallback = pressedCallback;
        // this.textureDisabled = textureDisabled;
        this.buttonType = 'default';

        // Add this container to the scene
        scene.add.existing(this);
        this.setSize(width, height);

        // Add event handlers
        this.setInteractive();
        this.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.on('pointerup', (pointer, localx, localy, event) => this.onPointerUp(pointer, localx, localy, event));
        this.on('pointerover', (pointer, localx, localy, event) => this.onPointerOver(pointer, localx, localy, event));
        this.on('pointerout', (pointer, localx, localy, event) => this.onPointerOut(pointer, localx, localy, event));
       // Add button background
        this.buttonBackground = scene.add.image(0, 0, textureDefault);
        this.buttonBackground.alpha = 1;
        this.buttonBackground.setDisplaySize(width, height);
        this.add(this.buttonBackground);

        // Add icon
        this.buttonIcon = scene.add.image(0, 0, textureIcon);
        this.buttonIcon.alpha = 0.5;
        this.add(this.buttonIcon);
    }

    onPointerDown(pointer, localx, localy, event) {
        if (this.disabled) {
            return;
        }

            this.buttonBackground.setTexture(this.texturePressed);
            this.confirmCallback.bind(this.parentContainer)(true);

        event.stopPropagation();
    }

    onPointerUp(pointer, localx, localy, event) {
        if (this.disabled)
            return;

        if (this.buttonType === 'default') {
            this.buttonBackground.setTexture(this.textureHover);
            this.confirmCallback.bind(this.parentContainer)(true);
        }
        event.stopPropagation();
    }

    onPointerOver(pointer, localx, localy, event) {
        // if (this.disabled)
        //     return;
        //
        // if (this.toggleState === false)
        // {
        //     this.buttonBackground.setTexture(this.textureHover);
        // }
        // else
        // {
        this.buttonBackground.setTexture(this.texturePressed);
        // }

        this.buttonBackground.alpha = 1;
        this.buttonIcon.alpha = 1;
    }

        onPointerOut(pointer, event)
        {
            // if (this.disabled)
            //     return;

            // console.log('pointer out');
            // if (this.toggleState === false)
            // {
            this.buttonBackground.setTexture(this.textureDefault);
            // }
            // else
            // {
            //     this.buttonBackground.setTexture(this.texturePressed);
            // }

            this.buttonBackground.alpha = 0.5;
            this.buttonIcon.alpha = 0.5;


            event.stopPropagation();
        }
    }