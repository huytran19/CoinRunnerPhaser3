import { IImageConstructor } from '~/interfaces/image.interface';

export default class Player extends Phaser.GameObjects.Image {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private walkingSpeed!: number;
  private currentScene: Phaser.Scene;
  private ship!: Phaser.GameObjects.Image;
  private smokeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.currentScene = aParams.scene;
    this.initVariables();
    this.initImage();
    this.initInput();
    this.initParticleEmitter();
    this.scene.add.existing(this);
  }

  initParticleEmitter() {
    const { width, height } = this.currentScene.scale;
    const particles = this.currentScene.add.particles('puff');

    const direction = new Phaser.Math.Vector2(0, 0);
    direction.setToPolar(this.rotation, 1);

    const dx = -direction.x;
    const dy = -direction.y;

    const ox = dx * this.width * 0.55;
    const oy = dy * this.width * 0.55;

    this.smokeEmitter = particles.createEmitter({
      quantity: 5,
      frequency: 15,
      accelerationY: 1000 * dy,
      accelerationX: 1000 * dx,
      speedY: { min: 100 * dy, max: 300 * dy },
      speedX: { min: -10 * dx, max: 10 * dx },
      scale: { start: 0.05, end: 0.01 },
      lifespan: { min: 100, max: 300 },
      alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
      rotate: { min: -180, max: 180 },
      angle: { min: 30, max: 110 },
      blendMode: 'ADD',
      follow: this,
      followOffset: { y: oy },
      tint: 0x8db8fc,
    });
  }

  private initVariables(): void {
    this.walkingSpeed = 7.5;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.handleInput();
  }

  private handleInput(): void {
    if (this.cursors.left.isDown) {
      this.angle -= this.walkingSpeed;
    } else if (this.cursors.right.isDown) {
      this.angle += this.walkingSpeed;
    }

    const direction = new Phaser.Math.Vector2(0, 0);
    direction.setToPolar(this.rotation, 1);
    const dx = direction.x;
    const dy = direction.y;

    if (this.cursors.up.isDown) {
      this.x += this.walkingSpeed * dx;
      this.y += this.walkingSpeed * dy;
    }
    if (this.smokeEmitter) {
      const ox = -dx * this.width * 0.55;
      const oy = -dy * this.width * 0.55;

      const ddx = -dx;
      const ddy = -dy;

      this.smokeEmitter.setSpeedX({ min: -10 * ddx, max: 10 * ddx });
      this.smokeEmitter.setSpeedY({ min: 100 * ddy, max: 300 * ddy });
      this.smokeEmitter.accelerationX.propertyValue = 1000 * ddx;
      this.smokeEmitter.accelerationY.propertyValue = 1000 * ddy;
      this.smokeEmitter.followOffset.x = ox;
      this.smokeEmitter.followOffset.y = oy;
    }
  }
}
