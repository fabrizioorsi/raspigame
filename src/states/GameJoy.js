import Phaser from 'phaser'
import Logo from '../sprites/Logo'
const SERVER_IP = 'https://my-site.dev:8002/'
let socket = null

export default class extends Phaser.State {
  init () {}
  preload () {
    this.game.time.advancedTiming = true;
    this.speed = 0;
    this.accelerating = false;
  }

  create () {
    socket = io(SERVER_IP, { transports: ['websocket'], rejectUnauthorized: false  })

    socket.on('connect', () => {
         alert(`conneted`)
    })
    socket.on('connect_error', (error) => {
        alert(`no goo!! ${SERVER_IP} ${JSON.stringify(error)}`)
    })


        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

        this.stick = this.pad.addStick(0, 0, 100, 'generic');
        this.stick.alignBottomLeft(0);
        this.stick.scale = 0.7;
        this.stick.motionLock = Phaser.VirtualJoystick.HORIZONTAL;

        this.buttonA = this.pad.addButton(600, 320, 'generic', 'button1-up', 'button1-down');
        this.buttonA.onDown.add(this.pressButtonA, this);
        this.buttonA.onUp.add(this.releaseButtonA, this);
        this.buttonA.alignBottomRight(20);

        this.buttonB = this.pad.addButton(515, 320, 'generic', 'button2-up', 'button2-down');
        this.buttonB.onDown.add(this.pressButtonB, this);
        this.buttonA.onUp.add(this.releaseButtonB, this);
        this.buttonB.alignBottomRight(60);

        
  }

  update() {
    
    
    if (this.stick.isDown)
        {
          console.log(this.stick.force);
            //this.car.body.rotateLeft(this.stick.forceX * 100 * -1);

              //this.car.body.angularVelocity = this.stick.forceX * 12 * (this.speed / 1000)
            
              
            
        }

    
  }

  render () {
    this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00');
    
    
  }


   pressButtonA() {
    this.accelerating = true
    this.backward = false
    socket.emit('joystick-accelerating', true)

    //this.speed = 200
      
    }

    releaseButtonA() {
    this.accelerating = false
    this.backward = false
    socket.emit('joystick-accelerating', false)
    //this.speed = 0
    }

    pressButtonB() {
    this.accelerating = false
    this.backward = true
    socket.emit('joystick-decelerating', true)
    //this.speed = -200
      
    }

    releaseButtonB() {
    this.accelerating = false
    this.backward = false
    socket.emit('joystick-decelerating', false)
    }

    pressButtonC (){

        //this.sprite.scale.set(1);
        //this.sprite.tint = 0xFFFFFF;

    }
}
