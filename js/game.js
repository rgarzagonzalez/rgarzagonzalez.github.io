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

	let Keys = {
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		W: 87,
		A: 65,
		S: 83,
		D: 68,
		J: 74,
		K: 75
	}

	window.addEventListener('keydown', function(e) {
		keyDownHandler(e);
	}, false);

	function keyDownHandler(e) {
		switch(e.keyCode) {
			case Keys.UP:
			case Keys.W:
				moveMenu('up');
				break;

			case Keys.DOWN:
			case Keys.S:
				moveMenu('down');
				break;

			case Keys.LEFT:
			case Keys.A:
				break;

			case Keys.RIGHT:
			case Keys.D:
				break;

			case Keys.J:
				actionButton();
				break;
		}
	}

	function moveMenu(direction) {
		let menu = document.getElementById('menu_options');
		let menuItems = [];
		let currentItem;
		let newItem;

		for(let i = 0; i < menu.childNodes.length; i++) {
			if(menu.childNodes[i].tagName == "LI") {
				menuItems.push(i);
				if(menu.childNodes[i].className == 'active') {
					currentItem = i;
					menu.childNodes[i].className = null;
				}
			}
		}

		newItem = (direction == 'up') ? menuItems.indexOf(currentItem) - 1 : menuItems.indexOf(currentItem) + 1;

		if(newItem < 0) {
			newItem = menuItems.length - 1;
		}
		else if(newItem == menuItems.length) {
			newItem = 0;
		}

		newItem = menuItems[newItem];

		menu.childNodes[newItem].className = 'active';

	}

	function actionButton() {
		let menu = document.getElementById('menu_options');
		let currentMenu;

		for(let i = 0; i < menu.childNodes.length; i++) {
			if(menu.childNodes[i].className == 'active') {
				currentMenu = menu.childNodes[i].id;
				break;
			}
		}

		switch(currentMenu) {
			case 'move':
				console.log('mostrar rango de movimiento');
				break;

			case 'act':
				console.log('mostrar menú de acciones');
				break;

			case 'wait':
				console.log('Esperar');
				break;
		}
	}

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