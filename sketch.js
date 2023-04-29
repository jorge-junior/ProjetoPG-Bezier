// Inicialize o sketch
function setup() {
  createCanvas(400, 400);
  let slider = select('#slider'); //// recebe as informaçoes do input do slider
}

// VARIAVEIS
// Lista de pontos de controle
let listas = [[]];

let points = [];

let posicao = 0;

//cores
let cor_curva = 'rgb(203,75,203)'
let cor_pontc ='rgb(203,75,203)'
let cor_polic = 'rgba(203,75,203,0.5)'

//nEvaluation
let nEvaluations = 50;

// Calcula a curva de Bezier
let curve = deCasteljau(points, nEvaluations);

// BOTOES

// cria uma nova curva caso s slider se mova com o valor selecionado
slider.addEventListener('input', sliderChanged);
function sliderChanged(){
  nEvaluations = slider.value;
  curve = deCasteljau(points, nEvaluations);
}

let buttonadd = document.getElementById("buttonAdd");
buttonadd.addEventListener('click', function() {
    let points = [];
    append(listas, points);
    posicao += 1;
});


let buttondel = document.getElementById("buttonDel");
buttondel.addEventListener('click', function() {
    listas.splice(posicao, 1);
    posicao -= 1;
    if (listas.length == 0) {
        listas = [[]];
        posicao = 0;
    }
    
});

// recebe as informaçoes do input do botão clear
let buttonclear = document.getElementById("buttonClear");
// limpa a tela caso o botão seja apertado
buttonclear.addEventListener('click', function() {
    listas = [[]];
    posicao = 0;
    clear();
    curve = deCasteljau(listas, nEvaluations);
});

//ocultar/mostrar curvas
const curvasCheckbox = document.getElementById("curvas");
curvas.addEventListener("change", function() {
  if (curvasCheckbox.checked) {
    cor_curva = "rgba(203,75,203,0)";
  }
  else {
    cor_curva = "rgb(203,75,203)";
  }
});

//ocultar/mostrar pontos de controle
//tá ocultando as partes que intersectam com os poligonais
const pontcCheckbox = document.getElementById("pontc");
pontc.addEventListener("change", function() {
  if (pontcCheckbox.checked) {
    cor_pontc = "rgba(203,75,203,0)";
  }
  else {
    cor_pontc = "rgb(203,75,203)";
  }
});

//ocultar/mostrar poligonais de controle
//tá ocultando as partes que cruzam com a curva
const policCheckbox = document.getElementById("polic");
polic.addEventListener("change", function() {
  if (policCheckbox.checked) {
    cor_polic = "rgba(203,75,203,0)";
  }
  else {
    cor_polic = "rgba(203,75,203,0.5)";
  }
});



let pontoproximo = 0;
let existe1 = false;  

function mousePressed() {
    listas[posicao].forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 30) {
          let distancia_proximo = dist(listas[posicao][pontoproximo].x, listas[posicao][pontoproximo].y, mouseX, mouseY);
          if (distancia <= distancia_proximo) {
              pontoproximo = listas[posicao].indexOf(ponto);
              existe1 = true;
          }
      }
  });
}

function mouseDragged() {
    if (existe1) {
        listas[posicao][pontoproximo].x = mouseX;
        listas[posicao][pontoproximo].y = mouseY;
        
        curve = deCasteljau(listas[posicao], nEvaluations);
    }
}

function mouseReleased(){
    pontoproximo = 0;
    existe1 = false;
}


// função que adicionas os pontos as curva de benzier
function mouseClicked() {
  console.log(listas)
  
  let newPoint = createVector(mouseX, mouseY);
  if (listas[posicao].length == 0 && mouseX <= 400 && mouseY <= 400) {
      append(listas[posicao], newPoint); 
      curve = deCasteljau(listas[posicao], nEvaluations);
  }
  
  let existe2 = false;
  pontoexiste = 0;
  listas[posicao].forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 30) {
          distancia_proximo = dist(listas[posicao][pontoexiste].x, listas[posicao][pontoexiste].y, mouseX, mouseY);
          if (distancia <= distancia_proximo) {
              pontoexiste = listas[posicao].indexOf(ponto);
              existe2 = true;
          }
      }
  });

  if (mouseX <= 400 && mouseY <= 400 && !existe2){
      append(listas[posicao], newPoint); 
      curve = deCasteljau(listas[posicao], nEvaluations);
  }
  existe2 = true;
}


// Desenha na tela
function draw() {
  background(255);
  noFill();
  
  listas.forEach(lista => {
      strokeWeight(2);

      // desenhado a cruva de benzier
      curve = deCasteljau(lista, nEvaluations);
      beginShape();
      stroke(cor_curva)
      curve.forEach(point => {
        vertex(point.x, point.y);
      });
      endShape();
    
      // desenhando as linhas entre pontos
      beginShape();
      stroke(cor_polic)
      strokeWeight(2);
      lista.forEach(point => {
        vertex(point.x, point.y);
      });
      endShape();
    
      // desenha os pontos
      stroke(cor_pontc); 
      strokeWeight(5);
      lista.forEach(ponto => {
        point(ponto.x, ponto.y);
      });
    
  });
  
  
  // Função que mostra quais pontos podem ser selecionados e as areas que nao é possivel criar um ponto
  
  /*
  pontoselecionado = 0;
  Listas[posicao].forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 30) {
          let distancia_prox = dist(Listas[posicao][pontoselecionado].x, points[pontoselecionado].y, mouseX, mouseY);
          if (distancia <= distancia_prox) {
              pontoselecionado = Listas[posicao].indexOf(ponto);
              ellipse(Listas[posicao][pontoselecionado].x, Listas[posicao][pontoselecionado].y, 30);
          }
      }
  });
  */
  
}
/*
function selecionado(pontos) {
    let existe = false;
    let pontoselecionado = 0;
    pontos.forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 30) {
          let distancia_proximo = dist(pontos[pontoselecionado].x, points[pontoselecionado].y, mouseX, mouseY);
          if (distancia <= distancia_proximo) {
              pontoselecionado = pontos.indexOf(ponto);
              existe = true;
          }
      }
  });
  
  if (existe) {
      
  }
}
*/

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