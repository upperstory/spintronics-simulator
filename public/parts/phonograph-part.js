import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const phonographRadius = 0.041168 / 2;

export class PhonographPart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'phonograph';

        this.partImage = PartBase.makeImage(scene, this.x, this.y,'phonograph-sprocket', 0.5, 10);

        //this.add(this.partImage);
        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);
        //this.partImage.setDisplaySize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        this.phonographBaseImageOffset = {x: -3, y: 18};
        this.phonographBaseImage = PartBase.makeImage(scene, this.x + this.phonographBaseImageOffset.x, this.y + this.phonographBaseImageOffset.y, 'phonograph-base', 0.5, 16);
        
        PartBase.setAllInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        },
            this.partImage,
            this.phonographBaseImage
        );

        this.setupSprocket(0, {x: 0, y: 0}, 117/2, true, phonographRadius);
        this.setupSprocket(1, {x: 0, y: 0}, 117/2, true, phonographRadius);
        this.setupSprocket(2, {x: 0, y: 0}, 117/2, true, phonographRadius);

        // Create bodies and fixtures for Planck world
        this.phonographSprocket = this.standardBody(1);
        this.phonographFixture = PartBase.createFixture(this.phonographSprocket, phonographRadius);
        this.sprocketBodies[0] = this.phonographSprocket;
        this.sprocketBodies[1] = this.phonographSprocket;
        this.sprocketBodies[2] = this.phonographSprocket;

        //this.frictionBody = this.world.createBody({position: planck.Vec2(this.x / worldScale, this.y / worldScale)});
        //this.frictionBody.createFixture(planck.Circle(resistorRadius), {density: 1, filterGroupIndex: -1, friction: 0.3});
        this.phonographJoint = this.standardRevolute(this.ground, this.phonographSprocket);
        this.sprocketJoints[0] = this.phonographJoint;
        this.sprocketJoints[1] = this.phonographJoint;
        this.sprocketJoints[2] = this.phonographJoint;
        
        this.setupInteractions(
            this.partImage,
            this.phonographSprocket
        );

        this.setupInteractions(
            this.phonographBaseImage
        );

        this.phonographSprocket.applyAngularImpulse(0.00000005);

        // Create the tone
        this.osc = new Tone.Oscillator(440, "sawtooth").toMaster();
        this.osc.volume.value = -20;
        this.osc.frequency.value = 400;
        this.osc.start();
    }

    updatePhysics()
    {
        //this.partImage.x = this.phonographSprocket.getPosition().x * worldScale;
        //this.partImage.y = this.phonographSprocket.getPosition().y * worldScale;
        this.partImage.rotation = this.phonographSprocket.getAngle();
        let angVel = Math.abs(this.phonographSprocket.getAngularVelocity());
        //if (angVel == 0)
        //    this.osc.stop();
        //else
        {

            if (this.osc.state == "stopped")
                this.osc.restart();
            let newVol = Math.log(angVel)*10 - 30;
            if (newVol > -5)
                newVol = -5;
            //console.log(newVol);
            this.osc.volume.value = newVol;

            this.osc.frequency.value = angVel * 100;
        }



        //this.osc.frequency.value = 100;
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.phonographBaseImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.phonographBaseImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.phonographBaseImage != undefined)
            this.phonographBaseImage.setPosition(x + this.phonographBaseImageOffset.x, y + this.phonographBaseImageOffset.y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.phonographBaseImage.destroy();
        this.world.destroyBody(this.phonographSprocket);
        this.world.destroyBody(this.ground);
        this.osc.stop();
        this.osc.disconnect();
        this.osc.dispose();
    }

    getPartExtents()
    {
        return {left: this.x - 74.444, right: this.x + 117/2, top: this.y - 117/2, bottom: this.y + 95};
    }

}
