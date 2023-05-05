// Inicialize o sketch
function setup() {
  createCanvas(400, 400);
  let slider = select('#slider'); //// recebe as informaçoes do input do slider
}

// VARIAVEIS
// Lista de pontos de controle
let listas = [[]];

// Posicao da lista selecionada
let posicao = 0;

//nEvaluation
let nEvaluations = 50;

// Calcula a curva de Bezier
let curve = deCasteljau(listas[posicao], nEvaluations);

// CORES
// cores das linhas
let cor_polic = 'rgba(111,99,111,0.5)'

// cores das curvas
let cores_curvas = ["rgb(0,0,0)",    "rgb(0,57,19)",
                    "rgb(0,126,0)",  "rgb(0,255,0)", 
                    "rgb(0,0,255)",  "rgb(0,255,255)",
                    "rgb(255,0,0)",  "rgb(255,255,0)",
                    "rgb(255,0,255)","rgb(121,85,72)"];
 
// BOTOES
// cria uma nova curva caso o slider se mova com o valor selecionado
slider.addEventListener('input', sliderChanged);
function sliderChanged(){
  nEvaluations = slider.value;
  curve = deCasteljau(listas[posicao], nEvaluations);
}

//cria uma nova curva 
let buttonadd = document.getElementById("buttonAdd");
buttonadd.addEventListener('click', function() {
    let pontos = [];
    append(listas, pontos);
    posicao += 1;
});

//deleta a ultima curva criada
let buttondel = document.getElementById("buttonDel");
buttondel.addEventListener('click', function() {
    listas.splice(posicao, 1);
    posicao -= 1;
    if (listas.length == 0) {
        listas = [[]];
        posicao = 0;
    }
    
});

// limpa a tela caso o botão seja apertado
let buttonclear = document.getElementById("buttonClear");
buttonclear.addEventListener('click', function() {
    listas = [[]];
    posicao = 0;
    clear();
    curve = deCasteljau(listas, nEvaluations);
});

// ocultar/mostrar curvas
const curvasCheckbox = document.getElementById("curvas");
curvas.addEventListener("change", function() {
  if (curvasCheckbox.checked) {
    cor_curva = "rgba(203,75,203,0)";
  }
  else {
    cor_curva = "rgb(203,75,203)";
  }
});

// ocultar/mostrar pontos de controle
const pontcCheckbox = document.getElementById("pontc");
pontc.addEventListener("change", function() {
  if (pontcCheckbox.checked) {
    cor_pontc = "rgba(203,75,203,0)";
  }
  else {
    cor_pontc = "rgb(203,75,203)";
  }
});

// ocultar/mostrar poligonais de controle
const policCheckbox = document.getElementById("polic");
polic.addEventListener("change", function() {
  if (policCheckbox.checked) {
    cor_polic = "rgba(203,75,203,0)";
  }
  else {
    cor_polic = "rgba(111,99,111,0.5)";
  }
});

function mostrarResult(){
    let element = document.getElementById("corCurva");
    if( element.style.backgroundColor== 'blue'){
            document.getElementById("corCurva").innerHtml = element.style.backgroundColor= 'red';
          posicao = 1;
    }
    else{
      document.getElementById("corCurva").innerHtml = element.style.backgroundColor= 'blue';
          posicao = 0;
    }
}

let pontoproximo = 0;
let existe1 = false;  

function mousePressed() {
    // verifica se o mouse esta proximo de algum ponto e pega sua posição na lista de pontos
    listas[posicao].forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 20) {
          let distancia_proximo = dist(listas[posicao][pontoproximo].x, listas[posicao][pontoproximo].y, mouseX, mouseY);
          if (distancia <= distancia_proximo) {
              pontoproximo = listas[posicao].indexOf(ponto);
              existe1 = true;
          }
      }
  });
}

function mouseDragged() {
    // caso algum ponto esteja proximo do mouse e seja selecionado sua posição é mudada de acordo com a posicao do mouse.
    if (existe1) {
        listas[posicao][pontoproximo].x = mouseX;
        listas[posicao][pontoproximo].y = mouseY;
        
        curve = deCasteljau(listas[posicao], nEvaluations);
    }
}

function mouseReleased(){
    // ao soltar o ponto as variaveis são resetadas
    pontoproximo = 0;
    existe1 = false;
}

// função que adicionas os pontos as curva de benzier
function mouseClicked() {
  console.log(listas);
  
  let newPoint = createVector(mouseX, mouseY);
  
  // caso não exista nenhum ponto ele cria um novo
  if (listas[posicao].length == 0 && mouseX <= 400 && mouseY <= 400) {
      append(listas[posicao], newPoint); 
      curve = deCasteljau(listas[posicao], nEvaluations);
  }
  
  // verifica se o mouse esta proximo de algum ponto e pega sua posição na lista de pontos
  let existe2 = false;
  pontoexiste = 0;
  listas[posicao].forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 20) {
          distancia_proximo = dist(listas[posicao][pontoexiste].x, listas[posicao][pontoexiste].y, mouseX, mouseY);
          if (distancia <= distancia_proximo) {
              pontoexiste = listas[posicao].indexOf(ponto);
              existe2 = true;
          }
      }
  });
  
  // cria um ponto
  if (mouseX <= 400 && mouseY <= 400 && !existe2){
      append(listas[posicao], newPoint); 
      curve = deCasteljau(listas[posicao], nEvaluations);
  }
}

// Desenha na tela
function draw() {
  background(255);
  noFill();
  
  // loop entre as listas de pontos de cada curva
  listas.forEach(lista => {
      strokeWeight(2);

      // desenhado a cruva de benzier
      curve = deCasteljau(lista, nEvaluations);
      beginShape();
      stroke(cores_curvas[listas.indexOf(lista)]);
      curve.forEach(point => {
        vertex(point.x, point.y);
      });
      // soluciona problema da curva desaparecer perto de pontos em algumas posições
      if (curve.length != 0) {
          vertex(curve[curve.length - 1].x, curve[curve.length - 1].y);
          vertex(lista[lista.length-1].x, lista[lista.length-1].y);
      }
      
      endShape();
    
      // desenhando as linhas entre pontos
      beginShape();
      let cor = cores_curvas[listas.indexOf(lista)];
      let newcor = color(red(cor), green(cor), blue(cor), 0.5);
      stroke(newcor)
      strokeWeight(2);
      lista.forEach(point => {
        vertex(point.x, point.y);
      });
      endShape();
    
      // desenha os pontos
      stroke(cores_curvas[listas.indexOf(lista)]);
      strokeWeight(5);
      lista.forEach(ponto => {
        point(ponto.x, ponto.y);
      });
    
  });
  
  
  // verifica se o mouse esta proximo de algum ponto e desenha uma elipse ao redor dele
  pontoselecionado = 0;
  listas[posicao].forEach(ponto => {
      let distancia = dist(ponto.x, ponto.y, mouseX, mouseY);
      if (distancia < 20) {
          let distancia_prox = dist(listas[posicao][pontoselecionado].x, listas[posicao][pontoselecionado].y, mouseX, mouseY);
          if (distancia <= distancia_prox) {
              pontoselecionado = listas[posicao].indexOf(ponto);
              ellipse(listas[posicao][pontoselecionado].x, listas[posicao][pontoselecionado].y, 20);
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