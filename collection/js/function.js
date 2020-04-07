var root=document.documentElement;
colH=100;
var senlngth=3;


function buildBody(data){
  allsonnets=data;
  var currentson=0;
  for(var i=0;i<allsonnets.length;i++){
    if(currentson==allsonnets[i].sonnet){
    }else{
      currentson++;
      d3.select('#maintext').append('span').classed('sonnet'+currentson,true).html('❤');
    }
    d3.select('#maintext').select('.sonnet'+currentson).append('span').html(' '+allsonnets[i].line+' ');
  }
}





var topbar=document.querySelector('#topbar');
topbar.addEventListener("mouseenter", function(event){
  var currentH=$('#topbar').height();
  var winHs=window.innerHeight*0.5;
  if(winHs<300){
    winHs=300;
  }
  var portion=(winHs)+'px';
  var slidetime=Math.abs(winHs-currentH)*1.5;
  d3.select('#topbar')
  .transition()
  .duration(slidetime)
  .ease(d3.easePolyIn)
  .style('height',portion);
});

topbar.addEventListener("mouseleave", function(event){
  var currentH=$('#topbar').height();
  var winH=window.innerHeight;
  var slidetime=Math.abs(100-currentH);
  d3.select('#topbar')
  .transition()
  .duration(slidetime)
  .ease(d3.easePolyIn)
  .style('height',colH+'px');
});

/*
function scaleTests(){

    senlngth=d3.select('.sentxt').html().length;
    var typewidth=100/senlngth*2;
    if(window.innerWidth>1000){
      typewidth=5;
    }
    root.style.setProperty('--textwidth', typewidth+'vw')
}

scaleTests();
window.addEventListener("resize",scaleTests);
*/
