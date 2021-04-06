import { PartBase } from './partbase.js';
import {worldScale} from '../constants.js';

const resistorRadius = 0.041168 / 2;

export class ResistorPart extends PartBase
{
    static possibleResistorValues = [100, 200, 500, 1000, 2000, 20, 50];

    constructor (scene, x, y, planckWorld)
    {
        super(scene, x, y, planckWorld);
        this.partType = 'resistor';

        // Set the starting resistance
        this.resistance = 1000; // 1000 ohms default

        // Create the resistor image
        this.partImage = scene.add.image(this.x, this.y,'resistor');
        this.partImage.setScale(0.5);
        this.partImage.setDepth(8);
        //this.add(this.partImage);

        this.partWidth = this.partImage.displayWidth;
        this.partHeight = this.partImage.displayHeight;
        //this.setSize(this.partWidth, this.partHeight);

        //this.partCenterX = this.partWidth / 2;
        //this.partCenterY = this.partHeight / 2;

        // Set the listeners
        this.partImage.setInteractive({
            draggable: true,
            pixelPerfect: true,
            alphaTolerance: 1
        });

        // Define the positions of the sprockets.
        this.sprocketCenter[0] = {x: 0, y: 0};
        this.sprocketRadius[0] = 117/2;
        this.sprocketExists[0] = true;
        this.sprocketPhysicsRadius[0] = 0.041168 / 2; // in m
        this.sprocketCenter[1] = {x: 0, y: 0};
        this.sprocketRadius[1] = 117/2;
        this.sprocketExists[1] = true;
        this.sprocketPhysicsRadius[1] = 0.041168 / 2; // in m
        this.sprocketCenter[2] = {x: 0, y: 0};
        this.sprocketRadius[2] = 117/2;
        this.sprocketExists[2] = true;
        this.sprocketPhysicsRadius[2] = 0.041168 / 2; // in m

        // Create bodies and fixtures for Planck world

        // Create a rigid ground body
        this.ground = this.world.createBody();
        //this.ground.createFixture(planck.Edge(planck.Vec2(50.0, 0.0), planck.Vec2(-50.0, 0.0)),{density: 0.1, filterGroupIndex: -1});

        this.resistorBody = this.world.createDynamicBody({position: planck.Vec2(0,0), angularDamping: 0});//this.resistance / 100});
        this.resistorFixture = this.resistorBody.createFixture(planck.Circle(resistorRadius), {density: 10, filterGroupIndex: -1, friction: 0});
        this.sprocketBodies[0] = this.resistorBody;
        this.sprocketBodies[1] = this.resistorBody;
        this.sprocketBodies[2] = this.resistorBody;

        //this.frictionBody = this.world.createBody({position: planck.Vec2(this.x / worldScale, this.y / worldScale)});
        //this.frictionBody.createFixture(planck.Circle(resistorRadius), {density: 1, filterGroupIndex: -1, friction: 0.3});

        this.resistorJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.resistorBody, this.resistorBody.getPosition()));
        this.sprocketJoints[0] = this.resistorJoint;
        this.sprocketJoints[1] = this.resistorJoint;
        this.sprocketJoints[2] = this.resistorJoint;

       // this.frictionRevoluteJoint = this.world.createJoint(planck.RevoluteJoint({}, this.ground, this.frictionBody, this.frictionBody.getPosition()));
        //this.frictionBody.setStatic();

        //this.frictionJoint = this.world.createJoint(planck.FrictionJoint({maxTorque: .00003, maxForce: 0.0005}, this.resistorBody, this.ground));//this.resistorBody.getPosition()));

        this.partImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.partImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.partImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.partImage.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY, this.resistorBody));
        this.partImage.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY, this.resistorBody));
        this.partImage.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY, this.resistorBody));

        this.resistorBody.applyAngularImpulse(0.000001);

        // Create the text that shows the resistor value
        /*this.resistanceText = scene.add.text(Math.round(58), Math.round(-83), this.getResistanceString(), {
            font: '20px Roboto',
            fontSize: '50px',
            color: "rgb(20, 20, 20)",
            fontStyle: 'strong'
        });
        this.add(this.resistanceText);*/


        // Draw a line to the resistor
        //this.textLine = new Phaser.Curves.Path(48, -50);
        //this.textLine.splineTo([50, -55, 54, -57, 56, -62]);
        //this.graphics = scene.add.graphics();
        //this.add(this.graphics);
        //this.graphics.lineStyle(2, 0x111111, 1);
        //this.textLine.draw(this.graphics);

        this.setResistance(3);
        //this.graphics.setVisible(false);
        //this.resistanceText.setVisible(false);
    }

    //averageAngularVelocity = 0;
    //numPointsToAverage = 1;
    // With higher resistance, we'll need higher angular damping AND higher density.
    // Let's keep the angular damping/density ratio the same all the time.
    //

    kFactor = 0;
    angularDamping = 0;
    density = 0;

    /*setResistance(resistance)
    {

    }*/

    updatePhysics()
    {
        //this.partImage.x = this.resistorBody.getPosition().x * worldScale;
        //this.partImage.y = this.resistorBody.getPosition().y * worldScale;
        this.partImage.rotation = this.resistorBody.getAngle();

        //let BaseResistance = 13000*0.0000000003; // in ohms
        // update averageAngularVelocity
        //this.averageAngularVelocity = (1/this.numPointsToAverage)*this.resistorBody.getAngularVelocity() + ((this.numPointsToAverage-1)/this.numPointsToAverage)*this.averageAngularVelocity;
        //console.log(this.resistorBody.getAngularVelocity());
        // Apply reverse force from resistance
        //console.log(this.resistorBody.getAngularVelocity() * this.kFactor);
        //this.resistorBody.applyTorque(-this.resistorBody.getAngularVelocity() * this.kFactor);
    }

    getResistanceString()
    {
        let resistanceString = "";
        if (this.resistance < 1000)
        {
            resistanceString = this.resistance.toString() + " Ω";
        }
        if (this.resistance >= 1000 && this.resistance < 1000000)
        {
            resistanceString = (this.resistance / 1000).toString() + " kΩ";
        }
        else if (this.resistance >= 1000000)
        {
            resistanceString = (this.resistance / 1000000).toString() + " MΩ";
        }
        return resistanceString;
    }

    setResistance(index)
    {
        this.resistance = ResistorPart.possibleResistorValues[index];
        //this.resistanceText.setText(this.getResistanceString());

        if (index == 0)
            this.partImage.setTexture('resistor-100');
        else if (index == 1)
            this.partImage.setTexture('resistor-200');
        else if (index == 2)
            this.partImage.setTexture('resistor-500');
        else if (index == 3)
            this.partImage.setTexture('resistor-1000');
        else if (index == 4)
            this.partImage.setTexture('resistor-2000');
        else if (index == 5)
            this.partImage.setTexture('resistor-20');
        else if (index == 6)
            this.partImage.setTexture('resistor-50');

        let dampingRatio = 100;
        this.angularDamping = this.resistance / 5;
        this.density = this.angularDamping / dampingRatio;
        //this.kFactor = this.resistance * 0.0000003;
        this.resistorBody.setAngularDamping(this.angularDamping);
        this.resistorFixture.setDensity(this.density);
        this.resistorBody.resetMassData();
        /*console.log("angular damping: "+this.resistorBody.getAngularDamping());
        console.log("density: "+this.resistorFixture.getDensity());
        console.log("kFactor: "+this.kFactor);*/
        //this.resistorBody.setAngularDamping(this.resistance / 100);
    }

    // Override with new behavior
    changePartProperty()
    {
        let currentIndex = ResistorPart.possibleResistorValues.indexOf(this.resistance);
        currentIndex++;
        if (currentIndex >= ResistorPart.possibleResistorValues.length)
            currentIndex = 0;
        this.setResistance(currentIndex);
    }

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y,
            value: this.resistance
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
            this.partImage.setPosition(x, y);
    }

    destroy()
    {
        this.partImage.destroy();
        //this.resistanceText.destroy();
        //this.textLine.destroy();
        //this.graphics.destroy();
        this.world.destroyBody(this.resistorBody);
        this.world.destroyBody(this.ground);
    }
}
