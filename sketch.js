let caminhao;
let obstaculos = [];
let estradaY = 150;
let cidadeChegou = false;
let tempoTotal = 20 * 60;
let tempoRestante;
let telaInicial = true;

let linhaPosicoes = [];
let arvoresPos = [];

function setup() {
  createCanvas(600, 300);
  caminhao = new Caminhao();
  tempoRestante = tempoTotal;
  textAlign(CENTER, CENTER);

  // Faixas da estrada
  for (let x = 0; x < width; x += 40) {
    linhaPosicoes.push(x);
  }

  // Árvores espalhadas em toda área verde abaixo da estrada
  for (let x = 0; x < width; x += 60) {
    for (let y = estradaY + 100; y < height; y += 60) {
      arvoresPos.push({ x: x + random(-20, 20), y: y + random(-20, 20) });
    }
  }

  // Árvores espalhadas em toda área verde acima da estrada
  for (let x = 0; x < width; x += 60) {
    for (let y = 0; y < estradaY - 50; y += 60) {
      arvoresPos.push({ x: x + random(-20, 20), y: y + random(-20, 20) });
    }
  }
}

function draw() {
  if (telaInicial) {
    background(200, 255, 200);
    textSize(22);
    fill(0);
    text("🌾 Missão: Conectar o Campo à Cidade 🏙️", width / 2, 60);
    textSize(16);
    text("Use as setas ↑ e ↓ para desviar dos obstáculos!", width / 2, 120);
    text("Evite bater nas vacas 🐄, pedras ⚫ e troncos 🪵", width / 2, 150);
    text("Pressione ENTER para começar", width / 2, 220);
    return;
  }

  if (cidadeChegou) {
    background(100, 200, 255);
    textSize(16);
    fill(255);
    text("Missão: Levar a produção do campo até a cidade!", width / 2, 30);
    fill(0);
    textSize(24);
    text("🚛🏙️ Você conectou o campo à cidade! 🏙️🚛", width / 2, height / 2);
    return;
  }

  // Fundo verde do campo
  background(100, 255, 100);

  // Desenha árvores espalhadas em cima e embaixo da estrada
  drawArvores();

  // Estrada
  drawEstrada();

  caminhao.mostrar();
  caminhao.mover();

  if (frameCount % 60 === 0 && random() < 0.5) {
    obstaculos.push(new Obstaculo());
  }

  for (let i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].mover();
    obstaculos[i].mostrar();

    if (obstaculos[i].bateu(caminhao)) {
      noLoop();
      fill(255, 0, 0);
      textSize(24);
      text("💥 Você bateu! Fim de jogo!", width / 2, height / 2);
      return;
    }

    if (obstaculos[i].x > width + 30) {
      obstaculos.splice(i, 1);
    }
  }

  tempoRestante--;
  if (tempoRestante <= 0) {
    cidadeChegou = true;
  }
}

function keyPressed() {
  if (telaInicial && keyCode === ENTER) {
    telaInicial = false;
  }
}

class Caminhao {
  constructor() {
    this.x = width - 60;
    this.y = 220;
    this.size = 40;
    this.velocidade = 4;
  }

  mostrar() {
    textSize(32);
    text("🚛", this.x, this.y);
  }

  mover() {
    if (keyIsDown(UP_ARROW) && this.y > estradaY + 10) {
      this.y -= this.velocidade;
    }
    if (keyIsDown(DOWN_ARROW) && this.y < estradaY + 60) {
      this.y += this.velocidade;
    }
  }
}

class Obstaculo {
  constructor() {
    this.x = 0;
    this.y = random(estradaY + 20, estradaY + 80);
    this.velocidade = random(2, 3.5);
    let emojis = ["🐄", "⚫", "🪵"];
    this.emoji = random(emojis);
  }

  mostrar() {
    textSize(28);
    text(this.emoji, this.x, this.y);
  }

  mover() {
    this.x += this.velocidade;
  }

  bateu(c) {
    let emojiWidth = textWidth(this.emoji);
    let emojiHeight = 28;
    return (
      this.x < c.x + 32 &&
      this.x + emojiWidth > c.x &&
      this.y < c.y + 32 &&
      this.y + emojiHeight > c.y
    );
  }
}

function drawEstrada() {
  fill(80);
  rect(0, estradaY, width, 100);

  fill(255);
  let linhaWidth = 30;
  let linhaHeight = 6;
  for (let i = 0; i < linhaPosicoes.length; i++) {
    rect(linhaPosicoes[i], estradaY + 47, linhaWidth, linhaHeight);
    linhaPosicoes[i] += 4;
    if (linhaPosicoes[i] > width) {
      linhaPosicoes[i] = -linhaWidth;
    }
  }
}

function drawArvores() {
  for (let i = 0; i < arvoresPos.length; i++) {
    let x = arvoresPos[i].x;
    let y = arvoresPos[i].y;

    // Tronco
    fill(101, 67, 33);
    rect(x + 10, y, 15, 40);

    // Copa
    fill(34, 139, 34);
    ellipse(x + 17, y - 20, 40, 40);
    ellipse(x + 35, y - 20, 40, 40);
    ellipse(x - 20, y - 20, 40, 40);
  }
      }
