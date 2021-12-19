class SettingsSizer {

    constructor(scene) {
        this.scene = scene;
    }

    mainMenuButton_LeftX() {
        return 51;
    }

    mainMenuButton_TopY() {
        return 10;
    }

    mainMenuButton_fontSize() {
        return 60;
    }

    mainMenuButton_fontColor() {
        return '#000';
    }

    screenCenterY() {
        const centerY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2
        return centerY;
    }

    screenCenterX() {
        const centerX = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2
        return centerX
    }

    textFontSize() {
        return 60;
    }

    textFontColor() {
        return '#000';
    }

    chooseSpeedY() {
        const centerY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2
        return centerY-200;
    }

    easySpeedY() {
        const centerY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2
        return centerY-50;
    }

    mediumSpeedY() {
        const centerY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2
        return centerY+50;
    }

    hardSpeedY() {
        const centerY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2
        return centerY+150;
    }
}