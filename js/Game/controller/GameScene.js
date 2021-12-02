class GameScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.GAME);
    }

    init(params) {
        this.levelGenerationInfo = params.levelGenerationInfo;

        this.formulas = params.formulas;
        this.levelNumber = params.levelNumber;

        this.displayingFormulas = [];
        this.indexOfLastDisplayingFormula = -1;

        this.displayingCannonBalls = [];
        this.score = 0;

        Scaler.setResolution(this, GC.RESOLUTIONS.MEDIUM.GAME.width, GC.RESOLUTIONS.MEDIUM.GAME.height);
    }

    create() {
        this.levelsInfo = this.cache.json.get('levelsInfo');
        this.sizer = new GameSizer(this);

        this.placeCannon();
        this.placeScoreLabels();
        this.placePauseButton();

        this.input.on('pointerdown', this.shoot(this));
        this.keyM = this.input.keyboard.addKey('M');
    }

    update() {
        this.focusCannonOnPointer();
        this.handleKeyboardInput();

        this.moveCannonBalls();

        this.spanNewFormulaIfNeeded();
        this.moveFormulas();
        this.removeFormulasIfNeeded();

        this.finishGameIfNeeded();
    }

    placeMainMenuButton() {
        let sizer = this.sizer;
        let scene = this;

        let leftX = sizer.mainMenuButton_LeftX();
        let topY = sizer.mainMenuButton_TopY();

        let fontSize = sizer.mainMenuButton_fontSize();
        let fontColor = sizer.mainMenuButton_fontColor();

        let mainMenuButton = scene.add.text(leftX, topY,
            'main menu', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });

        this.mainMenuButtonHeight = mainMenuButton.height;
        this.mainMenuButtonWidth = mainMenuButton.width;

        mainMenuButton.setInteractive();
        mainMenuButton.on('pointerover', () => {
            mainMenuButton.setFontFamily('Ribeye');
        });
        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setFontFamily('RibeyeMarrow');
        });
        mainMenuButton.on('pointerup', () => {
            Scaler.setResolution(this, 1200, 900);
            scene.openMainMenu();
        });
    }

    placeLevelMenuButton() {
        let sizer = this.sizer;
        let scene = this;

        let leftX = sizer.levelMenuButton_LeftX();
        let topY = sizer.levelMenuButton_TopY();

        let fontSize = sizer.levelMenuButton_fontSize();
        let fontColor = sizer.levelMenuButton_fontColor();

        let levelMenuButton = scene.add.text(leftX, topY,
            'level menu', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });

        this.levelMenuButtonHeight = levelMenuButton.height;
        this.levelMenuButtonWidth = levelMenuButton.width;

        levelMenuButton.setInteractive();
        levelMenuButton.on('pointerover', () => {
            levelMenuButton.setFontFamily('Ribeye');
        });
        levelMenuButton.on('pointerout', () => {
            levelMenuButton.setFontFamily('RibeyeMarrow');
        });
        levelMenuButton.on('pointerup', () => {
            Scaler.setResolution(this, 1200, 900);
            scene.openLevelMenu();
        });
    }

    placePauseButton() {
        let sizer = this.sizer;
        let scene = this;

        let leftX = sizer.pauseButton_LeftX();
        let topY = sizer.pauseButton_TopY();

        let fontSize = sizer.pauseButton_fontSize();
        let fontColor = sizer.pauseButton_fontColor();

        let pauseButton = scene.add.text(leftX, topY,
            'pause', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });

        this.pauseButtonHeight = pauseButton.height;
        this.pauseButtonWidth = pauseButton.width;

        pauseButton.setInteractive();
        pauseButton.on('pointerover', () => {
            pauseButton.setFontFamily('Ribeye');
        });
        pauseButton.on('pointerout', () => {
            pauseButton.setFontFamily('RibeyeMarrow');
        });
        pauseButton.on('pointerup', () => {
            // Scaler.setResolution(this, 1200, 900);
            // console.log("No pause scene");
            this.showMenu();
        });
    }

    openLevelMenu() {
        this.scene.start(GC.SCENES.LEVEL_MENU);
    }

    openMainMenu() {
        this.scene.start(GC.SCENES.MAIN_MENU);
    }

    finishGameIfNeeded() {
        if (this.isGameFinished()) {
            Scaler.setResolution(this, 1200, 900);

            let numberOfLevels = 2;
            // number of levels = 2
            // change it later !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // and use this.levelsInfo.levels.length instead of "2"

            if (this.score > 0 && numberOfLevels > this.levelNumber + 1) {
                let basePath = "/js/GameConfiguration";
                let initialExpressionPath = basePath + this.levelsInfo.levels[this.levelNumber + 1].initialExpressions;
                let substitutionsPath = basePath + this.levelsInfo.levels[this.levelNumber + 1].substitutions;
                let numberOfFormulas = this.levelsInfo.levels[this.levelNumber + 1].numberOfFormulas;

                this.scene.start(GC.SCENES.LEVEL_GENERATION, {
                    'numberOfFormulas': numberOfFormulas,
                    'initialExpressionPath': initialExpressionPath,
                    'substitutionsPath': substitutionsPath,
                    'levelNumber' : this.levelNumber + 1
                });
            }
            else {
                this.scene.start(GC.SCENES.GAME_COMPETE, {
                    'score': this.score,
                    'levelGenerationInfo': this.levelGenerationInfo
                });
            }
        }
    }

    isGameFinished() {
        return this.hasNoDisplayingFormulas() && this.allFormulasHasBeenPlaced()
    }

    spanNewFormulaIfNeeded() {
        if (this.needToSpanNewFormula()) {
            this.spanNewFormula();
        }
    }

    needToSpanNewFormula() {
        return !this.allFormulasHasBeenPlaced()
            && (this.hasNoDisplayingFormulas() || this.hasEnoughSpaceToPlaceNewFormula());
    }

    hasNoDisplayingFormulas() {
        return this.displayingFormulas.length === 0;
    }

    hasEnoughSpaceToPlaceNewFormula() {
        let cardSpeedY = this.sizer.card_SpeedY();

        return 0 <= this.lastCard_TopY() + cardSpeedY;
    }

    allFormulasHasBeenPlaced() {
        return this.indexOfLastDisplayingFormula === this.formulas.length - 1;
    }

    spanNewFormula() {
        let formula = this.placeNewFormula();

        this.displayingFormulas.push(formula);
        this.indexOfLastDisplayingFormula += 1;
    }

    placeNewFormula() {
        let index = this.indexOfLastDisplayingFormula + 1;

        let background_LeftX = this.sizer.cardBackground_LeftX();
        let background_TopY = this.spanCardBackground_TopY();
        let background = this.physics.add.image(background_LeftX, background_TopY, 'cardBackground_Regular');
        background.setOrigin(0, 0);

        this.addExistingCollisionsToNewFormula(background);

        let formulaCenterX = this.sizer.formula_CenterX();
        let formulaCenterY = this.spanFormula_CenterY();
        let formulaLabel = this.formulas[index].label;
        let formula = this.add.image(formulaCenterX, formulaCenterY, formulaLabel);
        formula.setOrigin(0.5);

        let scoreForHit = this.formulas[index].scoreForHit;
        let scoreForSkip = this.formulas[index].scoreForSkip;
        let formulaOrigin = this.formulas[index].origin;
        let formulaTarget = this.formulas[index].target;

        let arrow = undefined;
        if (0 < index) {
            let arrowCenterX = this.sizer.arrow_CenterX();
            let arrowCenterY = this.spanArrow_CenterY();

            console.log('arrowCenterX: ' + arrowCenterX);
            console.log('arrowCenterY: ' + arrowCenterY);

            arrow = this.add.image(arrowCenterX, arrowCenterY, 'arrow');
            arrow.setOrigin(0.5);
        }

        let newFormula = {
            'formula': formula,
            'background': background,
            'arrow': arrow,
            'scoreForHit': scoreForHit,
            'scoreForSkip': scoreForSkip,
            'isHit': false,
            'origin' : formulaOrigin,
            'target' : formulaTarget
        };

        if (0 === index) {
            this.formulaHasBeenHit(newFormula);
        }

        return newFormula;
    }

    moveFormulas() {
        for (let formula of this.displayingFormulas) {
            formula.background.x += this.sizer.card_SpeedX();
            formula.background.y += this.sizer.card_SpeedY();

            formula.formula.x += this.sizer.card_SpeedX();
            formula.formula.y += this.sizer.card_SpeedY();

            if (formula.arrow) {
                formula.arrow.x += this.sizer.card_SpeedX();
                formula.arrow.y += this.sizer.card_SpeedY();
            }

            if (formula.leftScore) {
                formula.leftScore.x += this.sizer.card_SpeedX();
                formula.leftScore.y += this.sizer.card_SpeedY();
            }

            if (formula.rightScore) {
                formula.rightScore.x += this.sizer.card_SpeedX();
                formula.rightScore.y += this.sizer.card_SpeedY();
            }
        }
    }

    removeFormulasIfNeeded() {
        if (this.needToRemoveFirstFormula()) {
            this.removeFirstFormula();
        }
    }

    needToRemoveFirstFormula() {
        return 0 < this.displayingFormulas.length
            && this.sizer.field_Height() < this.displayingFormulas[0].background.y;
    }

    removeFirstFormula() {
        this.formulaHasBeenPassed(this.displayingFormulas[0]);
        this.destroyFormulaObjects(this.displayingFormulas[0]);
        this.displayingFormulas.shift();
    }

    formulaHasBeenPassed(formula) {
        if (!formula.isHit) {
            this.score += formula.scoreForSkip;

            let formattedScore = this.formatScore(this.score);
            this.scoreValueText.setText(formattedScore);
        }
    }

    destroyFormulaObjects(formula) {
        formula.formula.destroy();
        formula.background.destroy();
        if (formula.arrow) formula.arrow.destroy();
        if (formula.leftScore) formula.leftScore.destroy();
        if (formula.rightScore) formula.rightScore.destroy();
    }

    // MARK: - Sizes based on the current game state
    lastCard_TopY() {
        let indexOfLastFormula = this.displayingFormulas.length - 1;
        let lastFormula = this.displayingFormulas[indexOfLastFormula];

        return lastFormula.background.y;
    }

    spanCardBackground_TopY() {
        let height = this.sizer.cardBackground_Height();
        let shadowY = this.sizer.cardBackground_ShadowY();

        if (this.hasNoDisplayingFormulas()) {
            return 0 - shadowY - height;
        }

        let distanceBetween = this.sizer.cardBackground_DistanceBetween();

        return this.lastCard_TopY() - distanceBetween - shadowY - height;
    }

    spanFormula_CenterY() {
        let cardTopY = this.spanCardBackground_TopY();
        let cardHeight = this.sizer.cardBackground_Height();

        return cardTopY + cardHeight / 2;
    }

    spanArrow_CenterY() {
        let cardTopY = this.spanCardBackground_TopY();
        let cardHeight = this.sizer.cardBackground_Height();
        let spaceBetween = this.sizer.cardBackground_DistanceBetween();
        let cardShadowY = this.sizer.cardBackground_ShadowY();
        let arrowShadowY = this.sizer.arrow_ShadowY();

        return cardTopY + cardHeight + (spaceBetween + cardShadowY) / 2 + arrowShadowY / 2;
    }

    placeCannon() {
        let x = this.sizer.cannon_MovingCenterX();
        let y = this.sizer.cannon_MovingCenterY();
        this.cannon = this.physics.add.image(x, y, 'cannon');

        let scale = this.sizer.cannon_Scale();
        this.cannon.setScale(scale);

        let originX = this.sizer.cannon_OriginX();
        let originY = this.sizer.cannon_OriginY();
        this.cannon.setOrigin(originX, originY);

        this.cannon.setDepth(1000);
    }

    focusCannonOnPointer() {
        let cannonOrigin = {
            x: this.cannon.x,
            y: this.cannon.y
        };
        let pointer = this.input.activePointer;

        let angleToPointer
            = Phaser.Math.Angle.BetweenPoints(cannonOrigin, pointer);
        let wrappedAngleToPointer
            = Phaser.Math.Angle.Wrap(angleToPointer + Phaser.Math.TAU);

        this.cannon.rotation = wrappedAngleToPointer;

        return this;
    }

    handleKeyboardInput() {

        if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
            this.showMenu();
        }
    }

    showMenu() {
        this.scene.pause(GC.SCENES.GAME);
        this.showPauseMenu();
    }

    showPauseMenu() {
        this.scene.run(GC.SCENES.GAME_PAUSE, {
            'levelGenerationInfo': this.levelGenerationInfo
        });
    }

    shoot(scene) {
        return () => {
            let shootDirection = scene.calculateShootDirection();
            let speed = scene.sizer.cannonBall_Speed();

            let startPositionX = scene.sizer.cannonBall_StartPositionX();
            let startPositionY = scene.sizer.cannonBall_StartPositionY();

            let sizer = this.sizer;

            // in the area of pause button we don`t shoot
            if (this.input.activePointer.downY >= sizer.pauseButton_TopY() &&
                this.input.activePointer.downX >= sizer.pauseButton_LeftX() &&
                    this.input.activePointer.downY <= sizer.pauseButton_TopY() + this.pauseButtonHeight &&
                        this.input.activePointer.downX <= sizer.pauseButton_LeftX() + this.pauseButtonWidth) {
                return;
            }

            let cannonBallObj = scene.physics.add.image(startPositionX, startPositionY, 'cannonBall');
            cannonBallObj.setScale(this.sizer.cannonBall_Scale());
            cannonBallObj.setOrigin(0.5);

            scene.addNewCollisionToDisplayingFormulas(cannonBallObj);

            scene.displayingCannonBalls.push({
                cannonBall: cannonBallObj,
                speedX: speed * shootDirection.x,
                speedY: speed * shootDirection.y
            })
        }
    }

    calculateShootDirection() {
        return {
            x: Math.cos(this.cannon.rotation - Phaser.Math.TAU),
            y: Math.sin(this.cannon.rotation - Phaser.Math.TAU)
        };
    }

    moveCannonBalls() {
        for (let cannonBall of this.displayingCannonBalls) {
            cannonBall.cannonBall.x += cannonBall.speedX;
            cannonBall.cannonBall.y += cannonBall.speedY;
        }
    }

    addNewCollisionToDisplayingFormulas(cannonBallObject) {
        for (let formula of this.displayingFormulas) {

            if (formula.isHit) {
                continue;
            }

            let scene = this;

            this.physics.add.collider(
                formula.background,
                cannonBallObject,
                function (_background, _cannonBall) {
                    scene.removeCannonBall(cannonBallObject);

                    let hitFormula = scene.displayingFormulas.find(item => item.background === _background);
                    scene.formulaHasBeenHit(hitFormula);
                }
            )
        }
    }

    addExistingCollisionsToNewFormula(cardBackgroundObj) {

        // TODO: пересмотреть код, может стоит его удалить?
        for (let cannonBall of this.displayingCannonBalls) {

            this.physics.add.collider(
                cardBackgroundObj,
                cannonBall.cannon,
                function (_formula, _cannonBall) {
                    console.log("I was trying to destroy a ball (2)");

                }
            )
        }
    }

    removeCannonBall(cannonBallObject) {
        this.displayingCannonBalls
            = this.displayingCannonBalls.filter(item => item.cannonBall !== cannonBallObject);

        cannonBallObject.destroy();
    }

    placeRule(formula) {
        let sizer = this.sizer;

        let background_RightX = sizer.ruleBackground_RightX();
        let background_BottomY = sizer.ruleBackground_BottomY();
        let background = this.physics.add.image(background_RightX, background_BottomY, 'cardBackground_Regular_For_Rule');
        background.setOrigin(1, 1);

        let RuleCenterX = background_RightX - background.displayWidth / 2;
        let RuleCenterY = background_BottomY - background.displayHeight / 2;
        console.log("center for rule", RuleCenterX, RuleCenterY);

        let ruleFontSize = sizer.scoreRule_FontSize();
        let ruleColor = sizer.scoreRule_Color();

        // this.add.text(ruleRightX - 550, ruleBottomY - 200, 'The rule',
        //     { fontSize: ruleFontSize, color: ruleColor })
        //     .setOrigin(1);

        // this.add.text(ruleRightX - 550/2, background_BottomY - backgroundHeight / 2 - ruleFontSize / 2, 'The rule',
        //     { fontSize: ruleFontSize, color: ruleColor })
        // const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        // const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        // text in the center of the screen
        // console.log(screenCenterX, screenCenterY)

        // this.add.text(screenCenterX, screenCenterY, 'The rule',
        //     { fontSize: ruleFontSize, color: ruleColor }).setOrigin(0.5)

        let formulaOrigin = formula.origin;
        let formulaTarget = formula.target;
        let rule = formulaOrigin + " -> " + formulaTarget;

        this.add.text(RuleCenterX, RuleCenterY, rule,
            { fontSize: ruleFontSize, color: ruleColor })
            .setOrigin(0.5);
    }

    formulaHasBeenHit(formula) {
        formula.isHit = true;

        formula.background.setTexture('cardBackground_Hit');

        let shadowX = this.sizer.cardBackground_ShadowX();
        formula.formula.x += shadowX;

        let shadowY = this.sizer.cardBackground_ShadowY();
        formula.formula.y += shadowY;

        if (formula.arrow && formula.scoreForHit < 0) {
            formula.arrow.setTexture('arrow_Green');
            this.placeRule(formula);

            let scoreRightX = this.sizer.arrowScoreLeft_RightX();
            let scoreCenterY = formula.arrow.y;
            let scoreFontSize = this.sizer.arrowScore_FontSize();
            let scoreColor = this.sizer.arrowScore_Color();
            formula.leftScore = this.add.text(
                scoreRightX, scoreCenterY,
                formula.scoreForHit,
                { fontSize: scoreFontSize, color: scoreColor }
            ).setOrigin(1, 0.5);

            this.score += formula.scoreForHit;
        }

        if (formula.arrow && 0 < formula.scoreForHit) {
            formula.arrow.setTexture('arrow_Red');

            let scoreLeftX = this.sizer.arrowScoreRight_LeftX();
            let scoreCenterY = formula.arrow.y;
            let scoreFontSize = this.sizer.arrowScore_FontSize();
            let scoreColor = this.sizer.arrowScore_Color();
            formula.rightScore = this.add.text(
                scoreLeftX, scoreCenterY,
                '+' + formula.scoreForHit,
                { fontSize: scoreFontSize, color: scoreColor }
            ).setOrigin(0, 0.5);

            this.score += formula.scoreForHit;
        }

        let formattedScore = this.formatScore(this.score);
        this.scoreValueText.setText(formattedScore);
    }

    placeScoreLabels() {
        let labelRightX = this.sizer.scoreLabel_RightX();
        let labelBottomY = this.sizer.scoreLabel_BottomY();
        let labelFontSize = this.sizer.scoreLabel_FontSize();
        let labelColor = this.sizer.scoreLabel_Color();
        this.add.text(labelRightX, labelBottomY, 'score:',
            { fontSize: labelFontSize, color: labelColor })
            .setOrigin(1);

        let valueRightX = this.sizer.scoreValue_RightX();
        let valueBottomY = this.sizer.scoreValue_BottomY();
        let valueFontSize = this.sizer.scoreValue_FontSize();
        let valueColor = this.sizer.scoreValue_Color();
        this.scoreValueText = this.add.text(valueRightX, valueBottomY, '000000',
            { fontSize: valueFontSize, color: valueColor })
            .setOrigin(1);
    }

    formatScore(score) {
        let signString = score < 0 ? "-" : "";
        let valueString = String(Math.abs(this.score)).padStart(6, '0');

        return signString + valueString;
    }

}