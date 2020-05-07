var settings=[];
var facets=[{tn: "days of the week", n: "day_of_week"},{tn: "news desks", n: "news_desk"},{tn: "section", n: "section_name"},{tn: "type of material", n: "type_of_material"},{tn: "recipe ingredients", n: "ingredients"}];
var param=[
  {tn:'subjects',n:'subject',t:'text',o:['technology']},
  {tn:'people',n:'persons',t:'split',o:['first name','last name']},
  {tn:'organizations',n:'organizations',t:'text',o:['facebook']},
  {tn:'geolocations',n:'glocations',t:'text',o:['san francisco']},
  {tn:'recipe ingredients',n:'ingredients',t:'text',o:['garlic']},
  {tn:'days of the week',n:'day_of_week',t:'options',o:['sunday','monday','tuesday','wednesday','thursday','friday','saturday']},
  {tn:'news desks',n:'news_desk',t:'options',o:["Arts & Leisure", "Arts", "Automobiles", "Blogs", "Books", "Booming", "Business Day", "Business", "Cars", "Circuits", "Classifieds", "Connecticut", "Crosswords & Games", "Culture", "DealBook", "Dining", "Editorial", "Education", "Energy", "Entrepreneurs", "Environment", "Escapes", "Fashion & Style", "Fashion", "Favorites", "Financial", "Flight", "Food", "Foreign", "Generations", "Giving", "Global Home", "Health & Fitness", "Health", "Home & Garden", "Home", "Jobs", "Key", "Letters", "Long Island", "Magazine", "Market Place", "Media", "Men's Health", "Metro", "Metropolitan", "Movies", "Museums", "National", "Nesting", "Obits", "Obituaries", "Obituary", "OpEd", "Opinion", "Outlook", "Personal Investing", "Personal Tech", "Play", "Politics", "Regionals", "Retail", "Retirement", "Science", "Small Business", "Society", "Sports", "Style", "Sunday Business", "Sunday Review", "Sunday Styles", "T Magazine", "T Style", "Technology", "Teens", "Television", "The Arts", "The Business of Green", "The City Desk", "The City", "The Marathon", "The Millennium", "The Natural World", "The Upshot", "The Weekend", "The Year in Pictures", "Theater", "Then & Now", "Thursday Styles", "Times Topics", "Travel", "U.S.", "Universal", "Upshot", "UrbanEye", "Vacation", "Washington", "Wealth", "Weather", "Week in Review", "Week", "Weekend", "Westchester", "Wireless Living", "Women's Health", "Working", "Workplace", "World", "Your Money"]},
  {tn:'section',n:'section_name',t:'options',o:["Arts", "Automobiles", "Autos", "Blogs", "Books", "Booming", "Business", "Business Day", "Corrections", "Crosswords & Games", "Crosswords/Games", "Dining & Wine", "Dining and Wine", "Editors' Notes", "Education", "Fashion & Style", "Food", "Front Page", "Giving", "Global Home", "Great Homes & Destinations", "Great Homes and Destinations", "Health", "Home & Garden", "Home and Garden", "International Home", "Job Market", "Learning", "Magazine", "Movies", "Multimedia", "Multimedia/Photos", "N.Y. / Region", "N.Y./Region", "NYRegion", "NYT Now", "National", "New York", "New York and Region", "Obituaries", "Olympics", "Open", "Opinion", "Paid Death Notices", "Public Editor", "Real Estate", "Science", "Sports", "Style", "Sunday Magazine", "Sunday Review", "T Magazine", "T:Style", "Technology", "The Public Editor", "The Upshot", "Theater", "Times Topics", "TimesMachine", "Today's Headlines", "Topics", "Travel", "U.S.", "Universal", "UrbanEye", "Washington", "Week in Review", "World", "Your Money"]},
  {tn:'type of material',n:'type_of_material',t:'options',o:["Addendum", "An Analysis", "An Appraisal", "Article", "Banner", "Biography", "Birth Notice", "Blog", "Brief", "Caption", "Chronology", "Column", "Correction", "Economic Analysis", "Editorial", "Editorial Cartoon", "Editors' Note", "First Chapter", "Front Page", "Glossary", "Interactive Feature", "Interactive Graphic", "Interview", "Letter", "List", "Marriage Announcement", "Military Analysis", "News", "News Analysis", "Newsletter", "Obituary", "Obituary (Obit)", "Op-Ed", "Paid Death Notice", "Postscript", "Premium", "Question", "Quote", "Recipe", "Review", "Schedule", "SectionFront", "Series", "Slideshow", "Special Report", "Statistics", "Summary", "Text", "Video", "Web Log"]},
];
var gates=['or','and','not'];
var mode=true;
var years=[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
var cooldown=false;
var displayOptions=['total articles','categories']
var display=1;
var histoire=[];
var presently=0;
var pastCursor=[];

// word_count
// {tn:'word count',t:'number',n:'word_count',o:['<500']}
//going to add back in:
// {tn:'raw contents',n:'query',t:'text',o:['anything']},


function startUp(){
  buildControl();
  addFacet(facets[0]);
  // rotateThing();
}

function buildControl(){
  var cont=d3.select('#control #options')
  cont.selectAll('div')
    .data(param,d => d)
    .join('div')
    .attr('class',d =>classM(d.t))
    .each(function(d,i,nodes){
      current=d3.select(nodes[i])
      current.append('h3').html(d.tn)
      current.on('click',function(event){
        if(mode){
          add(event,d3.event);
        }else{
          addFacet(event,d3.event)
        }
      })
    })
  function classM(type){return 'menu '+type};
  function classG(type){return 'toggle '+type};
}
function addFacet(d,e){
  var index=facets.findIndex(el=>el.n==d.n)
  if(index==-1){
  }else{
    facets.splice(index,1);
  }
  d3.selectAll('.bucket').remove()
  facets.unshift({tn:d.tn,n:d.n});
  facets.forEach((item, i) => {
    d3.select('#buckets')
    .append('div').classed('bucket',true)
    .style('order',i+1)
    .on('click',function(){addFacet(item)})
    .append('h3').classed('noselect',true).html(item.tn)
  });
}
function add(d,e){
  var domproof=d.n.replace('.','_');
  var wrapper=d3.select('.fgwrap.'+domproof);
  var parent=d3.select('.fgroup.'+domproof);
  var topbar;
  var logic=d3.select('#logic')
  var val=settings[settings.findIndex(el=>el.n==d.n)];
  if(settings.findIndex(el=>el.n==d.n)==-1){
    settings.push({n:d.n,g:0,a:[]});
    var val=settings[settings.findIndex(el=>el.n==d.n)];
    logic.append('div')
    .attr('class','fgwrap '+domproof)
    .append('div').datum(val)
    .attr('class','fgroup '+domproof)
    .append('div').classed('topbar',true)
    wrapper=d3.select('.fgwrap.'+domproof);
    parent=d3.select('.fgroup.'+domproof);
    topbar=parent.select('.topbar');
    topbar.append('div').attr('class','gate or').append('h3').html('OR')
    topbar.append('h3').html(d.tn)
    wrapper.append('div')
    .on('click',function(){
      settings.splice(settings.findIndex(el=>el.n==val.n),1);
      wrapper.remove();
    })
    .attr('class','close')
    .append('h3').html('✕')
    var scroller = document.querySelector('#logic');
    scroller.scrollTop = scroller.scrollHeight;
  }//end of the if
  parent.append('div').classed('filter',true)
  var filter=parent.select('.filter:last-child')
  val.a.push({v:'',g:0})
  filter.append('div').attr('class','gate noselect or').append('h3').html('OR')
  switch(d.t){
    case 'number':
    break;
    case 'options':
    filter
    .append('div').classed('drop-wrap',true)
    .append('div').classed('dropdown',true)
    var dwrap=filter.select('.drop-wrap');
    var dropdown=filter.select('.dropdown');
    d.o.forEach((item, i) => {
      dropdown.append('div')
      .classed('noselect',true)
      .classed('downselect',true)
      .html(item)
      .on('click',function(){
        var node=d3.event.currentTarget;
        var newVal=node.textContent;
        d3.select(node.parentNode).selectAll('.chosen').classed('chosen',false)
        node.parentNode.scrollTop = node.offsetTop-10;
        d3.select(node).classed('chosen',true);
        changeValue(newVal,node.parentNode.parentNode.parentNode)
      })
    });
    break;
    case 'split':
    filter.append('input').attr('type','text').attr('class',d.t+'input '+d.o[0]).attr('placeholder',d.o[0]).node().addEventListener('input', function(event){
      changeValue(scoop(event.currentTarget),event.currentTarget.parentNode);
    });;
    filter.append('input').attr('type','text').attr('class',d.t+'input '+d.o[1]).attr('placeholder',d.o[1]).node().addEventListener('input', function(event){
      changeValue(scoop(event.currentTarget),event.currentTarget.parentNode);
    });;
    function scoop(targ){
      var first=d3.select(targ.parentNode).select('.first').node().value;
      var last=d3.select(targ.parentNode).select('.last').node().value;
      var name=last+', '+first
      if(last==''){
        name=first;
      }else if(first==''){
        name=last;
      }
      return name;
    }
    filter.select('input').node().focus();
    break;
    default:
    filter.append('input').attr('type','text').classed(d.t+'input',true).attr('placeholder','e.g. '+d.o[0]);
    filter.select('input').node().focus();
    filter.select('input').node().addEventListener('input', function(event){
      changeValue(event.currentTarget.value,event.currentTarget.parentNode);
    });
    //       current.append('input').attr('type','text').classed('splitinput',true).attr('placeholder',d.o[1]);
  }
  filter.datum(val.a[val.a.length-1])
  filter.append('div')
  .on('click',function(event){
    val.a.splice(val.a.indexOf(event),1);
    d3.select(d3.event.currentTarget.parentNode).remove();
    if(val.a.length<1){
      settings.splice(settings.findIndex(el=>el.n==val.n),1);
      wrapper.remove();
    }
  })
  .attr('class','close')
  .append('h3').html('✕');

d3.selectAll('.gate').on('click',function(event){
  var copy=d3.select(d3.event.currentTarget.parentNode).datum();
  if(copy.g<2){
    copy.g++;
  }else{
    copy.g=0;
  }
  d3.select(d3.event.currentTarget)
  .datum(copy)
  .attr('class','gate noselect '+gates[copy.g])
  .select('h3')
  .html(gates[copy.g].toUpperCase());
})
}//end of add()
function changeValue(change,node){
  var copy=d3.select(node).datum();
  copy.v=change;
  d3.select(node).datum(copy);
}
//this controls what happens when you click on a nav bar item
document.querySelectorAll('#nav div').forEach((item, i) => {
  item.addEventListener('click',function(event){
    var target=event.currentTarget;
    switch(target.textContent){
      case 'filters':
      d3.select('#logic').style('display','inherit')
      d3.select('#facets').style('display','none')
      d3.selectAll('.tab').classed('tab',false)
      d3.select(target).classed('tab',true)
      d3.select('#options').selectAll('.split').style('display','inherit')
      d3.select('#options').selectAll('.text').style('display','inherit')
      mode=true;
      break;
      case 'sorting':
      d3.select('#logic').style('display','none')
      d3.select('#facets').style('display','inherit')
      d3.selectAll('.tab').classed('tab',false)
      d3.select(target).classed('tab',true)
      d3.select('#options').selectAll('.split').style('display','none')
      d3.select('#options').selectAll('.text').style('display','none')
      d3.select('#options').selectAll('.text').filter(d=>d.n=='ingredients').style('display','inherit')
      mode=false;
      break;
      case 'launch!':
      if(cooldown==false){
        launch();

        //cooldown functions
        cooldown=true;
        //display stuff
        d3.select(target).classed('or',true)
        setTimeout(function(){
          d3.select(target).classed('or',false).classed('not',true).select('h3').html('cooldown');
          for(var i=0;i<30+years.length;i++){
            if(cooldown==false){
              break;
            }
            var timed=30+years.length-i;
            timer(timed,i);
            function timer(time,index){
              setTimeout(function(){
                d3.select(target).select('h3').html('cooldown '+time);
              },index*1000)
            }//end of timer funnction
          }
        },500)
        //reactivate and remove display
        setTimeout(function(){
          d3.select(target).classed('not',false).select('h3').html('launch!');
          cooldown=false;
        },years.length*1000+30000)
      }

      break;
    }
  })
});




function launch(){
  var urls=[];
  var comp=[];
  // this builds the urls for each year in years
  years.forEach((item, i) => {
    urls.push({yr:item,url:urlGenerator(item)})
  });
  //this part splits the urls into segments of 5 so that they dont break the api request limit
  var segments=[];
  var segCount=0;
  for(var i=0;segCount<urls.length;i++){
    var sI=i*5;
    segments.push(urls.slice(sI,sI+5))
    var latest=segments[segments.length-1]
    segCount=segCount+latest.length;
    console.log('latest count: ',latest.length,'total count: ',segCount);
  }
  //for every grouping of 5 urls
  segments.forEach((item, i) => {
    //time out to respect the stupid request limit
    setTimeout(function(){
      //for every individual request
      item.forEach((request, r) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            comp.push({y:request.yr,h:data.response.meta.hits,f:data.response.facets[facets[0].n].terms});
            comp.sort(function compareFunction(a,b){
              return a.y-b.y
            });
              paintGraph(comp);
              window.scrollTo({
                top:0,
                left:0,
                behavior:'smooth'
              });
              if(comp.length==years.length){
                histoire.push({n:'lol',data:comp});
                presently=histoire.length-1;
              }
          }else if(this.status == 429){
            console.log('too many requests')
          }else if(this.status == 400){
            console.log('bad requests')
          }
        };
        xmlhttp.open("GET", request.url, true);
        xmlhttp.send();

        //end of for each url
      });
    },i*100)
    //end of timeout
  //end of for each segment
  });





}//end of launch

function urlGenerator(yr){
  //sections of query
  var pubY='pub_year:'+yr;
  var custom='';
  var query=''
  //stringbuilding tools
  var quotes='""';
  var parenth='()';

  settings.forEach((item, i) => {
    var match=param[param.findIndex(el=>el.n==item.n)];
    var inside=''
    var mult='';
    if(item.a.length>0&&(item.n!=='day_of_week')){
      mult='.contains';
    }
    item.a.forEach((choice, c) => {
      var gate=g(choice.g,c);
      inside=inside.concat(gate,insertString(quotes,choice.v.replace('&','%26'),1));
    });
    custom=custom+g(item.g,i)+item.n+mult+':'+insertString(parenth,inside,1)
  });
  custom='fq='+insertString(parenth,custom,1);
  custom=query+custom;
  custom=custom+' AND '+pubY;
  custom=custom+'&facet_fields='+facets[0].n;
  var vase='https://api.nytimes.com/svc/search/v2/articlesearch.json?';
  var key='&api-key=8JjFROX7FQ09VP3hu6R7QsoYYaHUxiqz';
  var presets='&facet=true&facet_filter=true';
  function g(index,i){
    var gate;
    if(i==0&&index<2){
      gate='';
    }else if(i==0){
      gate=gates[index].toUpperCase()+' ';
    }else{
      gate=' '+gates[index].toUpperCase()+' ';
    }
    return gate;
  }
  var url = vase+custom+presets+key;
  return url;

}//end of url generator
function insertString(original,insert,position){
  var a=original;
  var b=insert;
  var c=position;
  //credit to userjAndy on stack overflow
  var output = [a.slice(0, c), b, a.slice(c)].join('');
  return output;
}

function paintGraph(data){
  var increment=years;
  var tracking=[];
  var unit=''
  // {n:,p:}
  //this builds tracking

  if(display==1){
    unit='%';
  //for each year
    data.forEach((year, y) => {
      //for each bucket in that year
      year.f.forEach((bucket, b) => {
        var xCord=year.y;
        var yCord=parseFloat((bucket.count/year.h*100).toFixed(2));
        var tracknum=tracking.findIndex(el=>el.n==bucket.term);
        if(tracknum!==-1){
          tracking[tracknum].x.push(xCord);
          tracking[tracknum].y.push(yCord);
        }else{
          tracking.push({n:bucket.term,x:[xCord],y:[yCord],combo:[]});
        }
      });
      //end of tracking maker
    });
  }else{
    tracking.push({n:'hits',x:[],y:[],combo:[]})
  data.forEach((year, y) => {
    tracking[0].x.push(year.y);
    tracking[0].y.push(year.h);
  });
}

  //this finds the domain and range
  var max=0;
  //finds the max and DOUbLES as a function to fill in blank spaces
  tracking.forEach((item, i) => {
    var newM=d3.max(item.y)
    if(newM>max){
      max=newM;
    }
    //blank spaces set to 0
    increment.forEach((year, y) => {
      if(item.x.indexOf(year)==-1){
        newInd=item.x.indexOf(year-1)+1
        item.x.splice(newInd,0,year);
        item.y.splice(newInd,0,0);
      }
      item.combo.push({year:item.x[y],count:item.y[y]})
    });

  });
  var xPram=d3.scaleLinear()
    .domain([increment[0],increment[increment.length-1]])
    .range([0, 100]);
  var yPram=d3.scaleLinear()
    .domain([0,max])
    .range([0, 100]);

  //this clears the graph
  var wrap=d3.select('#gwrapper')
  wrap.selectAll('path').remove();
  wrap.selectAll('line').remove();
  d3.select('#increments').selectAll('div').remove();
  //increment markers at the bottom and side
  years.forEach((item, i) => {
    var w=1;
    if(i==0){
      w='1px';
    }
    d3.select('#increments').append('div')
    .style('flex',w)
    .datum([item,data,tracking])
    .classed('increment',true)
    .append('h4').html(item);
    d3.select('.increment:last-child')
    .append('div').classed('lomark',true)
  });
  d3.select('.increment:first-child')
  .append('div').classed('ymarkers',true)
  for(i=4;i>0;i--){
    var mVal=i/4*max;
    if(max>20){
      mVal=Math.round(mVal);
    }
    d3.select('.ymarkers')
    .append('div').classed('mark'+i,true)
    .append('h4').html(mVal+unit)
    d3.select('.mark'+i)
    .append('div').classed('himark',true);
  }
  // .html(max).classed('max',true)
  //this draws each line
  var line=d3.line()
  .x(d => xPram(d.year))
  .y(d => 100-yPram(d.count));
  tracking.forEach((item, i) => {
    svg=wrap.select('svg')
    item.combo.forEach((circle, c) => {
      svg.append('line')
      .attr("x1",xPram(circle.year))
      .attr("y1",100-yPram(circle.count))
      .attr("x2",xPram(circle.year))
      .attr("y2",100-yPram(circle.count))
      .attr('vector-effect','non-scaling-stroke')
    });

    svg.append("path")
      .datum(item.combo)
      .attr('vector-effect','non-scaling-stroke')
      .attr("stroke",`hsl(${399*i/tracking.length},100%, 75%)`)
      .attr("d",line);
  //end of tracking foreach
  });
d3.selectAll('path').on('mouseover',function(event){
  var tInd=tracking.findIndex(el=>el.combo==event);
  var tInd=tracking[tInd].n;
  d3.selectAll('path').style('stroke-opacity','0.1');
  d3.select(d3.event.currentTarget).style('stroke-opacity','1')
  d3.select('#labeler').style('display','block').html(tInd);
  d3.select('#mycursor').selectAll('h3').style('display','none')
  d3.select('#mycursor').selectAll('h4').style('display','none')

})
d3.selectAll('path').on('mouseout',function(){
  setTimeout(function(){
    d3.selectAll('path').style('stroke-opacity','1');
    d3.select('#labeler').style('display','none')
    d3.select('#mycursor').selectAll('h3').style('display','block')
    d3.select('#mycursor').selectAll('h4').style('display','block')
  },1000)
})

}//end of paintgraph

d3.selectAll('.toggledisp').on('click',function(){
  var target=d3.event.currentTarget;
  d3.selectAll('.dispick').classed('dispick',false);
  d3.select(target).classed('dispick',true);
  display=displayOptions.indexOf(target.textContent);
  if(histoire.length>0){
    paintGraph(histoire[presently].data);
  }
})

var vase='https://api.nytimes.com/svc/search/v2/articlesearch.json?';
var key='&api-key=8JjFROX7FQ09VP3hu6R7QsoYYaHUxiqz';
var presets='&facet=true&facet_filter=true';
var xmlhttp = new XMLHttpRequest();
var url = vase+'fq=day_of_week:("friday"NOT"monday")&facet_fields=day_of_week'+presets+key; //your file name (or, the structured URL for API call)
var data = [];
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    data = JSON.parse(this.responseText);
    console.log(data);
    //we'll do something here
  }
};
//IMPORTANT IMPORTANT IMPORTANT
// xmlhttp.open("GET", url, true);
// xmlhttp.send();

var cursorTrack=function(event){
  //mouse handler comes with info about where the mouse is
  yCoord=event.clientY;
  xCoord=event.clientX;
  var cursor=document.querySelector('#mycursor')
  cursor.style.top=yCoord+'px';
  cursor.style.left=xCoord+'px';
  var present=false;
  var contBox=document.querySelector('#increments').getBoundingClientRect();
  d3.selectAll('.increment')
  .classed('marked',false)
  .each(function(d,i,nodes){
    var check=nodes[i].getBoundingClientRect()
    if((Math.abs(check.right-xCoord)<check.width/2)&&!(yCoord>contBox.bottom)&&!(yCoord<contBox.y)){
      d3.select(nodes[i]).classed('marked',true)
      var info=d3.select(nodes[i]).datum();
      var ind=info[1].findIndex(el=>el.y==info[0]);
      var theData=info[1][ind];
      if(pastCursor!==info){
        // {n:bucket.term,x:[xCord],y:[yCord],combo:[]}
        newcursor=d3.select('#mycursor')
        newcursor.selectAll('h3').remove()
        newcursor.selectAll('h4').remove()
        newcursor.append('h3').html(info[0])
        if(display==1){
          theData.f.forEach((item, i) => {
            var col=`hsla(${399*info[2].findIndex(el=>el.n==item.term)/info[2].length},100%, 75%,0.5)`;
            var term=item.term;
            if(term==''){
              term='unlabeled';
            }
            newcursor.append('h4')
            .html(term+': '+Math.round(item.count/theData.h*100)+'%')
            .style('background-color',col);
          });
        }else{
          newcursor.append('h4')
          .html('hits:'+theData.h)
        }
      }
      pastCursor=info;
      present=true;
    }else{
    }
  })
  if (present==true){
    cursor.style.display='flex';
  }else{
    cursor.style.display='none';
  }
}
document.onmousemove=cursorTrack;




startUp();
// function rotateThing(){
//   var h=window.innerHeight;
//   var w=window.innerWidth;
//   var turnt=h/w*-45+'deg';
//   document.querySelector('.wip-banner').style.setProperty('--degrees',turnt)
// }
// window.addEventListener('resize',function(){
//   rotateThing();
// })
