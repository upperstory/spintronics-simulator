import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const levelChangerRadius = 0.033979 / 2;

export class LevelChangerPart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'level-changer';
        
        this.partImage = PartBase.makeImage(scene, this.x, this.y,'level-changer', 0.5, 16);

        //this.add(this.partImage);
        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);
        //this.partImage.setDisplaySize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.setupSprocket(0, {x: 0, y: 0}, 98/2, true, levelChangerRadius);
        this.setupSprocket(1, {x: 0, y: 0}, 98/2, true, levelChangerRadius);
        this.setupSprocket(2, {x: 0, y: 0}, 98/2, true, levelChangerRadius);
        this.setupSprocket(3, {x: 0, y: 0}, 98/2, true, levelChangerRadius);
        this.setupSprocket(4, {x: 0, y: 0}, 98/2, true, levelChangerRadius);

        // Create bodies and fixtures for Planck world
        this.levelChangerBody = this.standardBody(0.02);
        this.levelChangerFixture = this.levelChangerBody.createFixture(planck.Circle(levelChangerRadius), {density: 0.1, filterGroupIndex: -1, friction: 0});
        this.sprocketBodies[0] = this.levelChangerBody;
        this.sprocketBodies[1] = this.levelChangerBody;
        this.sprocketBodies[2] = this.levelChangerBody;
        
        this.levelChangerJoint = this.standardRevolute(this.ground, this.levelChangerBody);
        this.sprocketJoints[0] = this.levelChangerJoint;
        this.sprocketJoints[1] = this.levelChangerJoint;
        this.sprocketJoints[2] = this.levelChangerJoint;
        
        this.setupInteractions(
            this.partImage,
            this.levelChangerBody
        );

        this.levelChangerBody.applyAngularImpulse(0.00000005);
    }

    updatePhysics()
    {
        //this.partImage.x = this.levelChangerBody.getPosition().x * worldScale;
        //this.partImage.y = this.levelChangerBody.getPosition().y * worldScale;
        this.partImage.rotation = this.levelChangerBody.getAngle();
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
            this.partImage.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.world.destroyBody(this.levelChangerBody);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 98/2, right: this.x + 98/2, top: this.y - 98/2, bottom: this.y + 98/2};
    }

}
