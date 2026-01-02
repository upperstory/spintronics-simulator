import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

export class TilePart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'tile';

        // Create the resistor image
        this.partImageOffset = {x: 0, y: 0};
        this.partImage = scene.add.image(this.x + this.partImageOffset.x, this.y + this.partImageOffset.y,'tile');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(0);

        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;

        // Set the listeners
        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            value: 0
        }
        return partObject;
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x + this.partImageOffset.x, y + this.partImageOffset.y);
    }

    destroy()
    {
        this.partImage.destroy();
    }

    getPartExtents()
    {
        return {left: this.x - 184.352, right: this.x + 184.352, top: this.y - 164.444, bottom: this.y + 164.444};
    }
}
