import Phaser from 'phaser'
import Logo from '../sprites/Logo'


export default class extends Phaser.State {
  init () {}
  preload () {
    this.game.time.advancedTiming = true;
    this.speed = 0;
    this.accelerating = false;
  }

  create () {
    const SERVER_IP = 'https://my-site.dev:8002'
    let socket = null

    socket = io(SERVER_IP)

    socket.on('client-accelerating', (val) => {
      this.accelerating = val
      this.backward = !val
    });

    socket.on('client-decelerating', (val) => {
      this.accelerating = !val
      this.backward = val
    });

    var trackInnerVertices = [230,120, 150,200, 150,250, 250,250, 550,250, 600,300, 600,400, 550,450, 150,450, 150,490, 620,490, 670,440, 670,170, 620,120, 230,120];
    this.cursors = game.input.keyboard.createCursorKeys();
    //Vertices to create chainSHape that forms the outer wall of the entire racetrack
    var trackOuterVertices = [200,20, 50,150, 50,300, 100,350, 500,350, 500,360, 100,360, 50,400, 50,540, 100,590, 720,590, 770,540, 770,70, 720,20, 200,20];
    this.game.world.setBounds(0, 0, 800, 600);
    //this.game.stage.backgroundColor = '#124184';

    // Enable Box2D physics
    this.game.physics.startSystem(Phaser.Physics.BOX2D);
    //this.game.physics.box2d.gravity.y = 50;
    this.game.physics.box2d.setBoundsToWorld();
    this.game.physics.box2d.friction = 0.6;
    game.add.sprite(0, 0, 'racetrack');
    var innerTrack = new Phaser.Physics.Box2D.Body(game, null, 0, 0, 0);
    innerTrack.setChain(trackInnerVertices);
    
    var outerTrack = new Phaser.Physics.Box2D.Body(game, null, 0, 0, 0);
    outerTrack.setChain(trackOuterVertices);
    //Create car
    this.car = game.add.sprite(730, game.world.centerY, 'car');
    this.game.physics.box2d.enable(this.car);
    this.car.body.setRectangle(18, 28, 0, 0, 0);
    this.car.body.linearDamping = 1.6;
    this.game.camera.follow(this.car); 
    this.game.camera.scale.setTo(1.5, 1.5);


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
    this.car.body.setZeroRotation();
    //this.car.body.angularVelocity = 0
    //this.game.debug.spriteInfo(this.logo, 32, 32)
    //this.game.debug.box2dWorld();

    this.car.body.velocity.x = this.speed * Math.cos((this.car.body.angle -90 ) * 0.01745)
    this.car.body.velocity.y = this.speed * Math.sin((this.car.body.angle - 90) * 0.01745)
    if (this.accelerating) {
      this.car.body.thrust(400);
      if (this.speed < 100 )  this.speed += 10
    } 
    if (this.backward) {
      this.car.body.thrust(-400);
      if (this.speed > -50 )  this.speed -= 10
    }
    
    if (this.stick.isDown)
        {
          console.log(this.stick.force);
            //this.car.body.rotateLeft(this.stick.forceX * 100 * -1);

              this.car.body.angularVelocity = this.stick.forceX * 12 * (this.speed / 1000)
            
              
            
        }
    if (this.cursors.left.isDown)
    {
        this.car.body.angularVelocity = -3 * 12 * (this.speed / 1000) 
    }
    else if (this.cursors.right.isDown)
    {
        this.car.body.angularVelocity = 3 * 12 * (this.speed / 1000)
    }

    
  }

  render () {
    this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00');
    
    
  }


   pressButtonA() {
    this.accelerating = true
    this.backward = false
    //this.speed = 200
      
    }

    releaseButtonA() {
    this.accelerating = false
    this.backward = false
    //this.speed = 0
    }

    pressButtonB() {
    this.accelerating = false
    this.backward = true
    //this.speed = -200
      
    }

    releaseButtonB() {
    this.accelerating = false
    this.backward = false
    }

    pressButtonC (){

        //this.sprite.scale.set(1);
        //this.sprite.tint = 0xFFFFFF;

    }
}
