class HowToPlayScene extends Phaser.Scene {

    constructor() {
        super(GC.SCENES.HOW_TO_PLAY);
    }

    init(params) {}

    create() {
        this.sizer = new HowToPlaySizer(this);
        this.placeMainMenuButton();
        this.placeText();
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

    placeText() {
        let sizer = this.sizer;
        let scene = this;

        let centerX = sizer.screenCenterX();
        let centerY = sizer.screenCenterY();

        let fontSize = sizer.textFontSize();
        let fontColor = sizer.textFontColor();

        let howToPlayText = 'Fire a cannon at improperly converted expressions\n\n' +
                            'For each correct choice you will get 30 points\n' +
                            'and for incorrect choice you will lose 30 points\n\n' +
                            'The level will be considered passed if you get \na positive number of points\n\n' +
                            'Good luck! =)'

        let text = scene.add.text(centerX, centerY, howToPlayText, { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor }).setOrigin(0.5, 0.5);
    }
}