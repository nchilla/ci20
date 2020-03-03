var letters=[];
var consA=['B','C','D','F','G','H','J'];
var consB=['K','L','M','N','P','Q','R'];
var consC=['S','T','V','W','X','Y','Z'];
var consTotal=consA.concat(consB).concat(consC);
var vows=['A','E','I','O','U'];
var distCounter=0;
var orbitCount=0;
var mainwidth;
var step=0;
var orbSpeeds=[];
var speeders=[4000,6000,8000,10000,12000,14000,16000];

$(document).ready(function() {
  /*
  $(function() {
    $("#main").draggable();
  });
  */
  mainWidth=d3.select('#main').style('width')
  document.documentElement.style.setProperty('--mainwidth', mainWidth)
//capture key presses
  $(document).on("keydown", function(e){
    goBack();
  });
  $(document).on("keypress", function(e) {
    //translate unicode to characters
    var char = String.fromCharCode(e.which).toUpperCase();
    d3.select('#typehere').append('span').html(char);
    letters.push(char);
    pastLetter=letters[letters.length-2];
    if (!(consTotal.indexOf(char)==-1)){
      if (step==0){
        createOrbit(char);
      }else if(step==1){
        modOrbit1(char)
      }
    }else if (!(vows.indexOf(char)==-1)){
      step=0;
      d3.select('.current').classed('current',false)
      d3.select('.curcirc').classed('curcirc',false)
    }

  });

});

function upOrbits(){
  for(i=1;i<orbitCount;i++){
    orb=d3.select('.orb'+i);
    newOrb=orb.attr('data-dist')
    newDist=newOrb/distCounter*100;
    newOff=(100-newDist)/2;
    orb
    .style('width',newDist+'%')
    .style('height',newDist+'%')
    .style('top',newOff+'%')
    .style('left',newOff+'%')
  }
  for(i=1;i<orbitCount;i++){
    orb=d3.select('.circ'+i);
    newOrb=orb.attr('data-dist')
    newDist=newOrb/distCounter*100;
    newOff=(100-newDist)/2;
    orb
    .style('width',newDist+'%')
    .style('height',newDist+'%')
    .style('top',newOff+'%')
    .style('left',newOff+'%')
  }

}


function rotate(orbit,index){
  thisOrb=d3.select(`.orb${orbit}`);
  speeder=speeders[orbSpeeds[orbit-1]];
  thisOrb.style('animation',`${speeder} ${speeder}ms linear infinite`)
}



function createOrbit(k) {
  orbitCount++;
  var shape;
  d3.select('#main').append('div').classed('orbit',true).classed('current',true).classed('orb'+orbitCount,true)
  d3.select('#circles').append('div').classed('orbitline',true).classed('curcirc',true).classed('circ'+orbitCount,true)
  groupA=consA.indexOf(k)+1;
  groupB=consB.indexOf(k)+1;
  groupC=consC.indexOf(k)+1;
  if (!(groupA==0)){
    shape='circle';
    firstIndex=groupA;
  }else if (!(groupB==0)){
    shape='triangle'
    firstIndex=groupB;
  }else if (!(groupC==0)){
    shape='square'
    firstIndex=groupC;
  }
  distCounter=distCounter+firstIndex;
  orbDist=firstIndex/distCounter*100;
  scale=0.06;
  /*scale=firstIndex*0.02;*/
  offset=(100-orbDist)/2;
  curcirc=d3.select('.curcirc')
  curcirc
  .style('width','100%')
  .style('height','100%')
  .style('top','0%')
  .style('left','0%')
  .attr('data-dist',distCounter)
  current=d3.select('.current')
  current
  .style('width','100%')
  .style('height','100%')
  .style('top','0%')
  .style('left','0%')
  .attr('data-dist',distCounter)
  .append('div')
  .attr('class','sat')
  switch(shape){
    case 'triangle':
    current.select('.sat')
    .append('svg').classed('triangle',true)
    .attr('preserveAspectRatio','none')
    .attr('viewBox','0 0 100 100')
    .append('polygon')
    .attr('points','0 50,100 100,100 0')
    .attr('vector-effect','non-scaling-stroke')
    break;
    case 'circle':
    current.select('.sat')
    .append('div').classed('circle',true)
    break;
    case 'square':
    current.select('.sat')
    .append('div').classed('square',true)
    break;
  }
  current.select('.sat')
  .style('width',`calc(var(--mainwidth)*${scale})`)
  .style('height',`calc(var(--mainwidth)*${scale})`)
  .style('top',`calc(50% - calc(var(--mainwidth)*${scale/2}))`)
  .style('right',`calc(var(--mainwidth)*-${scale/2})`)
  /*current.classed('current',false);*/
  upOrbits();
  orbSpeeds.push(3);
  rotate(orbitCount,firstIndex);
  step++

  /*
  top:5%;
  left:5%;
  width:90%;
  height:90%;
  d3.select("#shift")
  .transition()
  .duration(400)
  .ease(d3.easeLinear)
  .style("top","-100vh")
  */
}//end of createorbit
function modOrbit1(k) {
  current=d3.select('.current')
  groupA=consA.indexOf(k)+1;
  groupB=consB.indexOf(k)+1;
  groupC=consC.indexOf(k)+1;
  console.log(groupA,groupB,groupC)
  if (!(groupA==0)){
    secIndex=groupA;
    scale=secIndex*0.02;
    current.select('.sat')
    .style('width',`calc(var(--mainwidth)*${scale})`)
    .style('height',`calc(var(--mainwidth)*${scale})`)
    .style('top',`calc(50% - calc(var(--mainwidth)*${scale/2}))`)
    .style('right',`calc(var(--mainwidth)*-${scale/2})`)
  }else if (!(groupB==0)){
    secIndex=groupB;
    orbSpeeds[orbSpeeds.length-1]=secIndex-1;
    rotate(orbitCount)
  }else if (!(groupC==0)){
    secIndex=groupC;
  }
  d3.select('.current').classed('current',false)
  d3.select('.curcirc').classed('curcurc',false)
  step++;
}//end of modorbit1

function goBack(){

}





window.addEventListener("resize", function(){
  mainWidth=d3.select('#main').style('width')
  document.documentElement.style.setProperty('--mainwidth', mainWidth)
});
