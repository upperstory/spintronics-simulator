export class PartBase extends Phaser.GameObjects.Container
{
    // Different parts will have different center points. So you can't load the PartBase base class by itself.

    constructor(scene, x, y, planckWorld)
    {
        super(scene, x, y);
        // Add this container to the scene
        scene.add.existing(this);
        this.world = planckWorld;
    }

    world = null;
    partWidth = 0;
    partHeight = 0;
    partCenterX = 0;
    partCenterY = 0;
    partType = 'undefined';
    partImage;
    pointerDownCallback = null;
    pointerMoveCallback = null;
    pointerOutCallback = null;
    dragStartCallback = null;
    dragCallback = null;
    dragEndCallback = null;

    sprocketBodies = [];
    sprocketJoints = [];
    sprocketPhysicsRadius = [];
    sprocketCenter = [{x: 0, y: 0}];
    sprocketRadius = [100];
    sprocketExists = [false];
    parentClass = null;

    serialize()
    {
        let partObject = {
            type: this.partType,
            x: this.x,
            y: this.y
        }
        return partObject;
    }

    // Starts as an empty function
    changePartProperty ()
    {

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

    setDragStartCallback (callback, parentClass)
    {
        this.parentClass = parentClass;
        this.dragStartCallback = callback;
    }

    setDragCallback (callback, parentClass)
    {
        this.parentClass = parentClass;
        this.dragCallback = callback;
    }

    setDragEndCallback (callback, parentClass)
    {
        this.parentClass = parentClass;
        this.dragEndCallback = callback;
    }

    getXYPoint(gridSpacing)
    {
        var XYPoint = {x: (partCenterX * gridSpacing * 2/Math.sqrt(2)) - ((partCenterY * gridSpacing) / Math.sqrt(2)), y: partCenterY * gridSpacing};
        return XYPoint;
    }

    onPointerDown(pointer, localx, localy, event)
    {
        if (this.pointerDownCallback != null)
            this.pointerDownCallback.bind(this.parentClass)(this, pointer);
        //event.stopPropagation();
    }

    onPointerMove(pointer, localx, localy, event)
    {
        if (this.pointerMoveCallback != null)
            this.pointerMoveCallback.bind(this.parentClass)(this, pointer);
        //event.stopPropagation();
    }

    onPointerOut(pointer, event)
    {
        if (this.pointerOutCallback != null)
            this.pointerOutCallback.bind(this.parentClass)(this, pointer);
        //event.stopPropagation();
    }

    onDragStart(pointer, dragX, dragY, physicsBody)
    {
        if (this.dragStartCallback != null)
            this.dragStartCallback.bind(this.parentClass)(this, pointer, dragX, dragY, physicsBody);
    }

    onDrag(pointer, dragX, dragY, physicsBody)
    {
        if (this.dragCallback != null)
            this.dragCallback.bind(this.parentClass)(this, pointer, dragX, dragY, physicsBody);
    }

    onDragEnd(pointer, dragX, dragY, physicsBody)
    {
        if (this.dragEndCallback != null)
            this.dragEndCallback.bind(this.parentClass)(this, pointer, dragX, dragY, physicsBody);
    }

    setPartTint(color)
    {

    }

    clearPartTint()
    {

    }

    static getSnapPosition(pointer, gridSpacing)
    {
        // Find the nearest four points and snap to nearest one
        var snapPoint = {x: 0, y: 0};
        var snapIndex = {x: 0, y: 0};

        // Start with x
        // Find the closest vertical line
        var xRawLineIndex = pointer.x / gridSpacing;
        var xClosestLineIndex = Math.round(xRawLineIndex);
        var xMinLineIndex = Math.floor(xRawLineIndex);
        var xMaxLineIndex = Math.ceil(xRawLineIndex);

        // Now do y

        // Which 30 deg line is it closest to.
        var yPosOnLine = (pointer.y + (pointer.x / Math.sqrt(3))) / (gridSpacing*(2/Math.sqrt(3)));
        var yClosestLineIndex = Math.round(yPosOnLine);
        var yMinLineIndex = Math.floor(yPosOnLine);
        var yMaxLineIndex = Math.ceil(yPosOnLine);

        // Now grab each of the 4 points
        var topleft = {x: xMinLineIndex * gridSpacing, y: (yMinLineIndex * gridSpacing * 2/Math.sqrt(3)) - ((xMinLineIndex * gridSpacing) / Math.sqrt(3))};
        var topright = {x: xMinLineIndex * gridSpacing, y: (yMaxLineIndex * gridSpacing * 2/Math.sqrt(3)) - ((xMinLineIndex * gridSpacing) / Math.sqrt(3))};
        var bottomleft = {x: xMaxLineIndex * gridSpacing, y: (yMinLineIndex * gridSpacing * 2/Math.sqrt(3)) - ((xMaxLineIndex * gridSpacing) / Math.sqrt(3))};
        var bottomright = {x: xMaxLineIndex * gridSpacing, y: (yMaxLineIndex * gridSpacing * 2/Math.sqrt(3)) - ((xMaxLineIndex * gridSpacing) / Math.sqrt(3))};

        // Calculate the distance to each point
        var topleftdist = Math.sqrt(Math.pow(pointer.x - topleft.x, 2) + Math.pow(pointer.y - topleft.y, 2));
        var toprightdist = Math.sqrt(Math.pow(pointer.x - topright.x, 2) + Math.pow(pointer.y - topright.y, 2));
        var bottomleftdist = Math.sqrt(Math.pow(pointer.x - bottomleft.x, 2) + Math.pow(pointer.y - bottomleft.y, 2));
        var bottomrightdist = Math.sqrt(Math.pow(pointer.x - bottomright.x, 2) + Math.pow(pointer.y - bottomright.y, 2));
        //console.log("topleft: " + topleftdist + ", topright: " + toprightdist + ", bottomleft: " + bottomleftdist + ", bottomright: " + bottomrightdist)

        var mindist = Math.min(topleftdist, toprightdist, bottomleftdist, bottomrightdist);

        if (mindist === topleftdist)
        {
            snapPoint = topleft;
            snapIndex.x = xMinLineIndex;
            snapIndex.y = yMinLineIndex;
        }
        else if (mindist === toprightdist)
        {
            snapPoint = topright;
            snapIndex.x = xMaxLineIndex;
            snapIndex.y = yMinLineIndex;
        }
        else if (mindist === bottomleftdist)
        {
            snapPoint = bottomleft;
            snapIndex.x = xMinLineIndex;
            snapIndex.y = yMaxLineIndex;
        }
        else
        {
            snapPoint = bottomright;
            snapIndex.x = xMaxLineIndex;
            snapIndex.y = yMaxLineIndex;
        }

        return {snapPoint, snapIndex};
    }

    static getSnapPositionOld(pointer, gridSpacing)
    {
        // Find the nearest four points and snap to nearest one
        var snapPoint = {x: 0, y: 0};
        var snapIndex = {x: 0, y: 0};

        // Start with y
        var yRawLineIndex = pointer.y / gridSpacing;
        var yClosestLineIndex = Math.round(yRawLineIndex);
        var yMinLineIndex = Math.floor(yRawLineIndex);
        var yMaxLineIndex = Math.ceil(yRawLineIndex);

        // Now do x
        // Think of origin lines starting from 0,0 origin. Which line is it closest to?
        var xPosOnLine = (pointer.x + (pointer.y / Math.sqrt(2))) / (gridSpacing*(2/Math.sqrt(2)));
        var xClosestLineIndex = Math.round(xPosOnLine);
        var xMinLineIndex = Math.floor(xPosOnLine);
        var xMaxLineIndex = Math.ceil(xPosOnLine);

        // Now grab each of the 4 points
        var topleft = {x: (xMinLineIndex * gridSpacing * 2/Math.sqrt(2)) - ((yMinLineIndex * gridSpacing) / Math.sqrt(2)), y: yMinLineIndex * gridSpacing};
        var topright = {x: (xMaxLineIndex * gridSpacing * 2/Math.sqrt(2)) - ((yMinLineIndex * gridSpacing) / Math.sqrt(2)), y: yMinLineIndex * gridSpacing};
        var bottomleft = {x: (xMinLineIndex * gridSpacing * 2/Math.sqrt(2)) - ((yMaxLineIndex * gridSpacing) / Math.sqrt(2)), y: yMaxLineIndex * gridSpacing};
        var bottomright = {x: (xMaxLineIndex * gridSpacing * 2/Math.sqrt(2)) - ((yMaxLineIndex * gridSpacing) / Math.sqrt(2)), y: yMaxLineIndex * gridSpacing};

        // Calculate the distance to each point
        var topleftdist = Math.sqrt(Math.pow(pointer.x - topleft.x, 2) + Math.pow(pointer.y - topleft.y, 2));
        var toprightdist = Math.sqrt(Math.pow(pointer.x - topright.x, 2) + Math.pow(pointer.y - topright.y, 2));
        var bottomleftdist = Math.sqrt(Math.pow(pointer.x - bottomleft.x, 2) + Math.pow(pointer.y - bottomleft.y, 2));
        var bottomrightdist = Math.sqrt(Math.pow(pointer.x - bottomright.x, 2) + Math.pow(pointer.y - bottomright.y, 2));
        //console.log("topleft: " + topleftdist + ", topright: " + toprightdist + ", bottomleft: " + bottomleftdist + ", bottomright: " + bottomrightdist)

        var mindist = Math.min(topleftdist, toprightdist, bottomleftdist, bottomrightdist);

        if (mindist == topleftdist)
        {
            snapPoint = topleft;
            snapIndex.x = xMinLineIndex;
            snapIndex.y = yMinLineIndex;
        }
        else if (mindist == toprightdist)
        {
            snapPoint = topright;
            snapIndex.x = xMaxLineIndex;
            snapIndex.y = yMinLineIndex;
        }
        else if (mindist == bottomleftdist)
        {
            snapPoint = bottomleft;
            snapIndex.x = xMinLineIndex;
            snapIndex.y = yMaxLineIndex;
        }
        else
        {
            snapPoint = bottomright;
            snapIndex.x = xMaxLineIndex;
            snapIndex.y = yMaxLineIndex;
        }

        return {snapPoint, snapIndex};
    }

    // Gets the image offset from the center of the image to the sprocket center.
    static getPartImageOffsets(partType)
    {
        let retVal = {x: 0, y: 0};
        if (partType === 'motor')
        {
            retVal.x = 0;//-75/2;
            retVal.y = -20.5;//-216/2 + 95;
        }
        else if (partType === 'phonograph')
        {
            retVal.x = 2;//-39/2;
            retVal.y = -16.5;//-13/2;
        }
        return retVal;
    }

    updatePhysics()
    {

    }

    // Returns the extent of the part - from the center of the image to the edge of the part - in each direction.
    // {left, right, top, bottom}
    getPartExtents()
    {
        if (partType === 'undefined')
            return null;

        return {left: this.x, right: this.x, top: this.y, bottom: this.y};
    }
}