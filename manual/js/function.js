//moods=[{name:'cruel',call:'a'},{name:'peaceful',call:'b'},{name:'tender',call:'C'},{name:'evil',call:'D'},{name:'moody',call:'E'}]
//mood=['frigid','peaceful','tender','evil','moody']
mood=['cold','calm','warm','harsh','moody']
level=['hardly','casually','somewhat','adequately','intensely','incredibly']
options=d3.select('.options')
moodbox=d3.select('.mood').select('.row')
levelbox=d3.select('.level')

for(i=0; i<6;i++){
 options.append('div').classed('row',true).attr('id','row'+i)
  whichRow='row'+i
  row=d3.select('#'+whichRow)

  for(x=0; x<5;x++){
    row.append('div').classed('block'+x,true).classed('bigsans',true).html('a')
    d3.select('#'+whichRow).select('.block'+x)
  }
  d3.select('#'+whichRow).style('filter','saturate('+(i/5*100+20)+'%)')
}

for(i=0;i<mood.length;i++){
  moodbox.append('div')
  .classed('label',true)
  .html(mood[i])
}
for(i=0;i<level.length;i++){
  levelbox.append('div')
  .classed('label',true)
  .html('<span class="long">'+level[i]+'</span>')
  .append('span').classed('short',true).html('('+(i+1)+')')
}

d3.selectAll('.label').classed('underlined',true)
moodbox.select('.label').classed('selected',true).classed('underlined',false)
levelbox.select('.label').classed('selected',true).classed('underlined',false)
options.select('.bigsans').style('text-decoration','underline')

function jumble(){
  for (i = 0; i < moods.length; i++){
    var randomDeg=Math.floor(75*Math.random())+90
    if (Math.random()*1>0.5){
      randomDeg=randomDeg*-1
    }
    /*
    var float;
    if (i%2 == 0){
      float='left';
    }else{
      float='right';
    }
    */
    container
    .append('div')
    .html(moods[i])
    .classed('word',true)
    .classed('word'+i,true)
    .style('transform','rotate('+randomDeg+'deg)')
    word=d3.select('.word'+i)
    word.append('div').attr('class','tl point')
    word.append('div').attr('class','tr point')
    word.append('div').attr('class','bl point')
    word.append('div').attr('class','tr point')
  }//end of for loop
}
