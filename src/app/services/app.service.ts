import { EventEmitter, Injectable } from '@angular/core';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  
  isImageLoaded: EventEmitter<number> = new EventEmitter();
	constructor(private gameService: GameService) { }

	createPlayGround(canvasElement): void {
		this.gameService.loadAssets(canvasElement).then( (image) => {
			this.isImageLoaded.emit();
		});
	}

	getImageLoadEmitter() {
		return this.isImageLoaded;
	}

	movePlayer(event: KeyboardEvent, type: string): void {
    if (type === 'keydown') {
      if (event.keyCode === 37) {
        // left
        this.gameService.moveLeft = true;
        this.gameService.moveUP = false;
        this.gameService.moveDown = false;
      } else if (event.keyCode === 39) {
        // right
        this.gameService.moveRight = true;
        this.gameService.moveLeft = false;
        this.gameService.moveUP = false;
        this.gameService.moveDown = false;
      } else if (event.keyCode === 38) {
        // up
        this.gameService.moveUP = true;
        this.gameService.moveLeft = false;
        this.gameService.moveRight = false;
        this.gameService.moveDown = false;
      } else if (event.keyCode === 40) {
        // down
        this.gameService.moveDown = true;
        this.gameService.moveLeft = false;
        this.gameService.moveRight = false;
        this.gameService.moveUP = false;
      }
    } else if (type === 'keyup') {
      this.gameService.moveDown = false;
      this.gameService.moveLeft = false;
      this.gameService.moveRight = false;
      this.gameService.moveUP = false;
    }
	}

  movePlayerByClicks(dir: string) {
    switch (dir) {
      case 'left':
        this.gameService.moveLeft = true;
        this.gameService.moveUP = false;
        this.gameService.moveDown = false;

        this.moveReset();        
        break;
      
      case 'right':
        this.gameService.moveRight = true;
        this.gameService.moveLeft = false;
        this.gameService.moveUP = false;
        this.gameService.moveDown = false;

        this.moveReset();
        break;

      case 'up':
        this.gameService.moveUP = true;
        this.gameService.moveLeft = false;
        this.gameService.moveRight = false;
        this.gameService.moveDown = false;

        this.moveReset();
        break;

      case 'down':
        this.gameService.moveDown = true;
        this.gameService.moveLeft = false;
        this.gameService.moveRight = false;
        this.gameService.moveUP = false;

        this.moveReset();
        break;
    }
  }

  moveReset() {
    setTimeout(() => {
      this.gameService.moveDown = false;
      this.gameService.moveLeft = false;
      this.gameService.moveRight = false;
      this.gameService.moveUP = false;
    }, 100)
  }
}
