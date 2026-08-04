import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const diodeRadius = 0.033979 / 2;

export class DiodePart extends PartBase
{
    partType = 'diode';
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partImage = PartBase.makeImage(scene, this.x, this.y, 'diode-sprocket', 0.5, 10);

        //this.add(this.partImage);
        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);
        //this.partImage.setDisplaySize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        this.diodeBaseImage = PartBase.makeImage(scene, this.x, this.y, 'diode-base', 0.5, 10);
        
        PartBase.setAllInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        },
            this.partImage,
            this.diodeBaseImage
        )

        this.setupSprocket(0, {x: 0, y: 0}, 99/2, true, diodeRadius);
        this.setupSprocket(1, {x: 0, y: 0}, 99/2, true, diodeRadius);
        this.setupSprocket(2, {x: 0, y: 0}, 99/2, true, diodeRadius);

        // Create bodies and fixtures for Planck world
        this.diodeSprocket = this.standardBody(0.05);
        this.diodeFixture = PartBase.createFixture(this.diodeSprocket, diodeRadius);
        this.sprocketBodies[0] = this.diodeSprocket;
        this.sprocketBodies[1] = this.diodeSprocket;
        this.sprocketBodies[2] = this.diodeSprocket;

        this.diodeJoint = this.world.createJoint(planck.RevoluteJoint({enableLimit: true}, this.ground, this.diodeSprocket, this.diodeSprocket.getPosition())); // non standard
        this.sprocketJoints[0] = this.diodeJoint;
        this.sprocketJoints[1] = this.diodeJoint;
        this.sprocketJoints[2] = this.diodeJoint;

        this.setupInteractions(
            this.partImage,
            this.diodeSprocket
        );
        
        this.setupInteractions(
            this.diodeBaseImage
        );

        this.diodeSprocket.applyAngularImpulse(0.0000002);
    }

    lowerLimit = null;

    updatePhysics()
    {
        //this.partImage.x = this.diodeSprocket.getPosition().x * worldScale;
        //this.partImage.y = this.diodeSprocket.getPosition().y * worldScale;
        this.partImage.rotation = this.diodeSprocket.getAngle();

        if (this.lowerLimit == null || this.diodeSprocket.getAngle() > this.lowerLimit) {
            this.lowerLimit = this.diodeSprocket.getAngle();
            this.diodeJoint.setLimits(this.lowerLimit, this.diodeSprocket.getAngle() + Math.PI * 2);
        }

        //this.buttonBody.setType(planck.Body.DYNAMIC);
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.diodeBaseImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.diodeBaseImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.diodeBaseImage != undefined)
            this.diodeBaseImage.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.diodeBaseImage.destroy();
        this.world.destroyBody(this.diodeSprocket);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 99/2, right: this.x + 99/2, top: this.y - 99/2, bottom: this.y + 99/2};
    }

}
