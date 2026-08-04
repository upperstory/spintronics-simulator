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
        
        this.partImage = PartBase.makeImage(scene, this.x, this.y, 'capacitor-sprocket', 0.5, 10, true);

        //this.add(this.partImage);
        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);
        //this.partImage.setDisplaySize(this.partWidth, this.partHeight);
        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;
        this.capacitorCapImage = PartBase.makeImage(scene, this.x, this.y, 'capacitor-cap', 0.5, 12, true);
        
        this.capacitorShortHandImage = PartBase.makeImage(scene, this.x, this.y, 'capacitor-short-hand', 0.5, 11, true)
        this.capacitorShortHandImage.setOrigin(0.5, 0.74);
        
        this.capacitorLongHandImage = PartBase.makeImage(scene, this.x, this.y, 'capacitor-long-hand', 0.5, 11, true)
        this.capacitorLongHandImage.setOrigin(0.5, 0.8);

        this.capacitorSprocketNoValueImage = PartBase.makeImage(scene, this.x, this.y, 'capacitor-sprocket-no-value', 0.5, 11, false);
        
        this.capacitorMeterImage = PartBase.makeImage(scene, this.x, this.y, 'capacitor-meter', 0.5, 12, false);
        
        this.capacitorNumbersImage = PartBase.makeImage(scene, this.x, this.y,'capacitor-numbers', 0.5, 11, false);

        this.maskShape = scene.add.graphics();
        this.maskShape.setPosition(this.x, this.y);
        this.maskShape.fillStyle(0xffffff);
        this.maskShape.fillRect(-30,-30,60,60);
        const mask = this.maskShape.createGeometryMask();
        this.capacitorNumbersImage.setMask(mask);
        
        PartBase.setAllInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        },
            this.partImage,
            this.capacitorCapImage,
            this.capacitorShortHandImage,
            this.capacitorLongHandImage,
            this.capacitorSprocketNoValueImage,
            this.capacitorMeterImage,
            this.capacitorNumbersImage
            
        )

        this.setupSprocket(0, {x: 0, y: 0}, 117/2, true, capacitorRadius);
        this.setupSprocket(1, {x: 0, y: 0}, 117/2, true, capacitorRadius);
        this.setupSprocket(2, {x: 0, y: 0}, 117/2, true, capacitorRadius);

        // Create bodies and fixtures for Planck world
        this.capacitorBody = this.standardBody(5);
        this.capacitorFixture = PartBase.createFixture(this.capacitorBody, capacitorRadius);
        this.sprocketBodies[0] = this.capacitorBody;
        this.sprocketBodies[1] = this.capacitorBody;
        this.sprocketBodies[2] = this.capacitorBody;

        this.capacitorShortHandBody = this.standardBody(0.02);
        this.capacitorLongHandBody = this.standardBody(0.02);
        //this.capacitorFixture = this.capacitorBody.createFixture(planck.Circle(capacitorRadius), {density: 0.1, filterGroupIndex: -1, friction: 0});
        this.capacitorJoint = this.world.createJoint(planck.RevoluteJoint({enableLimit: false, lowerAngle: lowerAngleLimit, upperAngle: upperAngleLimit}, this.ground, this.capacitorBody, this.capacitorBody.getPosition())); // non standard
        this.sprocketJoints[0] = this.capacitorJoint;
        this.sprocketJoints[1] = this.capacitorJoint;
        this.sprocketJoints[2] = this.capacitorJoint;
        this.capacitorShortHandJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.capacitorShortHandBody, planck.Vec2(this.x / worldScale, this.y / worldScale))); // non standard
        this.capacitorLongHandJoint = this.standardRevolute(this.ground, this.capacitorLongHandBody, this.capacitorBody);
        
        this.setupInteractions(
            this.partImage,
            this.capacitorBody
        );
        this.setupInteractions(
            this.capacitorCapImage
        );
        this.setupInteractions(
            this.capacitorShortHandImage
        );
        this.setupInteractions(
            this.capacitorLongHandImage
        );
        this.setupInteractions(
            this.capacitorSprocketNoValueImage,
            this.capacitorBody
        );
        this.setupInteractions(
            this.capacitorMeterImage
        );
        this.setupInteractions(
            this.capacitorNumbersImage
        );

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
