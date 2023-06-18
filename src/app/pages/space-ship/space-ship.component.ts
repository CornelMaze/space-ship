import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

interface BALL {
  x: number;
  y: number;
  size: number;
  color: string;
}

@Component({
  selector: 'app-space-ship',
  templateUrl: './space-ship.component.html',
  styleUrls: ['./space-ship.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpaceShipComponent {
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
    src: '../../../assets/rocket-ship.png',
    waitTime: 5,
  };
  bullet: BALL = {
    x: 100,
    y: 50,
    size: 5,
    color: 'rgb(0,0,255)',
  };
  bullets: BALL[] = [];
  allien: BALL = {
    x: 100,
    y: 50,
    size: 10,
    color: 'rgb(0,0,255)',
  };
  alliens: BALL[] = [];
  speed = 5;

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
    switch (event.code) {
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
        newBullet.x = this.ship.x + this.ship.width / 2;
        newBullet.y = this.ship.y;
        this.bullets.push(newBullet);
        break;
    }
    this.drawShip();
  }

  ngOnInit(): void {
    this.canvas = this.myCanvas.nativeElement as HTMLCanvasElement;
    let context = this.canvas.getContext('2d');
    this.context = context!;
    this.canvas.width = 320;
    this.canvas.height = 640;
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

  createAlliens() {
    let newAllien = Object.create(this.allien);
    let xPos = Math.floor(Math.random() * this.canvas.width);
    newAllien.x = xPos + newAllien.size;
    newAllien.y = 0;
    newAllien.size = this.allien.size;

    let RED = Math.floor(Math.random() * 255);
    let GREEN = Math.floor(Math.random() * 255);
    let BLUE = Math.floor(Math.random() * 255);
    let alpha = Math.ceil(Math.random() * 10) * 0.1;
    newAllien.color = `rgba(${RED}, ${GREEN}, ${BLUE}, ${alpha})`;
    this.alliens.push(newAllien);
  }

  drawAlliens() {
    for (let allien of this.alliens) {
      this.context.beginPath();
      this.context.fillStyle = allien.color;
      this.context.arc(allien.x, allien.y, allien.size, 0, 360, false);
      this.context.fill();
      this.context.closePath();
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
      this.context.beginPath();
      this.context.fillStyle = bullet.color;
      this.context.arc(bullet.x, bullet.y, bullet.size, 0, 360, false);
      this.context.fill();
      this.context.closePath();
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
        console.log(this.score, 'score');
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
