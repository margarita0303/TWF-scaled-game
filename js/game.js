const config = {
    // width: 1200,
    // height: 900,
    backgroundColor: 0xffcc66,
    type: Phaser.AUTO,
    scene: [
        MainMenuScene,
        LevelMenuScene,
        LevelGenerationScene,
        LoadingResourcesScene,
        GameScene,
        GamePauseScene,
        GameCompleteScene,
        HowToPlayScene
    ],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 900
    }
};

let game = new Phaser.Game(config);