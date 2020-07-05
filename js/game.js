window.onload = function() {
	let canvasCart = document.getElementById('gameCanvasCart');
	let cCart = canvasCart.getContext('2d');

	let canvasIso = document.getElementById('gameCanvasIso');
	let cIso = canvasIso.getContext('2d');

	let greenTile = new Image();
	greenTile.src = 'img/greenTile.png';

	let redTile = new Image();
	redTile.src = 'img/redTile.png';

	let tileWidth = greenTile.width;
	let tileHeight = greenTile.height;

	let gridWidth = 5;
	let gridHeight = 5;

	let grid = [
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	];

	let xOffset = (canvasIso.width / 2) - (tileWidth / 2);
	let yOffset = 0;

	let charPos = [2, 3];

	function drawGrid() {
		for(let i = 0; i < gridHeight; i++) {
			for(let j = 0; j < gridWidth; j++) {
				placeTile(grid[i][j], j, i);

				if(charPos[1] == i && charPos[0] == j) {
					placeChar(j, i);
				}
			}
		}
	}

	function placeTile(tileKind, x, y) {
		let posYCart = y * tileHeight;
		let posXCart = x * tileHeight;

		let cordsIso = cartToIso(x, y);

		//place cart tile
		cCart.fillStyle = (tileKind == 0) ? '#00FF00' : '#FF0000';
		cCart.fillRect(posXCart, posYCart, tileHeight, tileHeight);

		//Place Iso tile
		let tile = (tileKind == 0) ? greenTile : redTile;
		cIso.drawImage(tile, cordsIso[0], cordsIso[1], tileWidth, tileHeight);
		
	}

	function cartToIso(x, y) {
		let cordsIso = [];

		let posX = ((x - y) * (tileWidth / 2)) + xOffset;
		let posY = ((x + y) * (tileHeight / 2)) + yOffset;

		cordsIso.push(posX, posY);

		return cordsIso;
	}

	function placeChar(x, y) {
		//place in cart grid
		cCart.beginPath();
		cCart.arc((x * tileHeight) + (tileHeight / 2), (y * tileHeight) + (tileHeight / 2) , 10, 0, 2 * Math.PI, false);
		cCart.fillStyle = 'yellow';
		cCart.fill();

		//place in iso grid
		let cordsIso = cartToIso(x, y);
		cIso.beginPath();
		cIso.arc(cordsIso[0] + (tileWidth / 2), cordsIso[1] + (tileHeight / 2), 10, 0 , 2 * Math.PI, false);
		cIso.fillStyle = 'yellow';
		cIso.fill();
	}

	drawGrid();
}