/*
*	TO-DO:
*		- Comandos especiales para cada personaje
*		- Charge actions
*			- Agregar al orden de turno
*			- Área de efecto
*		- Diferentes escenarios
*
*		- Corregir la función del turno enemigo
*		- Corregir formula para evasión
*		- Corregir formula para determinar cantidad de daño
*		- Corregir stats
*		- Posición de números de daño
*	
*		- Celdas de distintas alturas
*		- Ganar niveles de experiencia
*		- Salvar progreso
*		- Cambiar formación antes de cada batalla
*		- Daño elemental
*		- Diálogo
*		- Agregar un pueblo con tienda y posada
*		- Rango mínimo en ataques con arco
*		- Bloquear campo visual de ataques con arco
*		- Sonido?
*		- Arte:
*			- Recibir daño
*			- Muerte
*			- Encantamiento
*			- Item
*			- FX
*/


//Abilidades = Str, Dex, Con, Int, Wis, Cha, suma de 3d6(Roll twice, discard lowest)

window.onload = function() {

	let directions = {
		north: 2,
		south: 0,
		east: 1,
		west: 3
	}

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
		this.itemRange = 2;
		this.minRange = args[17];
		this.jump = args[18];

		this.command = args[19];

		this.currentAnimation = 1;
		this.frame = 0;
		this.animationFrames = args[20];
		this.animationPlaying = true;
		this.animationLoop = true;

		this.ct = 0;
		this.cct = 0;	//Se usa para la función que calcula los próximos turnos

		this.facing = 1;	//Hacia donde está viendo
		this.charPos = [];	//Celda donde se encuentra el personaje
		this.moved = 0;	//Ya se movio?
		this.acted = 0;	//Ya actuó?
		this.selectFacing = 0;	//Se está cambiando la dirección?
		this.tileValues = [];	//Cuales celdas estan al frente, detrás y al costado
	}

	Character.prototype.animate = function() {
		if(this.animationPlaying == true) {
			this.frame ++ ;

			if(this.frame == this.animationFrames[this.currentAnimation].length) {
				if(this.animationLoop == true) {
					this.frame = 0;
				}
				else {
					this.frame = this.animationFrames[this.currentAnimation].length - 1;
					this.animationPlaying = false;

					//Si la animación fue la de ataque
					if(this.currentAnimation > 3 && this.currentAnimation < 8) {
						this.acted = 1;
						checkState();
					}
				}
			}
		}
	}

	Character.prototype.playAnimation = function(animation) {
		this.animationLoop = false;
		this.frame = 0;

		switch(animation) {
			case 'attack':
				this.currentAnimation = this.facing + 4;
				break;
		}
	}

	Character.prototype.calculateTileValues = function(width, height) {
		this.tileValues = [];

		switch(this.facing) {
			case 0:
			case 2:
				//Norte o sur
				for(let y = 0; y < height; y++) {
					this.tileValues[y] = [];
					for(x = 0; x < width; x++) {

						//Distancia entre personaje y fila que se está evaluando
						let yDiff = this.charPos[1] - y;

						//No es la fila donde está el personaje
						if(yDiff != 0) {

							//Dentro de este rango no es al costado
							if(x >= this.charPos[0] - Math.abs(yDiff) && x <= this.charPos[0] + Math.abs(yDiff)) {

								//La fila está sur del personaje
								if(yDiff < 0) {

									//Personaje viendo al sur
									if(this.facing == 0) {
										this.tileValues[y][x] = 'front';
									}

									//Personaje viendo al norte
									else if(this.facing == 2) {
										this.tileValues[y][x] = 'back';
									}
								}

								//La fila está al norte del personaje
								else if (yDiff > 0) {

									//Personaje viendo al sur
									if(this.facing == 0) {
										this.tileValues[y][x] = 'back';
									}

									//Personaje viendo al norte
									else if(this.facing == 2) {
										this.tileValues[y][x] = 'front';
									}
								}
							}

							else {
								this.tileValues[y][x] = 'side';
							}
						}

						//Misma fila que el personaje. Todas las celdas son de costado, excepto en la posición del personaje
						else {
							if(x != this.charPos[0]) {
								this.tileValues[y][x] = 'side';
							}
						}
					}
				}

				break;

			case 1:
			case 3:
				//Este u oeste
				for(let y = 0; y < height; y++) {
					this.tileValues[y] = [];
					for(x = 0; x < width; x++) {

						//Distancia entre el personaje y la fila que se está evaluando
						let yDiff = this.charPos[1] - y;
						let xDiff = Math.abs(yDiff) - 1;

						//No es la fila donde está el personaje
						if(yDiff != 0) {

							//Dentro de este rango es el costado
							if(x >= this.charPos[0] - xDiff && x <= this.charPos[0] + xDiff) {
								this.tileValues[y][x] = 'side';
							}

							//Fuera del rango es adelante o atrás
							else {

								//La celda está al Oeste del personaje
								if(x < this.charPos[0]) {

									//Si el personaje está viendo al este, esta celda está detrás de él
									if(this.facing == 1) {
										this.tileValues[y][x] = 'back';
									}

									//Si el personaje está viendo al oeste, esta celda está frente a él
									else if(this.facing == 3) {
										this.tileValues[y][x] = 'front';
									}
								}

								//La celda está al Este del personaje
								else if(x > this.charPos[0]) {

									//Si el personaje también está viendo al este, esta celda está delante de él
									if(this.facing == 1) {
										this.tileValues[y][x] = 'front';
									}

									//Si el personaje está viendo al oeste, esta celda está detrás de él
									else if(this.facing == 3) {
										this.tileValues[y][x] = 'back';
									}
								}
							}
						}

						//La misma fila donde está el personaje
						else {

							//Si no es la misma celda donde está el personaje
							if(x != this.charPos[0]) {

								//La celda está al oeste
								if(x < this.charPos[0]) {

									//El personaje está viendo al este, la celda está detrás de él
									if(this.facing == 1) {
										this.tileValues[y][x] = 'back';
									}

									//El personaje esta viendo al oeste, la celda está frente a él
									else if(this.facing == 3) {
										this.tileValues[y][x] = 'front';
									}
								}

								//La celda está al este
								else if(x > this.charPos[0]) {

									//El personaje está viendo al este, la celda está frente a él
									if(this.facing == 1) {
										this.tileValues[y][x] = 'front';
									}

									//El personaje está viendo al oeste, la celda está detrás de él
									else if(this.facing == 3) {
										this.tileValues[y][x] = 'back';
									}
								}
							}
						}
					}
				}

				break;

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
			'Monk', sprite_01, 204, 138, -45, -85, 1, 0, 100, 50, 6, 5, 5, 5, 5, 2, 1, 0, 0, ['Zen', 'Zen Punch'],
			[
				[0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
				[0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
				[0],
				[0],
				[0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 7, 8, 8, 9, 9, 10, 10, 10, 11, 11, 11],
				[0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 7, 8, 8, 9, 9, 10, 10, 10, 11, 11, 11],
				[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
				[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
			]
		],
		[
			'Fighter', sprite_02, 108, 150, 4, -104, 1, 0, 100, 50, 5, 5, 5, 5, 5, 2, 1, 0, 0, ['Fight', 'Wild Swing'],
			[
				[0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8],
				[0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0]
			]
		],
		[
			'Mage', sprite_03, 105, 130, 4, -81, 1, 0, 100, 50, 5, 5, 5, 5, 5, 2, 1, 0, 0, ['Fight', 'Wild Swing'],
			[
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0],
				[0]
			]
		],
		[
			'Slime', sprite_04, 102, 140, 6, -84, 1, 0, 100, 50, 5, 5, 5, 5, 5, 2, 1, 0, 0, [],
			[
				[0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,0,1,1,1,2,2,2,3,3,3,2,2,4,4,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,10,10,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18],
				[0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,0,1,1,1,2,2,2,3,3,3,2,2,4,4,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,10,10,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18],
				[0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,0,1,1,1,2,2,2,3,3,3,2,2,4,4,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,10,10,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18],
				[0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,0,0,0,0,1,1,1,2,2,2,3,3,3,2,2,4,4,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,10,10,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18],
				[0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
				[0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
				[0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
				[0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
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

	let inventory = {
		potion: [5, 'hpUp', 30],
		elixir: [3, 'apUp', 10],
		hiPotion: [0, 'hpUp', 50]
	}

	let itemToUse = '';


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
		faceSelection: 9,
		resolveAttack: 10,
		anouncement: 11,
		list: 12,
		itemUsage: 13,
		resolveItem: 14,
		battleOver: 15

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
	char1.charPos = [4,6];
	char1.calculateTileValues(gridWidth, gridHeight);

	let char2 = new Character(charList[1]);
	char2.charPos = [3,5];
	char2.calculateTileValues(gridWidth, gridHeight);

	let char3 = new Character(charList[2]);
	char3.charPos = [3,7];
	char3.calculateTileValues(gridWidth, gridHeight);

	let char4 = new Character(charList[3]);
	char4.charPos = [6,6];
	char4.calculateTileValues(gridWidth, gridHeight);

	let characters = [char1, char2, char3, char4];

	let playerParty = [0, 1, 2];

	let enemyParty = [3];

	let currentChar = '';

	let turnList = [];

	let turno = [];

	let characterDrawOrder = [];

	let currentTile = [];



	//Revisa que los elementos hayan cargado para iniciar el juego
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
					states.prev = states.explore;
					currentChar.selectFacing = 0;
					currentChar.calculateTileValues(gridWidth, gridHeight);
					currentTile = currentChar.charPos;
					centerCamera(currentTile[0], currentTile[1], 1);
					showCard('current', turno[0]);
					menuHandler(states.current);
					//console.log('battleMenu');
					break;

				case states.action:
					currentTile = currentChar.charPos;
					movementTiles = [];
					centerCamera(currentTile[0], currentTile[1], 1);
					showMenu('battleMenu');
					showMenu('actionMenu');
					break;

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

				case states.resolveAttack:
					resolveAction('attack');
					break;

				case states.resolveItem:
					resolveAction('item');
					break;
			}
		}
		else {
			console.log('Game Over');
			hideMenus();
			states.current = states.battleOver;
		}
	}


	//Regresa un objeto con información sobre las distancias entre el enemigo y los personajes
	function getDistances(enemy) {

		showRange('move', 'current');
		let distances = [];

		//Calcular la distancia entre el enemigo y cada uno de los miembros del grupo
		for(let i = 0; i < playerParty.length; i++) {
			let distance = calculateDistance(characters[enemy].charPos, characters[playerParty[i]].charPos);
			distances.push(distance);
		}

		//Determinar cuál es el más cercano
		let closest = distances.indexOf(Math.min(...distances));

		//Determinar distancia actual al blanco
		let currentDistance = distances[closest];

		//Más prioridad a las que se encuantren detrás o al lado del blanco
		if(characters[closest].tileValues[characters[enemy].charPos[1]][characters[enemy].charPos[0]] == 'side') {
			currentDistance -= 0.1;
		}
		else if(characters[closest].tileValues[characters[enemy].charPos[1]][characters[enemy].charPos[0]] == 'back') {
			currentDistance -= 0.2;
		}

		
		let rangeDistances = [];
		let rangeDistancesIndexes = [];

		let rangeDistancesSum = [];
		let rangeDistancesSumIndexes = [];

		let moveKeysX = Object.keys(movementTiles);

		//Calcular la distancia entre cada baldosa del rango de movimiento y los personajes del grupo
		for(let i = 0; i < moveKeysX.length; i++) {

			let moveKeysY = Object.keys(movementTiles[moveKeysX[i]]);

			for(let j = 0; j < moveKeysY.length; j++) {
				let coords = [moveKeysX[i], moveKeysY[j]];
				let rangeDistanceSum = 0;


				for(let k = 0; k < playerParty.length; k++) {

					//Suma de la distancia combinada a todos los blancos
					rangeDistanceSum += calculateDistance(coords, characters[playerParty[k]].charPos);

					//Distancia solo al personaje más cercano
					if(k == closest) {
						let rangeDistance = calculateDistance(coords, characters[playerParty[closest]].charPos);

						//Más prioridad a las que se encuentren detrás o al lado del blanco
						if(characters[playerParty[closest]].tileValues[moveKeysY[j]][moveKeysX[i]] == 'side') {
							rangeDistance -= 0.1;
						}
						else if(characters[playerParty[closest]].tileValues[moveKeysY[j]][moveKeysX[i]] == 'back') {
							rangeDistance -= 0.2;
						}

						rangeDistances.push(rangeDistance);
						rangeDistancesIndexes.push(coords);

					}
				}

				rangeDistancesSum.push(rangeDistanceSum);
				rangeDistancesSumIndexes.push(coords);
			}
		}

		let closestDistance = rangeDistances.indexOf(Math.min(...rangeDistances));
		let longestDistance = rangeDistances.indexOf(Math.max(...rangeDistances));
		let longestCombinedDistance = rangeDistancesSum.indexOf(Math.max(...rangeDistancesSum));

		movementTiles = [];

		let distanceObject = {
			currentDistance: currentDistance,
			closest: closest,
			rangeDistances: rangeDistances,
			rangeDistancesIndexes: rangeDistancesIndexes,
			rangeDistancesSumIndexes: rangeDistancesSumIndexes,
			closestDistance: closestDistance,
			longestDistance: longestDistance,
			longestCombinedDistance: longestCombinedDistance
		}

		return distanceObject;
	}


	//Regresa la dirección hacia la cual debe voltear al terminar el turno
	function evaluateFacing() {
		let directions = [1, 1, 1, 1];

		for(let i = 0; i < 4; i++) {
			currentChar.facing = i;
			currentChar.calculateTileValues(gridWidth, gridHeight);

			for(let j = 0; j < playerParty.length; j++) {
				if(currentChar.tileValues[characters[playerParty[j]].charPos[1]][characters[playerParty[j]].charPos[0]] == 'side') {
					directions[i] -= 0.1;
				}
				else if(currentChar.tileValues[characters[playerParty[j]].charPos[1]][characters[playerParty[j]].charPos[0]] == 'back') {
					directions[i] -= 0.2;
				}
			}
		}

		let directionToFace = directions.indexOf(Math.max(...directions));

		return directionToFace;
	}


	//Acciones que toman los enemigos cuando es su turno.
	function enemyTurn(enemy) {
		console.log('inicia Turno Enemigo');
		console.log(currentChar.tileValues.length + '<- array de valores');
		centerCamera(currentTile[0], currentTile[1], 1);

		hideMenus();

		distanceInfo = getDistances(enemy);

		//Ya se movió
		if(currentChar.moved == 1) {

			if(currentChar.acted == 1) {
				console.log('Ya actuó también, esperar');

				setTimeout(function() {
					let whereToTurn = evaluateFacing();
					currentChar.facing = whereToTurn;
					currentChar.currentAnimation = whereToTurn;
					currentChar.frame = 0;
					currentChar.calculateTileValues(gridWidth, gridHeight);

					setTimeout(function() {
						currentChar.moved = 0;
						currentChar.acted = 0;
						currentChar.ct = 0;
						currentChar = '';
						turno.shift();
						checkTurn();
					}, 200);
				}, 200);
			}
			else {
				console.log('No ha actuado aún');

				//Agregar función que regrese si puede o no curarse
				let canHeal = false;

				if(distanceInfo.currentDistance <= currentChar.attackRange) {
					console.log('blanco dentro de rango de ataque');

					setTimeout(function(){
						showRange('attack', 'current');

						setTimeout(function(){
							currentTile = [characters[playerParty[distanceInfo.closest]].charPos[0], characters[playerParty[distanceInfo.closest]].charPos[1]];
							centerCamera(currentTile[0], currentTile[1], 1);

							setTimeout(function() {
								movementTiles = [];
								drawGrid();
								states.current = states.resolveAttack;
								states.prev = states.resolveAttack;
								checkState();
							}, 200);
						},200);
					}, 300);
				}
				else {
					console.log('blanco fuera de rango de ataque');
					if(canHeal) {
						//curarse
					}
					else {
						console.log('No se puede curar, terminar turno');

						setTimeout(function() {
							let whereToTurn = evaluateFacing();
							currentChar.facing = whereToTurn;
							currentChar.currentAnimation = whereToTurn;
							currentChar.frame = 0;
							currentChar.calculateTileValues(gridWidth, gridHeight);

							setTimeout(function() {
								currentChar.moved = 0;
								currentChar.acted = 0;
								currentChar.ct = 0;
								currentChar = '';
								turno.shift();
								checkTurn();
							}, 200);
						}, 200);
					}
				}

			}
		}

		//No se ha movido
		else {

			//Ya actuó
			if(currentChar.acted == 1) {
				console.log('Ya actuó');
				showRange('move', 'current');

				//Opción para que se quede ahí?

				//De mientras que se aleje
				let x = parseInt(distanceInfo.rangeDistancesSumIndexes[distanceInfo.longestCombinedDistance][0]);
				let y = parseInt(distanceInfo.rangeDistancesSumIndexes[distanceInfo.longestCombinedDistance][1]);


				setTimeout(function() {
					currentTile = [x, y];
					drawGrid();

					setTimeout(function(){
						movementTiles = [];
						moveSelect();
					}, 350);
				}, 350);
			}

			//No ha actuado
			else {

				//Ya está en el mejor lugar disponible. Actuar
				if(distanceInfo.currentDistance <= distanceInfo.rangeDistances[distanceInfo.closestDistance]) {
					let canHeal = false;

					if(currentChar.hp < currentChar.maxHp * 0.15) {
						//Revisar si se puede curar y si es el caso, cambiar variable canHeal a true
					}

					if(canHeal) {
						//Curarse
					}
					else {
						setTimeout(function() {
							showRange('attack', 'current');

							setTimeout(function() {
								currentTile = [characters[playerParty[distanceInfo.closest]].charPos[0], characters[playerParty[distanceInfo.closest]].charPos[1]];
								centerCamera(currentTile[0], currentTile[1], 1);

								setTimeout(function() {
									movementTiles = [];
									drawGrid();
									states.current = states.resolveAttack;
									states.prev = states.resolveAttack;
									checkState();
								}, 200);
							}, 200);
						}, 500);
					}
				}

				//Hay que moverse
				else {
					let x;
					let y;
					
					console.log('Hay que moverse');
					//Poco hp, escapar
					if(currentChar.hp < currentChar.maxHp * 0.15) {
						x = parseInt(distanceInfo.rangeDistancesIndexes[distanceInfo.longestDistance][0]);
						y = parseInt(distanceInfo.rangeDistancesIndexes[distanceInfo.longestDistance][1]);
					}

					//Suficiente hp, acercarse para atacar
					else {
						x = parseInt(distanceInfo.rangeDistancesIndexes[distanceInfo.closestDistance][0]);
						y = parseInt(distanceInfo.rangeDistancesIndexes[distanceInfo.closestDistance][1]);
					}

					setTimeout(function(){
						showRange('move', 'current');

						setTimeout(function() {
							currentTile = [x, y];
							drawGrid();

							setTimeout(function(){
								movementTiles = [];
								moveSelect();
							}, 350);
						}, 350);
					}, 500);
				}
			}
		}
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


	//Centra el tablero en una posicióne specificada
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
			cChars.drawImage(shadow, 0, 0, 56, 20, cordsIso[0] + 28, cordsIso[1] + 24, 56, 20);
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


	//Muestra los menús correspondientes a cada estado del juego
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
				break;
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


	//Coloca la baldosa correspondiente a cada coordenada
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
				sy = 1;
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

			case 8:
				cCart.fillStyle = 'yellow';
				sx = 0;
				sy = 0;
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


	//Acciones que se deben tomar al presionar una tecla
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
			case states.move:
			case states.attack:
			case states.itemUsage:
				moveTile(direction);
				break;

			case states.battleMenu:
				moveMenu('battleMenu', direction);
				break;

			case states.action:
				moveMenu('actionMenu', direction);
				break;

			case states.confirm:
				moveMenu('confirmMenu', direction);
				break;

			case states.faceSelection:
				selectDirection(direction);
				break;

			case states.list:
				moveMenu('listMenu', direction);
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


	//Mueve el cursor por las distintas celdas
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

			case states.itemUsage:
				let targetItem = checkTile(currentTile, 'move');
				if(targetItem[0] == true) {
					states.prev = states.itemUsage;
					confirmAction('Item');
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

			case states.anouncement:
				states.current = states.prev;
				checkState();
				break;

			case states.list:
				menuSelect('listMenu');
				break;
		}
	}


	//Las acciones que se realizan al haber seleccionado una opción en un menú
	function menuSelect(menuName) {
		let menuOptions = menuName + '_options';
		let menu = document.getElementById(menuOptions);
		let currentMenu;
		let menuId;

		for(let i = 0; i < menu.childNodes.length; i++) {
			if(menu.childNodes[i].classList && menu.childNodes[i].classList.contains('active') && !menu.childNodes[i].classList.contains('off')) {
				currentMenu = menu.childNodes[i].getAttribute('name');
				menuId = menu.childNodes[i].id;
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

			case 'item':
				showList('items');
				break;

			case 'listItem':
				itemToUse = menuId;
				states.current = states.itemUsage;
				states.prev = states.action;
				hideMenus();
				showRange('item', 'current');
				break;

			case 'wait':
				states.prev = states.battleMenu;
				states.current = states.faceSelection;
				checkState();
				break;

			case 'cancel':
				switch(states.prev) {
					case states.move:
						states.current = states.move;
						states.prev = states.battleMenu;
						hideMenus();
						showRange('move', 'current');
						centerCamera(currentTile[0], currentTile[1], 0);
						break;

					case states.attack:
					case states.itemUsage:
						states.current = states.action;
						itemToUse = '';
						hideMenus();
						hideCards();
						checkState();
						break;

					case states.faceSelection:
						states.current = states.battleMenu;
						states.prev = states.battleMenu;
						hideMenus();
						checkState();
						break;
				}

				break;

			case 'confirm':
				switch(states.prev) {
					case states.move:
						moveSelect();
						break;

					case states.attack:
						states.current = states.resolveAttack;
						states.prev = states.resolveAttack;
						checkState();
						break;

					case states.itemUsage:
						states.current = states.resolveItem;
						states.prev = states.resolveAttack;
						checkState();
						break;

					case states.faceSelection:
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
						break;
				}
				break;
		}
	}


	//
	function showList(kind) {
		switch(kind) {
			case 'items':
				console.log('Lista de items');
				let itemKeys = Object.keys(inventory);
				let listTxt = '';
				console.log(inventory);

				for(let i = 0; i < itemKeys.length; i++) {
					if(inventory[itemKeys[i]][0] > 0) {
						listTxt += '<li name="listItem" id="' + itemKeys[i] + '"';

						if(i == 0) {
							listTxt += ' class="active" ';
						}

						listTxt += '>' + itemKeys[i] + ': ' + inventory[itemKeys[i]][0] + '</li>';
					}
				}

				var list = document.getElementById('listMenu_options');

				list.innerHTML = listTxt;

				states.current = states.list;
				states.prev = states.action;

				showMenu('listMenu');

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
			case 'Item':
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
		currentChar.calculateTileValues(gridWidth, gridHeight);


		if(playerParty.includes(turno[0])) {
			states.current = states.battleMenu;
			states.prev = states.battleMenu;
		}

		else {
			states.current = states.enemyTurn;
			states.prev = states.enemyTurn;
		}

		currentChar.moved = 1;

		hideMenus();

		checkState();
	}


	//Muestra mensajes
	function showAnouncement(str) {
		document.getElementById('anouncementText').innerHTML = str;
		showMenu('anouncementMenu');
	}


	//Muestra el daño y resta esa cantidad al hp del blanco
	function showDamage(kind, damage, target) {
		//Cambiar color dependiendo si se está haciendo daño o curando
		switch(kind) {
			case 'damage':
				document.getElementById('damageCont').style.color = 'white';
				break;

			case 'hpUp':
				document.getElementById('damageCont').style.color = 'blue';
				break;

			case 'apUp':
				document.getElementById('damageCont').style.color = 'green';
				break;
		}

		console.log(characters[target].charPos);
		let caca = cartToIso(characters[target].charPos[0], characters[target].charPos[0]);
		console.log(caca);

		let txt = damage.toString();

		let units = document.getElementById('units');
		let tens = document.getElementById('tens');
		let hundreds = document.getElementById('hundreds');

		units.innerHTML = txt[txt.length - 1];
		units.classList.add('show');
		
		if(damage > 9) {
			tens.innerHTML = txt[txt.length - 2];
			tens.classList.add('show');
		}
		
		if(damage > 99) {
			hundreds.innerHTML = txt[txt.length - 3];
			hundreds.classList.add('show');
		}

		setTimeout(function() {

			//Quitar clase que muestra los numeros
			units.classList.remove('show');
			tens.classList.remove('show');
			hundreds.classList.remove('show');

			//Se suma o se resta?
			switch(kind) {
				case 'damage':
					characters[target].hp -= damage;

					if(characters[target].hp < 0) {	//Si muere

						characters[target].hp = 0;
						characters[target].cp = 0;
						//Animación de muerte?

						//Revisar a que grupo pertenece
						if(playerParty.includes(target)) {	//Está en el grupo del jugador
							for(let i = 0; i < playerParty.length; i++) {
								if(playerParty[i] == target) {
									playerParty.splice(i, 1);
								}
							}
						}

						else if(enemyParty.includes(target)) {	//Está en el grupo de los enemigos
							for(let i = 0; i < enemyParty.length; i++) {
								if(enemyParty[i] == target) {
									enemyParty.splice(i, 1);
								}
							}
						}
					}
					break;

				case 'hpUp':
					characters[target].hp += damage;

					if(characters[target].hp > characters[target].maxHp) {
						characters[target].hp = characters[target].maxHp;
					}

					break;

				case 'apUp':
					characters[target].ap += damage;

					if(characters[target].ap > characters[target].maxAp) {
						characters[target].ap = characters[target].maxAp;
					}

					break;
			}

			//Ganar xp?

			if(playerParty.includes(turno[0])) {	//Turno del jugador, mostrar el menú
				states.current = states.battleMenu;
				states.prev = states.battleMenu;
			}
			else {	//Sigue siendo turno del enemigo
				states.prev = states.enemyTurn;
				states.current = states.enemyTurn;
			}

			checkState();
		}, 1500);
	}


	//Realiza las acciones después de haber confirmado
	function resolveAction(kind) {
		hideMenus();
		movementTiles = [];
		drawGrid();

		//No se ha realizado la acción, voltear al personaje hacia donde se está atacando
		if(currentChar.acted == 0) {

			//Solo girar si no está ya viendo en la dirección correcta
			if(currentChar.tileValues[currentTile[1]][currentTile[0]] != 'front') {

				//El blanco esta a un lado, girar 90 grados
				if(currentChar.tileValues[currentTile[1]][currentTile[0]] == 'side') {

					//Si está viendo al norte o sur, girar al este u oeste
					if(currentChar.facing == directions.north || currentChar.facing == directions.south) {

						//El blanco se encuantra al este
						if(currentTile[0] > currentChar.charPos[0]) {
							currentChar.facing = directions.east;
						}

						//El blanco se encuentra al oeste
						else {
							currentChar.facing = directions.west;
						}
					}

					//Si está viendo al este u oeste, girar al norte o sur
					else {

						//El blanco está al sur
						if(currentTile[1] > currentChar.charPos[1]) {
							currentChar.facing = directions.south;
						}

						//El blanco está al norte
						else {
							currentChar.facing = directions.north;
						}
					}
				}

				//El blanco está atrás, girar 180 grados
				else if(currentChar.tileValues[currentTile[1]][currentTile[0]] == 'back') {
					switch(currentChar.facing) {

						//Está viendo al norte, voltear al sur
						case directions.north:
							currentChar.facing = directions.south;
							break;

						//Está viendo al sur, voltear al norte
						case directions.south:
							currentChar.facing = directions.north;
							break;

						//Está viendo al este, voltear al oeste
						case directions.east:
							currentChar.facing = directions.west;
							break;

						//Está viendo al oeste, voltear al este
						case directions.west:
							currentChar.facing = directions.east;
							break;
					}
				}
			}

			if(kind == 'attack') {
				currentChar.playAnimation('attack');
			}
			else if (kind == 'item') {
				//Actualizar cuando haya animación de usar items
				currentChar.playAnimation('attack');
			}

		}


		//Ya se realizó la acción
		else if (currentChar.acted = 1) {

			//Si se usa in item, quitarlo del inventario
			if(kind == 'item') {
				inventory[itemToUse][0] --;
			}

			//Stance animation
			currentChar.currentAnimation = currentChar.facing;
			currentChar.frame = 0;
			currentChar.animationPlaying = true;
			currentChar.animationLoop = true;

			//Revisar si hubo un blanco en la celda
			let target = checkTile(currentTile, 'target');

			//Hay un blanco en la celda, determinar resultado del ataque
			if(target[0] == true) {

				//Si es un ataque
				if(kind == 'attack') {

					//Si el número es mayor a la defensa del enemigo, conectará (Ajustar la formula después)
					if(randomNumber(1,20) > characters[target[1]].def) {

						//Modifcar la formula después.
						let damage = randomNumber(1, 20);

						//Reproducir animación de recibir golpe?
						console.log('El ataque conectó, calcular daño: ');
						showDamage('damage', damage, target[1]);
					}

					//El ataque no conectó
					else {
						states.current = states.anouncement;

						//Turno del jugador, mostrar el menú
						if(playerParty.includes(turno[0])) {
							states.prev = states.battleMenu;
						}

						//Sigue siendo turno del enemigo
						else {
							states.prev = states.enemyTurn;
						}
					
						showAnouncement('Miss!');
					}
				}

				//Si se está usando un item
				else if(kind == 'item') {
					showDamage(inventory[itemToUse][1], inventory[itemToUse][2], target[1]);
				}
			}

			//No hay blanco válido, se termina la acción
			else {

				states.current = states.battleMenu;
				states.prev = states.battleMenu;

				checkState();
			}
		}
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

			case 'item':
				range = thisChar.itemRange;
				tile = 8;
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
						if(kind == 'item') {
							targetTiles[k][north] = tile;
						}
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
			case states.itemUsage:
				itemToUse = '';
				hideMenus();
				hideCards();
				states.current = states.action;
				states.prev = states.battleMenu;
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


	//Genera un número aleatorio entre dos valores
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