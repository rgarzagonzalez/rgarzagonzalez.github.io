window.onload = function() {
	let canvasCart = document.getElementById('gameCanvasCart');
	let cCart = canvasCart.getContext('2d');

	let canvasIso = document.getElementById('gameCanvasIso');
	let cIso = canvasIso.getContext('2d');

	let greenTile = new Image();
	greenTile.src = 'img/greenTile.png';

	let redTile = new Image();
	redTile.src = 'img/redTile.png';

	let walkableTile = new Image();
	walkableTile.src = 'img/walkableTile.png';

	let activeTile = new Image();
	activeTile.src = 'img/activeTile.png';

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

	let charPos = [4, 1];
	let selTilePos = [];
	let prevPos = [];

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

	let states = {
		current: 0,
		prev: 0,
		battleMenu: 0,
		move: 1,
		action: 2,
		confirm: 3,
		attack: 4
	}

	let movementTiles = [];

	let movementRange = 2;
	let attackRange = 1;
	let moved = 0;
	let acted = 0;


	function drawGrid() {
		menuHandler(states.current);
		cCart.clearRect(0, 0, canvasCart.width, canvasCart.height);
		cIso.clearRect(0, 0, canvasIso.width, canvasIso.height);
		for(let i = 0; i < gridHeight; i++) {
			for(let j = 0; j < gridWidth; j++) {
				placeTile(grid[i][j], j, i);

				if(movementTiles[j] != undefined && movementTiles[j][i] != undefined) {
					placeTile(movementTiles[j][i], j, i);
				}

				if(charPos[1] == i && charPos[0] == j) {
					placeChar(j, i);
				}
			}
		}
	}

	function menuHandler(state) {
		//hideMenus();
		switch(state) {
			case states.battleMenu:
				showMenu('battleMenu');
				break;

			case states.action:
				showMenu('actionMenu');
				break;

			case states.confirm:
				showMenu('confirmMenu');
		}
	}

	function hideMenus() {
		var menus = document.getElementsByClassName('menu');
		for(let i = 0; i < menus.length; i++) {
			menus[i].classList.remove('off');
			menus[i].classList.add('hidden');
		}
	}

	function showMenu(id) {
		switch(id) {
			case 'battleMenu':
				if(moved > 0) {
					let option = document.getElementById('move');
					option.classList.add('off');
				}
				if(acted > 0) {
					let option = document.getElementById('act');
					option.classList.add('off');
				}
				break;
		}

		let menus = document.getElementsByClassName('menu');

		for(let i = 0; i < menus.length; i++) {
			if(!menus[i].classList.contains('hidden')) {
				menus[i].classList.add('off');
			}
		}

		let menu = document.getElementById(id);
		menu.classList.remove('hidden');
		menu.classList.remove('off');
	}

	function placeTile(tileKind, x, y) {
		let tile;
		let posYCart = y * tileHeight;
		let posXCart = x * tileHeight;

		let cordsIso = cartToIso(x, y);

		switch(tileKind) {
			case 0:
				cCart.fillStyle = '#00FF00';
				tile = greenTile;
				break;

			case 1:
				cCart.fillStyle = '#FF0000';
				tile = redTile;
				break;

			case 2:
				cCart.fillStyle = '#0000FF';
				tile = walkableTile;
				break;

			case 3:
				cCart.fillStyle = '#AAAAAA';
				tile = activeTile;
				break;
		}

		//place cart tile
		cCart.fillRect(posXCart, posYCart, tileHeight, tileHeight);

		//Place Iso tile
		cIso.drawImage(tile, cordsIso[0], cordsIso[1], tileWidth, tileHeight);
		
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

	function cartToIso(x, y) {
		let cordsIso = [];

		let posX = ((x - y) * (tileWidth / 2)) + xOffset;
		let posY = ((x + y) * (tileHeight / 2)) + yOffset;

		cordsIso.push(posX, posY);

		return cordsIso;
	}

	function keyDownHandler(e) {
		switch(e.keyCode) {
			case Keys.UP:
			case Keys.W:
				move('up');
				break;

			case Keys.DOWN:
			case Keys.S:
				move('down');
				break;

			case Keys.LEFT:
			case Keys.A:
				move('left');
				break;

			case Keys.RIGHT:
			case Keys.D:
				move('right');
				break;

			case Keys.J:
				actionButton();
				break;

			case Keys.K:
				cancelButton();
				break;
		}
	}

	function move(direction){
		switch(states.current) {
			case states.battleMenu:
				moveMenu('battleMenu', direction);
				break;

			case states.move:
				moveTargetTile(direction);
				break;

			case states.action:
				moveMenu('actionMenu', direction);
				break;

			case states.attack:
				moveTargetTile(direction);
				break;

			case states.confirm:
				moveMenu('confirmMenu', direction);
		}
	}

	function moveMenu(menuName, direction) {
		let menuOptions = menuName + '_options';
		let menu = document.getElementById(menuOptions);
		let menuItems = [];
		let currentItem;
		let newItem;

		for(let i = 0; i < menu.childNodes.length; i++) {
			if(menu.childNodes[i].tagName == "LI") {
				menuItems.push(i);
				if(menu.childNodes[i].classList.contains('active')) {
					currentItem = i;
					menu.childNodes[i].classList.remove('active');
				}
			}
		}

		if(direction == 'up') {
			newItem = menuItems.indexOf(currentItem) - 1;
		}
		else if(direction == 'down') {
			newItem = menuItems.indexOf(currentItem) + 1;
		}
		else {
			newItem = menuItems.indexOf(currentItem);
		}

		if(newItem < 0) {
			newItem = menuItems.length - 1;
		}
		else if(newItem == menuItems.length) {
			newItem = 0;
		}

		newItem = menuItems[newItem];

		menu.childNodes[newItem].classList.add('active');
	}

	function moveTargetTile(direction) {
		let x = selTilePos[0];
		let y = selTilePos[1];

		switch(direction) {
			case 'up':
				if(y - 1 >= 0) {
					y--;
				}
				break;

			case 'down':
				if(y + 1 < gridHeight) {
					y++;
				}
				break;

			case 'left':
				if(x - 1 >= 0) {
					x--;
				}
				break;

			case 'right':
				if(x + 1 < gridWidth) {
					x++;
				}
				break;
		}

		if(movementTiles[x] != undefined && movementTiles[x][y] != undefined) {
			movementTiles[selTilePos[0]][selTilePos[1]] = 2;
			movementTiles[x][y] = 3;
			selTilePos = [x, y];
			drawGrid();
		}
	}

	function actionButton() {
		switch(states.current) {
			case states.battleMenu:
				menuSelect('battleMenu');
				break;

			case states.move:
				states.prev = states.move;
				confirmAction('Move');
				//moveSelect();
				break;

			case states.action:
				menuSelect('actionMenu');
				break;

			case states.attack:
				states.prev = states.attack;
				confirmAction('Attack');
				break;

			case states.confirm:
				menuSelect('confirmMenu');
				//if(states.prev == states.move) {
				//	moveSelect();
				//}
				break;
		}
	}

	function menuSelect(menuName) {
		let menuOptions = menuName + '_options';
		let menu = document.getElementById(menuOptions);
		let currentMenu;

		for(let i = 0; i < menu.childNodes.length; i++) {
			if(menu.childNodes[i].classList && menu.childNodes[i].classList.contains('active') && !menu.childNodes[i].classList.contains('off')) {
				currentMenu = menu.childNodes[i].id;
				break;
			}
		}

		switch(currentMenu) {
			case 'move':
				states.current = states.move;
				hideMenus();
				showRange('move');
				break;

			case 'act':
				states.current = states.action;
				menuHandler(states.current);
				break;

			case 'attack':
				states.current = states.attack;
				states.prev = states.action;
				hideMenus();
				showRange('attack');
				break;

			case 'special':
				console.log('special');
				break;

			case 'wait':
				console.log('Esperar');
				break;

			case 'cancel':
				if(states.prev == states.move) {
					states.current = states.move;
					states.prev = states.battleMenu;
					//charPos = prevPos;
					hideMenus();
					showRange('move');
				}
				break;

			case 'confirm':
				if(states.prev == states.move) {
					moveSelect();
				}
				else if(states.prev == states.attack) {
					attackSelect();
				}
		}
	}

	function confirmAction(action) {
		states.current = states.confirm;
		menuHandler(states.current);
	}

	function moveSelect() {
		prevPos = charPos;
		charPos = selTilePos;
		movementTiles = [];

		states.current = states.battleMenu;
		states.prev = states.battleMenu;

		moved = 1;

		hideMenus();


		drawGrid();
	}

	function attackSelect() {
		console.log('attack!');
		movementTiles = [];

		states.current = states.battleMenu;
		states.prev = states.battleMenu;

		acted = 1;

		hideMenus();

		drawGrid();
	}

	function showRange(kind) {
		movementTiles = [];
		selTilePos = charPos;
		let i = 0;
		let targetTiles = [];
		let range;
		let tile;

		switch(kind) {
			case 'move':
				range = movementRange;
				tile = 2;
				break;

			case 'attack':
				range = attackRange;
				tile = 2;
				break;
		}

		let nPoint = charPos[1] - range;
		let sPoint = charPos[1] + range;
		let wPoint = charPos[0] - range;
		let ePoint = charPos[0] + range;

		for(let j = wPoint; j <= ePoint; j++) {
			targetTiles[j] = [];
		}

		for(let j = 0; j <= sPoint - nPoint; j++) {
			let north = nPoint + j;
			let west = selTilePos[0] - i;
			let east = selTilePos[0] + i;

			if(west != east) {
				for(let k = west; k <= east; k++) {
					if(k == selTilePos[0] && north == selTilePos[1]) {
						targetTiles[k][north] = 3;
					}
					else {
						targetTiles[k][north] = tile;
					}
				}
			}
			else {
				targetTiles[west][north] = tile;
			}

			if(north >= selTilePos[1]) {
				i--;
			}
			else {
				i++;
			}
		}

		movementTiles = targetTiles;

		drawGrid();
	}

	function cancelButton() {
		switch(states.prev) {
			case states.move:
				states.current = states.move;
				states.prev = states.battleMenu;
				//charPos = prevPos;
				hideMenus();
				showRange('move');
				break;

			case states.battleMenu:
				movementTiles = [];
				states.current = states.battleMenu;
				states.prev = states.battleMenu;
				hideMenus();
				break;

			case states.action:
				states.current = states.action;
				states.prev = states.battleMenu;
				movementTiles = [];
				showMenu('battleMenu');
				showMenu('actionMenu');
				break;
		}

		drawGrid();
	}


	window.addEventListener('keydown', function(e) {
		keyDownHandler(e);
	}, false);

	drawGrid();
}