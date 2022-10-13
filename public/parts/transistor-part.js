import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const gateRadius = 0.063772 / 2;
const baseRadius = 0.03398 / 2;
const lowerAngleLimit = (Math.PI*2)*0.018;
const upperAngleLimit = (Math.PI*2)*0.125;

export class TransistorPart extends PartBase
{
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'transistor';
        this.hasChainConnection = 'open';
        this.partImage = scene.add.image(this.x, this.y,'transistor-gate');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(8);
        //this.partImage.setAlpha(0.0);

        // this.partWidth = this.partImage.displayWidth;
        // this.partHeight = this.partImage.displayHeight;

        this.transistorGuideImage = scene.add.image(this.x, this.y,'transistor-guide');
        this.transistorGuideImage.setScale(0.5);
        this.transistorGuideImage.setDepth(13);

        this.transistorBaseImage = scene.add.image(this.x, this.y,'transistor-base');
        this.transistorBaseImage.setScale(0.5);
        this.transistorBaseImage.setDepth(6);

        this.transistorTabImage = scene.add.image(this.x, this.y + 86,'transistor-tab');
        this.transistorTabImage.setScale(0.5);
        this.transistorTabImage.setDepth(13);

        this.transistorMidCapImage = scene.add.image(this.x, this.y,'transistor-mid-cap');
        this.transistorMidCapImage.setScale(0.5);
        this.transistorMidCapImage.setDepth(10);

        this.transistorResistorImage = scene.add.image(this.x, this.y,'transistor-resistor');
        this.transistorResistorImage.setScale(0.5);
        this.transistorResistorImage.setDepth(2);

        let brakeRadius = 56;
        let ballRadius = 25;

        this.transistorBrake1Image = scene.add.image(this.x, this.y - brakeRadius,'transistor-brake');
        this.transistorBrake1Image.setScale(0.5);
        this.transistorBrake1Image.setDepth(7);
        this.transistorBrake1Image.setRotation(-Math.PI/2);

        this.transistorBrake2Image = scene.add.image(this.x + Math.cos(((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius, this.y + Math.sin(((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius,'transistor-brake');
        this.transistorBrake2Image.setScale(0.5);
        this.transistorBrake2Image.setDepth(7);
        this.transistorBrake2Image.setRotation(Math.PI*(2/3) - Math.PI/2);

        this.transistorBrake3Image = scene.add.image(this.x + Math.cos(-((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius, this.y + Math.sin(-((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius,'transistor-brake');
        this.transistorBrake3Image.setScale(0.5);
        this.transistorBrake3Image.setDepth(7);
        this.transistorBrake3Image.setRotation(-Math.PI*(2/3) - Math.PI/2);

        this.transistorBall1Image = scene.add.image(this.x, this.y - ballRadius,'transistor-ball');
        this.transistorBall1Image.setScale(0.5);
        this.transistorBall1Image.setDepth(12);

        this.transistorBall2Image = scene.add.image(this.x + Math.cos(((Math.PI * 2) / 3) - Math.PI/2) * ballRadius, this.y + Math.sin(((Math.PI * 2) / 3) - Math.PI/2) * ballRadius,'transistor-ball');
        this.transistorBall2Image.setScale(0.5);
        this.transistorBall2Image.setDepth(12);

        this.transistorBall3Image = scene.add.image(this.x + Math.cos(-((Math.PI * 2) / 3) - Math.PI/2) * ballRadius, this.y + Math.sin(-((Math.PI * 2) / 3) - Math.PI/2) * ballRadius,'transistor-ball');
        this.transistorBall3Image.setScale(0.5);
        this.transistorBall3Image.setDepth(12);

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorGuideImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorBaseImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorTabImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorMidCapImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorResistorImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorBrake1Image.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorBrake2Image.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorBrake3Image.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorBall1Image.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorBall2Image.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.transistorBall3Image.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });


        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 117/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = baseRadius; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 0;
        this.sprocketExists[1] = false;
        this.sprocketPhysicsRadius[1] = 0; // in m
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 181/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = gateRadius; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();

        // Create transistor bodies and joints
        this.transistorGateBody = this.world.createDynamicBody({position: planck.Vec2(0,0/*this.x / worldScale, this.y / worldScale*/), angularDamping: 0.02});
        this.transistorGateBody.createFixture(planck.Circle(gateRadius), {density: 0.1, filterGroupIndex: -1});
        this.sprocketBodies[2] = this.transistorGateBody;

        this.transistorResistorBody = this.world.createDynamicBody({position: planck.Vec2(0,0/*(this.x) / worldScale, (this.y) / worldScale*/), angularDamping: 0.02});
        this.transistorResistorFixture = this.transistorResistorBody.createFixture(planck.Circle(baseRadius), {density: 10, filterGroupIndex: -1});
        this.sprocketBodies[0] = this.transistorResistorBody;

        this.transistorGateJoint = this.world.createJoint(planck.RevoluteJoint({enableLimit: true, lowerAngle: lowerAngleLimit, upperAngle: upperAngleLimit}, this.ground, this.transistorGateBody, this.transistorGateBody.getPosition()));
        this.sprocketJoints[2] = this.transistorGateJoint;
        this.transistorResistorJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.transistorResistorBody, this.transistorResistorBody.getPosition()));
        this.sprocketJoints[0] = this.transistorResistorJoint;

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.transistorGateBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.transistorGateBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.transistorGateBody));

        this.transistorGuideImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorGuideImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorGuideImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorGuideImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorGuideImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorGuideImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorResistorImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorResistorImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorResistorImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorResistorImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.transistorResistorBody));
        this.transistorResistorImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.transistorResistorBody));
        this.transistorResistorImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.transistorResistorBody));

        this.transistorTabImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorTabImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorTabImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorTabImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorTabImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorTabImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorMidCapImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorMidCapImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorMidCapImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorMidCapImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorMidCapImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorMidCapImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorBaseImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorBaseImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorBaseImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorBaseImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorBaseImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorBaseImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorBrake1Image.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorBrake1Image.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorBrake1Image.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorBrake1Image.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorBrake1Image.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorBrake1Image.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorBrake2Image.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorBrake2Image.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorBrake2Image.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorBrake2Image.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorBrake2Image.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorBrake2Image.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorBrake3Image.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorBrake3Image.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorBrake3Image.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorBrake3Image.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorBrake3Image.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorBrake3Image.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorBall1Image.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorBall1Image.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorBall1Image.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorBall1Image.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorBall1Image.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorBall1Image.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorBall2Image.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorBall2Image.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorBall2Image.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorBall2Image.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorBall2Image.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorBall2Image.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.transistorBall3Image.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.transistorBall3Image.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.transistorBall3Image.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.transistorBall3Image.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.transistorBall3Image.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.transistorBall3Image.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        //this.transistorCW = false;
        this.setTransistorCW(false);
    }

    updatePhysics()
    {
        //this.partImage.x = this.transistorGateBody.getPosition().x * worldScale;
        //this.partImage.y = this.transistorGateBody.getPosition().y * worldScale;
        this.partImage.rotation = this.transistorGateBody.getAngle();
        this.transistorGuideImage.rotation = this.transistorGateBody.getAngle();
        this.transistorResistorImage.rotation = this.transistorResistorBody.getAngle();
        let ballRadius = 26 - (Math.abs(this.transistorGateBody.getAngle()) * 18);
        this.transistorBall1Image.setPosition(this.x, this.y - ballRadius);
        this.transistorBall2Image.setPosition(this.x + Math.cos(((Math.PI * 2) / 3) - Math.PI/2) * ballRadius, this.y + Math.sin(((Math.PI * 2) / 3) - Math.PI/2) * ballRadius);
        this.transistorBall3Image.setPosition(this.x + Math.cos(-((Math.PI * 2) / 3) - Math.PI/2) * ballRadius, this.y + Math.sin(-((Math.PI * 2) / 3) - Math.PI/2) * ballRadius);

        // Set resistance of base
        let angleFraction = 0;
        let torqueAtMaxDeflection = 0.0000047829 * 2.5;
        let angularDampingAtMaxDeflection = 100;
        if (this.transistorCW) {
            // Range of angles between lowerAngleLimit and upperAngleLimit
            angleFraction = (this.transistorGateBody.getAngle() - lowerAngleLimit) / (upperAngleLimit - lowerAngleLimit);
            // Now set the torque to return the gate back to it's original position
            this.transistorGateBody.applyTorque(-(angleFraction) * torqueAtMaxDeflection); // in units of (N m / 1000) * 2.5
        }
        else {
            angleFraction = -(this.transistorGateBody.getAngle() - -lowerAngleLimit) / (upperAngleLimit - lowerAngleLimit);
            //console.log(angleFraction);
            // Now set the torque to return the gate back to it's original position
            this.transistorGateBody.applyTorque((angleFraction) * torqueAtMaxDeflection); // in units of (N m / 1000) * 2.5
        }
        let rFactor = angleFraction;
        if (rFactor > 1)
            rFactor = 1;
        if (rFactor < 0)
            rFactor = 0;

        let dampingRatio = 100;
        this.angularDamping = Math.pow(100, (1-rFactor) * 2)-1;
        if (this.angularDamping < 0.5)
            this.angularDamping = 0.5;
        this.density = this.angularDamping / dampingRatio;
        //this.kFactor = this.resistance * 0.0000003;
        //console.log("rFactor: "+rFactor);
        //console.log("angular damping: "+this.angularDamping);
        //console.log("density: "+this.density);

        this.transistorResistorBody.setAngularDamping(this.angularDamping);
        this.transistorResistorFixture.setDensity(this.density);
        this.transistorResistorBody.resetMassData();
        //console.log("Angular damping: " + this.angularDamping);
        //console.log("Density: " + this.density);

        //console.log((1-rFactor) * angularDampingAtMaxDeflection);
        //this.transistorBaseBody.setAngularDamping();
        //let BaseResistance = (1-rFactor)*100000*0.00000003; // in ohms
        //console.log(this.transistorBaseBody.getAngularVelocity());
        // Apply reverse force from resistance
        //console.log(this.transistorBaseBody.getAngularVelocity() * BaseResistance);
        //this.transistorBaseBody.applyTorque(-this.transistorBaseBody.getAngularVelocity() * BaseResistance);
        //this.transistorBaseBody.setAngularDamping((1-rFactor)*100);
    }

    // Override with new behavior
    changePartProperty()
    {
        this.setTransistorCW(!this.transistorCW);
    }

    setTransistorCW(cw)
    {
        this.transistorCW = cw;
        // Change the picture.
        if (cw) {
            //this.partImage.setTexture('transistor-cw')
            this.transistorGateJoint.setLimits(lowerAngleLimit, upperAngleLimit);
        }
        else
        {
            //this.partImage.setTexture('transistor-ccw')
            this.transistorGateJoint.setLimits(-upperAngleLimit, -lowerAngleLimit);
        }
    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            value: this.transistorCW
        }
        return partObject;
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.transistorGuideImage.setTint(color);
        this.transistorBaseImage.setTint(color);
        this.transistorTabImage.setTint(color);
        this.transistorMidCapImage.setTint(color);
        this.transistorResistorImage.setTint(color);
        this.transistorBrake1Image.setTint(color);
        this.transistorBrake2Image.setTint(color);
        this.transistorBrake3Image.setTint(color);
        this.transistorBall1Image.setTint(color);
        this.transistorBall2Image.setTint(color);
        this.transistorBall3Image.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.transistorGuideImage.clearTint();
        this.transistorBaseImage.clearTint();
        this.transistorTabImage.clearTint();
        this.transistorMidCapImage.clearTint();
        this.transistorResistorImage.clearTint();
        this.transistorBrake1Image.clearTint();
        this.transistorBrake2Image.clearTint();
        this.transistorBrake3Image.clearTint();
        this.transistorBall1Image.clearTint();
        this.transistorBall2Image.clearTint();
        this.transistorBall3Image.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;

        let brakeRadius = 56;

        if (this.partImage !== undefined)
            this.partImage.setPosition(x, y);
        if (this.transistorGuideImage !== undefined)
            this.transistorGuideImage.setPosition(x, y);
        if (this.transistorBaseImage !== undefined)
            this.transistorBaseImage.setPosition(x, y);
        if (this.transistorTabImage !== undefined)
            this.transistorTabImage.setPosition(x, y + 86);
        if (this.transistorMidCapImage !== undefined)
            this.transistorMidCapImage.setPosition(x, y);
        if (this.transistorResistorImage !== undefined)
            this.transistorResistorImage.setPosition(x, y);
        if (this.transistorBrake1Image !== undefined)
            this.transistorBrake1Image.setPosition(this.x, this.y - brakeRadius,'transistor-brake');
        if (this.transistorBrake2Image !== undefined)
            this.transistorBrake2Image.setPosition(this.x + Math.cos(((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius, this.y + Math.sin(((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius);
        if (this.transistorBrake3Image !== undefined)
            this.transistorBrake3Image.setPosition(this.x + Math.cos(-((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius, this.y + Math.sin(-((Math.PI * 2) / 3) - Math.PI/2) * brakeRadius,'transistor-brake');
        if (this.transistorBall1Image !== undefined)
            this.transistorBall1Image.setPosition(x, y);
        if (this.transistorBall2Image !== undefined)
            this.transistorBall2Image.setPosition(x, y);
        if (this.transistorBall3Image !== undefined)
            this.transistorBall3Image.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.transistorGuideImage.destroy();
        this.transistorBaseImage.destroy();
        this.transistorTabImage.destroy();
        this.transistorMidCapImage.destroy();
        this.transistorResistorImage.destroy();
        this.transistorBrake1Image.destroy();
        this.transistorBrake2Image.destroy();
        this.transistorBrake3Image.destroy();
        this.transistorBall1Image.destroy();
        this.transistorBall2Image.destroy();
        this.transistorBall3Image.destroy();
        this.world.destroyBody(this.transistorGateBody);
        this.world.destroyBody(this.transistorResistorBody);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 181/2, right: this.x + 181/2, top: this.y - 181/2, bottom: this.y + 181/2};
    }
}