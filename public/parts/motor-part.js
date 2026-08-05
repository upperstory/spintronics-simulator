import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';
import { ToggleButton } from '../toggle-button.js';

const motorWheelRadius = 0.025771 / 2;
const intermediateGearTopRadius = 0.0364 / 2;
const intermediateGearBottomRadius = 0.014 / 2;
const driveGearRadius = 0.042 / 2;
const sprocketGearRadius = 0.014 / 2;

export class MotorPart extends PartBase
{
    partType = 'motor';
    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.markBody(this.ground);
        
        this.isShorted = false;
        this.buttonWidth = 300;
        this.buttonHeight = 50;

        // Create the reset button textures
        this.resetButtonYOffset = 140;
        let graphics = scene.add.graphics();
        graphics.fillStyle(0xED1C24, 1);
        graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
        graphics.generateTexture('reset-button-default-background', this.buttonWidth, this.buttonHeight);
        graphics.destroy();

        graphics = scene.add.graphics();
        graphics.fillStyle(0xD6212E, 1);
        graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
        graphics.generateTexture('reset-button-hover-background', this.buttonWidth, this.buttonHeight);
        graphics.destroy();

        graphics = scene.add.graphics();
        graphics.fillStyle(0xED1C24, 1);
        graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
        graphics.generateTexture('reset-button-disabled-background', this.buttonWidth, this.buttonHeight);
        graphics.destroy();

        graphics = scene.add.graphics();
        graphics.fillStyle(0xB51F2B, 1);
        graphics.lineStyle(2,0x111111, 0.8);
        graphics.fillRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, 10);
        graphics.strokeRoundedRect(1, 1, this.buttonWidth-2, this.buttonHeight-2, 10);
        graphics.generateTexture('reset-button-selected-background', this.buttonWidth, this.buttonHeight);
        graphics.destroy();

        this.onSwitchToggled = this.onSwitchToggled.bind(this);

        this.resetButton = new ToggleButton(scene, 'reset-circuit-breaker', this.x, this.y + this.resetButtonYOffset, this.buttonWidth, this.buttonHeight, 'reset-button-default-background', 'reset-button-hover-background', 'reset-button-selected-background', 'reset-circuit-breaker', this.onSwitchToggled, 'reset-button-disabled-background');
        this.resetButton.setDepth(12);
        this.resetButton.setVisible(false);

        this.partImageOffset = {x: 0.5, y: -91.5};
        this.partImage = PartBase.makeImage(scene, this.x + this.partImageOffset.x, this.y + this.partImageOffset.y,'motor-wheel', 0.5, 10);
        this.markImage(this.partImage);

        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;

        this.motorBaseUnderImageOffset = {x: -8, y: -7};
        this.motorBaseUnderImage = PartBase.makeImage(scene, this.x + this.motorBaseUnderImageOffset.x, this.y + this.motorBaseUnderImageOffset.y, 'motor-base-under', 0.5, 0);
        this.markImage(this.motorBaseUnderImage);

        this.motorBaseTileImageOffset = {x: 0, y: 20.5};
        this.motorBaseTileImage = PartBase.makeImage(scene, this.x + this.motorBaseTileImageOffset.x, this.y + this.motorBaseTileImageOffset.y, 'motor-base-tile', 0.5, 1);
        this.markImage(this.motorBaseTileImage);

        this.motorPawlClosedImageOffset = {x: 11, y: 58};
        this.motorPawlClosedImage = PartBase.makeImage(scene, this.x + this.motorPawlClosedImageOffset.x, this.y + this.motorPawlClosedImageOffset.y, 'motor-pawl-closed', 0.5, 0, false);
        this.markImage(this.motorPawlClosedImage);

        this.motorPawlOpenImageOffset = {x: 11, y: 66};
        this.motorPawlOpenImage = PartBase.makeImage(scene, this.x + this.motorPawlOpenImageOffset.x, this.y + this.motorPawlOpenImageOffset.y, 'motor-pawl-open', 0.5, 0);
        this.markImage(this.motorPawlOpenImage);
        //this.motorPawlOpenImage.setAlpha(0.0);

        this.motorScrewImageOffset = {x: 0.5, y: -91.5};
        this.motorScrewImage = PartBase.makeImage(scene, this.x + this.motorScrewImageOffset.x, this.y + this.motorScrewImageOffset.y,'motor-screw', 0.5, 10);
        this.markImage(this.motorScrewImage);

        this.motorDriveGearImageOffset = {x: -32.5, y: 129-91.5};
        this.motorDriveGearImage = PartBase.makeImage(scene, this.x + this.motorDriveGearImageOffset.x, this.y + this.motorDriveGearImageOffset.y,'motor-drive-gear', 0.5, 1);
        this.markImage(this.motorDriveGearImage);
        //this.motorDriveGearImage.setAlpha(0.5);

        this.motorIntermediateGearImageOffset = {x: 25.5, y: 70.5-91.5};
        this.motorIntermediateGearImage = PartBase.makeImage(scene, this.x + this.motorIntermediateGearImageOffset.x, this.y + this.motorIntermediateGearImageOffset.y,'motor-intermediate-gear', 0.5, 1);
        this.markImage(this.motorIntermediateGearImage);
        //this.motorIntermediateGearImage.setAlpha(0.5);

        this.motorSpannerImageOffset = {x: -3.5, y: 99.5-91.5};
        this.motorSpannerImage = PartBase.makeImage(scene, this.x + this.motorSpannerImageOffset.x, this.y + this.motorSpannerImageOffset.y,'motor-spanner', 0.5, 2);
        this.markImage(this.motorSpannerImage);
        //this.motorSpannerImage.setAlpha(0.5);
        
        PartBase.setAllInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        },
            this.partImage,
            this.motorBaseUnderImage,
            this.motorBaseTileImage,
            this.motorPawlClosedImage,
            this.motorPawlOpenImage,
            this.motorScrewImage,
            this.motorDriveGearImage,
            this.motorIntermediateGearImage,
            this.motorSpannerImage
        );

        this.setupSprocket(0, {x: 0.5, y: -91.5}, 75/2, true, motorWheelRadius);
        this.setupSprocket(1, {x: 0.5, y: -91.5}, 75/2, true, motorWheelRadius);
        this.setupSprocket(2, {x: 0.5, y: -91.5}, 75/2, true, motorWheelRadius);
        // Create bodies and fixtures for Planck world
        this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)),{density: 0.1, filterGroupIndex: -1});

        // Create junction bodies and joints
        this.motorWheelSprocketBody = this.standardBody(0.02);
        this.markBody(this.motorWheelSprocketBody);
        PartBase.createFixture(this.motorWheelSprocketBody, motorWheelRadius);
        this.sprocketBodies[0] = this.motorWheelSprocketBody;
        this.sprocketBodies[1] = this.motorWheelSprocketBody;
        this.sprocketBodies[2] = this.motorWheelSprocketBody;
        this.motorIntermediateGearBody = this.standardBody(0.02, (0 + 44.5) / worldScale, (0 + 59.5) / worldScale);
        this.markBody(this.motorIntermediateGearBody);
        PartBase.createFixture(this.motorIntermediateGearBody, intermediateGearTopRadius);
        this.motorDriveGearBody = this.standardBody(0.02, (0 + 7.5) / worldScale, (0 + 133) / worldScale);
        this.markBody(this.motorDriveGearBody);
        PartBase.createFixture(this.motorDriveGearBody, driveGearRadius);
        
        this.motorWheelJoint = this.standardRevolute(this.ground, this.motorWheelSprocketBody);
        this.markJoint(this.motorWheelJoint);
        this.sprocketJoints[0] = this.motorWheelJoint;
        this.sprocketJoints[1] = this.motorWheelJoint;
        this.sprocketJoints[2] = this.motorWheelJoint;
        this.motorIntermediateGearJoint = this.standardRevolute(this.ground, this.motorIntermediateGearBody);
        this.markJoint(this.motorIntermediateGearJoint);
        this.motorDriveGearJoint = this.standardRevolute(this.ground, this.motorDriveGearBody);
        this.markJoint(this.motorDriveGearJoint);

        // Create the gear joints
        this.motorIntermediateGearGearJoint = this.gearJoint(this.motorIntermediateGearBody, this.motorWheelSprocketBody, this.motorIntermediateGearJoint, this.motorWheelJoint, sprocketGearRadius/intermediateGearTopRadius);
        this.markJoint(this.motorIntermediateGearGearJoint);
        this.motorDriveGearGearJoint = this.gearJoint(this.motorDriveGearBody, this.motorIntermediateGearBody, this.motorDriveGearJoint, this.motorIntermediateGearJoint, intermediateGearBottomRadius/driveGearRadius);
        this.markJoint(this.motorDriveGearGearJoint);
        
        this.setupInteractions(
            this.partImage,
            this.motorWheelSprocketBody
        );
        
        this.setupInteractions(
            this.motorBaseUnderImage
        );
        
        this.setupInteractions(
            this.motorBaseTileImage
        );
        
        this.setupInteractions(
            this.motorPawlClosedImage
        );
        
        this.setupInteractions(
            this.motorPawlOpenImage
        );
        
        this.setupInteractions(
            this.motorScrewImage
        );
        
        this.setupInteractions(
            this.motorDriveGearImage,
            this.motorDriveGearBody
        );
        
        this.setupInteractions(
            this.motorIntermediateGearImage,
            this.motorIntermediateGearBody
        );
        
        this.setupInteractions(
            this.motorSpannerImage
        );
    }

    updatePhysics()
    {
        if (!this.isShorted) {
            // We use the motorDriveGearBody because it rotates slower and is therefore under the limit of angular velocity.
            if (this.motorDriveGearBody.getAngularVelocity() >= 20) {
                // We detected a short!
                this.isShorted = true;
                this.motorPawlClosedImage.setVisible(true);
                this.motorPawlOpenImage.setVisible(false);
                //this.motorDriveGearBody.setAngularVelocity(0);
                //this.motorIntermediateGearBody.setAngularVelocity(0);
                //this.motorWheelSprocketBody.setAngularVelocity(0);

                this.motorWheelSprocketBody.setAngularDamping(5);
                //this.resistorFixture.setDensity(this.density);
                this.motorWheelSprocketBody.resetMassData();

                this.resetButton.setVisible(true);
            }
            else {
                this.motorWheelSprocketBody.applyTorque(0.00001648875);//0.000019236875);//0.00000901985); // in units of (N m / 1000)
                //console.log(this.motorDriveGearBody.getAngularVelocity());
            }
        }


        //this.partImage.x = this.motorWheelSprocketBody.getPosition().x * worldScale;
        //this.partImage.y = this.motorWheelSprocketBody.getPosition().y * worldScale;
        this.syncRotation(this.partImage, this.motorWheelSprocketBody);

        //this.motorDriveGearImage.x = this.motorDriveGearBody.getPosition().x * worldScale;
        //this.motorDriveGearImage.y = this.motorDriveGearBody.getPosition().y * worldScale;
        this.syncRotation(this.motorDriveGearImage, this.motorDriveGearBody);

        //this.motorIntermediateGearImage.x = this.motorIntermediateGearBody.getPosition().x * worldScale;
        //this.motorIntermediateGearImage.y = this.motorIntermediateGearBody.getPosition().y * worldScale;
        this.syncRotation(this.motorIntermediateGearImage, this.motorIntermediateGearBody);
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.motorBaseUnderImage.setTint(color);
        this.motorBaseTileImage.setTint(color);
        this.motorPawlClosedImage.setTint(color);
        this.motorPawlOpenImage.setTint(color);
        this.motorScrewImage.setTint(color);
        this.motorDriveGearImage.setTint(color);
        this.motorIntermediateGearImage.setTint(color);
        this.motorSpannerImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.motorBaseUnderImage.clearTint();
        this.motorBaseTileImage.clearTint();
        this.motorPawlClosedImage.clearTint();
        this.motorPawlOpenImage.clearTint();
        this.motorScrewImage.clearTint();
        this.motorDriveGearImage.clearTint();
        this.motorIntermediateGearImage.clearTint();
        this.motorSpannerImage.clearTint();

    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x + this.partImageOffset.x, y + this.partImageOffset.y);
        if (this.motorBaseUnderImage != undefined)
            this.motorBaseUnderImage.setPosition(x + this.motorBaseUnderImageOffset.x, y + this.motorBaseUnderImageOffset.y);
        if (this.motorBaseTileImage != undefined)
            this.motorBaseTileImage.setPosition(x + this.motorBaseTileImageOffset.x, y + this.motorBaseTileImageOffset.y);
        if (this.motorPawlClosedImage != undefined)
            this.motorPawlClosedImage.setPosition(x + this.motorPawlClosedImageOffset.x, y + this.motorPawlClosedImageOffset.y);
        if (this.motorPawlOpenImage != undefined)
            this.motorPawlOpenImage.setPosition(x + this.motorPawlOpenImageOffset.x, y + this.motorPawlOpenImageOffset.y);
        if (this.motorScrewImage != undefined)
            this.motorScrewImage.setPosition(x + this.partImageOffset.x, y + this.partImageOffset.y);
        if (this.motorDriveGearImage != undefined)
            this.motorDriveGearImage.setPosition(x + this.motorDriveGearImageOffset.x, y + this.motorDriveGearImageOffset.y);
        if (this.motorIntermediateGearImage != undefined)
            this.motorIntermediateGearImage.setPosition(x + this.motorIntermediateGearImageOffset.x, y + this.motorIntermediateGearImageOffset.y);
        if (this.motorSpannerImage != undefined)
            this.motorSpannerImage.setPosition(x + this.motorSpannerImageOffset.x, y + this.motorSpannerImageOffset.y);
        if (this.resetButton != undefined)
            this.resetButton.setPosition(x, y + this.resetButtonYOffset);
    }

    onSwitchToggled (name, newToggleState) {

        if (this.resetButton != undefined) {
            this.resetButton.setVisible(false);
            this.isShorted = false;
            this.motorPawlClosedImage.setVisible(false);
            this.motorPawlOpenImage.setVisible(true);

            this.motorWheelSprocketBody.setAngularDamping(0);
            //this.resistorFixture.setDensity(this.density);
            this.motorWheelSprocketBody.resetMassData();

            this.motorWheelSprocketBody.setAwake(true);
            this.motorIntermediateGearBody.setAwake(true);
            this.motorDriveGearBody.setAwake(true);

        }
    }

    getPartExtents()
    {
        return {left: this.x - 184.352, right: this.x + 184.352, top: this.y - 164.444, bottom: this.y + 200};
    }

}
