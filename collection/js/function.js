var root=document.documentElement;
var colH=140;
var senlngth=3;
var fTone=-1;
var fWho=-1;
var fTheme=[];
var fRhyme=[];
var counting=0;
//will store the original organization permanently so it can be reset
var origin;
//this is the working list of sonnet data that's adjusted when you switch out lines by rhyme
var allson;
var blinds=false;
var rhymeCount=[];
var cview='med';
var tones=[
  {t:'admonishing', g:1},
  {t:'chastened', g:1},
  {t:'candid', g:1},
  {t:'jealous', g:1},
  {t:'admiring', g:2},
  {t:'venerating', g:2},
  {t:'fervent', g:2},
  {t:'maddening', g:2},
  {t:'lustful', g:2},
  {t:'captivated', g:2},
  {t:'tender', g:2},
  {t:'defiant', g:2},
  {t:'vicarious', g:2},
  {t:'dependent', g:3},
  {t:'yielding', g:3},
  {t:'selfless', g:3},
  {t:'penitent', g:3},
  {t:'anguished', g:4},
  {t:'forlorn', g:4},
  {t:'doleful', g:4},
  {t:'betrayed', g:4},
  {t:'anxious', g:4},
  {t:'yearning', g:4}
]

//transfer json to variable and add to dom--------------------------------------------------------
function buildBody(data){
  if (origin!==undefined){
    origin=data;
  }
  allson=data;
  var currentson=0;
  var curline=1;
  for(var i=0;i<allson.length;i++){
    if(currentson==allson[i].sonnet){
    }else{
      currentson++;
      currentline=1;
      d3.select('#maintext').append('span').classed('sonnet',true).classed('sonnet'+currentson,true).append('span').classed('heart',true).html('❤'+currentson+' ');
      d3.select('#maintext').select('.sonnet'+currentson).append('br');
    }
    d3.select('#maintext').select('.sonnet'+currentson).append('span').classed('line',true).classed('line'+currentline,true);
    d3.select('#maintext').select('.sonnet'+currentson).append('br');
    allson[i].num=currentline;
    currentline++;
    var rhyme=allson[i].rhyme;
    //for each rhyme in list
    for(var x=0; x<rhyme.length;x++){
      var exists = (element) => element.r==rhyme[x];
      if(rhymeCount.some(exists)){
        rhymeCount[rhymeCount.findIndex(exists)].c=rhymeCount[rhymeCount.findIndex(exists)].c+1;
      }else{
        var n = allson[i].line.split(" ");
        var lastword=n[n.length - 1];
        rhymeCount.push({r:rhyme[x],c:1,e:lastword});
      }
    }//end of x loop
  }

  d3.selectAll('.line')
  .data(allson)
  .join(
    enter => enter.append("text").text(function(d) { return ' '+d.line+' '; }),
    update => update.append("text").text(function(d) { return ' '+d.line+' '; })
  )
  rhymeCheck();
  poemExp();
  sentenceBreak();
  buildFilters();
  counter();
}//end of buildBody

function rhymeCheck(){
  rhymeCount=rhymeCount.sort(function(a,b){return b.c-a.c;});
  for(var x=0;x<allson.length;x++){
    canRhyme(x);
  }
}
function canRhyme(ind){
  //this function decides whether a given line has enough rhymes to be given a switcher
  line=allson[ind];
  var r0=line.rhyme[0];
  var exists = (element) => element.r==r0;
  if(rhymeCount.find(exists).c>4){
    allson[ind].cr=true;
  }else{
    allson[ind].cr=false;
  }
  rhymeHandle(ind);
}
function rhymeHandle(ind){
    line=d3.selectAll('.line').filter(function(d, i){return i==ind;});
    if(allson[ind].cr==true){
      line
      .append('span')
      .attr('class','sw')
      .classed('changeable',true)
      .html(' ⇄')
      .on('click',function(info){switchLine(info)});
      if(!window.matchMedia("(hover: none)").matches){
        line
        .on('click',function(info){
          if(d3.select(event.currentTarget.parentNode).attr('id')=='selected'){
            switchLine(info)}//end of if
          }
        )
        .classed('changeable',true);
      }
    }else{
      line
      .on('mouseenter',null)
      .on('mouseleave',null);
    };

};
function switchLine(info){
  //this is the switch-out function
  //first step is find all the lines that share a rhyme with the clicked line
  //i might change it so that it only searches for matches with the first index rhyme
  var rhymes=info.rhyme;

  var search=[];
  var samerhyme = (element)=>element.rhyme.some(r=>rhymes.indexOf(r)>= 0)&&!search.includes(allson.indexOf(element));
  while(allson.findIndex(samerhyme)!==-1){
    var newInd=allson.findIndex(samerhyme);
    search.push(newInd);
  }
  var cIndex=allson.indexOf(info);
  search.splice(search.indexOf(cIndex),1);
  //now it picks one rhyme from the list at random
  var pick=search[Math.floor(Math.random()*search.length)];
  [allson[cIndex], allson[pick]] = [allson[pick], allson[cIndex]];
  //now it updates the dom
  updateLine(cIndex);
  updateLine(pick);
}
function updateLine(index){
  wArray=d3.selectAll('.line').data(allson).filter(function(d,i){return i==index});
  wArray.join('text')
  .text(function(d) { return d.line+' '; })
  .classed('changed',true);
  wArray.append('div').html(' — '+allson[index].sonnet+':'+allson[index].num).classed('label',true);
  rhymeHandle(index);
}
//top bar--------------------------------------------------------
var topbar=document.querySelector('#topbar');
if(!window.matchMedia("(hover: none)").matches){
  var cursorTrack=function(event){
    //mouse handler comes with info about where the mouse is
    yCoord=event.clientY
    xCoord=event.clientX
    document.querySelector('#mycursor').style.top=yCoord+'px';
    document.querySelector('#mycursor').style.left=xCoord+'px';
  }
  document.onmousemove=cursorTrack;


  topbar.addEventListener("mouseenter", function(event){
    lowerBlinds();
    // document.querySelector('#cicon').innerHTML='✎';
  });

  topbar.addEventListener("mouseleave", function(event){
    raiseBlinds();
    // document.querySelector('#cicon').innerHTML='✍';
  });
}
d3.selectAll('.scale span').on('click',function(event){
  var butclass=d3.event.currentTarget.className.slice(0,3);
  if(butclass!==cview){
    d3.selectAll('.'+cview).classed('cview',false);
    d3.selectAll('.'+butclass).classed('cview',true);
    cview=butclass;
    changeScale(cview);
  }
});
function changeScale(scale){
  d3.select('#maintext')
  .attr('class','')
  .classed(scale+'size',true);
  scrollControl('auto');
  setTimeout(function(){scrollControl('auto')},510);
};
function lowerBlinds(){
  var currentH=$('#topbar').height();
  var winHs=window.innerHeight*0.6;
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
  d3.select('#arrow').html('↑↑↑');
  blinds=true;
  d3.select('#cicon').text('➴').attr('class','pointer');
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
  d3.select('#arrow').html('↓↓↓');
  blinds=false;
  d3.select('#cicon').text('✎').attr('class','pencil');
}
function blindsTog(){
  if(blinds==false){
    lowerBlinds();
  }else{
    raiseBlinds();
  }
}
function buildFilters(){
  bTones();
  function bTones(){
    d3.select('#tone')
    .selectAll('span')
    .data(tones,d => d)
    .join('span')
    .text(d=>d.t)
    .attr('class',d =>classG(d));

    function classG(d){
      return 'toned'+d.g;
    }
    var spans=document.querySelectorAll('#tone span');
    for(var x=0; x<spans.length;x++){
      var rand=(Math.random()*15)*(Math.random()<0.5?-1:1);
      var rotation="rotate("+rand+"deg)"
      spans[x].style.transform=rotation;
    }
    d3.selectAll('#tone span')
    .on('click',function(event){
      var picked=d3.select(d3.event.currentTarget);
      if(picked.classed('fil-pick')==true){
        picked.classed('fil-pick',false);
        fTone=0;
      }else{
        d3.selectAll('#tone span').classed('fil-pick',false);
        picked.classed('fil-pick',true);
        fTone=event;
      }
      sentenceBuilder();
    })
  }
  d3.selectAll('.tabs span').on('click',function(){
    var modify=d3.event.currentTarget.innerHTML;
    console.log(modify);
    d3.selectAll('.fil-cat').style('opacity',0)
    setTimeout(function(){
      d3.selectAll('.fil-cat')
      .style('display','none');
      d3.select('#'+modify)
      .style('display','block')
      .style('opacity',1)
    },300)

  })

}
function sentenceBuilder(){
  if(fTone!==0){
    d3.select('#tonetext').text(fTone.t+' ');
  }else{
    d3.select('#tonetext').text('');
  }



  filterText();
}
function filterText(){
  var toneCheck=true;
  var toneCount;
  if(fTone!=='0'){
    toneCount=tones.indexOf(fTone);
    toneCheck=(l)=>{return l.tone==toneCount;};
  }
  d3.selectAll('.line')
  .classed('selection',false);
  d3.selectAll('.line')
  .filter(function(d, i){return checking(d,i);})
  .classed('selection',true);

  function checking(d,i){
    if(toneCheck(d)){
      return true;
    }else{
      return false;
    }
  }
  counter();
  if(counting>0){
    scrollSel(d3.select('.selection').node(),'smooth');
  }
}//end of filtertext
function counter(){
  counting=0;
  d3.selectAll('.selection').each(function(){
    counting++;
  })
  d3.select('#selected').selectAll('.line').each(function(){
    counting++;
  })
  d3.select('#selected').selectAll('.selection').each(function(){
    counting--;
  })
  d3.select('.counter').select('span').text(counting);
}



//poem expand interface--------------------------------------------------------
function poemExp(){
  sonnets=document.querySelectorAll('.sonnet')
  for (var i=0; i<sonnets.length;i++){
      sonnets[i].addEventListener("click", function(event){
      var selected=d3.select(event.currentTarget);
      d3.select('#maintext').selectAll('#selected').attr('id','');
      selected.attr('id','selected');
      var source=event.srcElement.parentNode;
      if(source!==null&&!source.className.includes('sonnet')){
        scrollControl('smooth');
      }
      var heart=selected.select('.heart');
      heart.on('mouseenter',function(event){
        if(d3.event.currentTarget.parentNode.id=='selected'){
          cursorChange('close');
        }
      })
      heart.on('mouseleave',function(event){
        if(d3.event.currentTarget.parentNode.id=='selected'){
          cursorChange('default');
        }
      })
      heart.on('click',function(){
        console.log('hello')
        setTimeout(function(){d3.select('#maintext').selectAll('#selected').attr('id',''); counter();},100);
      })
      counter();
      //end of on-click
    });
  }
}//end of poemexp
function scrollControl(behave){
  if(d3.select('#selected')._groups[0][0]!==null){
    scrollSel(document.querySelector('#selected'),behave);
  }else if(d3.select('.selection')._groups[0][0]!==null){
    scrollSel(d3.select('.selection').node(),behave);
  }
}

function scrollSel(node,behave){
  var windowRel=node.getBoundingClientRect().y-(colH+50);
  window.scroll({top:window.scrollY+windowRel,behavior:behave});
}

function cursorChange(x){
  console.log('program mouse to go',x)
}


function sentenceBreak(){
  var sent=d3.select('.sentxt');
  var senW=document.querySelector('.sentxt').getBoundingClientRect().width;
  var senH=document.querySelector('.sentxt').getBoundingClientRect().height;
  var screenW=document.querySelector('#sentence').getBoundingClientRect().width;
    d3.select('#sentence').style('padding-top','30px');

  if (sent.classed('oneline')==false){
    d3.select('.sentxt').attr('class','sentxt oneline noselect');
    senW=document.querySelector('.sentxt').getBoundingClientRect().width;
    d3.select('#sentence').style('padding-top','30px');
  }
  if(senW>screenW){
    d3.select('.sentxt').attr('class','sentxt twolines noselect');
    senW=document.querySelector('.sentxt').getBoundingClientRect().width;
    senH=document.querySelector('.sentxt').getBoundingClientRect().height;
    d3.select('#sentence').style('padding-top','20px');
  }
  var twolines=sent.classed('twolines')==true;
  if (twolines&&senH>colH){
    d3.select('.sentxt').attr('class','sentxt threelines noselect');
    d3.select('#sentence').style('padding-top','20px');
  }else if(twolines && senH<50){
    d3.select('#sentence').style('padding-top','30px');
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
