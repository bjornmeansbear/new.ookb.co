float mx;
float my;
float easing = 0.1;
int edge = 100;
char triggerChar='a';

void setup() {
  size(1000, 600);
  noStroke(); 
  ellipseMode(RADIUS);
  rectMode(CORNERS);
  background(#000000);
  noCursor();
}

void draw() { 


  if (abs(mouseX - mx) > 0.1) {
    mx = mx + (mouseX - mx) * easing;
  }
  if (abs(mouseY - my) > 0.1) {
    my = my + (mouseY- my) * easing;
  }

  mx = constrain(mx, 124, width - 124);
  my = constrain(my, 124, height - 124);


  if (keyPressed == true) {
    if (key == triggerChar || key =='a') {
      rect(mx, my, 224, 124);
      fill(#FF55ff, 10);
      }
      
    if (key == triggerChar || key =='d') {
      rect(mx, my, 600, 124);
      fill(#22be67, 10);
      }
      
    if(key=='s'){
    saveFrame("export/hello-######.png");
    }
  }
  else {
    fill(#FFFF00, 5);
    rect(mx, my, 600, 124);
  }
}

void mouseDragged() {
  fill(random(0,255), random(0,255),random(0,255));

}


 


