class LoadingResourcesScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.LOADING_RESOURCES);
    }

    init(params) {
        this.levelGenerationInfo = params.levelGenerationInfo;
        this.formulas = params.formulas;
        this.levelNumber = params.levelNumber;
    }

    preload() {
        this.load.image('cannon', '/js/LoadingResources/assets/cannon.png');
        this.load.image('cannonBall', '/js/LoadingResources/assets/cannonBall.png');
        this.load.image('cardBackground_Regular', '/js/LoadingResources/assets/cardBackground_Regular.png');
        this.load.image('cardBackground_Regular_For_Rule', '/js/LoadingResources/assets/cardBackground_Regular_For_Rule.png');
        this.load.image('cardBackground_Hit', '/js/LoadingResources/assets/cardBackground_Hit.png');

        this.load.image('arrow', '/js/LoadingResources/assets/arrow.png');
        this.load.image('arrow_Green', '/js/LoadingResources/assets/arrow_Green.png');
        this.load.image('arrow_Red', '/js/LoadingResources/assets/arrow_Red.png');

        this.load.image('pauseMenuBackground', '/js/LoadingResources/assets/pauseMenuBackground.png');
        this.load.image('congrats', '/js/LoadingResources/assets/congrats.png')

        for (let formula of this.formulas) {
            this.load.image(formula.label, formula.url);
        }

        this.sizer = new LoadingResourcesSizer(this);

        this.placeDescription();
        this.placeLoadingBarBackground();

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x6B4800
            }
        });

        this.load.on('progress', (progress) => {
            let leftX = this.sizer.loadingBar_LeftX();
            let topY = this.sizer.loadingBar_TopY();
            let width = progress * this.sizer.loadingBar_Width();
            let height = this.sizer.loadingBar_Height();
            let radius = this.sizer.loadingBar_Radius();

            if (30 <= width) {
                loadingBar.fillRoundedRect(leftX, topY, width, height, radius);
            }
        });
    }

    create() {
        console.log("LevelNumber in lr", this.levelNumber)
        this.scene.start(GC.SCENES.GAME, {
            'formulas': this.formulas,
            'levelGenerationInfo': this.levelGenerationInfo,
            'levelNumber' : this.levelNumber
        });
    }

    placeDescription() {
        let sizer = this.sizer;
        let add = this.add;

        WebFont.load({
            'custom': {
                families: ['RhodiumLibre']
            },
            active: function () {
                let centerX = sizer.description_CenterX();
                let centerY = sizer.description_CenterY();

                let fontSize = sizer.description_FontSize();
                let fontColor = sizer.description_FontColor();

                let description = add.text(centerX, centerY,
                    'Loading resources', { fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor });
                description.setOrigin(0.5);
            }
        });
    }

    placeLoadingBarBackground() {
        let leftX = this.sizer.loadingBarBackground_LeftX();
        let topY = this.sizer.loadingBarBackground_TopY();
        let width = this.sizer.loadingBarBackground_Width();
        let height = this.sizer.loadingBarBackground_Height();
        let radius = this.sizer.loadingBarBackground_Radius();

        let loadingBarBackground = this.add.graphics({
            fillStyle: {
                color: 0xD3A447
            }
        });

        loadingBarBackground.fillRoundedRect(leftX, topY, width, height, radius);
    }

}