function Character(args) {
	this.name = args[0];
	
	this.sprite = args[1];
	this.width = args[2];
	this.height = args[3];
	this.offsetX = args[4];
	this.offsetY = args[5];

	this.lvl = args[6];
	this.xp = args[7];

	this.maxHp = args[8];
	this.hp = args[8];
	this.maxAp = args[9];
	this.ap = args[9];

	this.spd = args[10];
	this.str = args[11];
	this.def = args[12];
	this.mAtk = args[13];
	this.mDef = args[14];

	this.movementRange = args[15];
	this.attackRange = args[16];
	this.minRange = args[17];
	this.jump = args[18];

	this.command = args[19];

	this.currentAnimation = 0;
	this.frame = 0;
	this.animationFrames = args[20];

	this.ct = 0;
	this.cct = 0;

	this.facing = 0;
	this.charPos = [];
	this.moved = 0;
	this.acted = 0;
	this.selectFacing = 0;
}

Character.prototype.animate = function() {
	this.frame ++ ;

	if(this.frame == this.animationFrames[this.currentAnimation].length) {
		this.frame = 0;
	}
}

function Sprite(animationFrames) {
	this.frame = 0;
	this.animationFrames;
}

let sprite_01 = new Image();
let sprite_02 = new Image();
let sprite_03 = new Image();
let sprite_04 = new Image();
let shadow = new Image();
let arrowSprite = new Image();


let charList = [
	[
		'Monk', sprite_01, 204, 138, -45, -85, 1, 0, 100, 50, 5, 5, 5, 5, 5, 2, 1, 0, 0, ['Zen', 'Zen Punch'],
		[
			[0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
			[0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
			[0],
			[0]
		]
	],
	[
		'Fighter', sprite_02, 108, 150, 4, -105, 1, 0, 100, 50, 5, 5, 5, 5, 5, 2, 1, 0, 0, ['Fight', 'Wild Swing'],
		[
			[0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8],
			[0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8],
			[0],
			[0]
		]
	],
	[
		'Mage', sprite_03, 105, 130, 4, -80, 1, 0, 100, 50, 5, 5, 5, 5, 5, 2, 1, 0, 0, ['Fight', 'Wild Swing'],
		[
			[0],
			[0],
			[0],
			[0]
		]
	],
	[
		'Slime', sprite_04, 102, 120, 6, -84, 1, 0, 100, 50, 3, 5, 5, 5, 5, 2, 1, 0, 0, [],
		[
			[0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,0,1,1,1,2,2,2,3,3,3,2,2,4,4,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,10,10,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18],
			[0],
			[0],
			[0]
		]
	]
];


let gridList = [
	[
		[0, 5, 6, 7, 0, 5, 6, 7, 0, 5],
		[6, 7, 0, 5, 6, 7, 0, 5, 6, 7],
		[0, 5, 6, 7, 0, 5, 6, 7, 0, 5],
		[6, 7, 0, 5, 6, 7, 0, 5, 6, 7],
		[0, 5, 6, 7, 0, 5, 6, 7, 0, 5],
		[6, 7, 0, 5, 6, 7, 0, 5, 6, 7],
		[0, 5, 6, 7, 0, 5, 6, 7, 0, 5],
		[6, 7, 0, 5, 6, 7, 0, 5, 6, 7],
		[0, 5, 6, 7, 0, 5, 6, 7, 0, 5],
		[6, 7, 0, 5, 6, 7, 0, 5, 6, 7]
	]
];

window.onload = function() {
	let canvasCart = document.getElementById('gameCanvasCart');
	let cCart = canvasCart.getContext('2d');

	let canvasIso = document.getElementById('gameCanvasIso');
	let cIso = canvasIso.getContext('2d');

	let canvasChars = document.getElementById('gameCanvasIsoChars');
	let cChars = canvasChars.getContext('2d');

	let tileSprite = new Image();
	tileSprite.src = 'img/tiles.png';
	tileSprite.addEventListener('load', assetLoaded);

	sprite_01.src = 'img/sprite_01.png';
	sprite_01.addEventListener('load', assetLoaded);

	sprite_02.src = 'img/sprite_02.png';
	sprite_02.addEventListener('load', assetLoaded);

	sprite_03.src = 'img/sprite_03.png';
	sprite_03.addEventListener('load', assetLoaded);

	sprite_04.src = 'img/sprite_04.png';
	sprite_04.addEventListener('load', assetLoaded);

	shadow.src = 'img/shadow.png';
	shadow.addEventListener('load', assetLoaded);

	arrowSprite.src = 'img/arrow.png';
	arrowSprite.addEventListener('load', assetLoaded);

	let assets = 0;

	let tileWidth = 112;
	let tileHeight = 60;

	let portraitSize = 120;

	let gridWidth = 10;
	let gridHeight = 10;

	let grid = gridList[0];

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
		showOtherRange: 7,
		enemyTurn: 8,
		faceSelection : 9,
		battleOver: 10
	}

	let movementTiles = [];

	let charPos = [4, 1];
	let moved = 0;
	let acted = 0;

	let arrow = {
		sprite: arrowSprite,
		currentFrame: 0,
		currentAnimationFrames: 4,
		currentAnimationHolds: 3,
		holds: 0
	}

	let char1 = new Character(charList[0]);
	char1.charPos = [1,4];

	let char2 = new Character(charList[1]);
	char2.charPos = [4,4];

	let char3 = new Character(charList[2]);
	char3.charPos = [5,1];

	let char4 = new Character(charList[3]);
	char4.charPos = [4, 6];

	let characters = [char1, char2, char3, char4];

	let playerParty = [0, 1, 2];

	let enemyParty = [3];

	let currentChar = '';

	let turnList = [];

	let turno = [];

	let characterDrawOrder = [];

	let currentTile = [];



	function assetLoaded() {
		assets++;
		
		if(assets == 7) {

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
		console.log('checking state: ' + states.current);
		if(checkParties()) {
			switch(states.current) {
				case states.idle:
					ctCharge();
					break;

				case states.battleMenu:
					currentChar.selectFacing = 0;
					centerCamera(currentTile[0], currentTile[1], 1);
					showCard('current', turno[0]);
					menuHandler(states.current);
					//console.log('battleMenu');
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

				case states.faceSelection:
					hideMenus();
					currentChar.selectFacing = 1;
					break;

				case states.enemyTurn:
					enemyTurn(turno[0]);
					break;
			}
		}
		else {
			console.log('Game Over');
			hideMenus();
			states.current = states.battleOver;
		}
	}


	function enemyTurn(enemy) {
		//console.log('centrar camara en enemigo');
		centerCamera(currentTile[0], currentTile[1], 1);
		console.log('inicia Turno Enemigo');
		console.log('Evaluar Situacion');
		console.log('Buscar blanco más cercano');

		let distances = [];
		//Calcular la distancia a cada uno de los miembros del grupo
		for(let i = 0; i < playerParty.length; i++) {
			let distance = calculateDistance(characters[enemy].charPos, characters[playerParty[i]].charPos);
			distances.push(distance);
		}

		//Determinar cuál es el más cercano
		let closest = distances.indexOf(Math.min(...distances));

		showRange('move', 'current');

		let rangeDistances = [];
		let rangeDistancesIndexes = [];

		let moveKeysX = Object.keys(movementTiles);

		//Calcular la distancia entre el blanco y las baldosas dentro del rango de movimiento
		for(let i = 0; i < moveKeysX.length; i++) {
			//rangeDistances[moveKeysX[i]] = [];
			let moveKeysY = Object.keys(movementTiles[moveKeysX[i]]);

			for(let j = 0; j < moveKeysY.length; j++) {
				let coords = [moveKeysX[i], moveKeysY[j]];
				let rangeDistance = calculateDistance(coords, characters[playerParty[closest]].charPos);
				console.log('distancia' + rangeDistance);
				//rangeDistances[moveKeysX[i]][moveKeysY[j]] = rangeDistance;
				rangeDistances.push(rangeDistance);
				rangeDistancesIndexes.push(coords);
			}
		}

		let closestDistance = rangeDistances.indexOf(Math.min(...rangeDistances));

		setTimeout(function(){
			let x = parseInt(rangeDistancesIndexes[closestDistance][0]);
			let y = parseInt(rangeDistancesIndexes[closestDistance][1]);
			currentTile = [x, y];
			//drawGrid();
			centerCamera(x, y, 1);
			moveSelect();
		}, 1000);
	}


	function calculateDistance(p1, p2) {
		let d = Math.sqrt( Math.pow((p2[0] - p1[0]), 2) + Math.pow((p2[1] - p1[1]), 2) );

		return d;
	}


	function checkParties() {
		if(playerParty.length > 0 && enemyParty.length > 0){
			//console.log('Aún hay personajes');
			return true;
		}
		else {
			//console.log('Se murio un grupo');
			return false;
		}
	}


	function ctCharge() {
		//console.log('cargando');
		for(let i = 0; i < characters.length; i++) {
			characters[i].ct += characters[i].spd;

			if(characters[i].ct >= 100) {
				characters[i].ct = 100;
				turno.push(i);
			}
		}

		checkTurn();
	}


	//Revisa si es turno de algun personaje o si sigue corriendo el tiempo
	function checkTurn() {
		//console.log('check turn');
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

		if(playerParty.includes(turno[0])) {	
			states.current = states.battleMenu;
			states.prev = states.explore;
		}

		else {
			states.current = states.enemyTurn;
			states.prev = states.enemyTurn;
		}

		checkState();
	}


	function centerCamera(x, y, animated) {
		if(animated == 1) {
			let xOffsetNew = (((x - y) * (tileWidth / 2)) * -1) + ((canvasIso.width / 2) - (tileWidth / 2) );
			let yOffsetNew = (((x + y) * (tileHeight / 2)) * -1) + (canvasIso.height / 2) - (tileHeight / 2) + (x * 2) + (y * 2);

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
			yOffset = (((x + y) * (tileHeight / 2)) * -1) + (canvasIso.height / 2) - (tileHeight / 2) + (x * 2) + (y * 2);

			drawGrid();
		}
	}


	function exploreField() {
		if(currentTile.length == 0) {
			currentTile = currentChar.charPos;
		}
		drawGrid();
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
			
			let frame = characters[char].frame;
			let currentAnimation = characters[char].currentAnimation;
			let animationFrames = characters[char].animationFrames;

			let currentFrame = animationFrames[currentAnimation][frame];

			let cordsIso = cartToIso(x, y);
			let sprite = characters[char].sprite;

			//colocar marca en retícula cartesiana
			cCart.beginPath();
			cCart.arc((x * tileHeight) + (tileHeight / 2), (y * tileHeight) + (tileHeight / 2) , 10, 0, 2 * Math.PI, false);
			cCart.fillStyle = 'yellow';
			cCart.fill();

			//dibujar personajes en retícula isométrica
			cChars.drawImage(shadow, 0, 0, 56, 22, cordsIso[0] + 28, cordsIso[1] + 25, 56, 20);
			cChars.drawImage(sprite, currentFrame * width, (currentAnimation * height) + portraitSize, width, height, cordsIso[0] + offsetX, cordsIso[1] + offsetY, width, height);

			if(characters[char] == currentChar) {
				if(characters[char].selectFacing == 1) {
					cChars.drawImage(tileSprite, characters[char].facing * tileWidth, tileHeight * 2, tileWidth, tileHeight, cordsIso[0] + 0, cordsIso[1] - 100, tileWidth, tileHeight);
				}
				else {
					cChars.drawImage(arrowSprite, arrow.currentFrame * 32, 0, 32, 16, cordsIso[0] + 40, cordsIso[1] - 110, 32, 16);
				}
			}
		}
	}


	function animate() {
		drawCharacters();

		for(let i = 0; i < characters.length; i++) {
			characters[i].animate();
		}

		if(arrow.holds < arrow.currentAnimationHolds) {
			arrow.holds++;
		}
		else {
			arrow.holds = 0;
			arrow.currentFrame++;
		}

		if(arrow.currentFrame >= arrow.currentAnimationFrames) {
			arrow.currentFrame = 0;
		}


		setTimeout(animate, 1000/30);
	}


	//Calcula el orden de los siguientes turnos
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
				hideMenus();
				showMenu('battleMenu');
				break;

			case states.action:
				showMenu('actionMenu');
				break;

			case states.confirm:
				showMenu('confirmMenu');
		}
	}


	//Esconde los menús
	function hideMenus() {
		var menus = document.getElementsByClassName('menu');
		for(let i = 0; i < menus.length; i++) {
			menus[i].classList.remove('off');
			menus[i].classList.add('hidden');
		}
	}


	//Muestra un menú en específico
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
		let posYCart = y * tileHeight;
		let posXCart = x * tileHeight;
		let sx;
		let sy;

		let cordsIso = cartToIso(x, y);

		switch(tileKind) {
			case 0:
				cCart.fillStyle = '#00FF00';
				sx = 0;
				sy = 0;
				break;

			case 1:
				cCart.fillStyle = '#FF0000';
				sx = 2;
				sy = 0;
				break;

			case 2:
				cCart.fillStyle = '#0000FF';
				sx = 1;
				sy = 0;
				break;

			case 3:
				cCart.fillStyle = '#AAAAAA';
				sx = 3;
				sy = 0;
				break;

			case 4:
				cCart.fillStyle = '#00FF00';
				sx = 0;
				sy = 1;
				break;

			case 5:
				cCart.fillStyle = '#00FF00';
				sx = 1;
				sy = 1;
				break;

			case 6:
				cCart.fillStyle = '#00FF00';
				sx = 2;
				sy = 1;
				break;

			case 7:
				cCart.fillStyle = '#00FF00';
				sx = 3;
				sy = 1;
				break;
		}

		//place cart tile
		cCart.fillRect(posXCart, posYCart, tileHeight, tileHeight);

		//Place Iso tile
		cIso.drawImage(tileSprite, (sx * tileWidth), (sy * tileHeight), tileWidth, tileHeight, cordsIso[0], cordsIso[1], tileWidth, tileHeight);
	}


	//Convierte las coordenadas cartesianas de un punto a isométrico
	function cartToIso(x, y) {
		let cordsIso = [];

		let posX = ((x - y) * (tileWidth / 2)) + xOffset;
		let posY = ((x + y) * (tileHeight / 2)) + yOffset - (x * 2) - (y * 2);

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


	//Acciones que ocurren al presionar una de las teclas de movimiento
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
				break;

			case states.faceSelection:
				selectDirection(direction);
				break;
		}
	}


	//Cambia la dirección hacia donde está viendo un personaje
	function selectDirection(direction) {
		switch(direction) {
			case 'down':
				//Sur
				currentChar.facing = 0;
				currentChar.currentAnimation = 0;
				currentChar.frame = 0;
				break;

			case 'right':
				//Este
				currentChar.facing = 1;
				currentChar.currentAnimation = 1;
				currentChar.frame = 0;
				break;

			case 'up':
				//Norte
				currentChar.facing = 2;
				currentChar.currentAnimation = 2;
				currentChar.frame = 0;
				break;

			case 'left':
				//Oeste
				currentChar.facing = 3;
				currentChar.currentAnimation = 3;
				currentChar.frame = 0;
				break;
		}
	}


	//Moverse dentro de los menús
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


	//Acciones que se realizan al presionar el botón de acción
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
						states.prev = states.explore;
						showRange('move', target[1]);
					}
				}

				break;

			case states.faceSelection:
				states.prev = states.faceSelection;
				confirmAction('Wait');
				break;
		}
	}


	//Las acciones que se realizan al haber seleccionado una opción en un menú
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
				states.prev = states.battleMenu;
				states.current = states.faceSelection;
				checkState();
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
					hideCards();
					movementTiles = [];
					currentTile = currentChar.charPos;
					centerCamera(currentTile[0], currentTile[1], 0);
					showMenu('battleMenu');
					showMenu('actionMenu');
					drawGrid();
				}
				else if(states.prev == states.faceSelection) {
					states.current = states.battleMenu;
					states.prev = states.battleMenu;
					hideMenus();
					checkState();
				}
				break;

			case 'confirm':
				if(states.prev == states.move) {
					moveSelect();
				}
				else if(states.prev == states.attack) {
					attackSelect();
				}
				else if(states.prev == states.faceSelection) {
					//Fin del turno
					currentChar.moved = 0;
					currentChar.acted = 0;
					currentChar.ct = 0;
					currentChar = '';
					document.getElementById('move').classList.remove('off');
					document.getElementById('act').classList.remove('off');
					hideMenus();
					turno.shift();
					checkTurn();
				}
				break;
		}
	}


	//Muestra mensaje de confirmación para realizar una acción.
	function confirmAction(action) {
		let confirmText = "";
		let textSpan = document.getElementById('confirmText');

		switch(action) {
			case 'Move':
				confirmText = 'Move here?';
				break;

			case 'Attack':
				confirmText = 'Perform this action';

				//Revisar si hay un blanco en la baldosa seleccionada
				let target = checkTile(currentTile, 'target');

				if(target[0] == true) {
					//Si se encontró un blanco
					showCard('current', turno[0]);
					showCard('target', target[1]);
				}

				break;

			case 'Wait':
				confirmText = 'End turn?';
				break;
		}

		textSpan.innerHTML = confirmText;

		states.current = states.confirm;
		menuHandler(states.current);
	}


	//Mueve personaje a nueva ubicación, después de haber confirmado
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


	//Realiza el ataque después de haber confirmado
	function attackSelect() {
		console.log('Revisar si hay un blanco en ' + currentTile);
		let target = checkTile(currentTile, 'target');
		
		if(target[0] == true) {
			console.log('Hay un blanco, determinar si el golpe conecta (por ahora, siempre va a conectar)');
			console.log('Si conectó, determinar cuanto daño se hizo (por ahora, siempre bajará 5)');
			characters[target[1]].hp -= 5;

			if(characters[target[1]].hp <= 0) {
				characters[target[1]].hp = 0;
				characters[target[1]].cp = 0;

				console.log();
				console.log(enemyParty.includes(target[1]));

				if(playerParty.includes(target[1])) {
					for(let i = 0; i < playerParty.length; i++) {
						if(playerParty[i] == target[1]) {
							playerParty.splice(i, 1);
						}
					}
				}

				else if(enemyParty.includes(target[1])) {
					for(let i = 0; i < enemyParty.length; i++) {
						if(enemyParty[i] == target[1]) {
							enemyParty.splice(i, 1);
						}
					}
				}
			}
		}
		else {
			console.log('No hay blanco');
		}

		currentTile = currentChar.charPos;
		centerCamera(currentTile[0], currentTile[1], 0);
		
		console.log('De cualquier manera, mostrar la animación');

		movementTiles = [];

		currentChar.acted = 1;

		drawGrid();//de mientras para ocultar las celdas de movimiento, debería quitarse con la animacón.

		states.current = states.battleMenu;
		states.prev = states.battleMenu;

		checkState();
	}


	//Revisa si la baldosa especificada contiene a un blanco o si está dentro del rango de movimiento
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


	//Muestra el rango de movimiento, o de ataque
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
				tile = 1;
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
						if(kind == 'move') {
							let tileCoords = [k, north];
							let target = checkTile(tileCoords, 'target');

							if(target[0] == false) {
								targetTiles[k][north] = tile;
							}
						}
						else {
							targetTiles[k][north] = tile;
						}
					}
				}
			}
			else {
				if(kind == 'move') {
					let tileCoords = [west, north];
					let target = checkTile(tileCoords, 'target');

					if(target[0] == false) {
						targetTiles[west][north] = tile;
					}
				}
				else {
					targetTiles[west][north] = tile;
				}
			}

			if(north >= currentTile[1]) {
				i--;
			}
			else {
				i++;
			}
		}

		movementTiles = targetTiles;

		//console.log(movementTiles);

		drawGrid();
	}


	//Acciones a realizar cuando se presione el botón de cancelar
	function cancelButton() {
		switch(states.prev) {
			case states.move:
				states.current = states.move;
				states.prev = states.battleMenu;
				hideMenus();
				showRange('move', 'current');
				checkState();
				break;

			case states.battleMenu:
				movementTiles = [];
				currentTile = currentChar.charPos;
				states.current = states.battleMenu;
				states.prev = states.explore;
				hideMenus();
				checkState();
				break;

			case states.action:
			case states.attack:
				hideMenus();
				hideCards();
				states.current = states.action;
				states.prev = states.battleMenu;
				movementTiles = [];
				showMenu('battleMenu');
				showMenu('actionMenu');
				checkState();
				break;

			case states.explore:
				movementTiles = [];
				states.current = states.explore;
				states.prev = states.battleMenu;
				hideMenus();
				checkState();
				break;

			case states.faceSelection:
				states.current = states.battleMenu;
				states.prev = states.battleMenu;
				hideMenus();
				checkState();
				break;
		}

		//checkState();

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
		document.getElementById('char1Animation').innerHTML = char1.currentAnimation;

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