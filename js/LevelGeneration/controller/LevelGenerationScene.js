class LevelGenerationScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.LEVEL_GENERATION);
    }

    init(params) {
        this.levelGenerationInfo = params;
        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressionsPath = params.initialExpressionPath;
        this.substitutionsPath = params.substitutionsPath;

        this.generator = undefined;
        this.formulas = [];
    }

    preload() {
        this.load.json(this.initialExpressionsPath, this.initialExpressionsPath);
        this.load.json(this.substitutionsPath, this.substitutionsPath);
    }

    deepClone(aObject) {
        if (typeof aObject != "object") {
            return aObject;
        }

        let v;
        let bObject = Array.isArray(aObject) ? [] : {};
        for (let prop in aObject) {
            v = aObject[prop];
            bObject[prop] = (typeof v === "object") ? this.deepClone(v) : v;
        }

        return bObject;
    }

    create() {
        this.initialExpressions = this.deepClone(this.cache.json.get(this.initialExpressionsPath));
        this.substitutions = this.deepClone(this.cache.json.get(this.substitutionsPath));

        this.sizer = new LevelGenerationSizer(this);
        this.generator = new LevelFormulaGenerator(this, {
            'numberOfFormulas': this.numberOfFormulas,
            'initialExpressions': this.initialExpressions.expressions,
            'substitutions': this.substitutions.substitutions
        });

        this.placeDescription();
        this.placeLoadingBarBackground();

        this.loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x6B4800
            }
        })
    }

    update() {
        if (this.generator.levelComplete()) {
            this.scene.start(GC.SCENES.LOADING_RESOURCES, {
                'formulas': this.formulas,
                'levelGenerationInfo': this.levelGenerationInfo
            });
        }

        let formula = this.generator.nextFormula();
        this.formulas.push(formula);

        let progress = this.generator.progress();

        let leftX = this.sizer.loadingBar_LeftX();
        let topY = this.sizer.loadingBar_TopY();
        let width = progress * this.sizer.loadingBar_Width();
        let height = this.sizer.loadingBar_Height();
        let radius = this.sizer.loadingBar_Radius();

        this.loadingBar.fillRoundedRect(leftX, topY, width, height, radius);
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
                    'Generating the level', { fontFamily: 'RhodiumLibre', fontSize: fontSize, color: fontColor });
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