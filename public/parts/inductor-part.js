import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';
const inductorSprocketRadius = 0.025771 / 2;

export class InductorPart extends PartBase
{
    static possibleInductanceValues = [.01, .02, .05, .1, .2, .5, 1, 2, 5, 10, 20, 50, 100, 200, 500];

    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'inductor';
        this.hasChainConnection = 'open';
        this.partImage = scene.add.image(this.x, this.y,'inductor-weights');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(10);

        // this.partWidth = this.partImage.displayWidth;
        // this.partHeight = this.partImage.displayHeight;

        this.inductorBaseImage = scene.add.image(this.x, this.y,'inductor-base');
        this.inductorBaseImage.setScale(0.5);
        this.inductorBaseImage.setDepth(16);

        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });
        this.inductorBaseImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 70/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = inductorSprocketRadius; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 70/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = inductorSprocketRadius; // in m
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 70/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = inductorSprocketRadius; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();
        //this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)),{density: 0.1, filterGroupIndex: -1});

        this.inductorBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0.5});
        this.inductorFixture = this.inductorBody.createFixture(planck.Circle(inductorSprocketRadius), {density: 1, filterGroupIndex: -1, friction: 0});
        this.sprocketBodies[0] = this.inductorBody;
        this.sprocketBodies[1] = this.inductorBody;
        this.sprocketBodies[2] = this.inductorBody;

        //this.frictionBody = this.world.createBody({position: planck.Vec2(this.x / worldScale, this.y / worldScale)});
        //this.frictionBody.createFixture(planck.Circle(resistorRadius), {density: 1, filterGroupIndex: -1, friction: 0.3});

        this.inductorJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.inductorBody, this.inductorBody.getPosition()));
        this.sprocketJoints[0] = this.inductorJoint;
        this.sprocketJoints[1] = this.inductorJoint;
        this.sprocketJoints[2] = this.inductorJoint;

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.inductorBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.inductorBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.inductorBody));

        this.inductorBaseImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.inductorBaseImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.inductorBaseImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.inductorBaseImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
        this.inductorBaseImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
        this.inductorBaseImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        // Set the starting inductance
        this.inductance = 50; // 50 H default

        // Create the text that shows the inductance value
        let textPos = {x: 58, y: -120};
        this.inductanceText = scene.add.text(textPos.x+10, textPos.y-33, this.getInductanceString(), {
            font: '20px Roboto',
            fontSize: '50px',
            color: "rgb(20, 20, 20)",
            fontStyle: 'strong'
        });
        this.inductanceText.setDepth(16);
        this.add(this.inductanceText);

        // Draw a line to the inductor
        this.textLine = new Phaser.Curves.Path(textPos.x, textPos.y);
        this.textLine.splineTo([textPos.x+2, textPos.y-5, textPos.x+6, textPos.y-7, textPos.x+8, textPos.y-12]);
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(16);
        this.add(this.graphics);

        this.graphics.lineStyle(2, 0x111111, 1);
        this.textLine.draw(this.graphics);

        this.setInductance(11);
        //this.start = Date.now();
    }

    updatePhysics()
    {
        //this.partImage.x = this.inductorBody.getPosition().x * worldScale;
        //this.partImage.y = this.inductorBody.getPosition().y * worldScale;
        this.partImage.rotation = this.inductorBody.getAngle();

        //let BaseResistance = 13000*0.0000000003; // in ohms
        // update averageAngularVelocity
        //this.averageAngularVelocity = (1/this.numPointsToAverage)*this.resistorBody.getAngularVelocity() + ((this.numPointsToAverage-1)/this.numPointsToAverage)*this.averageAngularVelocity;

        //let millis = Date.now() - this.start;
        //console.log(this.inductorBody.getAngularVelocity() / (Math.PI));
        //console.log(millis);

        // Apply reverse force from resistance
        //console.log(this.resistorBody.getAngularVelocity() * this.kFactor);
        //this.resistorBody.applyTorque(-this.resistorBody.getAngularVelocity() * this.kFactor);
    }

    getInductanceString()
    {
        let inductanceString = "";

        if (this.inductance < 0.001)
        {
            inductanceString = (this.inductance * 1000000).toString() + " μH";
        }
        if (this.inductance >= 0.001 && this.inductance < 1)
        {
            inductanceString = (this.inductance * 1000).toString() + " mH";
        }
        if (this.inductance >= 1 && this.inductance < 1000)
        {
            inductanceString = (this.inductance * 1).toString() + " H";
        }
        else if (this.inductance >= 1000)
        {
            inductanceString = (this.inductance / 1000).toString() + " kH";
        }
        return inductanceString;
    }

    setInductance(index)
    {
        this.inductance = InductorPart.possibleInductanceValues[index];
        this.inductanceText.setText(this.getInductanceString());

        this.inductorFixture.setDensity(this.inductance*(4.43/14.4456));

        this.inductorBody.resetMassData();
    }

    // Override with new behavior
    changePartProperty()
    {
        let currentIndex = InductorPart.possibleInductanceValues.indexOf(this.inductance);
        currentIndex++;
        if (currentIndex >= InductorPart.possibleInductanceValues.length)
            currentIndex = 0;
        this.setInductance(currentIndex);
    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            value: this.inductance
        }
        return partObject;
    }

    setPartTint(color)
    {
        this.partImage.setTint(color);
        this.inductorBaseImage.setTint(color);
    }

    clearPartTint()
    {
        this.partImage.clearTint();
        this.inductorBaseImage.clearTint();
    }

    setPosition(x, y)
    {
        this.x = x;
        this.y = y;
        if (this.partImage != undefined)
            this.partImage.setPosition(x, y);
        if (this.inductorBaseImage != undefined)
            this.inductorBaseImage.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        this.inductorBaseImage.destroy();
        this.inductanceText.destroy();
        this.textLine.destroy();
        this.graphics.destroy();
        this.world.destroyBody(this.inductorBody);
        this.world.destroyBody(this.ground);
    }

    getPartExtents()
    {
        return {left: this.x - 124.752, right: this.x + 124.752, top: this.y - 124.752, bottom: this.y + 124.752};
    }
}