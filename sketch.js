// Inicialize o sketch
function setup() {
  createCanvas(400, 400);
  let slider = select('#slider'); //// recebe as informaçoes do input do slider
}

// Lista de pontos de controle
let points = [];

let pontoproximo = 0;

let existe = false;

//nEvaluation
let nEvaluations = 50;

// Calcula a curva de Bezier
let curve = deCasteljau(points, nEvaluations);

// cria uma nova curva caso s slider se mova com o valor selecionado
slider.addEventListener('input', sliderChanged);
function sliderChanged(){
  nEvaluations = slider.value;
  curve = deCasteljau(points, nEvaluations);
}

// recebe as informaçoes do input do botão clear
let buttonclear = document.getElementById("buttonClear");
// limpa a tela caso o botão seja apertado
buttonclear.addEventListener('click', function() {
    points = [];
    clear();
    curve = deCasteljau(points, nEvaluations);
});


function mousePressed() {
    points.forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 30) {
          distancia_proximo = dist(points[pontoproximo].x, points[pontoproximo].y, mouseX, mouseY);
          if (distancia <= distancia_proximo) {
              pontoproximo = points.indexOf(ponto);
              existe = true;
          }
      }
  });
}

function mouseDragged() {
    if (existe) {
        points[pontoproximo].x = mouseX;
        points[pontoproximo].y = mouseY;
        
        curve = deCasteljau(points, nEvaluations);
    }
}

function mouseReleased(){
    pontoproximo = 0;
    existe = false;
}


// função que adicionas os pontos as curva de benzier
function mouseClicked() {
  let newPoint = createVector(mouseX, mouseY);
  if (points.length == 0 && mouseX <= 400 && mouseY <= 400) {
      append(points, newPoint); 
      curve = deCasteljau(points, nEvaluations);
  }
  
  let existe2 = false;
  pontoexiste = 0;
  points.forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 30) {
          distancia_proximo = dist(points[pontoexiste].x, points[pontoexiste].y, mouseX, mouseY);
          if (distancia <= distancia_proximo) {
              pontoexiste = points.indexOf(ponto);
              existe2 = true;
          }
      }
  });

  if (mouseX <= 400 && mouseY <= 400 && !existe2){
      append(points, newPoint); 
      curve = deCasteljau(points, nEvaluations);
  }
  existe = true;
}


// Desenha na tela
function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(2);

  // desenhado a cruva de benzier
  beginShape();
  curve.forEach(point => {
    vertex(point.x, point.y);
  });
  endShape();

  // desenhando as linhas entre pontos
  beginShape();
      points.forEach(point => {
        vertex(point.x, point.y);
      });
  endShape();

  // desenha os pontos
  stroke('purple'); 
  strokeWeight(5);
  points.forEach(ponto => {
    point(ponto.x, ponto.y);
  });
  
  
  // Função que mostra quais pontos podem ser selecionados e as areas que nao é possivel criar um ponto
  pontoselecionado = 0;
  points.forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 30) {
          let distancia_prox = dist(points[pontoselecionado].x, points[pontoselecionado].y, mouseX, mouseY);
          if (distancia <= distancia_prox) {
              pontoselecionado = points.indexOf(ponto);
              ellipse(points[pontoselecionado].x, points[pontoselecionado].y, 30);
          }
      }
  });
  
}

// Função de interpolação
function interpolate(t, p0, p1) {
  return { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
}

// Função de De Casteljau
function deCasteljau(points, nEvaluations) {
  if (points == undefined || points.length < 1) return [] ;
  result = [];
  start = points[0];
  for (let t = 0; t <= 1; t += 1 / nEvaluations) {
    controls = points;

    while (controls.length > 1) {
      aux = [];

      for (i = 0; i < controls.length - 1; i++) {
        aux[i] = interpolate(t, controls[i], controls[i + 1]);
      }
      controls = aux;
    }

    result.push(controls[0]);
  }
  return result;
}