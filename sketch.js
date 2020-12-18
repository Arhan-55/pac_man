var pac_manImg, pacman_collided, groundImg, cityImg, cloudImg, SunImg, SunImg_2;
var bananaImg, appleImg, carrotImg, pearImg, pizzaImg;
var CloudsGroup, foodGroup, obstaclesGroup;
var obstacle1, obstacle2, obstacle3;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score, gameOverImg, RestartImg;

function preload() {
  pac_manImg = loadAnimation("download (1).png", "download (2).png", "download (3).png", "download (4).png", "download (5).png", "download (6).png", "download (7).png", "download (8).png", "download (9).png");

  pacman_collided = loadAnimation("pac_man_collided.png");

  groundImg = loadImage("download (11)-1.png");
  cityImg = loadImage("city.png");
  cloudImg = loadImage("cloud.png");
  SunImg = loadAnimation("sun(2).png", "sun(1).png");
  SunImg_2 = loadAnimation("sun(2).png");

  obstacle1 = loadImage("download (12).png");
  obstacle2 = loadImage("download (13).png");
  obstacle3 = loadImage("obstacle.png");

  bananaImg = loadImage("banana.png");
  appleImg = loadImage("apple.png");
  carrotImg = loadImage("carrot.png");
  pearImg = loadImage("pear.png");
  pizzaImg = loadImage("pizza_slice.png");

  gameOverImg = loadImage("gameover.png");
  RestartImg = loadImage("restart.png");
}

function setup() {
  //createCanvas(500,500);
  city = createSprite(200, 200);
  city.addImage(cityImg);

  Sun = createSprite(340, 60);
  Sun.addAnimation("slow", SunImg);
  Sun.addAnimation("collided", SunImg_2);

  ground = createSprite(450, 400, 400, 10);
  ground.addImage("ground", groundImg);
  ground.scale = 2.1;
  ground.x = ground.width / 2;

  pacman = createSprite(50, 300);
  pacman.addAnimation("moving", pac_manImg);
  pacman.addAnimation("collided", pacman_collided);

  gameOver = createSprite(200, 120);
  gameOver.addImage(gameOverImg);

  restart = createSprite(200, 170);
  restart.addImage(RestartImg);
  restart.scale = 0.7;

  CloudsGroup = createGroup();
  foodGroup = createGroup();
  obstaclesGroup = createGroup();

  score = 0;
}

function draw() {

  if (ground.x < 85) {
    ground.x = ground.width / 2;
  }

  if (gameState === PLAY) {

    pacman.changeAnimation("moving", pac_manImg);
    pacman.scale = 0.7;
    Sun.changeAnimation("slow", SunImg);

    score = score + Math.round(getFrameRate() / 60);

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -2;

    if (keyDown("space")) {
      pacman.velocityY = -10;
    }
    pacman.velocityY = pacman.velocityY + 0.8;

    pacman.collide(ground);



    if (foodGroup.isTouching(pacman)) {
      foodGroup.destroyEach();
    }

    if (obstaclesGroup.isTouching(pacman)) {
      gameState = END;
    }
    foods();
    spawnClouds();
    spawnobstacles();

  }

  if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }

    ground.velocityX = 0;
    foodGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    pacman.velocityY = 0;

    foodGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);

    pacman.changeAnimation("collided", pacman_collided);
    Sun.changeAnimation("collided", SunImg_2);
  }

  CloudsGroup.setDepthEach(pacman.depth);
  pacman.depth = pacman.depth + 1;

  foodGroup.setDepthEach(restart.depth);
  restart.depth = restart.depth + 1;

  //CloudsGroup.setDepthEach(gameOver.depth);
  //gameOver.depth = gameOver.depth+1;

  drawSprites();
  strokeWeight(1.5);
  stroke("white");
  fill("white");
  textSize(20);
  text("Score : " + score, 5, 50);
}

function reset() {


  gameState = PLAY;

  obstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  foodGroup.destroyEach();

  score = 0;
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    Cloud = createSprite(500, Math.round(random(30, 120)));
    Cloud.addImage(cloudImg);
    Cloud.scale = 0.26;
    Cloud.velocityX = -4;
    Cloud.lifetime = 125;
    CloudsGroup.add(Cloud);

  }
}

function foods() {
  if (frameCount % 80 === 0) {
    food = createSprite(500, Math.round(random(120, 200)));
    food.velocityX = -5;

    r = Math.round(random(1, 5));
    switch (r) {
      case 1:
        food.addImage(bananaImg);
        food.scale = 0.1;
        break;
      case 2:
        food.addImage(pizzaImg);
        food.scale = 0.21;
        break;
      case 3:
        food.addImage(appleImg);
        food.scale = 0.1;
        break;
      case 4:
        food.addImage(carrotImg);
        food.scale = 0.5;
        break;
      case 5:
        food.addImage(pearImg);
        food.scale = 0.1;
        break;
      default:
        break;

    }
    food.lifetime = 100;
    foodGroup.add(food);
  }
}

function spawnobstacles() {
  if (frameCount % 140 === 0) {
    obstacle = createSprite(500, 275, 10, 40);
    obstacle.velocityX = -5;
    obstacle.collide(ground);

    //generate random obstacles
    rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        obstacle.y = 265;
        obstacle.scale = 0.5;
        break;
      case 2:
        obstacle.addImage(obstacle2);
        obstacle.scale = 0.3;
        obstacle.y = 270;
        break;
      case 3:
        obstacle.addImage(obstacle3);
        obstacle.scale = 0.12;
        obstacle.y = 280;
        break;
      default:
        break;

    }

    //assign lifetime to the obstacle           
    obstacle.lifetime = 100;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}