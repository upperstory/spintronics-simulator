import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const buttonRadius =  0.041168 / 2;

export class ButtonPart extends PartBase
{
    partType = 'button';
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partImage = PartBase.makeImage(scene, this.x, this.y, 'button-sprocket', 0.5, 8)

        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        
        this.buttonBaseImage = PartBase.makeImage(scene, this.x, this.y, 'button-base', 0.5, 16);
        
        PartBase.setAllInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        },
            this.partImage,
            this.buttonBaseImage
        )

        this.setupSprocket(0, {x: 0, y: 0}, 117/2, true, buttonRadius);
        this.setupSprocket(1, {x: 0, y: 0}, 117/2, true, buttonRadius);
        this.setupSprocket(2, {x: 0, y: 0}, 117/2, true, buttonRadius);

        // Create bodies and fixtures for Planck world
        this.buttonBody = this.standardBody(0.02);
        this.buttonFixture = PartBase.createFixture(this.buttonBody, buttonRadius);
        this.sprocketBodies[0] = this.buttonBody;
        this.sprocketBodies[1] = this.buttonBody;
        this.sprocketBodies[2] = this.buttonBody;
        
        this.buttonJoint = this.standardRevolute(this.ground, this.buttonBody);
        this.sprocketJoints[0] = this.buttonJoint;
        this.sprocketJoints[1] = this.buttonJoint;
        this.sprocketJoints[2] = this.buttonJoint;
        
        this.setupInteractions(
            this.partImage,
            this.buttonBody
        );
        
        this.setupInteractions(
            this.buttonBaseImage
        );

        this.setButtonState(false);
    }

    buttonState = true;

    setButtonState(state)
    {
        if (state) {
            this.buttonBody.setType(planck.Body.DYNAMIC);
            this.buttonBaseImage.setTexture('button-base-pushed');
        }
        else
        {
            this.buttonBody.setType(planck.Body.STATIC);
            this.buttonBaseImage.setTexture('button-base');
        }
        this.buttonState = state;
    }

    toggleState()
    {
        this.setButtonState(!this.buttonState);
    }

    // Override with new behavior
    changePartProperty()
    {
        this.toggleState();
    }

    updatePhysics()
    {
        //this.partImage.x = this.buttonBody.getPosition().x * worldScale;
        //this.partImage.y = this.buttonBody.getPosition().y * worldScale;
        this.syncRotation(this.partImage, this.buttonBody);
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.buttonBaseImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.buttonBaseImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.buttonBaseImage != undefined)
            this.buttonBaseImage.setPosition(x, y);
    }

    clickedInInteractMode(pointer)
    {
        // The button was clicked in Interact mode. If it's over the center, change the button's state.
        // Part's midpoint:
        if (Math.sqrt(Math.pow(Math.abs(this.x - pointer.worldX),2) + Math.pow(Math.abs(this.y - pointer.worldY), 2)) < 22)
        {
            this.toggleState();
        }
    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            value: this.buttonState
        }
        return partObject;
    }

    destroy()
    {
        this.partImage.destroy();
        this.buttonBaseImage.destroy();
        this.world.destroyBody(this.buttonBody);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 117/2, right: this.x + 117/2, top: this.y - 117/2, bottom: this.y + 117/2};
    }
}
