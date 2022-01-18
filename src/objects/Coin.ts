import { IImageConstructor } from '~/interfaces/image.interface';

export default class Coin extends Phaser.GameObjects.Image {
  private centerOfScreen!: number;
  private changePositionTimer!: Phaser.Time.TimerEvent;
  private lastPosition!: string;
  private currentScene!: Phaser.Scene;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.currentScene = aParams.scene;
    this.initVariables();
    this.initImage();
    this.initEvents();
    this.initParticle();
    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.centerOfScreen = this.scene.sys.canvas.width / 2;
    this.changePositionTimer;
    this.setFieldSide();
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initEvents(): void {
    this.changePositionTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true,
    });
  }

  update(): void {}

  public changePosition(): void {
    this.setNewPosition();
    this.setFieldSide();

    this.changePositionTimer.reset({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true,
    });
  }

  private setNewPosition(): void {
    if (this.lastPosition == 'right') {
      this.x = Phaser.Math.RND.integerInRange(100, this.centerOfScreen);
    } else {
      this.x = Phaser.Math.RND.integerInRange(385, 700);
    }
    this.y = Phaser.Math.RND.integerInRange(100, 500);
  }

  private setFieldSide(): void {
    if (this.x <= this.centerOfScreen) {
      this.lastPosition = 'left';
    } else {
      this.lastPosition = 'right';
    }
  }

  public initParticle(): void {
    const particles = this.currentScene.add.particles('flash');

    this.currentScene.events.on('trail-to', (data) => {
      const emitter = particles.createEmitter({
        x: data.fromX,
        y: data.fromY,
        quantity: 5,
        speed: { random: [50, 100] },
        lifespan: { random: [200, 400] },
        scale: { start: 0.02, end: 0.008 },
        rotate: { random: true, start: 0, end: 180 },
        angle: { random: true, start: 0, end: 270 },
      });

      const xVals = [data.fromX, 300, 100, data.toX];
      const yVals = [data.fromY, 100, 150, data.toY];

      this.currentScene.tweens.addCounter({
        from: 0,
        to: 1,
        ease: Phaser.Math.Easing.Sine.InOut,
        duration: 1000,
        onUpdate: (tween) => {
          const v = tween.getValue();
          const x = Phaser.Math.Interpolation.CatmullRom(xVals, v);
          const y = Phaser.Math.Interpolation.CatmullRom(yVals, v);

          emitter.setPosition(x, y);
        },
        onComplete: () => {
          emitter.explode(50, data.toX, data.toY);
          emitter.stop();

          this.currentScene.time.delayedCall(1000, () => {
            particles.removeEmitter(emitter);
          });
        },
      });
    });
  }
}
