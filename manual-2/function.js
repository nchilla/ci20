var lampPow=true;
var nightlight=false;
var cmood=0
var clevel=5
var moods=['Upbeat','Peaceful','Tender','Evil','Moody']
var letters=['A','B','C','D','E']
var colors=[{fore:'#664BFF',back:'#F7CB15'},{fore:'#664BFF',back:'#00FFC5'},{fore:'#F7CB15',back:'#FF6565'},{fore:'#00FFC5',back:'#FD66DC'},{fore:'#FF9A9A',back:'#664BFF'}]
var levels=['Hardly','Casually','Somewhat','Adequately','Intensely','Incredibly']
var resize=false;
var fore=true
var infoDis=false;
document.documentElement.style.setProperty('--scroller', 0)


function genIntens(){
  for(i=0;i<levels.length;i++){
    d3.select('.intdisp')
    .append('div').classed('row',true)
    .append('div').classed('disptext',true).attr('onclick','levChange('+i+')')
    .html(levels[i]).style('filter','saturate('+(i/5*100+20)+'%)')
  }
}
function genMood(){
  for(i=0;i<moods.length;i++){
    d3.select('.mooddisp')
    .append('div').classed('row',true).attr('onclick','moodChange('+i+')')
    .append('div').classed('disptext',true).html(moods[i])
    .style('color',colors[i].back)

  }
}

function genOut(){
  d3.select('.outdisp')
  .append('div').classed('finalrow',true)
  .append('div').attr('class','tile')
  for(a=0;a<levels.length;a++){
    d3.select('.finalrow')
    .append('div').attr('class','tile booktype').html(a+1)
  }
  for(i=0;i<moods.length;i++){
    d3.select('.outdisp')
    .append('div').classed('finalrow',true).attr('id','row'+i).style('color',colors[i].back)
    d3.select('#row'+i).append('div').attr('class','tile booktype').html(letters[i])
    for(x=0;x<levels.length;x++){
      d3.select('#row'+i)
      .append('div').classed('tile',true).classed('disptext',true).html('a').style('filter','saturate('+(x/5*100+20)+'%)').attr('onclick','levChange('+x+'); moodChange('+i+');')
    }
  }

}

genIntens()
genMood()
genOut()

function hoodCheck(){
  if (fore==true){
    d3.select('.foreground').style('display','none')
    d3.select('.hood').html('cover')
    fore=false;
  }else{
    d3.select('.foreground').style('display','flex')
    d3.select('.hood').html('under the hood')
    fore=true;
}
}

document.body.onkeyup = function(e){
    if(e.keyCode == 13){
      if (fore==true){
        d3.select('.foreground').style('display','none')
        fore=false;
      }else{
        d3.select('.foreground').style('display','flex')
        fore=true;
      }
    }
}

function moodCycle(){
  if (lampPow==false){
  }else{
    if (cmood==4){
      cmood=0
      console.log('reset')
    }else{
      cmood+=1
      console.log(cmood)
    }//inner else
  }//outer else
  moodChange(cmood)
}//end of funct

function moodChange(minput){
  if (lampPow==false){}else{
  document.documentElement.style.setProperty('--foreground', colors[minput].fore)
  document.documentElement.style.setProperty('--background', colors[minput].back)
  d3.select('.moodtext').html(moods[minput])
  cmood=minput;
  }
}

function levChange(limput){
  if (lampPow==false){}else{
    d3.selectAll('.saturate').style('filter','saturate('+(limput/5*100+20)+'%)')
    d3.select('.levtext').html(levels[limput])
    d3.selectAll('.scalers').classed('underline',true)
    d3.select('#s'+limput).classed('underline',false)
  }
  clevel=limput;
}


function powerNew(newSet){
  console.log(newSet)
  if (newSet==false){
    lampPow=newSet
    console.log('offfired')
    document.documentElement.style.setProperty('--foreground', 'black')
    document.documentElement.style.setProperty('--background', 'black')
    d3.select('.intdisp').style('opacity',0)
    d3.select('.mooddisp').style('opacity',0)
    d3.select('.outdisp').style('opacity',0)
    d3.selectAll('.powerinput').classed('white',true)
    d3.selectAll('.hood').classed('white',true)
  }else{
    lampPow=newSet
    console.log('onfired')
    d3.select('.intdisp').style('opacity',1)
    d3.select('.mooddisp').style('opacity',1)
    d3.select('.outdisp').style('opacity',1)
    d3.selectAll('.powerinput').classed('white',false)
    d3.selectAll('.hood').classed('white',false)
    console.log(newSet+' '+lampPow)
    console.log(cmood+' '+clevel)
    moodChange(cmood)
    levChange(clevel)
  }

}

function powerToggle(){
  if (lampPow==true){
    powerNew(false)
  }else{
    powerNew(true)
  }
}

powerNew(true)


function dropDown(){
  if (infoDis==false){
    console.log('fired')
    d3.selectAll('.info').style('max-height','100%')
    d3.selectAll('.info').style('border-bottom','0px')
    d3.selectAll('.display').classed('noshow',true)
    d3.selectAll('.accord').html('-')
    infoDis=true
  }else{
    d3.selectAll('.info').style('max-height','70px')
    d3.selectAll('.info').style('border-bottom','2px solid var(--foreground)')
    d3.selectAll('.display').classed('noshow',false)
    d3.selectAll('.accord').html('+')
    infoDis=false
  }
}

/*
function nightLum(){
  if (nightlight==false){
    document.documentElement.style.setProperty('--foreground', 'white')
    nightlight=true
    dropDown()
  }else{
    document.documentElement.style.setProperty('--foreground', 'black')
    nightlight=false;
    infoDis=true;
    dropDown()
  }
}
*/

//credit to user RayLoveless on Stack Overflow
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0,0);

function bigtext(){
  var letterWidth;
  if (moods[cmood].length>levels[clevel].length){
    letterWidth=Math.floor(100/moods[cmood].length)*1.8
  }else{
    letterWidth=Math.floor(100/levels[clevel].length)*1.8
  }
  if (letterWidth>16){
    document.documentElement.style.setProperty('--vartext','16vw')
  }else{
    document.documentElement.style.setProperty('--vartext', letterWidth+'vw')
  }

}

bigtext()


function lightChange(){

}

function powerButton(){
  if (lampPow==false){
    lampPow=true;
    lightChange()
  }else{
    lampPow=false;
    lightChange()
  }
}//end of funct




function tempCycle(){
  if (lampPow==false){
  }else{
    if (cmood==6){
      cmood=1
    }else{
      cmood+=1
    }//inner else
  }//outer else
  lightChange()
}//end of funct




function onScroll() {
  width=d3.select('.empty').node().getBoundingClientRect().width
  right=d3.select('.empty').node().getBoundingClientRect().bottom
    if (width<right){
      document.documentElement.style.setProperty('--scroller', `${window.scrollY}px`)
    }
}


window.addEventListener('scroll', onScroll)
//credit to Filip Vitas on Medium for his "Beautiful Parallax 2019 Edition tutorial on Medium"
//codepen: https://codepen.io/FilipVitas/pen/NoOmrE?editors=1010
