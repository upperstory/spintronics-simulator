import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

export class TilePart extends PartBase
{
    partType = 'tile';
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        // Create the resistor image
        this.partImageOffset = {x: 0, y: 0};
        this.partImage = PartBase.makeImage(scene, this.x + this.partImageOffset.x, this.y + this.partImageOffset.y,'tile', 0.5, 0);

        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;

        // Set the listeners
        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        
        this.setupInteractions(
            this.partImage
        );
        
        delete this.ground; // delete automatic ground body
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
