var root=document.documentElement;
var colH=100;
var senlngth=3;
var allsonnets;

//transfer json to variable and add to dom--------------------------------------------------------
function buildBody(data){
  allsonnets=data;
  var currentson=0;
  var curline=1;
  for(var i=0;i<allsonnets.length;i++){
    if(currentson==allsonnets[i].sonnet){
    }else{
      currentson++;
      currentline=1;
      d3.select('#maintext').append('span').classed('sonnet',true).classed('sonnet'+currentson,true).append('span').classed('heart',true).html('❤'+currentson+' ');
    }
    d3.select('#maintext').select('.sonnet'+currentson).append('span').html(' '+allsonnets[i].line+' ').classed('line'+currentline,true);
    currentline++;
  }
  poemExp();
  /*
  d3.select('#maintext')
  .transition()
  .duration(1000)
  .ease(d3.easeQuadInOut)
  .style('line-height','32px');
  */
}




//top bar--------------------------------------------------------
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
  var slidetime=Math.abs(colH-currentH);
  d3.select('#topbar')
  .transition()
  .duration(slidetime)
  .ease(d3.easePolyIn)
  .style('height',colH+'px');
});
//poem expand interface--------------------------------------------------------
function poemExp(){
  sonnets=document.querySelectorAll('.sonnet')
  for (var i=0; i<sonnets.length;i++){
      sonnets[i].addEventListener("mousedown", function(event){
      d3.select('#maintext').selectAll('#selected').attr('id','');
      var selected=d3.select(event.srcElement.parentNode);
      if (selected.attr('id')=='maintext'){
        selected=d3.select(event.srcElement);
      }
      selected.attr('id','selected');
      scrollControl('smooth');
      // document.querySelector('#selected').scrollIntoView({block:'end',behavior: 'smooth'});
    });
  }


}//end of poemexp

function scrollControl(behave){
  behave
  if(d3.select('#selected')._groups[0][0]!==null){
    var windowRel=document.querySelector('#selected').getBoundingClientRect().y-(colH+50);
    window.scroll({top:window.scrollY+windowRel,behavior:behave});
  }
}


function resizing(){
  scrollControl('auto');
}
/*
function scaleTests(){

    senlngth=d3.select('.sentxt').html().length;
    var typewidth=100/senlngth*2;
    if(window.innerWidth>1000){
      typewidth=5;
    }
    root.style.setProperty('--textwidth', typewidth+'vw')
}

scaleTests();*/
window.addEventListener("resize",resizing);
