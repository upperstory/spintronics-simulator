import { PartBase } from './parts/partbase.js';
import { JunctionPart } from './parts/junction-part.js';
import { ButtonPart } from './parts/button-part.js';
import { InductorPart } from './parts/inductor-part.js';
import { ResistorPart } from './parts/resistor-part.js';
import { CapacitorPart } from './parts/capacitor-part.js';
import { TransistorPart } from './parts/transistor-part.js';
import { MotorPart } from './parts/motor-part.js';
import { LevelChangerPart } from './parts/level-changer-part.js';
import { DiodePart } from './parts/diode-part.js';
import { PhonographPart } from './parts/phonograph-part.js';
import { TilePart } from './parts/tile-part.js'
import { TileConnectorPart } from './parts/tile-connector-part.js'
import { Chain } from './chain.js'

import { worldScale } from './constants.js';
import { tileSpacing } from './constants.js';

// PartManager holds the list of parts, interacts directly with them, and provides methods for changing them. The parts themselves are never passed out or into the PartManager.
export class PartManager {
    parts = [];
    chains = [];
    chainBeingBuilt = null;
    scene = null;
    sprocketTolerance = 5;
    toolMode = 'default';
    dragDiff = {x: 0, y: 0};
    gridSpacing = 0;
    mapWidth = 0;
    mapHeight = 0;
    world = null;

    constructor (scene, gridSpacing, mapWidth, mapHeight, planckWorld)
    {
        this.scene = scene;
        this.gridSpacing = gridSpacing;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.world = planckWorld;
        this.mouseGround = this.world.createBody();
    }

    update()
    {
        for (let i = 0; i < this.parts.length; i++)
        {
            this.parts[i].updatePhysics();
        }

    }

    addPart(partType, x, y, value = null)
    {
        if (partType === 'junction') {
            var newPart = new JunctionPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'button') {
            var newPart = new ButtonPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            if (value != null)
            {
                newPart.setButtonState(value);
            }
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'resistor') {
            var newPart = new ResistorPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            if (value != null)
            {
                let requestedValue = ResistorPart.possibleResistorValues.indexOf(value);
                if (requestedValue === -1)
                    requestedValue = 0;
                newPart.setResistance(requestedValue);
            }
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'capacitor') {
            var newPart = new CapacitorPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);

            if (value != null)
            {
                let requestedValue = CapacitorPart.possibleCapacitanceValues.indexOf(value);
                if (requestedValue === -1)
                    requestedValue = 0;
                newPart.setCapacitance(requestedValue);
            }
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'diode') {
            var newPart = new DiodePart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'transistor') {
            var newPart = new TransistorPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            if (value != null)
            {
                newPart.setTransistorCW(value);
            }

            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'level-changer') {
            var newPart = new LevelChangerPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'phonograph') {
            var newPart = new PhonographPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'motor') {
            var newPart = new MotorPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'inductor') {
            var newPart = new InductorPart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            if (value != null)
            {
                let requestedValue = InductorPart.possibleInductanceValues.indexOf(value);
                if (requestedValue === -1)
                    requestedValue = 0;
                newPart.setInductance(requestedValue);
            }

            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'tile') {
            var newPart = new TilePart(this.scene, x, y, this.world);
            newPart.setPointerDownCallback(this.onPartClicked, this);
            newPart.setPointerMoveCallback(this.onPointerMoveOverPart, this);
            newPart.setPointerOutCallback(this.onPointerMoveOutOfPart, this);
            newPart.setDragStartCallback(this.onPartDragStart, this);
            newPart.setDragCallback(this.onPartDrag, this);
            newPart.setDragEndCallback(this.onPartDragEnd, this);
            this.parts.push(newPart);
            return newPart;
        }
        else if (partType === 'tile-connector') {
            var newPart = new TileConnectorPart(this.scene, x, y, this.world);
            this.parts.push(newPart);
            return newPart;
        }

        return null;
    }

    updateTileConnectors()
    {
        // Tile connectors know which two tiles they are between

        // First, delete all the connectors. Start over.
        for (let i = 0; i < this.parts.length; i++)
        {
            if (this.parts[i].partType === 'tile-connector') {
                // Now destroy the part
                this.parts[i].destroy();
                this.parts.splice(i, 1);
                i--;
            }
        }
        // Iterate through all the tiles. For each tile, iterate through all other tiles, looking for adjacent tiles.
        for (let i = 0; i < this.parts.length; i++)
        {
            if (this.parts[i].partType === 'tile' || this.parts[i].partType === 'motor')
            {
                // Iterate through all the other tiles
                for (let j = i + 1; j < this.parts.length; j++)
                {
                    if (this.parts[j].partType === 'tile' || this.parts[j].partType === 'motor')
                    {
                        // Check if the tile 'j' is adjacent to the current one 'i'.
                        // Calculate the distance between the tiles
                        let distanceBetween = Math.sqrt(Math.pow(this.parts[i].x - this.parts[j].x, 2) + Math.pow(this.parts[i].y - this.parts[j].y, 2));
                        if (distanceBetween > tileSpacing * (2/Math.sqrt(3)) * 0.9 && distanceBetween <  tileSpacing * (2/Math.sqrt(3)) * 1.1)
                        {
                            // This is an adjacent tile
                            // Add a connector in between.
                            var newPart = new TileConnectorPart(this.scene, 0, 0, this.world);
                            newPart.setJoiningTiles(this.parts[i], this.parts[j]);
                            this.parts.push(newPart);
                        }

                    }
                }
            }
        }
    }

    isInTheMiddleOfBuildingAChain()
    {
        if (this.chainBeingBuilt != null)
        {
            return true;
        }
        return false;
    }

    getInfoAboutFirstSprocketInChainBeingBuilt()
    {
        let retVal = {partIndex: -1, cw: false, level: 0};

        if (this.chainBeingBuilt == null)
            return retVal;

        for (let i = 0; i < this.parts.length; i++)
        {
            //console.log(this.parts[partIndex]);
            if (this.chainBeingBuilt.connections[0].part === this.parts[i]) {

                retVal.partIndex = i;
                retVal.cw = this.chainBeingBuilt.connections[0].cw;
                retVal.level = this.chainBeingBuilt.connections[0].level;
                break;
            }
        }

        return retVal;
    }

    startChain()
    {
        this.chainBeingBuilt = new Chain(this.scene);
        this.chainBeingBuilt.setPointerDownCallback(this.onChainClicked, this);
        this.chainBeingBuilt.setPointerMoveCallback(this.onPointerMoveOverChain, this);
        this.chainBeingBuilt.setPointerOutCallback(this.onPointerMoveOutOfChain, this);
    }

    closeChain()
    {
        this.chainBeingBuilt.closeChain();

        this.createChainJoints(this.chainBeingBuilt);

        this.chains.push(this.chainBeingBuilt);
        this.chainBeingBuilt = null;
        this.redrawChains();
    }

    cancelChain()
    {
        if (this.chainBeingBuilt != null) {
            this.chainBeingBuilt.destroy();
            this.chainBeingBuilt = null;
        }
    }

    createChainJoints(chain)
    {
        // Add gear joints that connect the sprockets
        let lastConnection = chain.connections[0];
        for (let i = 1; i < chain.connections.length; i++)
        {
            let thisConnection = chain.connections[i];
            let level = lastConnection.level;

            let gearRatio = -thisConnection.part.sprocketPhysicsRadius[level]/lastConnection.part.sprocketPhysicsRadius[level];
            if (lastConnection.cw != thisConnection.cw)
                gearRatio = -gearRatio;
            chain.joints[i - 1] = this.world.createJoint(planck.GearJoint({}, lastConnection.part.sprocketBodies[level], thisConnection.part.sprocketBodies[level], lastConnection.part.sprocketJoints[level], thisConnection.part.sprocketJoints[level], gearRatio));
        }
    }

    deleteChainJoints(chain)
    {
        // Delete gear joints that connect the sprockets
        for (let i = 0; i < chain.joints.length; i++)
        {
            this.world.destroyJoint(chain.joints[i]);
        }
    }

    addChainConnection(partIndex, level, cw)
    {
        this.chainBeingBuilt.addConnection(this.parts[partIndex], level, cw);
        this.chainBeingBuilt.redrawChainGraphics();
    }

    getLengthOfChainBeingBuilt()
    {
        if (this.chainBeingBuilt != null)
            return this.chainBeingBuilt.connections.length;

        return 0;
    }

    getLevelOfChainBeingBuilt()
    {
        if (this.chainBeingBuilt != null)
            return this.chainBeingBuilt.connections[0].level;
        return -1;
    }

    onPartClicked(part, pointer)
    {
        if (this.toolMode === 'delete')
        {
            let partIndex = 0;
            //Get the part index.
            for (let i = 0; i < this.parts.length; i++)
            {
                if (this.parts[i] === part) {
                    partIndex = i;
                }
            }

            this.deletePart(partIndex);
        }
        else if (this.toolMode === 'edit')
        {
            let partIndex = 0;
            //Get the part index.
            for (let i = 0; i < this.parts.length; i++)
            {
                if (this.parts[i] === part) {
                    partIndex = i;
                }
            }
            this.changePartProperty(partIndex);
        }
        else if (this.toolMode === 'interact')
        {
            // The button part should change state if the center of it is clicked in Interact mode.
            if (part.partType === 'button')
                part.clickedInInteractMode(pointer);

        }
    }

    changePartProperty(partIndex)
    {
        let thisPart = this.parts[partIndex];
        thisPart.changePartProperty();
    }

    deletePart(partIndex)
    {
        // First, adjust all the chains to get rid of the connection.
        for (let c = 0; c < this.chains.length; c++)
        {
            let thisChain = this.chains[c];
            // Delete all the chain joints.
            this.deleteChainJoints(thisChain);
            // Delete the connections to this part.
            for (let d = 0; d < thisChain.connections.length; d++)
            {
                let thisConnection = thisChain.connections[d];
                if (thisConnection.part === this.parts[partIndex])
                {
                    thisChain.connections.splice(d, 1);
                    d--;
                }
            }

            // Is the chain too short to keep now that we removed the part?
            if (thisChain.connections.length < 2)
            {
                thisChain.destroy();
                this.chains.splice(c,1);
                c--;
            }
            else {
                // Create the chain gear joints
                this.createChainJoints(thisChain);
                // Redraw the chain
                thisChain.redrawChainGraphics();
            }
        }

        // Now destroy the part
        this.parts[partIndex].destroy();
        this.parts.splice(partIndex, 1);
        // Update all the tile connectors
        this.updateTileConnectors();
    }

    onChainClicked(chain, pointer)
    {
        if (this.toolMode === 'delete')
        {
            let chainIndex = 0;
            //Get the part index.
            for (let i = 0; i < this.chains.length; i++)
            {
                if (this.chains[i] === chain) {
                    chainIndex = i;
                }
            }

            this.deleteChain(chainIndex);
        }
    }

    deleteChain(chainIndex)
    {
        this.deleteChainJoints(this.chains[chainIndex]);

        // Adjust all the chains to get rid of the connection.
        this.chains[chainIndex].destroy();
        this.chains.splice(chainIndex, 1);
    }

    deleteAllChains()
    {
        while(this.chains.length > 0)
        {
            this.deleteChain(0);
        }
    }

    deleteAllParts()
    {
        while(this.parts.length > 0)
        {
            this.deletePart(0);
        }
    }

    // Add a chain from file
    addChain(connections)
    {
        let newChain = new Chain(this.scene);
        newChain.setPointerDownCallback(this.onChainClicked, this);
        newChain.setPointerMoveCallback(this.onPointerMoveOverChain, this);
        newChain.setPointerOutCallback(this.onPointerMoveOutOfChain, this);

        for (let i = 0; i < connections.length; i++)
        {
            let thisConnection = connections[i];
            newChain.addConnection(this.parts[thisConnection.partIndex], thisConnection.level, thisConnection.cw);
        }
        newChain.isComplete = true;
        // Create the gear joints for the chain
        this.createChainJoints(newChain);

        this.chains.push(newChain);
        this.redrawChains();
    }

    onPointerMoveOverPart(part, pointer)
    {
        // The pointer moved over the part 'part'.
        if (this.toolMode === 'delete')
        {
            part.setPartTint(0xFF0000);
        }
        else if (this.toolMode === 'move')
        {
            part.setPartTint(0xDDDDDD);
            if (this.partDragging)
                this.scene.input.setDefaultCursor('grabbing');
            else
                this.scene.input.setDefaultCursor('grab');
        }
        else if (this.toolMode === 'edit')
        {
            part.setPartTint(0xDDDDDD);
        }
    }

    onPointerMoveOutOfPart(part, pointer)
    {
        // The pointer moved off the part 'part'.
        if (this.toolMode === 'delete')
        {
            part.clearPartTint();
        }
        else if (this.toolMode == 'move')
        {
            part.clearPartTint();
            this.scene.input.setDefaultCursor('default');
        }
        else if (this.toolMode == 'edit')
        {
            part.clearPartTint();
        }
    }

    onPointerMoveOverChain(chain, pointer)
    {
        // The pointer moved over the part 'part'.
        if (this.toolMode == 'delete')
        {
            chain.setTintFill(0xAA0000);
        }
    }

    onPointerMoveOutOfChain(chain, pointer)
    {
        // The pointer moved off the part 'part'.
        if (this.toolMode == 'delete')
        {
            chain.clearTint();
        }
    }

    setToolMode(mode)
    {
        this.toolMode = mode;
    }

    // Redraw all the chains
    redrawChains()
    {
        for (let i = 0; i < this.chains.length; i++)
        {
            this.chains[i].redrawChainGraphics();
        }
        let chainLength = 0;
        for (let i = 0; i < this.chains.length; i++)
        {
            chainLength += this.chains[i].chainLength;
        }
        console.log(chainLength);
    }

    redrawChainBeingBuilt(pointer)
    {
        if (this.chainBeingBuilt != null)
            this.chainBeingBuilt.redrawChainGraphics(pointer);
    }

    isSprocketAvailable(partIndex, level)
    {
        for (let i = 0; i < this.chains.length; i++)
        {
            let thisChain = this.chains[i];
            for (let j = 0; j < thisChain.connections.length; j++)
            {
                let thisConnection = thisChain.connections[j];
                if (thisConnection.part == this.parts[partIndex] && thisConnection.level == level)
                    return false;
            }
        }
        return true;
    }

    getAllLevelsWithSameRadiusThatAreAvailableOnThisPart(partIndex, level)
    {
        let retVal = [];
        let thisPart = this.parts[partIndex];
        let thisRadius = thisPart.sprocketRadius[level];

        for (let l = 0; l < thisPart.sprocketRadius.length; l++)
        {
            // Check each level on this part.
            // Does the sprocket exist?
            if (!thisPart.sprocketExists[l])
                continue;

            // Is there a chain already on it?
            let sprocketAlreadyUsed = false;
            for (let i = 0; i < this.chains.length; i++)
            {
                let thisChain = this.chains[i];
                for (let j = 0; j < thisChain.connections.length; j++)
                {
                    let thisConnection = thisChain.connections[j];
                    if (thisConnection.part == thisPart && thisConnection.level == l) {
                        sprocketAlreadyUsed = true;
                        break;
                    }
                }

                if (sprocketAlreadyUsed)
                    break;
            }

            if (sprocketAlreadyUsed)
                continue;

            // Does it have the same radius?
            if (thisPart.sprocketRadius[level] != thisPart.sprocketRadius[l])
                continue;

            retVal.push(l);
        }

        return retVal;
    }

    getGetNumberOfLevelsOnThisPart(partIndex)
    {
        let thisPart = this.parts[partIndex];
        return thisPart.sprocketRadius.length;
    }

    // When you're routing a chain (already started), sometimes you click on a sprocket and you get back the lowest level sprocket,
    // but you meant to get back the sprocket at the current height.
    // This function gives you the sprocket at the correct level if it exists. It also checks to make sure you're not clicking on the same sprocket you're currently on.
    getNextAllowedSprocketAtPoint (x, y)
    {
        let nextSprocket = this.getSprocketAtPoint(x, y);
        if (nextSprocket == null)
            return null;

        let currentChainLevel = this.chainBeingBuilt.connections[0].level;
        let nextPart = this.parts[nextSprocket.partIndex];
        let lastChainPart = this.chainBeingBuilt.connections[this.chainBeingBuilt.connections.length - 1].part;

        // Check to make sure it's not the same part that it's currently on.
        if (nextPart == lastChainPart)
            return null;

        // Check to make sure it's on the correct level.
        if (currentChainLevel != nextSprocket.level)
        {
            // Well this one's not at the correct level, but is there another sprocket with the same radius that is at the correct level?
            if (nextPart.sprocketRadius[currentChainLevel] == nextPart.sprocketRadius[nextSprocket.level])
                nextSprocket.level = currentChainLevel;
            else
                return null;
        }

        // Check to make sure there's not already a connection from another chain to this one.
        for (let i = 0; i < this.chains.length; i++)
        {
            let thisChain = this.chains[i];
            for (let j = 0; j < thisChain.connections.length; j++)
            {
                let thisConnection = thisChain.connections[j];
                if (thisConnection.part == nextPart && thisConnection.level == nextSprocket.level)
                {
                    return null;
                }
            }
        }

        // Check to make sure there's not already a connection from this chain to this sprocket.
        for (let j = 1; j < this.chainBeingBuilt.connections.length; j++)
        {
            let thisConnection = this.chainBeingBuilt.connections[j];
            if (thisConnection.part == nextPart && thisConnection.level == nextSprocket.level)
            {
                return null;
            }
        }

        // This is a valid potential connection
        return nextSprocket;
    }

    // Returns {partIndex, level} if the mouse is close or null if not.
    getSprocketAtPoint(x, y)
    {
        // Find the first sprocket that overlaps the cursor
        for (var j = 0; j < this.parts.length; j++)
        {
            const part = this.parts[j];

            for (var i = 0; i < part.sprocketExists.length; i++)
            {
                if (part.sprocketExists[i] === false)
                    continue;

                var sprocketCenter = {x: part.x + part.sprocketCenter[i].x, y: part.y + part.sprocketCenter[i].y};
                var sprocketRadius = part.sprocketRadius[i];

                // Calculate distance from pointer to center of sprocket
                var distanceToCenter = Math.sqrt(Math.pow(x - sprocketCenter.x, 2) + Math.pow(y - sprocketCenter.y, 2));

                if (distanceToCenter < (sprocketRadius + this.sprocketTolerance) && distanceToCenter > (sprocketRadius - this.sprocketTolerance))
                {
                    // The point is in the sprocket circle
                    var retVal = {partIndex: j, level: i};
                    return retVal;
                }
            }
        }

        return null;
    }

    getSprocketBounds(partIndex, level)
    {
        const part = this.parts[partIndex];
        let bounds = {
            x: part.x + part.sprocketCenter[level].x,
            y: part.y + part.sprocketCenter[level].y,
            radius: part.sprocketRadius[level],
            thickness: this.sprocketTolerance * 2};

        return bounds;
    }

    getLastSprocketBoundsOfChainBeingBuilt()
    {
        if (this.chainBeingBuilt == null)
            return null;

        const part = this.chainBeingBuilt.connections[this.chainBeingBuilt.connections.length - 1].part;
        const level = this.chainBeingBuilt.connections[this.chainBeingBuilt.connections.length - 1].level
        let bounds = {
            x: part.x + part.sprocketCenter[level].x,
            y: part.y + part.sprocketCenter[level].y,
            radius: part.sprocketRadius[level],
            thickness: this.sprocketTolerance * 2};

        return bounds;
    }

    partDragging = false;
    mouseJoint;
    targetBody;
    mouseMove = {x:0, y:0};
    mouseGround;

    onPartDragStart(part, pointer, dragX, dragY, physicsBody)
    {
        let worldPointer = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        if (this.toolMode === 'move') {
            this.dragDiff.x = worldPointer.x - part.x;
            this.dragDiff.y = worldPointer.y - part.y;
            this.partDragging = true;
            this.scene.input.setDefaultCursor('grabbing');
        }
        else if (this.toolMode === 'interact') {
            let point = {x: (worldPointer.x - part.x) / worldScale, y: (worldPointer.y - part.y) / worldScale};
//            let point = {x: worldPointer.x / worldScale, y: worldPointer.y / worldScale};
            if (physicsBody !== undefined) {
                this.mouseJoint = planck.MouseJoint({maxForce: 1000}, this.mouseGround, physicsBody, planck.Vec2(point));
                this.world.createJoint(this.mouseJoint);
            }
        }
    }

    onPartDragEnd(part, pointer, dragX, dragY, physicsBody)
    {
        let worldPointer = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        if (this.toolMode == 'move') {
            this.redrawChains();
            this.updateTileConnectors();
            this.partDragging = false;
            this.scene.input.setDefaultCursor('grab');
        }
        else if (this.toolMode == 'interact') {
            let point = {x: (worldPointer.x - part.x) / worldScale, y: (worldPointer.y - part.y) / worldScale};

            if (this.mouseJoint) {
                this.world.destroyJoint(this.mouseJoint);
                this.mouseJoint = null;
            }
        }
    }

    onPartDrag(part, pointer, dragX, dragY, physicsBody)
    {
        let worldPointer = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        if (this.toolMode == 'move') {
            let desiredPosition = {x: 0, y: 0};
            desiredPosition.x = worldPointer.x - this.dragDiff.x;
            desiredPosition.y = worldPointer.y - this.dragDiff.y;

            let snapPosition;
            if (part.partType == 'motor' || part.partType == 'tile')
            {
                snapPosition = PartBase.getSnapPosition(desiredPosition, tileSpacing);
            } else {
                snapPosition = PartBase.getSnapPosition(desiredPosition, this.gridSpacing);
            }

            part.setPosition(snapPosition.snapPoint.x, snapPosition.snapPoint.y);//setPosition(snapPosition.snapPoint.x, snapPosition.snapPoint.y);
            this.redrawChains();
            this.updateTileConnectors();
        }
        else if (this.toolMode == 'interact') {
            let point = {x: (worldPointer.x - part.x) / worldScale, y: (worldPointer.y - part.y) / worldScale};

            if (this.mouseJoint) {
                this.mouseJoint.setTarget(point);
            }

            this.mouseMove.x = point.x;
            this.mouseMove.y = point.y;
        }
    }

    serializeParts()
    {
        let partsArray = [];
        for (let i = 0; i < this.parts.length; i++)
        {
            let thisPart = this.parts[i];
            let partObject = thisPart.serialize();
            partsArray.push(partObject);
        }
        return partsArray;
    }

    serializeChains()
    {
        let chainsArray = [];
        for (let i = 0; i < this.chains.length; i++)
        {
            let thisChain = this.chains[i];
            let connectionsArray = [];
            for (let j = 0; j < thisChain.connections.length; j++)
            {
                let thisConnection = thisChain.connections[j];
                let partIndex = 0;
                // Find the part of this connection;
                for (let pi = 0; pi < this.parts.length; pi++)
                {
                    if (thisConnection.part == this.parts[pi])
                    {
                        partIndex = pi;
                        break;
                    }
                }
                let connectionObject = {
                    partIndex: partIndex,
                    level: thisConnection.level,
                    cw: thisConnection.cw
                };
                connectionsArray.push(connectionObject);
            }

            let chainObject = {
                connections: connectionsArray
            };

            chainsArray.push(chainObject);
        }

        return chainsArray;
    }
}