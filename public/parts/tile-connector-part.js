import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

export class TileConnectorPart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'tile-connector';

        this.partImageOffset = {x: 0, y: 0};
        this.partImage = scene.add.image(this.x + this.partImageOffset.x, this.y + this.partImageOffset.y,'tile-connector');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(1);

        // this.partWidth = this.partImage.displayWidth;
        // this.partHeight = this.partImage.displayHeight;
    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            rotation: this.partImage.rotation
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

    // This is only called if we know the two tiles are adjacent.
    setJoiningTiles(tile1, tile2)
    {
        // Figure out where to put the connector and its rotation angle.
        this.setPosition((tile1.x + tile2.x) / 2, (tile1.y + tile2.y) / 2);
        let x = Math.atan((tile2.y - tile1.y)/(tile2.x - tile1.x));

        this.partImage.rotation = Math.atan((tile2.y - tile1.y)/(tile2.x - tile1.x)) + Math.PI/2;
    }

    getPartExtents()
    {
        return {left: this.x - 26.898, right: this.x + 26.898, top: this.y - 26.898, bottom: this.y + 26.898};
    }
}