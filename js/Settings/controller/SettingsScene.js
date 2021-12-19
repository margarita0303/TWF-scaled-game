class SettingsScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.SETTINGS);
    }

    init(params) {}

    create() {
        this.sizer = new SettingsSizer(this);
        this.placeMainMenuButton();
        this.placeChooseSpeedButton();
        this.placeVariantsOfSpeed();
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

    placeChooseSpeedButton() {
        let sizer = this.sizer;
        let scene = this;

        let centerX = sizer.screenCenterX();
        let speedY = sizer.chooseSpeedY();

        let fontSize = sizer.textFontSize();
        let fontColor = sizer.textFontColor();

        let chooseSpeedText = "Choose speed";
        let chooseSpeedButton = scene.add.text(centerX, speedY, chooseSpeedText, { fontFamily: 'Ribeye', fontSize: fontSize, color: fontColor }).setOrigin(0.5, 0.5);
    }

    placeVariantsOfSpeed() {
        let sizer = this.sizer;
        let scene = this;

        let centerX = sizer.screenCenterX();
        let easySpeedY = sizer.easySpeedY();
        let mediumSpeedY = sizer.mediumSpeedY();
        let hardSpeedY = sizer.hardSpeedY();

        let fontSize = sizer.textFontSize();
        let fontColor = sizer.textFontColor();

        let easyButton = scene.add.text(centerX, easySpeedY, "easy", { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor }).setOrigin(0.5, 0.5);
        easyButton.setInteractive();
        easyButton.on('pointerover', () => {
            easyButton.setFontFamily('Ribeye');
        });
        easyButton.on('pointerout', () => {
            easyButton.setFontFamily('RibeyeMarrow');
        });
        easyButton.on('pointerup', () => {
            scene.scene.start(GC.SCENES.MAIN_MENU);
        });

        let mediumButton = scene.add.text(centerX, mediumSpeedY, "medium", { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor }).setOrigin(0.5, 0.5);
        mediumButton.setInteractive();
        mediumButton.on('pointerover', () => {
            mediumButton.setFontFamily('Ribeye');
        });
        mediumButton.on('pointerout', () => {
            mediumButton.setFontFamily('RibeyeMarrow');
        });
        mediumButton.on('pointerup', () => {
            scene.scene.start(GC.SCENES.MAIN_MENU);
        });

        let hardButton = scene.add.text(centerX, hardSpeedY, "hard", { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor }).setOrigin(0.5, 0.5);
        hardButton.setInteractive();
        hardButton.on('pointerover', () => {
            hardButton.setFontFamily('Ribeye');
        });
        hardButton.on('pointerout', () => {
            hardButton.setFontFamily('RibeyeMarrow');
        });
        hardButton.on('pointerup', () => {
            scene.scene.start(GC.SCENES.MAIN_MENU);
        });
    }
}