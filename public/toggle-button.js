export class ToggleButton extends Phaser.GameObjects.Container
{
    thisScene = null;

    // Constants for rich tooltip styling
    static TOOLTIP_MAX_WIDTH = 260;
    static TOOLTIP_PADDING = 10;
    static TOOLTIP_LINE_HEIGHT = 18;

    constructor(scene, name, x, y, width, height, textureDefault, textureHover, texturePressed, textureIcon, pressedCallback, textureDisabled = null)
    {
        super(scene, x, y);
        this.thisScene = scene;
        this.name = name;
        this.textureDefault = textureDefault;
        this.textureHover = textureHover;
        this.texturePressed = texturePressed;
        this.textureIcon = textureIcon;
        this.toggledCallback = pressedCallback;
        this.textureDisabled = textureDisabled;
        this.buttonType = 'default';

        this.toggleState = false;
        this.disabled = false;

        // Add this container to the scene
        scene.add.existing(this);
        this.setSize(width, height);
        // Add event handlers
        this.setInteractive();
        this.on('pointerdown', (pointer, localx, localy, event) => this.onPointerDown(pointer, localx, localy, event));
        this.on('pointerup', (pointer, localx, localy, event) => this.onPointerUp(pointer, localx, localy, event));
        this.on('pointerover', (pointer, localx, localy, event) => this.onPointerOver(pointer, localx, localy, event));
        this.on('pointerout', (pointer, localx, localy, event) => this.onPointerOut(pointer, localx, localy, event));

        // Add button background
        this.buttonBackground = scene.add.image(0, 0, textureDefault);
        this.buttonBackground.alpha = 0.5;
        this.buttonBackground.setDisplaySize(width, height);
        this.add(this.buttonBackground);

        // Add icon
        this.buttonIcon = scene.add.image(0, 0, textureIcon);
        this.buttonIcon.alpha = 0.5;
        if (this.buttonIcon.displayWidth > this.buttonIcon.displayHeight) {
            if (this.buttonIcon.displayWidth > this.buttonBackground.displayWidth * 0.9)
                this.buttonIcon.setScale((this.buttonBackground.displayWidth * 0.9) / this.buttonIcon.displayWidth);
        }
        else {
            if (this.buttonIcon.displayHeight > this.buttonBackground.displayHeight * 0.9)
                this.buttonIcon.setScale((this.buttonBackground.displayHeight * 0.9) / this.buttonIcon.displayHeight);
        }
        //this.buttonIcon.setDisplaySize(width*0.8, height*0.8);
        this.add(this.buttonIcon);

        this.tooltipString = "";
        this.tooltipData = null; // Rich tooltip data object
        this.tooltipText = null;
        this.tooltipElements = []; // Array to hold all tooltip elements for cleanup
        this.keyboardShortcut = null;
        this.keyboardShortcutText = null;
        this.keyLabelBackground = null;
    }

    // Sets the button type: 'toggle' or 'default'
    setButtonType(buttonType)
    {
        this.buttonType = buttonType;
        this.toggleState = false;
    }

    setDisabled(disabled)
    {
        this.disabled = disabled;
        if (disabled) {
            this.buttonBackground.setTexture(this.textureDisabled);
            this.buttonIcon.setTintFill(0x888888);
        }
        else
        {
            this.buttonBackground.setTexture(this.textureDefault);
            this.buttonIcon.clearTint();
        }
    }

    setImageScale(scaleFactor)
    {
        this.buttonIcon.setScale(scaleFactor);
    }

    getToggleState ()
    {
        return this.toggleState;
    }

    setTooltipString(tooltipString, tooltipJustify = 'right')
    {
        this.tooltipString = tooltipString;
        this.tooltipJustify = tooltipJustify;
    }

    /**
     * Set rich tooltip data for multi-line tooltips with descriptions
     * @param {Object} data - { name, shortcut, description, equivalent }
     * @param {string} tooltipJustify - 'left' or 'right'
     */
    setRichTooltip(data, tooltipJustify = 'right')
    {
        this.tooltipData = data;
        this.tooltipJustify = tooltipJustify;
        // Also set simple tooltip string as fallback
        if (data && data.name) {
            this.tooltipString = data.shortcut ? `${data.name} [${data.shortcut}]` : data.name;
        }
    }

    setTooltipJustify(tooltipJustify)
    {
        this.tooltipJustify = tooltipJustify;
    }

    /**
     * Helper to wrap text to a maximum width
     */
    wrapText(text, maxWidth, fontSize = 14)
    {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        // Approximate character width (will vary by font)
        const charWidth = fontSize * 0.55;
        const maxChars = Math.floor(maxWidth / charWidth);

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (testLine.length > maxChars && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines;
    }

    setKeyboardShortcut(key)
    {
        this.keyboardShortcut = key;

        // Create the visual keyboard shortcut label
        if (this.keyboardShortcutText == null && key != null) {
            // Create background rectangle for the key label
            const labelWidth = 18;
            const labelHeight = 18;
            const cornerOffset = 5;

            // Position in bottom-right corner of button
            const labelX = (this.width / 2) - labelWidth - cornerOffset;
            const labelY = (this.height / 2) - labelHeight - cornerOffset;

            // Create semi-transparent background
            this.keyLabelBackground = this.thisScene.add.graphics();
            this.keyLabelBackground.fillStyle(0x000000, 0.4);
            this.keyLabelBackground.fillRoundedRect(labelX, labelY, labelWidth, labelHeight, 3);
            this.add(this.keyLabelBackground);

            // Create text label
            this.keyboardShortcutText = this.thisScene.add.text(
                labelX + labelWidth / 2,
                labelY + labelHeight / 2,
                key,
                {
                    font: '12px Roboto',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    fontStyle: 'bold'
                }
            );
            this.keyboardShortcutText.setOrigin(0.5, 0.5);
            this.keyboardShortcutText.alpha = 0.5;
            this.add(this.keyboardShortcutText);
        }
    }

    setToggleState (toggleState)
    {
        if (this.disabled)
            return;

        if (this.toggleState == false && toggleState == true)
        {
            this.buttonBackground.setTexture(this.texturePressed);
        }
        else if (this.toggleState == false && toggleState == false)
        {
            this.buttonBackground.setTexture(this.textureDefault);
        }
        else if (this.toggleState == true && toggleState == true)
        {
            this.buttonBackground.setTexture(this.texturePressed);
        }
        else if (this.toggleState == true && toggleState == false)
        {
            this.buttonBackground.setTexture(this.textureDefault);
        }
        this.toggleState = toggleState;
    }

    onPointerDown(pointer, localx, localy, event)
    {
        if (this.disabled)
            return;

        if (this.buttonType == 'default')
        {
            this.buttonBackground.setTexture(this.texturePressed);
        }
        else if (this.buttonType == 'toggle') {
            this.setToggleState(true);
            this.toggledCallback.bind(this.parentContainer)(this.name, this.toggleState);
        }
        event.stopPropagation();
    }

    onPointerUp(pointer, localx, localy, event)
    {
        if (this.disabled)
            return;

        if (this.buttonType == 'default')
        {
            this.buttonBackground.setTexture(this.textureHover);
            this.toggledCallback.bind(this.parentContainer)(this.name, true);
        }
        event.stopPropagation();
    }

    onPointerOver(pointer, localx, localy, event)
    {
        if (this.disabled)
            return;

        if (this.toggleState == false)
        {
            this.buttonBackground.setTexture(this.textureHover);
        }
        else
        {
            this.buttonBackground.setTexture(this.texturePressed);
        }

        this.buttonBackground.alpha = 1;
        this.buttonIcon.alpha = 1;

        // Also make keyboard shortcut label more visible on hover
        if (this.keyboardShortcutText != null) {
            this.keyboardShortcutText.alpha = 1;
        }

        // Draw the Tooltip - use rich tooltip if available
        if ((this.tooltipData || this.tooltipString != "") && this.tooltipText == null) {
            // Make this button the top-most item
            this.setDepth(17);

            if (this.tooltipData && this.tooltipData.description) {
                // Render rich multi-line tooltip
                this.renderRichTooltip();
            } else {
                // Render simple tooltip (fallback)
                this.renderSimpleTooltip();
            }
        }

        event.stopPropagation();
    }

    /**
     * Render a simple single-line tooltip
     */
    renderSimpleTooltip()
    {
        let textPos = {x: 0, y: 0};
        this.tooltipText = this.thisScene.add.text(textPos.x, textPos.y, this.tooltipString, {
            font: '20px Roboto',
            fontSize: '50px',
            color: "rgb(20,20,20)",
            fontStyle: 'strong'
        });
        this.tooltipText.setDepth(16);
        let textBounds = this.tooltipText.getBounds();

        // Draw white background
        this.toolTipGraphics = this.thisScene.add.graphics();
        this.toolTipGraphics.lineStyle(2, 0x111111, 1);
        this.toolTipGraphics.fillStyle(0xffffff, 1);
        if (this.tooltipJustify == 'right')
            this.toolTipGraphics.fillRoundedRect((this.width / 2) + 8 - 4, (-textBounds.height / 2) - 2, textBounds.width + 8, textBounds.height + 4, 6);
        else
            this.toolTipGraphics.fillRoundedRect(-((this.width / 2) + 8 + 4 + textBounds.width), (-textBounds.height / 2) - 2, textBounds.width + 8, textBounds.height + 4, 6);

        this.add(this.toolTipGraphics);
        this.tooltipElements.push(this.toolTipGraphics);

        if (this.tooltipJustify == 'right')
            this.tooltipText.setPosition(this.width / 2 + 8, -textBounds.height / 2);
        else
            this.tooltipText.setPosition(-(this.width / 2 + 8 + textBounds.width), -textBounds.height / 2);
        this.add(this.tooltipText);
        this.tooltipElements.push(this.tooltipText);
    }

    /**
     * Render a rich multi-line tooltip with header, description, and electronic equivalent
     */
    renderRichTooltip()
    {
        const data = this.tooltipData;
        const padding = ToggleButton.TOOLTIP_PADDING;
        const maxWidth = ToggleButton.TOOLTIP_MAX_WIDTH;
        const lineHeight = ToggleButton.TOOLTIP_LINE_HEIGHT;

        // Build tooltip content
        const headerText = data.shortcut ? `${data.name} [${data.shortcut}]` : data.name;
        const descriptionLines = this.wrapText(data.description, maxWidth - padding * 2, 13);
        const equivalentText = data.equivalent ? `= ${data.equivalent}` : '';

        // Calculate total height
        const headerHeight = 28;
        const descriptionHeight = descriptionLines.length * lineHeight;
        const equivalentHeight = equivalentText ? 24 : 0;
        const dividerHeight = 1;
        const totalHeight = headerHeight + dividerHeight + descriptionHeight + (equivalentText ? dividerHeight + equivalentHeight : 0) + padding;

        // Calculate position
        const tooltipX = this.tooltipJustify === 'right'
            ? (this.width / 2) + 8
            : -((this.width / 2) + 8 + maxWidth);
        const tooltipY = -totalHeight / 2;

        // Create graphics for background
        this.toolTipGraphics = this.thisScene.add.graphics();
        this.toolTipGraphics.setDepth(16);

        // Main background
        this.toolTipGraphics.fillStyle(0xffffff, 1);
        this.toolTipGraphics.lineStyle(1, 0xcccccc, 1);
        this.toolTipGraphics.fillRoundedRect(tooltipX, tooltipY, maxWidth, totalHeight, 8);
        this.toolTipGraphics.strokeRoundedRect(tooltipX, tooltipY, maxWidth, totalHeight, 8);

        // Header background (subtle)
        this.toolTipGraphics.fillStyle(0xf5f5f5, 1);
        this.toolTipGraphics.fillRoundedRect(tooltipX, tooltipY, maxWidth, headerHeight, { tl: 8, tr: 8, bl: 0, br: 0 });

        // Divider line after header
        this.toolTipGraphics.lineStyle(1, 0xe0e0e0, 1);
        this.toolTipGraphics.lineBetween(tooltipX + padding, tooltipY + headerHeight, tooltipX + maxWidth - padding, tooltipY + headerHeight);

        this.add(this.toolTipGraphics);
        this.tooltipElements.push(this.toolTipGraphics);

        // Header text (bold)
        this.tooltipText = this.thisScene.add.text(tooltipX + padding, tooltipY + 6, headerText, {
            font: 'bold 15px Roboto',
            color: '#222222'
        });
        this.tooltipText.setDepth(17);
        this.add(this.tooltipText);
        this.tooltipElements.push(this.tooltipText);

        // Description text
        let currentY = tooltipY + headerHeight + 8;
        for (const line of descriptionLines) {
            const lineText = this.thisScene.add.text(tooltipX + padding, currentY, line, {
                font: '13px Roboto',
                color: '#444444'
            });
            lineText.setDepth(17);
            this.add(lineText);
            this.tooltipElements.push(lineText);
            currentY += lineHeight;
        }

        // Electronic equivalent (if provided)
        if (equivalentText) {
            currentY += 4;
            // Divider before equivalent
            this.toolTipGraphics.lineBetween(tooltipX + padding, currentY - 2, tooltipX + maxWidth - padding, currentY - 2);

            const equivText = this.thisScene.add.text(tooltipX + padding, currentY + 2, equivalentText, {
                font: 'italic 12px Roboto',
                color: '#666666'
            });
            equivText.setDepth(17);
            this.add(equivText);
            this.tooltipElements.push(equivText);
        }
    }

    onPointerOut(pointer, event)
    {
        if (this.disabled)
            return;

        // console.log('pointer out');
        if (this.toggleState == false)
        {
            this.buttonBackground.setTexture(this.textureDefault);
        }
        else
        {
            this.buttonBackground.setTexture(this.texturePressed);
        }

        this.buttonBackground.alpha = 0.5;
        this.buttonIcon.alpha = 0.5;

        // Restore keyboard shortcut label to semi-transparent
        if (this.keyboardShortcutText != null) {
            this.keyboardShortcutText.alpha = 0.5;
        }

        // Clean up all tooltip elements
        if (this.tooltipText != null || this.tooltipElements.length > 0)
        {
            this.setDepth(0);

            // Destroy all tooltip elements
            for (const element of this.tooltipElements) {
                if (element && element.destroy) {
                    element.destroy();
                }
            }
            this.tooltipElements = [];

            // Also destroy the main references (for backwards compatibility)
            if (this.tooltipText) {
                this.tooltipText = null;
            }
            if (this.toolTipGraphics) {
                this.toolTipGraphics = null;
            }
        }

        event.stopPropagation();
    }



}