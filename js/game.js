window.onload = function() {
	let canvasCart = document.getElementById('gameCanvasCart');
	let cCart = canvasCart.getContext('2d');

	let canvasIso = document.getElementById('gameCanvasIso');
	let cIso = canvasIso.getContext('2d');

	let canvasChars = document.getElementById('gameCanvasIsoChars');
	let cChars = canvasChars.getContext('2d');

	let greenTile = new Image();
	greenTile.src = 'img/greenTile.png';
	greenTile.addEventListener('load', assetLoaded);

	let redTile = new Image();
	redTile.src = 'img/redTile.png';
	redTile.addEventListener('load', assetLoaded);

	let walkableTile = new Image();
	walkableTile.src = 'img/walkableTile.png';
	walkableTile.addEventListener('load', assetLoaded);

	let activeTile = new Image();
	activeTile.src = 'img/activeTile.png';
	activeTile.addEventListener('load', assetLoaded);

	let sprite_01 = new Image();
	sprite_01.src = 'img/sprite_01.png';
	sprite_01.addEventListener('load', assetLoaded);

	let sprite_02 = new Image();
	sprite_02.src = 'img/sprite_02.png';
	sprite_02.addEventListener('load', assetLoaded);

	let sprite_03 = new Image();
	sprite_03.src = 'img/sprite_03.png';
	sprite_03.addEventListener('load', assetLoaded);

	let sprite_04 = new Image();
	sprite_04.src = 'img/sprite_04.png';
	sprite_04.addEventListener('load', assetLoaded);

	let assets = 0;

	let tileWidth = greenTile.width;
	let tileHeight = greenTile.height;

	let portraitSize = 120;

	let gridWidth = 10;
	let gridHeight = 10;

	let grid = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	let xOffset = (canvasIso.width / 2) - (tileWidth / 2);
	let yOffset = 0;

	//let currentTile = [];
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
		idle: 0,
		battleMenu: 1,
		move: 2,
		action: 3,
		confirm: 4,
		attack: 5,
		explore: 6,
		showOtherRange: 7
	}

	let movementTiles = [];

	let charPos = [4, 1];
	let moved = 0;
	let acted = 0;

	let char1 = {
		name: 'Monk',
		sprite: sprite_01,
		width: 108,
		height: 130,
		offsetX: 0,
		offsetY: -95,
		frame: 0,
		currentAnimation: 0,
		currentAnimationFrames: 8,
		currentAnimationHolds: 1,
		holds: 0,
		maxHp: 100,
		hp: 100,
		maxAp: 50,
		ap: 50,
		spd: 5,
		ct: 0,
		cct: 0,
		charPos: [3, 3],
		movementRange: 2,
		attackRange: 1,
		moved: 0,
		acted: 0
	};

	let char2 = {
		name: 'Fighter',
		sprite: sprite_02,
		width: 108,
		height: 150,
		offsetX: 0,
		offsetY: -115,
		frame: 0,
		currentAnimation: 0,
		currentAnimationFrames: 9,
		currentAnimationHolds: 4,
		holds: 0,
		maxHp: 150,
		hp: 45,
		maxAp: 35,
		ap: 30,
		spd: 8,
		ct: 0,
		cct: 0,
		charPos: [4, 5],
		movementRange: 2,
		attackRange: 1,
		moved: 0,
		acted: 0
	};

	let char3 = {
		name: 'Mage',
		sprite: sprite_03,
		width: 105,
		height: 130,
		offsetX: 0,
		offsetY: -88,
		frame: 0,
		currentAnimation: 0,
		currentAnimationFrames: 1,
		currentAnimationHolds: 0,
		holds: 0,
		maxHp: 100,
		hp: 100,
		maxAp: 100,
		ap: 100,
		spd: 3,
		ct: 0,
		cct: 0,
		charPos: [2, 3],
		movementRange: 2,
		attackRange: 1,
		moved: 0,
		acted: 0
	};

	let char4 = {
		name: 'Slime',
		sprite: sprite_04,
		width: 102,
		height: 120,
		offsetX: 0,
		offsetY: -88,
		frame: 0,
		currentAnimation: 0,
		currentAnimationFrames: 19,
		currentAnimationHolds: 1,
		holds: 0,
		maxHp: 100,
		hp: 100,
		maxAp: 100,
		ap: 100,
		spd: 4,
		ct: 0,
		cct: 0,
		charPos: [4, 6],
		movementRange: 2,
		attackRange: 1,
		moved: 0,
		acted: 0
	}

	let characters = [char1, char2, char3, char4];

	let currentChar = '';

	let turnList = [];

	let turno = [];

	let characterDrawOrder = [];

	let currentTile = [];



	function assetLoaded() {
		assets++;
		
		if(assets == 8) {
			tileWidth = greenTile.width;
			tileHeight = greenTile.height;

			debug();

			window.addEventListener('keydown', function(e) {
				keyDownHandler(e);
			}, false);

			drawGrid();
			animate();

			checkState();
		}
	}


	function checkState() {
		console.log('checking state');
		switch(states.current) {
			case states.idle:
				ctCharge();
				break;

			case states.battleMenu:
				centerCamera(currentTile[0], currentTile[1], 1);
				showCard('current', turno[0]);
				menuHandler(states.current);
				console.log('battleMenu');
				break;

			case states.action:
				currentTile = currentChar.charPos;
				centerCamera(currentTile[0], currentTile[1], 1);

			case states.explore:
				exploreField();
				break;

			case states.move:
				centerCamera(currentTile[0], currentTile[1], 0);
				break;
		}
	}


	function ctCharge() {
		console.log('cargando');
		for(let i = 0; i < characters.length; i++) {
			characters[i].ct += characters[i].spd;

			if(characters[i].ct >= 100) {
				characters[i].ct = 100;
				turno.push(i);
			}
		}

		checkTurn();
	}


	function checkTurn() {
		console.log('check turn');
		if(turno.length > 0) {
			//console.log('Longitud = '+ turno.length +', activar turno');
			turn();
		}

		else {
			//console.log('Longitud = 0, no hay turno');
			states.current = states.idle;
			setTimeout(checkState, 1000/60);
		}
	}


	function turn(){
		console.log('inicia el turno');
		currentChar = characters[turno[0]];
		currentTile = currentChar.charPos;
		states.current = states.battleMenu;
		states.prev = states.explore;
		//states.current = states.explore;
		//drawGrid();

		//if(states.current == states.explore) {
		//	exploreField();
		//}
		checkState();
	}


	function centerCamera(x, y, animated) {
		if(animated == 1) {
			let xOffsetNew = (((x - y) * (tileWidth / 2)) * -1) + ((canvasIso.width / 2) - (tileWidth / 2) );
			let yOffsetNew = (((x + y) * (tileHeight / 2)) * -1) + (canvasIso.height / 2) - (tileHeight / 2);

			let xDiff = xOffsetNew - xOffset;
			let yDiff = yOffsetNew - yOffset;

			let xSteps = xDiff / 64;
			let ySteps = yDiff / 64;

			let centerSteps = [1, 3, 4, 8, 16, 16, 8, 4, 3, 1];

			let centerCounter = 0;

			let centering = setInterval(function() {
				let xIncrease = centerSteps[centerCounter] * xSteps;
				let yIncrease = centerSteps[centerCounter] * ySteps;

				xOffset += xIncrease;
				yOffset += yIncrease;

				centerCounter++;

				drawGrid();

				if(centerCounter == 10) {
					clearInterval(centering);
				}
			},1000/ 60);
		}
		else {
			xOffset = (((x - y) * (tileWidth / 2)) * -1) + ((canvasIso.width / 2) - (tileWidth / 2) );
			yOffset = (((x + y) * (tileHeight / 2)) * -1) + (canvasIso.height / 2) - (tileHeight / 2);
			drawGrid();
		}
	}


	function exploreField() {
		if(currentTile.length == 0) {
			currentTile = currentChar.charPos;
			drawGrid();
		}
	}


	function showCard(card, index) {
		let which = card == 'current' ? 'Character' : 'Target';
		let whichChar = characters[index];

		whichChar = characters[index];

		cardId = document.getElementById('card' + which);

		portraitCont = document.getElementById('portrait' + which);
		nameCont = document.getElementById('name' + which);
		hpCont = document.getElementById('hp' + which + 'Num');
		maxHpCont = document.getElementById('hp' + which + 'MaxNum');
		hpBar = document.getElementById('hp' + which);
		apCont = document.getElementById('ap' + which + 'Num');
		maxApCont = document.getElementById('ap' + which + 'MaxNum');
		apBar = document.getElementById('ap' + which);
		ctCont = document.getElementById('ct' + which + 'Num');
		ctBar = document.getElementById('ct' + which);

		portrait = whichChar.sprite.src;
		name = whichChar.name;
		hp = whichChar.hp;
		maxHp = whichChar.maxHp;
		hpPercent = (hp / maxHp) * 100;
		ap = whichChar.ap;
		maxAp = whichChar.maxAp;
		apPercent = (ap / maxAp) * 100;
		ct = whichChar.ct;

		portraitCont.style.backgroundImage = 'url(' + portrait + ')';
		nameCont.innerHTML = name;
		hpCont.innerHTML = hp;
		maxHpCont.innerHTML = maxHp;
		hpBar.style.width = hpPercent + '%';
		apCont.innerHTML = ap;
		maxApCont.innerHTML = maxAp;
		apBar.style.width = apPercent + '%';
		ctCont.innerHTML = ct;
		ctBar.style.width = ct + '%';

		cardId.classList.remove('hide');
	}


	function hideCards() {
		let cards = document.getElementsByClassName('card');
		for(let i = 0; i < cards.length; i++) {
			cards[i].classList.add('hide');
		}
	}


	function drawGrid() {
		console.log('draw');
		cCart.clearRect(0, 0, canvasCart.width, canvasCart.height);
		cIso.clearRect(0, 0, canvasIso.width, canvasIso.height);

		characterDrawOrder = [];

		//if(currentTile.length > 0) {
		//	centerCamera(currentTile[0], currentTile[1]);
		//}

		//menuHandler(states.current);

		for(let i = 0; i < gridHeight; i++) {
			for(let j = 0; j < gridWidth; j++) {
				placeTile(grid[i][j], j, i);

				if(movementTiles[j] != undefined && movementTiles[j][i] != undefined) {
					placeTile(movementTiles[j][i], j, i);
				}

				for(let k = 0; k < characters.length; k++) {
					if(characters[k].charPos[1] == i && characters[k].charPos[0] == j) {
						characterDrawOrder.push(k);
					}
				}

				if(currentTile.length > 0 && currentTile[0] == j && currentTile[1] == i) {
					//Colocar baldosa activa
					placeTile(3, j, i);
				}
			}
		}

		drawCharacters();
	}


	function drawCharacters() {
		cChars.clearRect(0, 0, canvasChars.width, canvasChars.height);

		for(let i = 0; i < characterDrawOrder.length; i++) {
			let char = characterDrawOrder[i];
			let x = characters[char].charPos[0];
			let y = characters[char].charPos[1];
			let width = characters[char].width;
			let height = characters[char].height;
			let offsetX = characters[char].offsetX;
			let offsetY = characters[char].offsetY;
			let currentFrame = characters[char].frame;
			let column = characters[char].currentAnimation;

			let cordsIso = cartToIso(x, y);
			let sprite = characters[char].sprite;

			//colocar marca en retícula cartesiana
			cCart.beginPath();
			cCart.arc((x * tileHeight) + (tileHeight / 2), (y * tileHeight) + (tileHeight / 2) , 10, 0, 2 * Math.PI, false);
			cCart.fillStyle = 'yellow';
			cCart.fill();

			//dibujar personajes en retícula isométrica
			cChars.drawImage(sprite, currentFrame * width, (column * height) + portraitSize, width, height, cordsIso[0] + offsetX, cordsIso[1] + offsetY, width, height);
		}
	}


	function animate() {
		drawCharacters();

		for(let i = 0; i < characters.length; i++) {
			if(characters[i].currentAnimationHolds > 0) {
				if(characters[i].holds < characters[i].currentAnimationHolds) {
					characters[i].holds++;
				}
				else {
					characters[i].holds = 0;
					characters[i].frame ++;
				}
			}
			else {
				characters[i].frame ++;
			}
			
			if(characters[i].frame >= characters[i].currentAnimationFrames) {
				characters[i].frame = 0;
			}
		}

		setTimeout(animate, 1000/30);
	}


	function battleOrder() {
		turnList = [];
		let list = '';
		let i = 0;

		while(turnList.length < 20) {
			for(let i = 0; i < characters.length; i++) {
				if(characters[i].hp > 0) {
					characters[i].cct += characters[i].spd;
				}

				if(characters[i].cct >= 100) {
					turnList.push(characters[i].name);
					characters[i].cct = 0;
				}
			}
			i++;
		}

		for(let i = 0; i < turnList.length; i++) {
			list += '<div>'+(i + 1)+': '+ turnList[i] +'</div>';
		}

		document.getElementById('turnList').innerHTML = list;

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
				if(currentChar.moved > 0) {
					let option = document.getElementById('move');
					option.classList.add('off');
				}
				if(currentChar.acted > 0) {
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
			case states.explore:
				moveTile(direction);
				break;

			case states.battleMenu:
				moveMenu('battleMenu', direction);
				break;

			case states.move:
				//moveTargetTile(direction);
				moveTile(direction);
				break;

			case states.action:
				moveMenu('actionMenu', direction);
				break;

			case states.attack:
				moveTile(direction);
				//moveTargetTile(direction);
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


	function moveTile(direction) {
		hideCards();
		let x = currentTile[0];
		let y = currentTile[1];

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

		currentTile = [x, y];
		
		let target = checkTile(currentTile, 'target');
		if(target[0] == true) {
				showCard('current', target[1]);
		}

		centerCamera(x, y, 0);
	}


	function actionButton() {
		switch(states.current) {
			case states.battleMenu:
				menuSelect('battleMenu');
				break;

			case states.move:
				let targetTile = checkTile(currentTile, 'move');

				if(targetTile[0] == true) {
					states.prev = states.move;
					confirmAction('Move');
				}

				break;

			case states.action:
				menuSelect('actionMenu');
				break;

			case states.attack:
				let targetAttack = checkTile(currentTile, 'move');
				if(targetAttack[0] == true) {
					states.prev = states.attack;
					confirmAction('Attack');
				}
				break;

			case states.confirm:
				menuSelect('confirmMenu');
				//if(states.prev == states.move) {
				//	moveSelect();
				//}
				break;

			case states.explore:
				let target = checkTile(currentTile, 'target');
				
				if(target[0] == true) {
					if(characters[target[1]] == currentChar) {
						//Estamos seleccionando al personaje en turno, activar el menú
						states.current = states.battleMenu;
						checkState();
					}
					else {
						//Estamos seleccionando a otro personaje, mostrar su rango de movimiento
						states.current = states.showOtherRange;
						showRange('move', target[1]);
					}
				}

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
				states.prev = states.battleMenu;
				hideMenus();
				showRange('move', 'current');
				break;

			case 'act':
				states.current = states.action;
				menuHandler(states.current);
				break;

			case 'attack':
				states.current = states.attack;
				states.prev = states.action;
				hideMenus();
				showRange('attack', 'current');
				break;

			case 'special':
				console.log('special');
				break;

			case 'wait':
				currentChar.moved = 0;
				currentChar.acted = 0;
				currentChar.ct = 0;
				currentChar = '';
				document.getElementById('move').classList.remove('off');
				document.getElementById('act').classList.remove('off');
				hideMenus();
				turno.shift();
				checkTurn();
				break;

			case 'cancel':
				if(states.prev == states.move) {
					states.current = states.move;
					states.prev = states.battleMenu;
					hideMenus();
					showRange('move', 'current');
					centerCamera(currentTile[0], currentTile[1], 0);
				}
				else if(states.prev == states.attack) {
					states.current = states.action;
					hideMenus();
					movementTiles = [];
					currentTile = currentChar.charPos;
					centerCamera(currentTile[0], currentTile[1], 0);
					showMenu('battleMenu');
					showMenu('actionMenu');
					drawGrid();
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
		let confirmText = "";
		let textSpan = document.getElementById('confirmText');

		if(action == 'Move') {
			confirmText = 'Move here?';
		}
		else if(action == 'Attack') {
			confirmText = "Perform this action?";
			//Revisar si hay un blanco en la baldosa seleccionada
			let target = checkTile(currentTile, 'target');

			if(target[0] == true) {
				console.log('Si hay un blanco');
				showCard('target', target[1]);
			}
		}

		confirmText = action == 'Move' ? "Move here?" : "Perform this action?";

		textSpan.innerHTML = confirmText;

		states.current = states.confirm;
		menuHandler(states.current);
	}


	function moveSelect() {
		prevPos = currentChar.charPos;
		currentChar.charPos = currentTile;
		movementTiles = [];

		states.current = states.battleMenu;
		states.prev = states.battleMenu;

		currentChar.moved = 1;

		hideMenus();

		checkState();
	}


	function attackSelect() {
		console.log('Revisar si hay un blanco en ' + currentTile);
		let target = checkTile(currentTile, 'target');
		
		if(target[0] == true) {
			console.log('Hay un blanco, determinar si el golpe conecta (por ahora, siempre va a conectar)');
			console.log('Si conectó, determinar cuanto daño se hizo (por ahora, siempre bajará 5)');
			characters[target[1]].hp -= 5;
		}
		else {
			console.log('No hay blanco');
		}

		currentTile = currentChar.charPos;
		centerCamera(currentTile[0], currentTile[1], 0);
		
		console.log('De cualquier manera, mostrar la animación');

		movementTiles = [];

		states.current = states.battleMenu;
		states.prev = states.battleMenu;

		currentChar.acted = 1;

		hideMenus();

		drawGrid();
	}


	function checkTile(tilePos, type) {
		let result = [false];
		switch(type) {
			case 'target':
				for(let i = 0; i < characters.length; i++) {
					if(characters[i].charPos[0] == tilePos[0] && characters[i].charPos[1] == tilePos[1]) {
						//Se encontró un blanco
						result = [true, i];
						return result;
						break;
					}
				}
				return result;
				break;

			case 'move':
				let validTile = false;
				let x = tilePos[0];
				let y = tilePos[1];

				if(movementTiles[x] != undefined && movementTiles[x][y] != undefined) {
					validTile = true;
				}

				if(validTile) {
					result = [true, tilePos];
				}

				return result;

				break;
		}
	}


	function showRange(kind, char) {
		let i = 0;
		let targetTiles = [];
		let range;
		let tile;
		let thisChar;

		movementTiles = [];

		if(char == 'current') {
			thisChar = currentChar;
		}
		else {
			thisChar = characters[char];
		}

		currentTile = thisChar.charPos;

		switch(kind) {
			case 'move':
				range = thisChar.movementRange;
				tile = 2;
				break;

			case 'attack':
				range = thisChar.attackRange;
				tile = 2;
				break;
		}

		let nPoint = thisChar.charPos[1] - range;
		let sPoint = thisChar.charPos[1] + range;
		let wPoint = thisChar.charPos[0] - range;
		let ePoint = thisChar.charPos[0] + range;

		for(let j = wPoint; j <= ePoint; j++) {
			targetTiles[j] = [];
		}

		for(let j = 0; j <= sPoint - nPoint; j++) {
			let north = nPoint + j;
			let west = currentTile[0] - i;
			let east = currentTile[0] + i;

			if(west != east) {
				for(let k = west; k <= east; k++) {
					if(k == currentTile[0] && north == currentTile[1]) {
						//targetTiles[k][north] = 3;
					}
					else {
						targetTiles[k][north] = tile;
					}
				}
			}
			else {
				targetTiles[west][north] = tile;
			}

			if(north >= currentTile[1]) {
				i--;
			}
			else {
				i++;
			}
		}

		movementTiles = targetTiles;

		console.log(movementTiles);

		drawGrid();
	}


	function cancelButton() {
		switch(states.prev) {
			case states.move:
				states.current = states.move;
				states.prev = states.battleMenu;
				hideMenus();
				showRange('move', 'current');
				break;

			case states.battleMenu:
				movementTiles = [];
				currentTile = currentChar.charPos;
				states.current = states.battleMenu;
				states.prev = states.explore;
				hideMenus();
				break;

			case states.action:
			case states.attack:
				hideMenus();
				states.current = states.action;
				states.prev = states.battleMenu;
				movementTiles = [];
				showMenu('battleMenu');
				showMenu('actionMenu');
				break;

			case states.explore:
				movementTiles = [];
				drawGrid();
				states.current = states.explore;
				hideMenus();
				checkState();
				break;
		}

		checkState();

		//drawGrid();
	}


	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}


	function debug() {
		document.getElementById('currentState').innerHTML = states.current;
		document.getElementById('previousState').innerHTML = states.prev;

		document.getElementById('char1Name').innerHTML = char1.name;
		document.getElementById('char1Hp').innerHTML = char1.hp;
		document.getElementById('char1Ct').innerHTML = char1.ct;
		document.getElementById('char1Acted').innerHTML = char1.acted;
		document.getElementById('char1Moved').innerHTML = char1.moved;

		document.getElementById('char2Name').innerHTML = char2.name;
		document.getElementById('char2Hp').innerHTML = char2.hp;
		document.getElementById('char2Ct').innerHTML = char2.ct;
		document.getElementById('char2Acted').innerHTML = char2.acted;
		document.getElementById('char2Moved').innerHTML = char2.moved;

		document.getElementById('char3Name').innerHTML = char3.name;
		document.getElementById('char3Hp').innerHTML = char3.hp;
		document.getElementById('char3Ct').innerHTML = char3.ct;
		document.getElementById('char3Acted').innerHTML = char3.acted;
		document.getElementById('char3Moved').innerHTML = char3.moved;

		if(currentChar == '') {
			document.getElementById('whoseCurrent').innerHTML = 'None';
		}
		else {
			document.getElementById('whoseCurrent').innerHTML = currentChar.name;
		}

		setTimeout(debug, 1000/60);
	}
}