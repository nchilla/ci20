var letters='';
var letterNum=0;
var consA=['b','c','d','f','g','h','j'];
var consB=['k','l','m','n','p','q','r'];
var consC=['s','t','v','w','x','y','z'];
var alphabet=['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var consTotal=consA.concat(consB).concat(consC);
var vows=['a','e','i','o','u'];
var mainwidth;
var orbSpeeds=[];
var speeders=[4000,6000,8000,10000,12000,14000,16000];
var sentenceConstruct=[];
var currentsys=0;
var rooting=document.documentElement.style;
var show=true;
function compareArrays(a1,a2){
  var same=true;
  if (a1.length>a2.length){
    for (y=0;y<a1.length;y++){
      if (!(a1[y]==a2[y])){
        same=false;
      }
    }
  }else{
    for (y=0;y<a2.length;y++){
      if (!(a1[y]==a2[y])){
        same=false;
      }
    }
  }//end of outer else
  return same;
}//end of comparearrays



$(document).ready(function() {


  $(function() {
    $("#main").draggable(
      {handle: "#handle"}
    );
  });
  mainWidth=d3.select('#main').style('width')
  document.documentElement.style.setProperty('--mainwidth', mainWidth)

//capture key presses
  $(document).on("keydown", function(e){
    if(e.which==8){
      letters=letters.slice(0,letters.length-1);
      letterNum--;
      console.log(letterNum)
      if (letterNum<0){
        currentsys--;
        if (currentsys<0){
          currentsys=0;
        }
        letters=sentenceConstruct[currentsys].word;
        letterNum=letters.length;
      }
      wordSystem(letters,currentsys);
      genSystem();
      updateText();
      updateSentence(currentsys);
    }
  });

  $(document).on("keypress", function(e) {
    //translate unicode to characters
    var char = String.fromCharCode(e.which);

    if (char==' '){
      currentsys++;
      letters='';
      letterNum=0;
      wordSystem(letters,currentsys);
      genSystem();
      updateText();
      updateSentence(currentsys);
    }else{
      letters=letters+char;
      letterNum=letters.length;
      wordSystem(letters,currentsys);
      genSystem();
      updateText();
      updateSentence(currentsys);
      typedist=document.querySelector('#type');
      typedist.scrollLeft = typedist.scrollWidth;
      sentdist=document.querySelector('#sentence');
      sentdist.scrollLeft = sentdist.scrollWidth;
    }

  });

});

function collapse(){
  if(show==true){
    d3.select('#main').style('height','40px')
    show=false;
    d3.select('.collapse').html('show')
  }else{
    d3.select('#main').style('height','calc(70% + 80px)')
    d3.select('.collapse').html('collapse')
    show=true;
  }
}


function updateText(){
  d3.select('#type').html(`<span>${letters}</span>`).append('span').html('|').attr('class','cursor noselect');
  d3.select('#type').insert('span',':first-child').html('word:')
}
function updateSentence(pick){
  var sentence='';
  for (i=0;i<sentenceConstruct.length;i++){
    if(i==pick+1){
      select='afterpick'
    }else{
      select='';
    }
    sentence=sentence+`<span class="words ${select}"> `+sentenceConstruct[i].word+'</span>'
  }
  d3.select('#sentence').html(`${sentence}`)
  d3.select('#sentence').insert('span','.afterpick').html('|').attr('class','cursor noselect');
  d3.select('#sentence').insert('span',':first-child').html('sentence:')
  var wordCount=0;
  d3.selectAll('.words').each(function(){
    if (d3.select(this).html().length==0){
      d3.select(this).remove();
      sentenceConstruct=sentenceConstruct.splice(wordCount,1);
    }else{
      d3.select(this).attr('onclick',`goWord(${wordCount})`)
      wordCount++;
    }
    if (d3.select(this).html()[d3.select(this).html().length]==' '){
      d3.select(this).innerHTML[d3.select(this).html().length]==''
    }
  })
  starHandler();
}

function goWord(f){
  currentsys=f;
  letters=sentenceConstruct[currentsys].word;
  letterNum=letters.length;
  wordSystem(letters,currentsys);
  genSystem();
  updateText();
  updateSentence(currentsys);
}

function starHandler(star){
  d3.selectAll('.star').remove()
  starCount=sentenceConstruct.length;
  genCounter=0;
  for (var i=0;i<sentenceConstruct.length;i++){
    cword=sentenceConstruct[i];
    var vowC=0;
    var orbitC;
    var starCol;
    var trajectX=0;
    var trajectY=0;
    var first=cword.word[cword.word.length-2];
    var last=cword.word[cword.word.length-1];
    if(first==undefined){
      first=alphabet[Math.floor(Math.random()*25)];
    }
    if(last==undefined){
      last=alphabet[Math.floor(Math.random()*25)];
    }
    // if(vows.indexOf(first)!==-1){
    //   first=alphabet[Math.floor(Math.random()*25)]
    // }
    var firstLetter=alphabet.indexOf(first.toLowerCase());
    var lastLetter=alphabet.indexOf(last.toLowerCase());
    if(firstLetter!==-1){
      trajectX=firstLetter/25*100;
    }
    if(lastLetter!==-1){
      trajectY=lastLetter/25*100;
    }
    for(var x=0;x<cword.word.length;x++){
      if (vows.indexOf(cword.word[x].toLowerCase())!==-1){
        vowC++;
      }
    }
    switch (cword.orbits[0].level){
      case -1:
      starCol='white';
      break;
      case 0:
      starCol='#FFF94C';
      break;
      case 1:
      starCol='#FF3838';
      break;
      case 2:
      starCol='#4B38FF';
      break;
      case 3:
      starCol='purple';
      break;
      case 4:
      starCol='#0AFFB1';
      break;
      default:
      starCol='white';
      break;
    }//end of color switch
    orbitC=cword.orbits.length-1;
    starSize=vowC*5;
    d3.select('#galaxy').append('div').classed('star',true).classed('sta'+i,true)
    .style('width',starSize+'vh')
    .style('height',starSize+'vh')
    .style('top',trajectY+'%')
    .style('left',trajectX+'%')
    .style('margin-top',`-${starSize/2}vh`)
    .style('margin-left',`-${starSize/2}vh`)
    .style('left',trajectX+'%')
    .attr('onclick',`goWord(${genCounter})`)
    for(var f=1;f-1<orbitC;f++){
      rotDeg=(f)/orbitC*180
      d3.select('.sta'+i)
      .append('div').classed('radial',true)
      .style('border-color',starCol)
      .style('transform',`rotate(${rotDeg}deg)`)
    }
    d3.select('.sta'+i)
    .append('div').classed('point',true).style('background-color',starCol)
    genCounter++;
  }
}


/*
function rotate(orbit,index){
  thisOrb=d3.select(`.orb${orbit}`);
  speeder=speeders[orbSpeeds[orbit-1]];
  thisOrb.style('animation',`spin ${speeder}ms linear infinite`)
}
*/

function wordSystem(newtext,system){
  sentenceConstruct[system]={word:newtext,orbits:[]};
  solarsystem=sentenceConstruct[system];
  word=solarsystem.word.slice(0,solarsystem.word.length).toLowerCase();
  orbits=solarsystem.orbits;
  var index=0;
  var orbitN=0;
  orbits[0]={body:'sun',level:vows.indexOf(word[0]),add:[]};
  if (!(vows.indexOf(word[0])==-1)){
    index++;
  }
  while(index<word.length){
    if (!(consA.indexOf(word[index])==-1)){
      group=consA;
      shape='cir';
      mode='A';
    }else if(!(consB.indexOf(word[index])==-1)){
      group=consB;
      shape='squ';
      mode='B';
    }else if(!(consC.indexOf(word[index])==-1)){
      group=consC;
      shape='tri';
      mode='C';
    }
    if (consTotal.indexOf(word[index])==-1){
      orbits[orbitN].add.push({cat:'vow',level:vows.indexOf(word[index])});
    }else if(consTotal.indexOf(word[index-1])==-1){
      orbitN++;
      orbits[orbitN]={body:'planet',group:shape,dist:group.indexOf(word[index]),add:[]};
    }else{
      orbits[orbitN].add.push({cat:'cons',mode:mode,level:group.indexOf(word[index])});
    }
    index++;
  }//end of while
}//end of wordSystem





function genSystem(){
  blueprints=sentenceConstruct[currentsys].orbits;
  build=d3.select('#build');
  circles=d3.select('#circles');
  numOrbits=document.querySelector('#circles').childElementCount;


  switch (blueprints[0].level){
    case -1:
    rooting.setProperty('--systemcol', 'white')
    break;
    case 0:
    rooting.setProperty('--systemcol', '#FFF94C')
    break;
    case 1:
    rooting.setProperty('--systemcol', '#FF3838')
    break;
    case 2:
    rooting.setProperty('--systemcol', '#4B38FF')
    break;
    case 3:
    rooting.setProperty('--systemcol', 'purple')
    break;
    case 4:
    rooting.setProperty('--systemcol', '#0AFFB1')
    break;
    default:
    rooting.setProperty('--systemcol', 'white')
    break;
  }//end of color switch
  var sumDist=0;
  var soFar=0;
  for(i=1; i<blueprints.length;i++){
    sumDist=sumDist+blueprints[i].dist+1;
  }//end of for loop
  for(i=1; i<blueprints.length;i++){
    var newarray=blueprints[i].add.splice(0,blueprints[i].add.length)
    /*d3.select('.orb'+i).attr('data-dna')==blueprints[i]*/
    if (numOrbits>=i){
      var oldarray=$('.orb'+i).data('dna').split(',');
      if (compareArrays(oldarray,newarray)==true){
      }else{
        build.select('.orb'+i).remove();
        circles.select('.circ'+i).remove();
        generate();
      }
    }else{
      generate();
    }
    function generate(){
      build.append('div').classed('orbit',true).classed('orb'+i,true);
      circles.append('div').classed('circle',true).classed('circ'+i,true);
      orb=d3.select('.orb'+i);
      circ=d3.select('.circ'+i);
      newVows=[];
      orb.attr('data-dna',newarray)
      group=blueprints[i].group;
      function newBody(){
        orb.append('div').classed('sat',true);
        switch(group){
          case 'cir':
          orb.select('.sat').append('div').classed('cir',true);
          break;
          case 'squ':
          orb.select('.sat').append('div').classed('squ',true);
          break;
          case 'tri':
          orb.select('.sat').append('svg').classed('tri',true)
          .attr('preserveAspectRatio','none')
          .attr('viewBox','0 0 100 100')
          .append('polygon')
          .attr('points','0 50,100 100,100 0')
          .attr('vector-effect','non-scaling-stroke')
          break;
        }//end of switch
      }//end of newbody
      newBody();
      var prop={scale:{set:false,val:0.06},rotate:{set:false,val:3},direct:{set:false,val:'spin'},spin:{set:false,val:8000},satt:{set:false,val:false}}
      scale=prop.scale;
      rotate=prop.rotate;
      direct=prop.direct;
      spin=prop.spin;
      satt=prop.satt;

      if(newarray.length>0){
        switch (newarray[0].mode){
          case 'B':
          scale.val=0.02*(newarray[0].level+1);
          scale.set=true;
          break;
          case 'C':
          rotate.val=newarray[0].level;
          rotate.set=true;
          direct.val='spin';
          direct.set=true;
          break;
          case 'A':
          rotate.val=newarray[0].level;
          rotate.set=true;
          direct.val='spin2';
          direct.set=true;
          break;
        }
      }
      if(newarray.length>1){
        switch (newarray[1].mode){
          case 'A':
            if (scale.set==true){
              rotate.val=newarray[1].level;
              rotate.set=true;
              direct.val='spin';
              direct.set=true;
            }else{
              scale.val=0.02*(newarray[0].level+1);
              scale.set=true;
            }
          break;
          case 'B':
            spin.val=speeders[newarray[1].level];
            spin.set=true;
          break;
          case 'C':
            satt.val=speeders[newarray[1].level];
            satt.set=true;
          break;
        }
      }
      if(newarray.length>2){
        newProps=[]
        if (scale.set==false){
          newProps.push('scale');
        }
        if (spin.set==false){
          newProps.push('spin');
        }
        if (satt.set==false){
          newProps.push('satt');
        }
        if (rotate.set==false){
          newProps.push('rotate');
        }
        switch (newarray[2].mode){
          case 'A':
          changeTier3(newProps[0]);
          break;
          case 'B':
          changeTier3(newProps[1]);
          break;
          case 'C':
          changeTier3(newProps[2])
          break;
        }

        function changeTier3(change){
          switch(change){
            case 'scale':
            scale.val=0.02*(newarray[2].level+1);
            scale.set=true;
            break;
            case 'spin':
            spin.val=speeders[newarray[2].level];
            spin.set=true;
            break;
            case 'satt':
            satt.val=speeders[newarray[1].level];
            satt.set=true;
            break;
            case 'rotate':
            rotate.val=newarray[2].level;
            rotate.set=true;
            direct.val='spin2';
            direct.set=true;
            break;
            default:
            rotate.val=newarray[2].level;
            rotate.set=true;
            direct.val='spin';
            direct.set=true;
            break;
          }
        }

      }
      function rotateOrbit(){
      speeder=speeders[rotate.val];
      orb.style('animation',`${direct.val} ${speeder}ms linear infinite`)
      }
      function scaleBod(){
        orb.select('.sat')
        .style('width',`calc(var(--mainwidth)*${scale.val})`)
        .style('height',`calc(var(--mainwidth)*${scale.val})`)
        .style('top',`calc(50% - calc(var(--mainwidth)*${scale.val/2}))`)
        .style('right',`calc(var(--mainwidth)*-${scale.val/2})`)
      }
      function addSat(){
        if (satt.set==true){
          moonspeed=speeders[satt.val];
          orb.select('.sat').append('div').classed('moonbox',true).style('animation',`spin ${moonspeed}ms linear infinite`)
          .append('div').classed('moon',true);
        }
      }
      function spinBody(){
        if (spin.set==true){
          orb.select('.sat').style('animation',`spin ${spin.val}ms linear infinite`);
        }
      }

      function vowelFinder(){
        vowarray=newarray.splice(0,newarray.length);
        for(var i=0;i<vowarray.length;i++){
          if(vowarray[i].cat=='vow'){
            newVows.push(vowarray[i].level)
          }
        }
      }
      vowelFinder()

      rotateOrbit();
      addSat();
      scaleBod();
      spinBody();

      //vowel handler
      function vowelHandler(){
        console.log(newVows)
        for(var y=0;y<newVows.length;y++){
          switch (y){
            case 0:
            addLines(newVows[y])
            break;
          }//end of switch
        }//end of for loop

        function addLines(level){
          switch(level){
            case 0:
            switch(group){
              case 'tri':
              orb.select('.sat').append('svg')
              .attr('preserveAspectRatio','none')
              .attr('viewBox','0 0 100 100')
              .classed('innertri',true)
              .append('polygon')
              .attr('points','0 50,100 100,100 0')
              .attr('vector-effect','non-scaling-stroke')
              break;
              case 'cir':
              orb.select('.sat').append('div')
              .classed('innercir',true)
              break;
              case 'squ':
              orb.select('.sat').append('div')
              .classed('innersqu',true)
              break;
            }
            break;
            case 1:
            orb.select('.sat')
            .append('svg').classed('lines',true)
            .attr('preserveAspectRatio','none')
            .attr('viewBox','0 0 100 100')
            lines=orb.select('.lines')
            switch(group){
              case 'tri':
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '33%')
              .attr("x2", '100%')
              .attr("y1", '33%')
              .attr("y2", "100%")
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '33%')
              .attr("x2", '100%')
              .attr("y1", '66%')
              .attr("y2", '0%')
              break;
              case 'cir':
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '15%')
              .attr("x2", '85%')
              .attr("y1", '85%')
              .attr("y2", "15%")
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '15%')
              .attr("x2", '85%')
              .attr("y1", '15%')
              .attr("y2", '85%')
              break;
              case 'squ':
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '0%')
              .attr("x2", '100%')
              .attr("y1", '100%')
              .attr("y2", "0%")
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '0%')
              .attr("x2", '100%')
              .attr("y1", '0%')
              .attr("y2", '100%')
              break;
            }

            break;
            case 2:
            break;
            case 3:
            orb.select('.sat')
            .append('svg').classed('lines',true)
            .attr('preserveAspectRatio','none')
            .attr('viewBox','0 0 100 100')
            lines=orb.select('.lines')
            switch(group){
              case 'tri':
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '0%')
              .attr("x2", '99%')
              .attr("y1", '49%')
              .attr("y2", "49%")

              break;
              case 'cir':
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '0%')
              .attr("x2", '99%')
              .attr("y1", '49%')
              .attr("y2", "49%")
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '5%')
              .attr("x2", '92%')
              .attr("y1", '75%')
              .attr("y2", "75%")
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '5%')
              .attr("x2", '92%')
              .attr("y1", '25%')
              .attr("y2", "25%")
              break;
              case 'squ':
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '0%')
              .attr("x2", '99%')
              .attr("y1", '49%')
              .attr("y2", "49%")
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '0%')
              .attr("x2", '99%')
              .attr("y1", '75%')
              .attr("y2", "75%")
              lines.append('line')
              .attr('vector-effect','non-scaling-stroke')
              .attr("x1", '0%')
              .attr("x2", '99%')
              .attr("y1", '25%')
              .attr("y2", "25%")
              break;
            }
            break;
            case 4:
            break;
          }
        }
      }//end of vowelHandler
      vowelHandler();
    }


  }//end of creation for-loop
  for(x=1; x<blueprints.length;x++){
    function scaleOrb(){
      orb=d3.select('.orb'+x);
      circ=d3.select('.circ'+x);
      //scale
      soFar=soFar+blueprints[x].dist+1;
      dist=soFar/sumDist*100;
      off=(100-dist)/2;
      orb
      .style('width',dist+'%')
      .style('height',dist+'%')
      .style('top',off+'%')
      .style('left',off+'%')
      circ
      .style('width',dist+'%')
      .style('height',dist+'%')
      .style('top',off+'%')
      .style('left',off+'%')
    }//end of scaleOrb
    scaleOrb();}//end of scaling for-loop

    for (i=numOrbits;i>blueprints.length-1;i--){
      d3.select('.orb'+i).remove()
      d3.select('.circ'+i).remove()
    }

}

window.addEventListener("resize", function(){
  mainWidth=d3.select('#main').style('width');
  document.documentElement.style.setProperty('--mainwidth', 'calc('+mainWidth+' + 80px)');
  if(window.innerWidth>500){
    $('#main').css('right','20px').css('top','20px').css('left','inherit');
  }else{
    $('#main').css('left','0px').css('top','0px').css('right','inherit');
    console.log(window.innerWidth)
  }


  $('#main').css('right','20px').css('top','20px').css('left','inherit');
  type=document.querySelector('#type');
  type.scrollLeft = type.scrollWidth;
});
