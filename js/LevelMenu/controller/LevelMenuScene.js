class LevelMenuScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_MENU);
    }

    preload() {
        this.load.json('levelsInfo', '/js/GameConfiguration/levelsInfo.json');
        this.load.image('cardBackground', '/js/LevelMenu/src/cardBackground.png');
        this.load.image('cardBackground_Bordered', '/js/LevelMenu/src/cardBackground_Bordered.png');
    }

    create() {
        this.levelsInfo = this.cache.json.get('levelsInfo');

        this.sizer = new LevelMenuSizer(this);

        this.placeLevelCards();
    }

    placeLevelCards() {
        this.placeMainMenuButton();

        for (let level of this.levelsInfo.levels) {
            let cardBackground = this.placeCardBackground(level.index);
            this.placeCardIndex(level.index, cardBackground);
            this.placeCardDescription(level.index);
        }
    }

    placeMainMenuButton() {
        let sizer = this.sizer;
        let scene = this;

        WebFont.load({
            'custom': {
                families: ['Ribeye', 'RibeyeMarrow']
            },
            active: function () {
                let leftX = sizer.mainMenuButton_LeftX();
                let topY = sizer.mainMenuButton_TopY();

                let fontSize = sizer.mainMenuButton_fontSize();
                let fontColor = sizer.mainMenuButton_fontColor();

                let mainMenuButton = scene.add.text(leftX, topY,
                    '<- main menu', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });
                mainMenuButton.setInteractive();
                mainMenuButton.on('pointerover', () => {
                  mainMenuButton.setFontFamily('Ribeye');
                });
                mainMenuButton.on('pointerout', () => {
                    mainMenuButton.setFontFamily('RibeyeMarrow');
                });
                mainMenuButton.on('pointerup', () => {
                    scene.scene.start(GC.SCENES.MAIN_MENU);
                });
            }
        })
    }

    placeCardBackground(index) {
        const leftX = this.sizer.backgroundRectangle_LeftX(index);
        const topY = this.sizer.backgroundRectangle_TopY(index);

        let cardBackground = this.add.image(leftX, topY, 'cardBackground');
        cardBackground.setOrigin(0);

        cardBackground.setInteractive();
        cardBackground.on('pointerover', () => {
            cardBackground.setTexture('cardBackground_Bordered');
        });
        cardBackground.on('pointerout', () => {
            cardBackground.setTexture('cardBackground');
        });
        cardBackground.on('pointerup', () => {
            let basePath = "/js/GameConfiguration";
            let initialExpressionPath = basePath + this.levelsInfo.levels[index - 1].initialExpressions;
            let substitutionsPath = basePath + this.levelsInfo.levels[index - 1].substitutions;
            let numberOfFormulas = this.levelsInfo.levels[index - 1].numberOfFormulas;

            this.scene.start(GC.SCENES.LEVEL_GENERATION, {
                'numberOfFormulas': numberOfFormulas,
                'initialExpressionPath': initialExpressionPath,
                'substitutionsPath': substitutionsPath,
                'levelNumber' : index - 1
            });
        });

        return cardBackground;
    }

    placeCardIndex(index, cardBackground) {
        let sizer = this.sizer;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['Ribeye', 'RibeyeMarrow']
            },
            active: function () {
                let centerX = sizer.cardIndex_CenterX(index);
                let topY = sizer.cardIndex_TopY(index);

                let fontSize = sizer.cardIndex_fontSize();
                let fontColor = sizer.cardIndex_fontColor();

                let cardIndex = add.text(centerX, topY,
                    index, { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });
                cardIndex.setOrigin(0.5, 0);

                cardBackground.on('pointerover', () => {
                    cardIndex.setFontFamily('Ribeye');
                });
                cardBackground.on('pointerout', () => {
                    cardIndex.setFontFamily('RibeyeMarrow');
                })
            }
        });
    }

    placeCardDescription(index) {
        let sizer = this.sizer;
        let add = this.add;
        let description = this.levelsInfo.levels[index - 1].description;

        WebFont.load({
            'custom': {
                families: ['RhodiumLibre']
            },
            active: function () {
                let centerX = sizer.cardDescription_CenterX(index);
                let centerY = sizer.cardDescription_CenterY(index);
                let fontSize = sizer.cardDescription_FontSize(index);
                let color = sizer.cardDescription_Color(index);

                add.text(
                    centerX, centerY,
                    description,
                    { fontFamily: 'RhodiumLibre', fontSize: fontSize, color: color }
                ).setOrigin(0.5);
            }
        })
    }

}