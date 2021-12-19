class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(GC.SCENES.MAIN_MENU)
    }

    init()
    {
        //  Inject our CSS
        let element = document.createElement('style');
        document.head.appendChild(element);

        let sheet = element.sheet;

        let ribeyeMarrowStyles = '@font-face { font-family: "RibeyeMarrow"; src: url("/fonts/RibeyeMarrow-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ribeyeMarrowStyles, 0);

        let ribeyeStyles = '@font-face { font-family: "Ribeye"; src: url("/fonts/Ribeye-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ribeyeStyles, 0);

        let rhodiumLibreStyles = '@font-face { font-family: "RhodiumLibre"; src: url("/fonts/RhodiumLibre-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(rhodiumLibreStyles, 0);

        let ptMonoStyles = '@font-face { font-family: "PTMono"; src: url("/fonts/PTMono-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(ptMonoStyles, 0);

        let poetsenOneStyles = '@font-face { font-family: "PoetsenOne"; src: url("/fonts/PoetsenOne-Regular.ttf") format("truetype"); }\n';
        sheet.insertRule(poetsenOneStyles, 0);
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        let add = this.add;
        let game = this.game;
        let scene = this.scene;

        let sizer = new MainMenuSizer(this);

        WebFont.load({
            'custom': {
                families: [ 'Ribeye', 'RibeyeMarrow' ]
            },
            active: function() {
                let fontSize = sizer.fontSize();
                let fontColor = sizer.fontColor();

                let playButtonPosition = sizer.position('Play');
                let playButton = add.text(
                    playButtonPosition.x, playButtonPosition.y,
                    'Play', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor});

                playButton.setInteractive();
                playButton.setOrigin(0.5);
                playButton.on('pointerover', () => {
                    playButton.setFontFamily('Ribeye');
                });
                playButton.on('pointerout', () => {
                    playButton.setFontFamily('RibeyeMarrow');
                });
                playButton.on('pointerup', () => {
                    scene.start(GC.SCENES.LEVEL_MENU);
                });

                let howToPlayButtonPosition = sizer.position('How to play');
                let howToPlayButton = add.text(howToPlayButtonPosition.x, howToPlayButtonPosition.y,
                    'How to play', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });

                howToPlayButton.setInteractive();
                howToPlayButton.setOrigin(0.5);
                howToPlayButton.on('pointerover', () => {
                    howToPlayButton.setFontFamily('Ribeye');
                });
                howToPlayButton.on('pointerout', () => {
                    howToPlayButton.setFontFamily('RibeyeMarrow');
                });
                howToPlayButton.on('pointerup', () => {
                    scene.start(GC.SCENES.HOW_TO_PLAY);
                });

                let settingsButtonPosition = sizer.position('Settings');
                let settingsButton = add.text(settingsButtonPosition.x, settingsButtonPosition.y,
                    'Settings', { fontFamily: 'RibeyeMarrow', fontSize: fontSize, color: fontColor });

                settingsButton.setInteractive();
                settingsButton.setOrigin(0.5);
                settingsButton.on('pointerover', () => {
                    settingsButton.setFontFamily('Ribeye');
                });
                settingsButton.on('pointerout', () => {
                    settingsButton.setFontFamily('RibeyeMarrow');
                });
            }
        })
    };
}