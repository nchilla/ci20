var root=document.documentElement;
var colH=100;
var senlngth=3;
var allsonnets;
var blinds=false;
var rhymeCount=[];

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
    d3.select('#maintext').select('.sonnet'+currentson).append('span').html(' '+allsonnets[i].line+' ').classed('line',true).classed('line'+currentline,true);
    currentline++;
  }
  d3.selectAll('.line').data(allsonnets);
  rhymeCheck();
  poemExp();
  sentenceBreak();
  /*
  d3.select('#maintext')
  .transition()
  .duration(1000)
  .ease(d3.easeQuadInOut)
  .style('line-height','32px');
  */
}


function rhymeCheck(){
  for(var l=0;l<allsonnets.length;l++){
    var rhyme=allsonnets[l].rhyme;
    //for each rhyme in list
    for(var x=0; x<rhyme.length;x++){
      var exists = (element) => element.r==rhyme[x];
      if(rhymeCount.some(exists)){
        rhymeCount[rhymeCount.findIndex(exists)].c=rhymeCount[rhymeCount.findIndex(exists)].c+1;
      }else{
        rhymeCount.push({r:rhyme[x],c:1});
      }
    }//end of x loop
  }//end of l loop
  rhymeCount=rhymeCount.sort(function(a,b){return b.c-a.c;});
  for(var l=0;l<allsonnets.length;l++){
    rhymeHandle(l);
  }
}

function rhymeHandle(ind){
    line=allsonnets[ind];
    var r0=line.rhyme[0];
    var exists = (element) => element.r==r0;
    if(rhymeCount.find(exists).c>4){
      d3.selectAll('.line').filter(function(d, i){return i==ind;}).append('span').attr('class','sw').html(' ⇄');
    };
};



//top bar--------------------------------------------------------
var topbar=document.querySelector('#topbar');
topbar.addEventListener("mouseenter", function(event){
  lowerBlinds();
});

topbar.addEventListener("mouseleave", function(event){
  raiseBlinds();
});


function lowerBlinds(){
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
  d3.select('#arrow').html('↑');
  blinds=true;
}


function raiseBlinds(){
  var currentH=$('#topbar').height();
  var winH=window.innerHeight;
  var slidetime=Math.abs(colH-currentH);
  d3.select('#topbar')
  .transition()
  .duration(slidetime)
  .ease(d3.easePolyIn)
  .style('height',colH+'px');
  d3.select('#arrow').html('↓');
  blinds=false;
}

function blindsTog(){
  if(blinds==false){
    lowerBlinds();
  }else{
    raiseBlinds();
  }
}


//poem expand interface--------------------------------------------------------
function poemExp(){
  sonnets=document.querySelectorAll('.sonnet')
  for (var i=0; i<sonnets.length;i++){
      sonnets[i].addEventListener("click", function(event){
      var selected=d3.select(event.currentTarget);
      // if (selected.attr('id')=='maintext'){
      //   selected=d3.select(event.srcElement);
      // }else if(selected.classed('line')){
      //   return;
      //   console.log('test');
      // }
      d3.select('#maintext').selectAll('#selected').attr('id','');
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

function sentenceBreak(){
  var sent=d3.select('.sentxt');
  var senW=document.querySelector('.sentxt').getBoundingClientRect().width;
  var senH=document.querySelector('.sentxt').getBoundingClientRect().height;
  var screenW=document.querySelector('#sentence').getBoundingClientRect().width;
  d3.select('#sentence').style('padding-top','20px');

  if (sent.classed('oneline')==false){
    d3.select('.sentxt').attr('class','sentxt oneline noselect');
    senW=document.querySelector('.sentxt').getBoundingClientRect().width;
  }
  if(senW>screenW){
    d3.select('.sentxt').attr('class','sentxt twolines noselect');
    senW=document.querySelector('.sentxt').getBoundingClientRect().width;
    senH=document.querySelector('.sentxt').getBoundingClientRect().height;
  }
  var twolines=sent.classed('twolines')==true;
  if (twolines&&senH>colH){
    d3.select('.sentxt').attr('class','sentxt threelines noselect');
  }else if(twolines && senH<50){
    d3.select('#sentence').style('padding-top','40px');
  }

}//end of sentence break




function resizing(){
  scrollControl('auto');
  sentenceBreak();
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
