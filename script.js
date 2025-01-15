var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;

function init() {
  // Seleccionar el canvas
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);

  // Habilitar interacción táctil para dispositivos móviles
  createjs.Touch.enable(stage);

  // Hacer que el canvas sea responsivo
  resizeCanvas();

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  // Crear corazones
  for (var i = 0; i < 100; i++) {
    var heart = new createjs.Shape();
    heart.graphics.beginFill(
      createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30)
    );
    heart.graphics
      .moveTo(0, -12)
      .curveTo(1, -20, 8, -20)
      .curveTo(16, -20, 16, -10)
      .curveTo(16, 0, 0, 12)
      .curveTo(-16, 0, -16, -10)
      .curveTo(-16, -20, -8, -20)
      .curveTo(-1, -20, 0, -12);
    heart.y = -100;

    container.addChild(heart);
  }

  // Texto central
  var text = new createjs.Text(
    "Buenos días, mi cerecita. ¿Cómo amaneciste? Te deseo un hermoso día, cuídate ¿Ok? TQM💞 💞",
    "bold 20px Arial",
    "#fff"
  );
  text.textAlign = "center";
  stage.addChild(text);

  // Crear contenedores de captura
  for (var i = 0; i < 100; i++) {
    var captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, canvas.width, canvas.height);
    captureContainers.push(captureContainer);
  }

  // Actualizar posición del texto al redimensionar
  function updateTextPosition() {
    text.x = canvas.width / 2;
    text.y = canvas.height / 2 - text.getMeasuredLineHeight();
  }

  updateTextPosition();

  // Configurar ticker
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  // Redimensionar el canvas cuando cambie el tamaño de la ventana
  window.addEventListener("resize", function () {
    resizeCanvas();
    updateTextPosition();
  });
}

function resizeCanvas() {
  // Ajustar tamaño del canvas según la ventana
  canvas.width = window.innerWidth * 0.95; // 95% del ancho de la pantalla
  canvas.height = window.innerHeight * 0.85; // 85% de la altura de la pantalla

  // Recalcular posiciones y tamaños de los elementos
  if (stage) {
    container.children.forEach((heart) => {
      heart.y = Math.random() * canvas.height;
      heart.x = Math.random() * canvas.width;
      heart.scaleX = heart.scaleY = Math.random() * 1.5 + 0.5;
    });
  }
}

function tick(event) {
  var w = canvas.width;
  var h = canvas.height;
  var l = container.numChildren;

  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(0);
  var captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 0);
  captureContainer.addChild(container);

  // Actualizar posición de los corazones
  for (var i = 0; i < l; i++) {
    var heart = container.getChildAt(i);
    if (heart.y < -50) {
      heart._x = Math.random() * w;
      heart.y = h * (1 + Math.random()) + 50;
      heart.perX = (1 + Math.random() * 2) * h;
      heart.offX = Math.random() * h;
      heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
      heart.velY = -Math.random() * 2 - 1;
      heart.scale = Math.random() * 2 + 1;
      heart._rotation = Math.random() * 40 - 20;
      heart.alpha = Math.random() * 0.75 + 0.05;
      heart.compositeOperation =
        Math.random() < 0.33 ? "lighter" : "source-over";
    }
    var int = ((heart.offX + heart.y) / heart.perX) * Math.PI * 2;
    heart.y += heart.velY * heart.scaleX / 2;
    heart.x = heart._x + Math.cos(int) * heart.ampX;
    heart.rotation = heart._rotation + Math.sin(int) * 30;
  }

  captureContainer.updateCache("source-over");

  stage.update(event);
}

// Inicializar la animación
init();
