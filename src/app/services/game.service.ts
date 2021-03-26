import { Injectable, Input } from '@angular/core';
import { Obstacles } from '../interfaces/obstacles';
import { PlayerPosition } from '../interfaces/player-position';
import { SingleObstacles } from '../interfaces/single-obstacle';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import * as CONFIG from './../config/config';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Input() public width: number = CONFIG.playGroundWidth;
	@Input() public height: number = CONFIG.playGroundHeight;
	frameNumber: number = CONFIG.frameNumber;
	player: PlayerPosition = {
		x: CONFIG.playGroundWidth / 2 - CONFIG.playerAvatar.width,
		y: CONFIG.playGroundHeight - (CONFIG.playerAvatar.height + CONFIG.playerAvatar.height / 2),
	};

	context: CanvasRenderingContext2D;
	obstacles: Array<Obstacles> = [];
	image: HTMLImageElement = null;
	gameLoop =  null;
	moveUP = false;
	moveDown = false;
	moveLeft = false;
	moveRight = false;

  avoided = 0;

	loadAssets(canvasElement: HTMLCanvasElement): Promise<void>  {
		this.context = canvasElement.getContext('2d');
		canvasElement.width = this.width;
		canvasElement.height = this.height;
		return new Promise((resolve, reject) => {
			this.image = new Image();
			this.image.src = CONFIG.spritePath;
			this.image.width = 58;
			this.image.height = 128;
			resolve();
		});
	}

	startGameLoop() {
		this.gameLoop = setInterval(() => {
			this.suffleProperties();
			this.cleanGround();
			this.createObstacles();
			this.moveObstacles();
			this.createPlayer();
		}, 10);
	}

	animationFrame(n: number): boolean {
		if ((this.frameNumber / n) % 1 === 0) { return true; }
		return false;
	}

	suffleProperties(): void {
		this.frameNumber += 1;
	}

	createObstacles(): void {
		if (this.frameNumber === 1 || this.animationFrame(100)) {
			if (this.obstacles.length > 20) {
				this.obstacles.splice(0, 5);
			}
			this.getSingleObstacle();
		}
	}

	getSingleObstacle(): void {
		const context: CanvasRenderingContext2D = this.context;
		const image: HTMLImageElement = this.image;
		const randomViruses: SingleObstacles = CONFIG.viruses[Math.floor(Math.random() * CONFIG.viruses.length)];

		this.obstacles.push(new function () {
			this.x = Math.floor(Math.random() * 450) + 0,
			this.y = Math.floor(Math.random() * -15) + 0,
			this.width = randomViruses.width;
			this.height = randomViruses.height;
			this.update = () => {
				context.drawImage(
					image,
					randomViruses.sX, randomViruses.sY,
					randomViruses.sWidth, randomViruses.sHeight,
					this.x, this.y,
					randomViruses.width, randomViruses.height
				);
			};
		});
	}

	moveObstacles(): void {
		this.obstacles.forEach((element: Obstacles, index: number) => {
			element.y += 3;
			element.update();
			this.detectCrash(element);
			if (element.y > this.height) {
				this.obstacles.splice(index, 1);
			}
		});
	}

	createPlayer(): void {
		if (this.moveUP) {
			if (this.player.y === 0) {
				this.player.y = 0;
			} else {
				this.player.y -= CONFIG.playerSpeed;
			}
		} else if (this.moveDown) {
			if (this.player.y + CONFIG.playerAvatar.height === CONFIG.playGroundHeight ||
				this.player.y + CONFIG.playerAvatar.height > CONFIG.playGroundHeight) {
				this.player.y = CONFIG.playGroundHeight - CONFIG.playerAvatar.height;
			} else {
				this.player.y += CONFIG.playerSpeed;
			}
		} else if (this.moveLeft) {
			if (this.player.x === 0 || this.player.x < 0 ) {
				this.player.x = 0;
			} else {
				this.player.x -= CONFIG.playerSpeed;
			}
		} else if (this.moveRight) {
			if (this.player.x + CONFIG.playerAvatar.sWidth === CONFIG.playGroundWidth ||
				this.player.x + CONFIG.playerAvatar.sWidth > CONFIG.playGroundWidth) {
				this.player.x = CONFIG.playGroundWidth - CONFIG.playerAvatar.width;
			} else {
				this.player.x += CONFIG.playerSpeed;
			}
		}
		this.context.drawImage(
			this.image,
			CONFIG.playerAvatar.sX, CONFIG.playerAvatar.sY,
			CONFIG.playerAvatar.sWidth, CONFIG.playerAvatar.sHeight,
			this.player.x, this.player.y,
			CONFIG.playerAvatar.width, CONFIG.playerAvatar.height,
		);
	}

	detectCrash(obstacle: Obstacles ): void {

		const componentLeftSide = obstacle.x;
		const componentRightSide = obstacle.x + obstacle.width;
		const componentTop = obstacle.y;
		const componentBottom = obstacle.y + obstacle.height;

		const playerRightSide = this.player.x + CONFIG.playerAvatar.width;
		const playerLeftSide = this.player.x;
		const playerTop = this.player.y;
		const playerBottom = this.player.y + CONFIG.playerAvatar.height;

		if ((
				(playerRightSide > componentLeftSide) && (playerTop < componentBottom)
			) && (
				(playerLeftSide < componentRightSide) && (playerTop < componentBottom)
			) && (
				(playerRightSide > componentLeftSide) && (playerBottom > componentTop)
			) && (
				(playerLeftSide < componentRightSide) && (playerBottom > componentTop)
			)
		) {
			clearInterval(this.gameLoop);
			// alert('Game Over');
      Swal.fire({
        title: 'Positive!',
        text: `You've been infected with the virus.`,
        allowOutsideClick: false,
        allowEnterKey: false,
        showCancelButton: true,
        confirmButtonText: 'Retry',
        cancelButtonText: 'Exit',
        imageUrl: 'assets/virus-1.png'
      }).then(result => {
        if (result.value) {
          window.location.reload();
        } else if (result.isDismissed) {
          console.log('end game');
        }
      });
      // Swal.fire(`Positive!`, `You've been infected with the COVID-19 virus.`, 'error')
      //   .then(result => console.log(result));
			// window.location.reload();
		} else {
      // console.log(this.avoided += 1);
    }
	}

	cleanGround(): void {
		this.context.clearRect(0, 0, CONFIG.playGroundWidth, CONFIG.playGroundHeight);
	}
}
