import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

interface BALL {
  x: number;
  y: number;
  size: number;
  color?: string;
  src?: string;
}

@Component({
  selector: 'app-space-ship',
  templateUrl: './space-ship.component.html',
  styleUrls: ['./space-ship.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpaceShipComponent {
  scrHeight: any;
  scrWidth: any;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    if (this.canvas) {
      this.canvas.width = this.scrWidth - 20;
      this.canvas.height = this.scrHeight - 140;
    }
  }

  constructor() {
    this.getScreenSize();
  }

  UP = 'ArrowUp';
  DOWN = 'ArrowDown';
  RIGHT = 'ArrowRight';
  LEFT = 'ArrowLeft';
  SPACE = 'Space';
  gameOver = false;
  timer: any = 60;
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  fadeIn = true;
  alpha = 1;
  score = 0;
  ship = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    size: 0,
    width: 24,
    height: 32,
    img: new Image(),
    src: '../../../assets/rocket.svg',
    waitTime: 20,
  };
  bullet: BALL = {
    x: 100,
    y: 50,
    size: 5,
    src: '../../../assets/bullet.svg',
  };
  bullets: BALL[] = [];
  allien: BALL = {
    x: 100,
    y: 50,
    size: 10,
    src: '../../../assets/aliens-svgrepo-com.svg',
  };
  alliens: BALL[] = [];
  speed = 5;
  direction = {
    down: 'ArrowDown',
    up: 'ArrowUp',
    right: 'ArrowRight',
    left: 'ArrowLeft',
    space: 'Space',
  };
  level = 1;
  @HostListener('document:keyup', ['$event'])
  keyupHandler(event: KeyboardEvent) {
    if (this.gameOver) return;
    if (
      event.code === 'ArrowDown' ||
      event.code === 'ArrowUp' ||
      event.code === 'ArrowRight' ||
      event.code === 'ArrowLeft' ||
      event.code === 'Space'
    ) {
      this.context.clearRect(
        this.ship.x,
        this.ship.y,
        this.ship.width,
        this.ship.height
      );
    }
    this.changeDirection(event.code);
  }

  ngOnInit(): void {
    this.canvas = this.myCanvas.nativeElement as HTMLCanvasElement;
    let context = this.canvas.getContext('2d');
    this.context = context!;
    this.canvas.width = this.scrWidth - 20;
    this.canvas.height = this.scrHeight - 140;
    this.positionShip();
    this.drawShip();
    this.drawBullets();
    this.timer = setInterval(() => {
      this.moveBullets();
      this.moveAlliens();
      this.checkCollision();
      this.showScore();
    }, 300);
  }

  restartGame() {
    this.gameOver = false;
    this.bullets = [];
    this.alliens = [];
    this.level = 1;
    this.score = 0;
    this.positionShip();
    this.drawShip();
    this.timer = setInterval(() => {
      this.moveBullets();
      this.moveAlliens();
      this.checkCollision();
      this.showScore();
    }, 300);
  }

  changeDirection(instruction: string) {
    switch (instruction) {
      case this.UP:
        if (this.ship.y <= 0) {
          this.ship.y = 0;
        } else {
          this.ship.y -= this.speed;
        }
        break;
      case this.DOWN:
        if (this.ship.y + this.ship.height >= this.canvas.height) {
          this.ship.y = this.canvas.height - this.ship.height;
        } else {
          this.ship.y += this.speed;
        }
        break;
      case this.LEFT:
        if (this.ship.x <= 0) {
          this.ship.x = 0;
        } else {
          this.ship.x -= this.speed;
        }
        break;
      case this.RIGHT:
        if (this.ship.x + this.ship.width >= this.canvas.width) {
          this.ship.x = this.canvas.width - this.ship.width;
        } else {
          this.ship.x += this.speed;
        }
        break;
      case this.SPACE:
        let newBullet = Object.create(this.bullet);
        newBullet.x = this.ship.x + this.ship.width / 2 - this.bullet.size * 2;
        newBullet.y = this.ship.y - this.ship.height / 2;
        if (this.score > 100) {
          newBullet.src = '../../../assets/bullet-2.svg';
        }
        this.bullets.push(newBullet);
        break;
    }
    this.drawShip();
  }

  createAlliens() {
    if (this.score < 100) {
      this.level = 1;
    } else if (this.score > 100 && this.score < 200) {
      this.level = 2;
      this.ship.waitTime = 15;
    } else if (this.score > 200 && this.score < 300) {
      this.level = 3;
      this.ship.waitTime = 10;
    } else if (this.score > 300 && this.score < 400) {
      this.level = 4;
      this.ship.waitTime = 5;
    } else if (this.score > 400 && this.score < 500) {
      this.level = 5;
    } else {
      this.level = 6;
    }

    let newAllien = Object.create(this.allien);
    let xPos = Math.floor(Math.random() * this.canvas.width);
    newAllien.x = xPos + newAllien.size;
    if (newAllien.x >= this.canvas.width - newAllien.size) {
      newAllien.x = this.canvas.width - newAllien.size * 2;
    }
    if (newAllien.x <= 0) {
      newAllien.x = 0;
    }
    newAllien.y = 0;
    newAllien.size = this.allien.size;

    let chooseAlien = Math.floor(Math.random() * this.level);
    switch (chooseAlien) {
      case 0:
        newAllien.src = '../../../assets/alien-1.svg';
        break;
      case 1:
        newAllien.src = '../../../assets/alien-2.svg';
        break;
      case 2:
        newAllien.src = '../../../assets/alien-3.svg';
        break;
      case 3:
        newAllien.src = '../../../assets/alien-4.svg';
        break;
      case 4:
        newAllien.src = '../../../assets/alien-5.svg';
        break;
      case 5:
        newAllien.src = '../../../assets/alien-6.svg';
        break;
      default:
        newAllien.src = '../../../assets/alien-5.svg';
        break;
    }

    this.alliens.push(newAllien);
  }

  drawAlliens() {
    for (let allien of this.alliens) {
      let newAllien = new Image();
      newAllien.src = allien.src!;
      newAllien.onload = () => {
        this.context.drawImage(newAllien, allien.x, allien.y, 24, 24);
      };
    }
  }

  moveAlliens() {
    this.alliens = this.alliens.filter((allien) => {
      if (allien.y <= this.canvas.height) {
        allien.y += 5;
        return allien;
      }
      if (allien.y >= this.canvas.height) {
        clearInterval(this.timer);
        this.endGame();
      }
      return;
    });
    this.drawAlliens();
  }

  moveBullets() {
    this.clearBullets();
    this.bullets = this.bullets.filter((bullet) => {
      if (bullet.y > 0) {
        bullet.y -= 5;
        return bullet;
      }
      return;
    });
    this.drawBullets();
  }

  positionShip() {
    this.ship.x = this.canvas.width / 2 - this.ship.width / 2;
    this.ship.y = this.canvas.height - this.ship.height;
  }

  drawBullets() {
    for (let bullet of this.bullets) {
      let newBullet = new Image();
      newBullet.src = bullet.src!;
      newBullet.onload = () => {
        this.context.drawImage(newBullet, bullet.x, bullet.y, 24, 24);
      };
    }
  }

  clearBullets() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawShip();
  }

  drawShip() {
    if (this.ship.waitTime === 0) {
      this.createAlliens();
      let randomTime = Math.floor(Math.random() * 20);
      this.ship.waitTime = randomTime;
    } else {
      this.ship.waitTime--;
    }
    let ship = new Image();
    ship.src = this.ship.src;
    ship.onload = () => {
      this.context.drawImage(
        ship,
        this.ship.x,
        this.ship.y,
        this.ship.width,
        this.ship.height
      );
    };
  }

  hitTestCircle(allien: BALL, bullet: BALL) {
    var retval = false;
    var dx = allien.x - bullet.x;
    var dy = allien.y - bullet.y;
    var distance = dx * dx + dy * dy;
    if (distance <= (allien.size + bullet.size) * (allien.size + bullet.size)) {
      retval = true;
    }
    return retval;
  }

  checkCollision() {
    this.bullets.map((bullet, index) => {
      this.alliens = this.alliens.filter((allien) => {
        if (!this.hitTestCircle(bullet, allien)) {
          return allien;
        }
        this.bullets.splice(index, 1);
        this.score += 1;
        return;
      });
    });
  }

  endGame() {
    this.gameOver = true;
    this.context.fillStyle = 'red';
    this.context.font = '34px Arial';

    this.context.fillText(
      'Game Over',
      this.canvas.width / 2 - 90,
      this.canvas.height / 2
    );
  }

  showScore() {
    this.context.fillStyle = 'red';
    this.context.font = '14px Arial';
    this.context.fillText(this.score.toString(), 5, 20);
  }
}
