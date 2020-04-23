var root=document.documentElement;
var colH=140;
var senlngth=3;
var fTone=0;
var fWho=-1;
var fTheme=[];
var fRhyme=[];
var resetCount=0;
var counting=0;
var updatedMain=false;
var punct=new RegExp(',|!|;|:|\\?','gi');
var dedication=[
  'TO THE ONLIE BEGETTER OF','THESE INSUING SONNETS','​​Mr W.H.', 'ALL HAPPINESSE','​​AND THAT ETERNITIE','​​PROMISED BY','OUR EVER-LIVING POET.','WISHETH','​​THE WELL-WISHING','ADVENTURER IN','SETTING','FORTH','T.T.']
for(var q=0;q<dedication.length;q++){
  console.log(dedication[q])
};

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
];
var themes=[
  ['TIME','age and decay','mortality','cyclical time','past and future'],
  ['NATURE','beauty','growth','virtue','offspring'],
  ['MATERIALITY','wealth and value','sensation','anatomy','substance','sleep'],
  ['RELATIONSHIPS','marriage','temptation','conflict','sex','self-image','sentiment'],
  ['POETRY',"poetry’s power","poetry’s limitations",'rival poets']
];
var allCheck=[{l:'t',a:[],v:false},{l:'n',a:[],v:false},{l:'m',a:[],v:false},{l:'r',a:[],v:false},{l:'p',a:[],v:false}];
var whoms=['a man','a woman','oneself'];
var defCursor={icon:'✎',cls:'pencil'};
//transfer json to variable and add to dom--------------------------------------------------------
function buildBody(data){
  coverFade(true,resetCount);
  if (origin!==undefined){
    origin=JSON.parse(JSON.stringify(data));
  }
  allson=JSON.parse(JSON.stringify(data));;
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
  sentenceBuilder();
  buildFilters();
  counter();
  coverFade(false,resetCount);
}//end of buildBody
function resetBody(){
  fTone=0;
  fWho=-1;
  fTheme=[];
  fRhyme=[];
  counting=0;
  allCheck=[{l:'t',a:[],v:false},{l:'n',a:[],v:false},{l:'m',a:[],v:false},{l:'r',a:[],v:false},{l:'p',a:[],v:false}];
  d3.selectAll('#selected').attr('id','');
  d3.selectAll('.selection').classed('selection',false);
  d3.selectAll('.fil-pick').classed('fil-pick',false);
  if(updatedMain==true){
    rhymeCount=[];
    d3.select('#maintext').selectAll('span').remove();
    buildBody(origin);
  }else{
    sentenceBuilder();
    buildFilters();
    counter();
    coverFade(true,resetCount);
    coverFade(false,resetCount);
  };
  window.scroll({top:0,behavior:'smooth'});
}
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
        .on('mouseover',function(info){
          if(d3.select(event.currentTarget.parentNode).attr('id')=='selected'){
            cursorChange('rhyme');
          }
          }
        )
        .on('mouseleave',function(info){
          cursorChange('default');
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
  updatedMain=true;
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
  defCursor.icon='➴';
  defCursor.cls='pointer';
  cursorChange('default');
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
  defCursor.icon='✎';
  defCursor.cls='pencil';
  cursorChange('default');
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
  bObject();
  bRhyme();
  bTheme();
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
  function bObject(){
    d3.select('#object')
    .selectAll('span')
    .data(whoms,d => d)
    .join('span')
    .text(d=>d)
    .attr('class',d =>classO(d));
    function classO(d){
      var splitter=d.split(' ');
      return splitter[splitter.length-1];
    }
    d3.selectAll('#object span')
    .on('click', function(event){
      var picked=d3.select(d3.event.currentTarget);
      if(picked.classed('fil-pick')==true){
        picked.classed('fil-pick',false);
        fWho=-1;
      }else{
        d3.selectAll('#object span').classed('fil-pick',false);
        picked.classed('fil-pick',true);
        fWho=event;
      }
      sentenceBuilder();
    })
  }
  function bRhyme(){
    var moreThan3=rhymeCount.filter(cr => cr.c > 4)
    d3.select('#rhymes')
    .selectAll('span')
    .data(moreThan3,d => d)
    .join('span')
    .classed('indiv',true)
    .each(function(d){
      parsePhonetics(d.r)
      })
    .append('span')
    .text(d=>'  ('+d.e.replace(punct,'')+')')

    d3.selectAll('#rhymes .indiv')
    .on('click', function(event){
      var picked=d3.select(d3.event.currentTarget);
      if(picked.classed('fil-pick')==true){
        picked.classed('fil-pick',false);
        fRhyme.splice(fRhyme.indexOf(event),1);
      }else{
        picked.classed('fil-pick',true);
        fRhyme.push(event);
      }
      sentenceBuilder();
    })
  }
  function bTheme(){
    for(var e=0;e<themes.length;e++){
      themeClass=themes[e][0].toLowerCase();
      d3.select('#themes').append('div').attr('class',themeClass+' grouping noselect');
      d3.select('.'+themeClass)
      .selectAll('span')
      .data(themes[e],d => d)
      .join('span')
      .text(d=>d)
      .each(function(d,i,nodes){
        var rand=(Math.random()*5)*(Math.random()<0.5?-1:1);
        var rotation="rotate("+rand+"deg)"
        if(i==0){
          d3.select(nodes[i])
          .classed('t-header',true)
          .append('text').text(':\xa0');
        }else if(i==themes[e].length-1){
          d3.select(nodes[i]).classed('t-item',true);
          nodes[i].style.transform=rotation;
        }else{
          d3.select(nodes[i]).classed('t-item',true).append('text').text(',\xa0');
          nodes[i].style.transform=rotation;
        }//end of if
      });
    }
    d3.selectAll('#themes .t-item')
    .on('click', function(event){
      var cEvent=d3.event.currentTarget;
      selectThemes(cEvent);
      sentenceBuilder();
    })//end of onclick
    d3.selectAll('#themes .t-header')
      .on('click', function(event){
        var s=allCheck[themes.findIndex(el=>el[0]==event)].v;
        if (s==true){
          allCheck[themes.findIndex(el=>el[0]==event)].v=false;
        }else{
          allCheck[themes.findIndex(el=>el[0]==event)].v=true;
        }
        var s=allCheck[themes.findIndex(el=>el[0]==event)].v;
        var pick=d3.select(d3.event.currentTarget.parentNode);
        pick.selectAll('.t-item').each(function(d,i,nodes){
          selectThemes(nodes[i],s);
        })
        sentenceBuilder();
    })//end of onclick
    function selectThemes(cNode,head){
      var picked=d3.select(cNode);
      var curInd=themes.findIndex(el=>el.includes(picked.data()[0]));
      var cue=allCheck[curInd].l+themes[curInd].indexOf(picked.data()[0]);
      var arr=allCheck[curInd].a;
      selectorF=(x)=>{picked.classed('fil-pick',false);};
      selectorT=(x)=>{picked.classed('fil-pick',true);};
      if(head==true){
        if(arr.includes(cue)==false){
          arr.push(cue);
        }
        selectorT();
      }else if(head==false){
        selectorF();
        arr.splice(arr.indexOf(cue),1);
      }else{
        if(picked.classed('fil-pick')==true){
          selectorF();
          arr.splice(arr.indexOf(cue),1);
        }else{
          selectorT();
          arr.push(cue);
        }
      }
    }//end of selectthemes
  }//end of bTheme
  //switching tabs
  d3.selectAll('.tabs span').on('click',function(){
    var modify=d3.event.currentTarget.innerHTML;
    var disp;
    switch(modify){
      case 'object':
      disp='flex'
      break;
      default:
      disp='block';
      break;
    }
    d3.select('.current-tab').classed('current-tab',false);
    d3.select(event.currentTarget).classed('current-tab',true);
    d3.selectAll('.fil-cat').style('opacity',0)
    setTimeout(function(){
      d3.selectAll('.fil-cat')
      .style('display','none');
      d3.select('#'+modify)
      .style('display',disp)
      .style('opacity',1)
    },300)

  });
}//end of buildfilters
function sentenceBuilder(){
  var noneSelect=true;
  if(fTone!==0){
    d3.select('#tonetext').text(fTone.t+' ');
    var noneSelect=false;
  }else{
    d3.select('#tonetext').text('');
  }
  if(fWho!==-1){
    d3.select('#whotext').text('for '+fWho+' ');
    var noneSelect=false;
  }else{
    d3.select('#whotext').text('');
  }
  if(fRhyme.length>0){
    var domSel=d3.select('#rhymetext')
    domSel.selectAll('span').remove();
    domSel.insert('span').text(', rhyming with ')
    var rhymeString='';
    for(var i=0; i<fRhyme.length;i++){
      if(i>0){
        domSel.insert('span').text(', ')
      }
      if(i==fRhyme.length-1&&fRhyme.length>1){
        domSel.insert('span').text(' or ')
      }
      parsePhonetics(fRhyme[i].r,domSel,i);
    }
    var noneSelect=false;
  }else{
    d3.select('#rhymetext').text('');
  }

  if(allCheck.some(el=>el.a.length>0)){
    d3.select('#themetext').html('');
    var selCount=0;
    var tStr='';
    for(var x=0;x<allCheck.length;x++){
      var cArr=allCheck[x].a;
      var arrLeng=cArr.length;
      if(arrLeng==themes[x].length-1){
        tStr=tStr+' '+themes[x][0]+',';
        selCount++;
      }else{
        for(var f=0; f<arrLeng;f++){
          var num=parseInt(cArr[f][1])
          tStr=tStr+' '+themes[x][num]+',';
          selCount++;
        }
      }
    }
    tStr=tStr.slice(0,tStr.length-1);
    if(selCount>1){
      tStr=tStr.replace(/,(?=[^,]*$)/, ', or');
      if(selCount<3){
        tStr=tStr.replace(',',' ');
      }
    }
    d3.select('#themetext').append('span').text('concerning').classed('startTheme',true);
    d3.select('#themetext').append('span').text(tStr);
    var noneSelect=false;
  }else{
    d3.select('#themetext').html('');
  }


  if(noneSelect==true){
    d3.select('#shakespeare').style('display','inline');
  }else{
    d3.select('#shakespeare').style('display','none');
  }
  sentenceBreak();
  filterText();
}
function filterText(){
  var allNothing='nope';
  var toneCheck=(l)=>{return 'g';};
  var whoCheck=(l)=>{return 'g';};
  var rhymeChecker=(l)=>{return 'g';};
  var themeChecker=(l)=>{return 'g';};
  var rCompare=[];
  if(fTone!==0){
    toneCheck=(l)=>{if(l.tone==tones.indexOf(fTone)){return 'g';}else{return 'nope';}};
    allNothing='g';
  }
  if(fWho!==-1){
    whoCheck=(l)=>{if(l.who==whoms.indexOf(fWho)){return 'g';}else{return 'nope';}};
    allNothing='g';
    // {return l.who==whoms.indexOf(fWho);};
  }
  if(fRhyme.length>0){
    for(var x=0;x<fRhyme.length;x++){
      rCompare.push(fRhyme[x].r);
    }
    rhymeChecker=(l)=>{
      if(l.rhyme.some(r=> rCompare.indexOf(r) >= 0)){return 'g';}else{return 'nope';}};
    allNothing='g';
    // {return l.who==whoms.indexOf(fWho);};
  }
  if(allCheck.some(el=>el.a.length>0)){
    var themeChecker=function(l){
      var including=0;
      for(var x=0;x<allCheck.length;x++){
        if(l.theme.some(r=> allCheck[x].a.indexOf(r) >= 0)){
          including++;
        }
      };
      if(including>0){
        return 'g';
      }else{
        return 'nope';
      };
    };//end of checkingn function
    allNothing='g';
  }//end of if statement
  d3.selectAll('.line')
  .classed('selection',false);
  d3.selectAll('.line')
  .filter(function(d, i){return checking(d,i);})
  .classed('selection',true);

  function checking(d,i){
    if(toneCheck(d)=='g' && whoCheck(d)=='g' && rhymeChecker(d)=='g' && themeChecker(d)=='g' && allNothing=='g'){
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

function goTo(num){
  if(num==undefined||num<1||num>154){
    d3.select('#maintext').selectAll('#selected').attr('id','');
  }else{
    d3.select('#maintext').selectAll('#selected').attr('id','');
    var selected=d3.select('.sonnet'+(num));
    selected.attr('id','selected');
    var source=selected.node().parentNode;
    if(source!==null&&!source.className.includes('sonnet')){
      scrollControl('smooth');
    }
    var heart=selected.select('.heart');

    heart.on('click',function(){
      setTimeout(function(){d3.select('#maintext').selectAll('#selected').attr('id',''); counter();document.querySelector('input').value='';},100);
    })
    counter();
  }
}

//poem expand interface--------------------------------------------------------
function poemExp(){
  sonnets=document.querySelectorAll('.sonnet')
  for (var i=0; i<sonnets.length;i++){
      sonnets[i].addEventListener("click", function(event){
      var ex=event.currentTarget.classList;
      ex=ex[ex.length-1]
      ex=ex.slice(6,10);
      document.querySelector('input').value=ex;
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
        }
      })
      heart.on('mouseleave',function(event){
        if(d3.event.currentTarget.parentNode.id=='selected'){
        }
      })
      heart.on('click',function(){
        setTimeout(function(){d3.select('#maintext').selectAll('#selected').attr('id',''); counter();},100);
      })

      counter();
      //end of on-click
    });
  //   if(!window.matchMedia("(hover: none)").matches){
  //     sonnets[i].addEventListener("mouseover", function(event){
  //
  //     });
  //     sonnets[i].addEventListener("mouseleave", function(event){
  //
  //     });
  // }//end of match media check

  }//end of for loop

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
  var cicon=d3.select('#cicon');
  var caption=d3.select('#mcaption');
  switch(x){
    case 'default':
    cicon.text(defCursor.icon).attr('class',defCursor.cls);
    caption.style('opacity',0);
    break;
    case 'rhyme':
    caption.text('⇄ shuffle').style('opacity',1);
    break;
  }
}
function parsePhonetics(str,node,ind){
  var signal=0;
  var span;
  if(node==undefined){
    span=d3.select('#rhymes').selectAll('span').filter(function(d, i){return d.r==str;});
    ind='';
  }else{
    span=node;
  }
  var rep1=new RegExp('ʊ','gi');
  var rep2=new RegExp('ɔ','gi');
  var rep3=new RegExp('ɑ','gi');
  var rep4=new RegExp('ʌ','gi');
  var rep5=new RegExp('ʒ','gi');
  var rep6=new RegExp('з','gi');
  var rep7=new RegExp('ɪ','gi');
  var rep8=new RegExp('ʃ','gi');
  str=str.replace(rep1,'@Ω');
  str=str.replace(rep2,'@C');
  str=str.replace(rep3,'α');
  str=str.replace(rep4,'ʌ');
  str=str.replace(rep5,'З');
  str=str.replace(rep6,'з');
  str=str.replace(rep7,'І');
  str=str.replace(rep8,'L');
  span.insert('span').classed('phonetic'+ind,true);
  current=span.select('.phonetic'+ind)
  for(var x=0; x<str.length;x++){
    if(signal!==0){
      current.append('span').classed(signal,true).text(str[x]);
      signal=0;
    }else if(str[x]=='@'){
      signal='updown';
    }else if(str[x]=='L'){
      current.append('span').classed('ital',true).text(str[x].toLowerCase());
    }else{
      current.append('span').text(str[x]);
    }
  }
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
  if (twolines&&senH>100){
    d3.select('.sentxt').attr('class','sentxt threelines noselect');
    d3.select('#sentence').style('padding-top','20px');
  }else if(twolines && senH<50){
    d3.select('#sentence').style('padding-top','30px');
  }

}//end of sentence break

function coverFade(cover,r){
  c=d3.select('#cover');
  if(cover==false&&r>0){
    setTimeout(function(){
      c.style('opacity',0);
      setTimeout(function(){c.style('display','none');},300);
    },600)
  }else
  if(cover==false){
    c.style('opacity',0);
    setTimeout(function(){c.style('display','none');},300);
    resetCount++;
  }else{
    c.style('display','block');
    c.style('opacity',1);
  }
}
const input = document.querySelector('input');
input.addEventListener('input', updateValue);
function updateValue(e) {
  goTo(document.querySelector('input').value);
}

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
