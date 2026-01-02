import { PartBase } from './parts/partbase.js';

const multiplier = 2.842;
export class Chain
{
    connections = []; // In the format {part, level, cw/ccw}
    joints = []; // The first connection doesn't have any joints, but every connection after that has a joint between it and the previous connection.
    chainGraphics = null;
    scene = null; // The scene to draw the chain onto.
    isComplete = false;
    backTexture = null;
    backImage = null;
    textureName = '';
    chainLength = 0; // in mm

    LEVEL_ONE_COLOR = 'rgb(20,20,20)';
    LEVEL_TWO_COLOR = 'rgb(60,60,60)';
    LEVEL_THREE_COLOR = 'rgb(100,100,100)';
    LEVEL_FOUR_COLOR = 'rgb(130,130,130)';
    LEVEL_FIVE_COLOR = 'rgb(160,160,160)';

    LEVEL_ONE_COLOR_GO = 0x141414;
    LEVEL_TWO_COLOR_GO = 0x3C3C3C;
    LEVEL_THREE_COLOR_GO = 0x646464;
    LEVEL_FOUR_COLOR_GO = 0x828282;
    LEVEL_FIVE_COLOR_GO = 0xA0A0A0;

    pointerDownCallback = null;
    pointerMoveCallback = null;
    pointerOutCallback = null;

    constructor (scene)
    {
        this.scene = scene;
        let i = 0;
        do {
            this.textureName = 'chain-' + i.toString();
            i++;
        } while (scene.textures.exists(this.textureName));

        // Create an empty texture
        //this.chainGraphics = new Phaser.GameObjects.Graphics(scene);//scene.add.graphics();

        // For the final line drawn to the pointer:
        this.finalLineGraphics = scene.add.graphics();
        this.finalLineGraphics.setDepth(100);

        let width = this.scene.cameras.main.width > 0 ? this.scene.cameras.main.width : 10;
        let height = this.scene.cameras.main.height > 0 ? this.scene.cameras.main.height : 10;

        this.backTexture = scene.textures.createCanvas(this.textureName, width, height);
        //this.backTexture = scene.textures.createCanvas(this.textureName, this.mapWidth, this.mapHeight);

        // Grab the graphics context from the canvas. This is what we'll draw to.
        this.chainGraphics = this.backTexture.context;

        //this.backImage = scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY, this.textureName);
        this.backImage = scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY, this.textureName);
        this.backImage.setInteractive(scene.input.makePixelPerfect(1));
        this.backImage.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.backImage.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        this.backImage.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));
        this.backImage.setDepth(2);

        //this.chainGraphics.clearRect(0,0,1000,1000);
        //this.chainGraphics.strokeStyle = 0x111111;
        //this.chainGraphics.lineWidth = 10;
        //this.chainGraphics.strokeRect(100, 100, 100, 100);

    }

    setPointerDownCallback (callback, parentClass)
    {
        this.parentClass = parentClass;
        this.pointerDownCallback = callback;
    }

    setPointerMoveCallback (callback, parentClass)
    {
        this.parentClass = parentClass;
        this.pointerMoveCallback = callback;
    }

    setPointerOutCallback (callback, parentClass)
    {
        this.parentClass = parentClass;
        this.pointerOutCallback = callback;
    }

    setTintFill(color)
    {
        this.backImage.setTintFill(color);
    }

    clearTint()
    {
        this.backImage.clearTint();
    }

    onPointerDown(pointer, localx, localy, event)
    {

        if (this.pointerDownCallback != null)
            this.pointerDownCallback.bind(this.parentClass)(this, pointer);
        //event.stopPropagation();
    }

    onPointerMove(pointer, localx, localy, event)
    {
        //console.log('moved');
        //this.backImage.setTintFill(0xFF0000);
        //this.rTexture.snapshotPixel(pointer.x, pointer.y, this.onGotColor.bind(this));

        if (this.pointerMoveCallback != null)
            this.pointerMoveCallback.bind(this.parentClass)(this, pointer);
        //event.stopPropagation();
    }

    onPointerOut(pointer, event)
    {
        //this.backImage.clearTint();
        if (this.pointerOutCallback != null)
            this.pointerOutCallback.bind(this.parentClass)(this, pointer);
        //event.stopPropagation();
    }

    addConnection (part, level, cw)
    {
        this.connections.push({part: part, level: level, cw: cw});
        this.backImage.setDepth((level + 1) * 2);
        // Check if the chain is a complete loop now. If so, set isComplete to true and redraw.
    }

    closeChain ()
    {
        this.isComplete = true;
        this.redrawChainGraphics(null);
    }

    destroy ()
    {
        // Remove event listeners before destroying to prevent memory leaks
        this.backImage.off('pointerdown');
        this.backImage.off('pointermove');
        this.backImage.off('pointerout');

        this.backImage.destroy();
        this.finalLineGraphics.destroy();
        this.scene.textures.remove(this.textureName);
    }

    // Redraw this chain on our graphics object.
    // pointer is the current position {x, y} of the pointer.
    //
    redrawChainGraphics (pointer = null)
    {
        // Erase the previous contents.
        this.chainGraphics.clearRect(0,0,this.backTexture.width, this.backTexture.height);//-this.mapWidth/2, -this.mapHeight/2, this.mapWidth, this.mapHeight);
        this.finalLineGraphics.clear();

        this.chainLength = 0;

        // Step 1: Determine the size of the chain loop based on the sprockets it's connected to. Add a 10 px margin.
        // Step 2: Resize the canvas to the size of the chain loop
        // Step 3: Position the canvas in the correct place on the map.
        // Step 4: Draw the chain on the canvas.

        // Step 1: Determine the size of the chain loop based on the sprockets it's connected to.
        let canvasMinX = 99999999;
        let canvasMaxX = -99999999;
        let canvasMinY = 99999999;
        let canvasMaxY = -99999999;

        for (let i = 0; i < this.connections.length; i++)
        {
            let thisConnection = this.connections[i];
            let connectedPart = thisConnection.part;
            canvasMinX = Math.min(canvasMinX, (connectedPart.x + connectedPart.sprocketCenter[thisConnection.level].x) - connectedPart.sprocketRadius[thisConnection.level]);
            canvasMaxX = Math.max(canvasMaxX, (connectedPart.x + connectedPart.sprocketCenter[thisConnection.level].x) + connectedPart.sprocketRadius[thisConnection.level]);
            canvasMinY = Math.min(canvasMinY, (connectedPart.y + connectedPart.sprocketCenter[thisConnection.level].y) - connectedPart.sprocketRadius[thisConnection.level]);
            canvasMaxY = Math.max(canvasMaxY, (connectedPart.y + connectedPart.sprocketCenter[thisConnection.level].y) + connectedPart.sprocketRadius[thisConnection.level]);
        }

        // Add a 10 px margin.
        canvasMinX -= 10;
        canvasMaxX += 10;
        canvasMinY -= 10;
        canvasMaxY += 10;

        // Step 2: Resize the canvas to the size of the chain loop
        this.backTexture.setSize(canvasMaxX - canvasMinX, canvasMaxY - canvasMinY);
        //console.log('minX: ' + canvasMinX);
        //console.log('maxX: ' + canvasMaxX);
        //console.log('minY: ' + canvasMinY);
        //console.log('maxY: ' + canvasMaxY);
        this.backImage.setDisplaySize(canvasMaxX - canvasMinX, canvasMaxY - canvasMinY);
        // The following resets 0, 0 to the center of the Image.
        this.backImage.setTexture(this.textureName);

        // Step 3: Position the canvas in the correct place on the map.
        this.backImage.setPosition((canvasMaxX+canvasMinX)/2, (canvasMaxY+canvasMinY)/2);

        // Step 4: Draw the chain on the canvas.
        if (this.connections[0].level == 0) {
            this.chainGraphics.strokeStyle = this.LEVEL_ONE_COLOR;
            this.finalLineGraphics.lineStyle(10, this.LEVEL_ONE_COLOR_GO);
        } else if (this.connections[0].level == 1) {
            this.chainGraphics.strokeStyle = this.LEVEL_TWO_COLOR;
            this.finalLineGraphics.lineStyle(10, this.LEVEL_TWO_COLOR_GO);
        } else if (this.connections[0].level == 2) {
            this.chainGraphics.strokeStyle = this.LEVEL_THREE_COLOR;
            this.finalLineGraphics.lineStyle(10, this.LEVEL_THREE_COLOR_GO);
        } else if (this.connections[0].level == 3) {
            this.chainGraphics.strokeStyle = this.LEVEL_FOUR_COLOR;
            this.finalLineGraphics.lineStyle(10, this.LEVEL_FOUR_COLOR_GO);
        } else if (this.connections[0].level == 4) {
            this.chainGraphics.strokeStyle = this.LEVEL_FIVE_COLOR;
            this.finalLineGraphics.lineStyle(10, this.LEVEL_FIVE_COLOR_GO);
        }
        this.chainGraphics.lineWidth = 10;



        //this.chainGraphics.fillStyle = 'rgba(0, 0, 0, 0.5)';
        //this.chainGraphics.fillRect(-1000, -1000, 2000, 2000);//canvasMaxX-canvasMinX, canvasMaxY-canvasMinY);

        let lastConnection = this.connections[0];

        let lastLastTangentAngle = 0;
        let lastTangentAngle = 0;
        let thisTangentAngle = 0;
        let lastSprocketCenter;
        let lastSprocketRadius;
        let lastSprocketPoint;

        let thisSprocketCenter;
        let thisSprocketRadius;
        let thisSprocketPoint;

        let thisConnection;

        let firstTangentAngle = 0;

        // How many connections to draw?
        let numberConnectionsToDraw = this.connections.length;
        if (this.isComplete)
            numberConnectionsToDraw++;

        for (let i = 1; i < numberConnectionsToDraw; i++)
        {
            // 1. Draw a line tangent to the two sprockets.
            // 2. Draw an arc from the last point to the start of the line.

            // Step 1: Draw a line tangent to the two sprockets.

            // If it's the last iteration, put back in the first connection.
            if (i < this.connections.length)
                thisConnection = this.connections[i];
            else
                thisConnection = this.connections[0];

            // Find the line tangent to the sprocket of the final part.
            lastSprocketCenter = lastConnection.part.sprocketCenter[lastConnection.level];
            lastSprocketRadius = lastConnection.part.sprocketRadius[lastConnection.level];
            lastSprocketPoint = {x: (lastConnection.part.x + lastSprocketCenter.x), y: (lastConnection.part.y + lastSprocketCenter.y)};

            thisSprocketCenter = thisConnection.part.sprocketCenter[thisConnection.level];
            thisSprocketRadius = thisConnection.part.sprocketRadius[thisConnection.level];
            thisSprocketPoint = {x: (thisConnection.part.x + thisSprocketCenter.x), y: (thisConnection.part.y + thisSprocketCenter.y)};

            let distBetweenCenters = pythagorean(thisSprocketPoint.x - lastSprocketPoint.x, thisSprocketPoint.y - lastSprocketPoint.y);

            let yDiff = thisSprocketPoint.y - lastSprocketPoint.y;

            let lastTangentPoint = {x: 0, y: 0};
            let thisTangentPoint = {x: 0, y: 0};

            if (lastConnection.cw && thisConnection.cw) {
                let alpha = Math.asin(-yDiff / distBetweenCenters);
                let beta = Math.acos((lastSprocketRadius - thisSprocketRadius) / distBetweenCenters);

                // Clockwise connection
                if (thisSprocketPoint.x - lastSprocketPoint.x > 0) {
                    lastTangentPoint.x = lastSprocketPoint.x - (Math.cos(Math.PI - (beta + alpha)) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(Math.PI - (beta + alpha)) * lastSprocketRadius);
                    thisTangentPoint.x = thisSprocketPoint.x - (Math.cos(Math.PI - (beta + alpha)) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin(Math.PI - (beta + alpha)) * thisSprocketRadius);
                    lastTangentAngle = alpha + beta;
                    thisTangentAngle = alpha + beta;
                } else {
                    lastTangentPoint.x = lastSprocketPoint.x - (Math.cos((alpha - beta)) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(Math.PI - (alpha - beta)) * lastSprocketRadius);
                    thisTangentPoint.x = thisSprocketPoint.x - (Math.cos((alpha - beta)) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin(Math.PI - (alpha - beta)) * thisSprocketRadius);
                    lastTangentAngle = (Math.PI - alpha) + beta;
                    thisTangentAngle = (Math.PI - alpha) + beta;
                }
            }
            else if (lastConnection.cw == false && thisConnection.cw == false)
            {
                let alpha = Math.asin(-yDiff / distBetweenCenters);
                let beta = Math.acos((lastSprocketRadius - thisSprocketRadius) / distBetweenCenters);

                // Counterclockwise connection
                if (thisSprocketPoint.x - lastSprocketPoint.x > 0) {
                    lastTangentPoint.x = lastSprocketPoint.x + (Math.cos(alpha-beta) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(alpha-beta) * lastSprocketRadius);
                    thisTangentPoint.x = thisSprocketPoint.x + (Math.cos(alpha-beta) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin(alpha-beta) * thisSprocketRadius);
                    lastTangentAngle = alpha - beta;
                    thisTangentAngle = alpha - beta;
                } else {
                    lastTangentPoint.x = lastSprocketPoint.x + (Math.cos(Math.PI-(alpha+beta)) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(Math.PI-(alpha+beta)) * lastSprocketRadius);
                    thisTangentPoint.x = thisSprocketPoint.x + (Math.cos(Math.PI-(alpha+beta)) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin(Math.PI-(alpha+beta)) * thisSprocketRadius);
                    lastTangentAngle = Math.PI - (alpha + beta);
                    thisTangentAngle = Math.PI - (alpha + beta);
                }
            }
            else if (lastConnection.cw == true && thisConnection.cw == false)
            {
                let alpha = Math.asin(-yDiff / distBetweenCenters);
                let beta = Math.acos((lastSprocketRadius + thisSprocketRadius) / distBetweenCenters);

                if (thisSprocketPoint.x - lastSprocketPoint.x > 0) {
                    // Clockwise connection
                    lastTangentPoint.x = lastSprocketPoint.x - (Math.cos(Math.PI - (beta + alpha)) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(Math.PI - (beta + alpha)) * lastSprocketRadius);
                    // Counterclockwise connection
                    thisTangentPoint.x = thisSprocketPoint.x - (Math.cos(-(alpha+beta)) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin(-(alpha+beta)) * thisSprocketRadius);
                    lastTangentAngle = alpha + beta;
                    thisTangentAngle = Math.PI + alpha + beta;
                } else {
                    // Clockwise connection
                    lastTangentPoint.x = lastSprocketPoint.x - (Math.cos((alpha - beta)) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(Math.PI - (alpha - beta)) * lastSprocketRadius);
                    // Counterclockwise connection
                    thisTangentPoint.x = thisSprocketPoint.x + (Math.cos(-alpha + beta) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin(-alpha + beta) * thisSprocketRadius);
                    //console.log('alpha: '+Phaser.Math.RadToDeg(alpha)+' beta: '+Phaser.Math.RadToDeg(beta));
                    lastTangentAngle = (Math.PI - alpha) + beta;
                    thisTangentAngle = -alpha + beta;
                    //console.log('thisTangentAngle: '+Phaser.Math.RadToDeg(thisTangentAngle));
                }
            }
            else if (lastConnection.cw == false && thisConnection.cw == true)
            {
                let alpha = Math.asin(-yDiff / distBetweenCenters);
                let beta = Math.acos((lastSprocketRadius + thisSprocketRadius) / distBetweenCenters);

                if (thisSprocketPoint.x - lastSprocketPoint.x > 0) {
                    // Counterclockwise connection
                    lastTangentPoint.x = lastSprocketPoint.x + (Math.cos(alpha-beta) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(alpha-beta) * lastSprocketRadius);
                    // Clockwise connection
                    thisTangentPoint.x = thisSprocketPoint.x + (Math.cos((Math.PI + alpha) - beta) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin((Math.PI + alpha) - beta) * thisSprocketRadius);
                    lastTangentAngle = alpha - beta;
                    thisTangentAngle = (Math.PI + alpha) - beta;
                } else {
                    // Counterclockwise connection
                    lastTangentPoint.x = lastSprocketPoint.x + (Math.cos(Math.PI-(alpha+beta)) * lastSprocketRadius);
                    lastTangentPoint.y = lastSprocketPoint.y - (Math.sin(Math.PI-(alpha+beta)) * lastSprocketRadius);
                    // Clockwise connection
                    thisTangentPoint.x = thisSprocketPoint.x + (Math.cos(-(alpha + beta)) * thisSprocketRadius);
                    thisTangentPoint.y = thisSprocketPoint.y - (Math.sin(-(alpha + beta)) * thisSprocketRadius);
                    lastTangentAngle = Math.PI - (alpha + beta);
                    thisTangentAngle = -(alpha + beta);
                }
            }

            this.chainGraphics.beginPath();
            this.chainGraphics.moveTo(lastTangentPoint.x - canvasMinX, lastTangentPoint.y - canvasMinY);
            this.chainGraphics.lineTo(thisTangentPoint.x - canvasMinX, thisTangentPoint.y - canvasMinY);
            this.chainGraphics.stroke();

            this.chainLength += (1/multiplier)*Math.sqrt(Math.pow(lastTangentPoint.x - thisTangentPoint.x, 2) + Math.pow(lastTangentPoint.y - thisTangentPoint.y, 2));

            //this.chainGraphics.strokeLineShape({x1: lastTangentPoint.x, y1: lastTangentPoint.y, x2: thisTangentPoint.x, y2: thisTangentPoint.y});

            // Step 2: Draw an arc connecting the last last point to the last point.
            if (i > 1) // We don't draw an arc before the very first line.
            {
                // We'll draw the arc between lastLastTangentAngle and lastTangentAngle
                this.chainGraphics.beginPath();
                this.chainGraphics.arc(lastSprocketPoint.x - canvasMinX, lastSprocketPoint.y - canvasMinY, lastSprocketRadius, -lastLastTangentAngle, -lastTangentAngle, !lastConnection.cw);
                this.chainGraphics.stroke();

                this.chainLength += (1/multiplier)*arcLength(lastSprocketRadius, -lastLastTangentAngle, -lastTangentAngle, !lastConnection.cw);

                //this.chainGraphics.beginPath();
                //this.chainGraphics.arc(lastSprocketPoint.x, lastSprocketPoint.y, lastSprocketRadius, -lastLastTangentAngle, -lastTangentAngle, !lastConnection.cw);
                //this.chainGraphics.strokePath();
            }

            // Save the very first angle so we can connect to it when we close up the loop at the end.
            if (i == 1)
                firstTangentAngle = lastTangentAngle;

            lastLastTangentAngle = thisTangentAngle;

            lastConnection = thisConnection;
        }

        if (this.isComplete)
        {
            // This chain is complete.
            // 1. Draw an arc on the sprocket after the final line.
            this.chainGraphics.beginPath();
            this.chainGraphics.arc(thisSprocketPoint.x - canvasMinX, thisSprocketPoint.y - canvasMinY, thisSprocketRadius, -thisTangentAngle, -firstTangentAngle, !thisConnection.cw);
            this.chainGraphics.stroke();

            this.chainLength += (1/multiplier)*arcLength(thisSprocketRadius, -thisTangentAngle, -firstTangentAngle, !thisConnection.cw);
            //this.chainGraphics.beginPath();
            //this.chainGraphics.arc(thisSprocketPoint.x, thisSprocketPoint.y, thisSprocketRadius, -thisTangentAngle, -firstTangentAngle, !thisConnection.cw);
            //this.chainGraphics.strokePath();
        }
        else
        {
            // This chain is incomplete.
            // 1. Draw a line to the pointer.
            // 2. Draw an arc from the last line (lastLastTangentAngle) to this line (if this isn't the very first connection).

            // Step 1: Draw a line to the pointer.
            if (pointer != null) {

                // Grab the final connection
                let finalConnection = this.connections[this.connections.length - 1];

                // Find the line tangent to the sprocket of the final part.
                let sprocketCenter = finalConnection.part.sprocketCenter[finalConnection.level];
                let sprocketRadius = finalConnection.part.sprocketRadius[finalConnection.level];

                let distBetweenCenterAndPointer = pythagorean((finalConnection.part.x + sprocketCenter.x) - pointer.x, (finalConnection.part.y + sprocketCenter.y) - pointer.y);

                let yDiff = pointer.y - (finalConnection.part.y + sprocketCenter.y);

                let tangentPointX;
                let tangentPointY;

                if (finalConnection.cw) {
                    let alpha = Math.asin(-yDiff / distBetweenCenterAndPointer);
                    let beta = Math.acos(sprocketRadius / distBetweenCenterAndPointer);

                    // Clockwise connection
                    if (pointer.x - (finalConnection.part.x + sprocketCenter.x) > 0) {
                        tangentPointX = (finalConnection.part.x + sprocketCenter.x) - (Math.cos(Math.PI - (beta + alpha)) * sprocketRadius);
                        tangentPointY = (finalConnection.part.y + sprocketCenter.y) - (Math.sin(Math.PI - (beta + alpha)) * sprocketRadius);
                        lastTangentAngle = alpha + beta;
                    } else {
                        tangentPointX = (finalConnection.part.x + sprocketCenter.x) - (Math.cos((alpha - beta)) * sprocketRadius);
                        tangentPointY = (finalConnection.part.y + sprocketCenter.y) - (Math.sin(Math.PI - (alpha - beta)) * sprocketRadius);
                        lastTangentAngle = (Math.PI - alpha) + beta;
                    }
                } else {
                    let alpha = Math.asin(-yDiff / distBetweenCenterAndPointer);
                    let beta = Math.acos(sprocketRadius / distBetweenCenterAndPointer);

                    // Counterclockwise connection
                    if (pointer.x - (finalConnection.part.x + sprocketCenter.x) > 0) {
                        tangentPointX = (finalConnection.part.x + sprocketCenter.x) + (Math.cos(alpha - beta) * sprocketRadius);
                        tangentPointY = (finalConnection.part.y + sprocketCenter.y) - (Math.sin(alpha - beta) * sprocketRadius);
                        lastTangentAngle = alpha - beta;
                    } else {
                        tangentPointX = (finalConnection.part.x + sprocketCenter.x) + (Math.cos(Math.PI - (alpha + beta)) * sprocketRadius);
                        tangentPointY = (finalConnection.part.y + sprocketCenter.y) - (Math.sin(Math.PI - (alpha + beta)) * sprocketRadius);
                        lastTangentAngle = Math.PI - (alpha + beta);
                    }
                }
                this.finalLineGraphics.beginPath();
                this.finalLineGraphics.moveTo(tangentPointX, tangentPointY);
                this.finalLineGraphics.lineTo(pointer.x, pointer.y);
                this.finalLineGraphics.strokePath();

                this.chainLength += (1/multiplier)*(Math.sqrt(Math.pow(tangentPointX - pointer.x, 2) + Math.pow(tangentPointY - pointer.y, 2)));

                /*this.chainGraphics.beginPath();
                this.chainGraphics.moveTo(tangentPointX, tangentPointY);
                this.chainGraphics.lineTo(pointer.x, pointer.y);
                this.chainGraphics.stroke();*/

                /*this.chainGraphics.strokeLineShape({
                    x1: tangentPointX,
                    y1: tangentPointY,
                    x2: pointer.x,
                    y2: pointer.y
                });*/

                // Step 2: Now draw the arc from the end of the last line to the start of this line.
                if (this.connections.length > 1) {
                    this.chainGraphics.beginPath();
                    this.chainGraphics.arc((finalConnection.part.x + sprocketCenter.x) - canvasMinX, (finalConnection.part.y + sprocketCenter.y) - canvasMinY, sprocketRadius, -thisTangentAngle, -lastTangentAngle, !finalConnection.cw);
                    this.chainGraphics.stroke();

                    this.chainLength += (1/multiplier)*arcLength(sprocketRadius, -thisTangentAngle, -lastTangentAngle, !finalConnection.cw);

                    //this.chainGraphics.beginPath();
                    //this.chainGraphics.arc(finalConnection.part.x + sprocketCenter.x, finalConnection.part.y + sprocketCenter.y, sprocketRadius, -thisTangentAngle, -lastTangentAngle, !finalConnection.cw);
                    //this.chainGraphics.strokePath();
                }
            }
        }

        // Now make an image that we can use to test if our cursor is on the chain.

        //this.scene.textures.remove('chain');
        // Create a clear graphics object;
//        let emptyGraphics = this.scene.add.graphics();
//        emptyGraphics.generateTexture('chain', this.scene.cameras.main.width, this.scene.cameras.main.height);

        /*
        this.rTexture.clear();
        this.rTexture.draw(this.chainGraphics);
        */
        this.backImage.setDepth((this.connections[0].level+1)*3);
        this.backTexture.refresh();

        //this.rTexture.fill(0x000000,1,0,0,600,600);
        //this.scene.textures.remove('chain');
        //this.rTexture.saveTexture('chain');
        //this.rTexture.setInteractive();
        //this.rTexture.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        //this.rTexture.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        //this.rTexture.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));

//        this.rTexture.setVisible(false);
        //this.chainGraphics.generateTexture('chain', this.scene.cameras.main.width, this.scene.cameras.main.height);
        //.hitTexture.destroy(true, true);
        //this.hitTexture = this.scene.add.image(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, 'chain');
/*        if (pointer == null) {
            this.scene.textures.remove('chain');
            this.chainGraphics.generateTexture('chain', this.scene.cameras.main.width, this.scene.cameras.main.height);
            this.hitTexture.setTexture('chain');
            this.hitTexture.setInteractive(this.scene.input.makePixelPerfect(1));
        }*/
        //this.hitTexture.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        //this.hitTexture.on('pointermove', (pointer, localx, localy, event) => this.onPointerMove(pointer, localx, localy, event));
        //this.hitTexture.on('pointerout', (pointer, event) => this.onPointerOut(pointer, event));

//        this.hitTexture.setTexture('chain');
//        this.hitTexture.clearTint();
        //this.hitTexture.setTintFill(0xFF0000);
//        this.hitTexture.setInteractive(this.scene.input.makePixelPerfect(1));
    }

}

function pythagorean (side1, side2)
{
    return Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2));
}

// in radians
function arcLength (radius, startAngle, endAngle, anticlockwise)
{
    let circumference = radius * 2 * Math.PI;
    let radianChange = 0;
    if (!anticlockwise)
    {
        if (endAngle >= startAngle)
        {
            radianChange = endAngle - startAngle;
        }
        else
            radianChange = (endAngle + Math.PI*2) - startAngle; //
    }
    else
    {
        if (startAngle > endAngle)
        {
            radianChange = startAngle - endAngle;
        }
        else
            radianChange = (startAngle + Math.PI*2) - endAngle;
    }

    return Math.abs((radianChange / (Math.PI * 2)) * (radius * 2 * Math.PI));
}