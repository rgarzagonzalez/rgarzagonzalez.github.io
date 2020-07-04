window.onload = function() {
	let canvas = document.getElementById('gameCanvas');
	let c = canvas.getContext('2d');

	let tileWidth = 10;
	let tileHeight = 10;

	let gridWidth = 5;
	let gridHeight = 5;

	let grid = [
		[1, 1, 1, 1, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1]
	];

	function drawGrid() {
		for(let i = 0; i < gridHeight; i++) {
			for(let j = 0; j < gridWidth; j++) {
				placeTile(grid[i][j], [i], [j]);
			}
		}
	}

	function placeTile(tileKind, y, x) {
		let posY = y * tileHeight;
		let posX = x * tileWidth;

		c.fillStyle = (tileKind == 0) ? '#00FF00' : '#FF0000';

		c.fillRect(posX, posY, tileWidth, tileHeight);

	}

	drawGrid();
}