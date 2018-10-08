import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  preload () {
    this.loaderBg = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBg'
    )
    this.loaderBar = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'loaderBar'
    )
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('logo', 'assets/images/logo.png')
    this.load.image('car', 'assets/images/car.png');
    this.load.image('racetrack', 'assets/images/racetrack.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.atlas('generic', 'assets/images/virtualjoystick/skins/generic-joystick.png', 'assets/images/virtualjoystick/skins/generic-joystick.json');
    this.load.image('bg', 'assets/images/virtualjoystick/barbarian_loading.png');
  }

  create () {
    this.state.start('Game')
  }
}
