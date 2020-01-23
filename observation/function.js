var power=false;
var temp='temp1';
var lev='5';
var nightlight=false;
var url='assets/nolight';
churchill=d3.select('#churchill');
vartext=d3.select('#vartext')
d3.select('#power').classed('highlight',true)
d3.select('#nightlight').classed('highlight',true)
d3.select('#temp').classed('highlight',false)
d3.select('#timer').classed('highlight',false)
d3.selectAll('.level').classed('highlight',false)

function lightChange(){
  url=temp+'-'+lev
  churchill.attr('src','assets/'+url)
};


function powerButton(){
  if (power==false){
    lightChange()
    power=true;
    d3.select('#power').classed('highlight',true)
    d3.select('#nightlight').classed('highlight',false)
    d3.select('#temp').classed('highlight',true)
    d3.select('#timer').classed('highlight',true)
    d3.selectAll('.row').classed('highlightbar',true)
  }else{
    churchill.attr('src','assets/nolight')
    power=false;
    d3.select('#power').classed('highlight',true)
    d3.select('#nightlight').classed('highlight',true)
    d3.select('#temp').classed('highlight',false)
    d3.select('#timer').classed('highlight',false)
    d3.selectAll('.row').classed('highlightbar',false)
  }
};

function nightLight(){
  if (power==false&&nightlight==false){
    churchill.attr('src','assets/nightlight')
    nightlight=true;
  }else if(power==false&&nightlight==true){
    churchill.attr('src','assets/nolight')
    power=false;
    nightlight=false;
  }else if(power==true){
  }
}

function tempToggle(){
  if (power==false){
  }else{
    var oldSet=parseInt(temp.charAt(4),10);
    var newSet=oldSet+1;
    if (newSet==6){
      newSet=1
    }
    temp=temp.slice(0, -1)+newSet
    lightChange()
  }
}

function levelChange(newLevel){
  if (power==false){}else{
    lev=newLevel
    lightChange()
  }
}

d3.select('#power')
.on("mouseover", hoverP)
.on("mouseout", hoverOut);
d3.select('#nightlight')
.on("mouseover", hoverN)
.on("mouseout", hoverOut);
d3.select('#temp')
.on("mouseover", hoverT)
.on("mouseout", hoverOut);
d3.select('#timer')
.on("mouseover", hoverTi)
.on("mouseout", hoverOut);
d3.select('#lightlevels')
.on("mouseover", hoverL)
.on("mouseout", hoverOut);

function hoverP(){
  vartext.html('The buttons are touch sensitive. They remain lit for several seconds after the lamp is powered off.')
}
function hoverN(){
  vartext.html('An additional light bar only functional when the main led lighting is powered off')
}
function hoverT(){
  vartext.html('A toggle button for light temperature/mood that questionabely uses a recycling icon. It has five different options that go from very warm to very cool.')
}
function hoverTi(){
  vartext.html('Pressing this sets a 30 minute timer, after which the lamp will automatically shut off.')
}
function hoverL(){
  vartext.html('This is a 1-6 scale of light intensity options.')
}
function hoverOut(){
  vartext.html('Hover over the buttons to learn about their function, and click them to see how they affect the lighting.')
}
