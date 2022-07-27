import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const capacitorRadius =  0.041168 / 2;
const lowerAngleLimit = -288 * (1/360)*2*Math.PI;
const upperAngleLimit = 288 * (1/360)*2*Math.PI;
//const lowerAngleLimit = -9000 * (1/360)*2*Math.PI;
//const upperAngleLimit = 9000 * (1/360)*2*Math.PI;

export class CapacitorPart extends PartBase
{
    static possibleCapacitanceValues = [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05];

    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'capacitor';
        this.partImage = scene.add.image(this.x, this.y,'capacitor-sprocket');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(10);
        this.partImage.setVisible(true);

        //this.add(this.partImage);
        // this.partWidth = this.partImage.displayWidth;
        // this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);
        //this.partImage.setDisplaySize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        this.capacitorCapImage = scene.add.image(this.x, this.y,'capacitor-cap');
        this.capacitorCapImage.setScale(0.5);
        this.capacitorCapImage.setDepth(12);
        this.capacitorCapImage.setVisible(true);

        this.capacitorShortHandImage = scene.add.image(this.x, this.y,'capacitor-short-hand');
        this.capacitorShortHandImage.setScale(0.5);
        this.capacitorShortHandImage.setDepth(11);
        this.capacitorShortHandImage.setOrigin(0.5, 0.74);
        this.capacitorShortHandImage.setVisible(true);

        this.capacitorLongHandImage = scene.add.image(this.x, this.y,'capacitor-long-hand');
        this.capacitorLongHandImage.setScale(0.5);
        this.capacitorLongHandImage.setDepth(11);
        this.capacitorLongHandImage.setOrigin(0.5, 0.8);
        this.capacitorLongHandImage.setVisible(true);

        this.capacitorSprocketNoValueImage = scene.add.image(this.x, this.y,'capacitor-sprocket-no-value');
        this.capacitorSprocketNoValueImage.setScale(0.5);
        this.capacitorSprocketNoValueImage.setDepth(11);
        //this.capacitorSprocketNoValueImage.setOrigin(0.5, 0.8);
        this.capacitorSprocketNoValueImage.setVisible(false);

        this.capacitorMeterImage = scene.add.image(this.x, this.y,'capacitor-meter');
        this.capacitorMeterImage.setScale(0.5);
        this.capacitorMeterImage.setDepth(12);
        //this.capacitorMeterImage.setOrigin(0.5, 0.8);
        this.capacitorMeterImage.setVisible(false);

        this.capacitorNumbersImage = scene.add.image(this.x, this.y,'capacitor-numbers');
        this.capacitorNumbersImage.setScale(0.5);
        this.capacitorNumbersImage.setDepth(11);
        //this.capacitorNumbersImage.setOrigin(0.5, 0.8);
        this.capacitorNumbersImage.setVisible(false);

        this.maskShape = scene.add.graphics();
        this.maskShape.setPosition(this.x, this.y);
        this.maskShape.fillStyle(0xffffff);
        this.maskShape.fillRect(-30,-30,60,60);
        const mask = this.maskShape.createGeometryMask();
        this.capacitorNumbersImage.setMask(mask);

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.capacitorCapImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.capacitorShortHandImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.capacitorLongHandImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.capacitorSprocketNoValueImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.capacitorMeterImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.capacitorNumbersImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 117/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = capacitorRadius; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 117/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = capacitorRadius; // in m
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 117/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = capacitorRadius; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();

        this.capacitorBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 5});
        this.capacitorFixture = this.capacitorBody.createFixture(planck.Circle(capacitorRadius), {density: 0.1, filterGroupIndex: -1, friction: 0});
        this.sprocketBodies[0] = this.capacitorBody;
        this.sprocketBodies[1] = this.capacitorBody;
        this.sprocketBodies[2] = this.capacitorBody;

        this.capacitorShortHandBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.02});
        this.capacitorLongHandBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.02});
        //this.capacitorFixture = this.capacitorBody.createFixture(planck.Circle(capacitorRadius), {density: 0.1, filterGroupIndex: -1, friction: 0});

        this.capacitorJoint = this.world.createJoint(planck.RevoluteJoint({enableLimit: false, lowerAngle: lowerAngleLimit, upperAngle: upperAngleLimit}, this.ground, this.capacitorBody, this.capacitorBody.getPosition()));
        this.sprocketJoints[0] = this.capacitorJoint;
        this.sprocketJoints[1] = this.capacitorJoint;
        this.sprocketJoints[2] = this.capacitorJoint;
        this.capacitorShortHandJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.capacitorShortHandBody, planck.Vec2(this.x / worldScale, this.y / worldScale)));
        this.capacitorLongHandJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.capacitorLongHandBody, this.capacitorBody.getPosition()));


        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.capacitorBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.capacitorBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.capacitorBody));

        this.capacitorCapImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.capacitorCapImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.capacitorCapImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.capacitorCapImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.capacitorCapImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.capacitorCapImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.capacitorShortHandImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.capacitorShortHandImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.capacitorShortHandImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.capacitorShortHandImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.capacitorShortHandImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.capacitorShortHandImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.capacitorLongHandImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.capacitorLongHandImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.capacitorLongHandImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.capacitorLongHandImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.capacitorLongHandImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.capacitorLongHandImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.capacitorSprocketNoValueImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.capacitorSprocketNoValueImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.capacitorSprocketNoValueImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.capacitorSprocketNoValueImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.capacitorBody));
        this.capacitorSprocketNoValueImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.capacitorBody));
        this.capacitorSprocketNoValueImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.capacitorBody));

        this.capacitorMeterImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.capacitorMeterImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.capacitorMeterImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.capacitorMeterImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.capacitorMeterImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.capacitorMeterImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.capacitorNumbersImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.capacitorNumbersImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.capacitorNumbersImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.capacitorNumbersImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.capacitorNumbersImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.capacitorNumbersImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        // Set the starting resistance
        this.capacitance = CapacitorPart.possibleCapacitanceValues[2]; // 1 mF default

        // Create the text that shows the resistor value
        this.capacitanceText = scene.add.text(Math.round(58), Math.round(-83), this.getCapacitanceString(), {
            font: '20px Roboto',
            fontSize: '50px',
            color: "rgb(20, 20, 20)",
            fontStyle: 'strong'
        });
        this.add(this.capacitanceText);

        // Draw a line to the capacitor
        this.textLine = new Phaser.Curves.Path(48, -50);
        this.textLine.splineTo([50, -55, 54, -57, 56, -62]);
        this.graphics = scene.add.graphics();
        this.add(this.graphics);
        this.graphics.lineStyle(2, 0x111111, 1);
        this.textLine.draw(this.graphics);
    }

    updatePhysics()
    {
        //this.partImage.x = this.capacitorBody.getPosition().x * worldScale;
        //this.partImage.y = this.capacitorBody.getPosition().y * worldScale;
        this.partImage.rotation = this.capacitorBody.getAngle();
        this.capacitorSprocketNoValueImage.rotation = this.capacitorBody.getAngle();

        // Set resistance of base
        let angleFraction = 0;
        let torqueAtMaxDeflection = (0.001 / this.capacitance)*(0.0000185256 * 2.5);

        // Range of angles between lowerAngleLimit and upperAngleLimit
        if (this.capacitorBody)
        angleFraction = (this.capacitorBody.getAngle() - lowerAngleLimit) / (upperAngleLimit - lowerAngleLimit);

        /*if (this.capacitorBody.getAngle() < lowerAngleLimit)
            this.capacitorBody.setAngle(lowerAngleLimit);
        if (this.capacitorBody.getAngle() > upperAngleLimit)
            this.capacitorBody.setAngle(upperAngleLimit);*/

        // Now set the torque to return the gate back to it's original position
        this.capacitorBody.applyTorque(-(angleFraction - 0.5) * 2 * torqueAtMaxDeflection); // in units of (N m / 1000) * 2.5

        if ((angleFraction - 0.5) * 2 > 0)
        {
            this.capacitorLongHandBody.setAngle(0);
            this.capacitorShortHandBody.setAngle(this.capacitorBody.getAngle());
        }
        else {
            this.capacitorShortHandBody.setAngle(0);
            this.capacitorLongHandBody.setAngle(this.capacitorBody.getAngle());
        }

        this.capacitorNumbersImage.x = this.x + (-(angleFraction - 0.5) * 2) * (1/this.capacitance) * .21705;
        //this.capacitorShortHandImage.x = this.capacitorShortHandBody.getPosition().x * worldScale;
        //this.capacitorShortHandImage.y = this.capacitorShortHandBody.getPosition().y * worldScale;
        this.capacitorShortHandImage.rotation = this.capacitorShortHandBody.getAngle();

        //this.capacitorLongHandImage.x = this.capacitorLongHandBody.getPosition().x * worldScale;
        //this.capacitorLongHandImage.y = this.capacitorLongHandBody.getPosition().y * worldScale;
        this.capacitorLongHandImage.rotation = this.capacitorLongHandBody.getAngle();
    }

    getCapacitanceString()
    {
        let capacitanceString = "";
        if (this.capacitance < 0.001)
        {
            capacitanceString = (this.capacitance * 1000000).toString() + " μF";
        }
        if (this.capacitance >= 0.001 && this.capacitance < 1)
        {
            capacitanceString = (this.capacitance * 1000).toString() + " mF";
        }
        else if (this.capacitance >= 1)
        {
            capacitanceString = (this.capacitance).toString() + " F";
        }
        return capacitanceString;
    }

    setCapacitance(index)
    {
        this.capacitance = CapacitorPart.possibleCapacitanceValues[index];
        this.capacitanceText.setText(this.getCapacitanceString());

        // Change the appearance if the kit capacitor
        if (this.capacitance == 0.001)
        {
            this.capacitorSprocketNoValueImage.setVisible(false);
            this.capacitorMeterImage.setVisible(false);
            this.capacitorNumbersImage.setVisible(false);

            this.partImage.setVisible(true);
            this.capacitorCapImage.setVisible(true);
            this.capacitorShortHandImage.setVisible(true);
            this.capacitorLongHandImage.setVisible(true);
        }
        else
        {
            this.capacitorSprocketNoValueImage.setVisible(true);
            this.capacitorMeterImage.setVisible(true);
            this.capacitorNumbersImage.setVisible(true);

            this.partImage.setVisible(false);
            this.capacitorCapImage.setVisible(false);
            this.capacitorShortHandImage.setVisible(false);
            this.capacitorLongHandImage.setVisible(false);
        }
        // setAwake wakes up the part if it's sleeping so it will update the physics again
        this.capacitorBody.setAwake(true);
    }

    // Override with new behavior
    changePartProperty()
    {
        let currentIndex = CapacitorPart.possibleCapacitanceValues.indexOf(this.capacitance);
        currentIndex++;
        if (currentIndex >= CapacitorPart.possibleCapacitanceValues.length)
            currentIndex = 0;
        this.setCapacitance(currentIndex);
    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            value: this.capacitance
        }
        return partObject;
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.capacitorCapImage.setTint(color);
        this.capacitorShortHandImage.setTint(color);
        this.capacitorLongHandImage.setTint(color);
        this.capacitorSprocketNoValueImage.setTint(color);
        this.capacitorMeterImage.setTint(color);
        this.capacitorNumbersImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.capacitorCapImage.clearTint();
        this.capacitorShortHandImage.clearTint();
        this.capacitorLongHandImage.clearTint();
        this.capacitorSprocketNoValueImage.clearTint();
        this.capacitorMeterImage.clearTint();
        this.capacitorNumbersImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.capacitorCapImage != undefined)
            this.capacitorCapImage.setPosition(x, y);
        if (this.capacitorShortHandImage != undefined)
            this.capacitorShortHandImage.setPosition(x, y);
        if (this.capacitorLongHandImage != undefined)
            this.capacitorLongHandImage.setPosition(x, y);
        if (this.capacitorSprocketNoValueImage != undefined)
            this.capacitorSprocketNoValueImage.setPosition(x, y);
        if (this.capacitorMeterImage != undefined)
            this.capacitorMeterImage.setPosition(x, y);
        if (this.capacitorNumbersImage != undefined)
            this.capacitorNumbersImage.setPosition(x, y);
        if (this.maskShape != undefined)
            this.maskShape.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.capacitorCapImage.destroy();
        this.capacitorShortHandImage.destroy();
        this.capacitorLongHandImage.destroy();
        this.capacitorSprocketNoValueImage.destroy();
        this.capacitorMeterImage.destroy();
        this.capacitorNumbersImage.destroy();
        this.maskShape.destroy();
        this.capacitanceText.destroy();
        this.textLine.destroy();
        this.graphics.destroy();
        this.world.destroyBody(this.capacitorBody);
        this.world.destroyBody(this.capacitorShortHandBody);
        this.world.destroyBody(this.capacitorLongHandBody);

        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 117/2, right: this.x + 117/2, top: this.y - 117/2, bottom: this.y + 117/2};
    }

}