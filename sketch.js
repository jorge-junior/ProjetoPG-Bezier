// Inicialize o sketch
function setup() {
    createCanvas(400, 400);
  }
  
  // Lista de pontos de controle
  let points = [];
  
  // Número de avaliações
  let nEvaluations = 100;
  
  // Calcula a curva de Bezier
  let curve = deCasteljau(points, nEvaluations);
  
  // recebe as informaçoes do input do botão clear
  let buttonclear = document.getElementById("buttonClear");
  buttonclear.addEventListener('click', function() {
      points = [];
      clear();
      curve = deCasteljau(points, nEvaluations);
  });
  
  // funçao que adicionas os pontos as curva de benzier
  function mouseClicked() {
    let newPoint = createVector(mouseX, mouseY); 
    if (mouseX <= 400 && mouseY <= 400){
        append(points, newPoint); 
    
        curve = deCasteljau(points, nEvaluations);
    }
  }
  
  // Desenha a curva de Bezier na tela
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