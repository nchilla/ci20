var settings=[];
var comp=[];
var facets=[{tn: "days of the week", n: "day_of_week"},{tn: "news desks", n: "news_desk"},{tn: "section", n: "section_name"},{tn: "type of material", n: "type_of_material"},{tn: "recipe ingredients", n: "ingredients"}];
var param=[
  {tn:'all fields/content',n:'query',t:'text',o:['anything']},
  {tn:'subjects',n:'subject',t:'text',o:['technology']},
  {tn:'people',n:'persons',t:'split',o:['first name','last name']},
  {tn:'organizations',n:'organizations',t:'text',o:['YMCA']},
  {tn:'geolocations',n:'glocations',t:'text',o:['australia']},
  {tn:'recipe ingredients',n:'ingredients',t:'text',o:['garlic']},
  {tn:'days of the week',n:'day_of_week',t:'options',o:['sunday','monday','tuesday','wednesday','thursday','friday','saturday']},
  {tn:'news desks',n:'news_desk',t:'options',o:["Arts & Leisure", "Arts", "Automobiles", "Blogs", "Books", "Booming", "Business Day", "Business", "Cars", "Circuits", "Classifieds", "Connecticut", "Crosswords & Games", "Culture", "DealBook", "Dining", "Editorial", "Education", "Energy", "Entrepreneurs", "Environment", "Escapes", "Fashion & Style", "Fashion", "Favorites", "Financial", "Flight", "Food", "Foreign", "Generations", "Giving", "Global Home", "Health & Fitness", "Health", "Home & Garden", "Home", "Jobs", "Key", "Letters", "Long Island", "Magazine", "Market Place", "Media", "Men's Health", "Metro", "Metropolitan", "Movies", "Museums", "National", "Nesting", "Obits", "Obituaries", "Obituary", "OpEd", "Opinion", "Outlook", "Personal Investing", "Personal Tech", "Play", "Politics", "Regionals", "Retail", "Retirement", "Science", "Small Business", "Society", "Sports", "Style", "Sunday Business", "Sunday Review", "Sunday Styles", "T Magazine", "T Style", "Technology", "Teens", "Television", "The Arts", "The Business of Green", "The City Desk", "The City", "The Marathon", "The Millennium", "The Natural World", "The Upshot", "The Weekend", "The Year in Pictures", "Theater", "Then & Now", "Thursday Styles", "Times Topics", "Travel", "U.S.", "Universal", "Upshot", "UrbanEye", "Vacation", "Washington", "Wealth", "Weather", "Week in Review", "Week", "Weekend", "Westchester", "Wireless Living", "Women's Health", "Working", "Workplace", "World", "Your Money"]},
  {tn:'section',n:'section_name',t:'options',o:["Arts", "Automobiles", "Autos", "Blogs", "Books", "Booming", "Business", "Business Day", "Corrections", "Crosswords & Games", "Crosswords/Games", "Dining & Wine", "Dining and Wine", "Editors' Notes", "Education", "Fashion & Style", "Food", "Front Page", "Giving", "Global Home", "Great Homes & Destinations", "Great Homes and Destinations", "Health", "Home & Garden", "Home and Garden", "International Home", "Job Market", "Learning", "Magazine", "Movies", "Multimedia", "Multimedia/Photos", "N.Y. / Region", "N.Y./Region", "NYRegion", "NYT Now", "National", "New York", "New York and Region", "Obituaries", "Olympics", "Open", "Opinion", "Paid Death Notices", "Public Editor", "Real Estate", "Science", "Sports", "Style", "Sunday Magazine", "Sunday Review", "T Magazine", "T:Style", "Technology", "The Public Editor", "The Upshot", "Theater", "Times Topics", "TimesMachine", "Today's Headlines", "Topics", "Travel", "U.S.", "Universal", "UrbanEye", "Washington", "Week in Review", "World", "Your Money"]},
  {tn:'type of material',n:'type_of_material',t:'options',o:["Addendum", "An Analysis", "An Appraisal", "Article", "Banner", "Biography", "Birth Notice", "Blog", "Brief", "Caption", "Chronology", "Column", "Correction", "Economic Analysis", "Editorial", "Editorial Cartoon", "Editors' Note", "First Chapter", "Front Page", "Glossary", "Interactive Feature", "Interactive Graphic", "Interview", "Letter", "List", "Marriage Announcement", "Military Analysis", "News", "News Analysis", "Newsletter", "Obituary", "Obituary (Obit)", "Op-Ed", "Paid Death Notice", "Postscript", "Premium", "Question", "Quote", "Recipe", "Review", "Schedule", "SectionFront", "Series", "Slideshow", "Special Report", "Statistics", "Summary", "Text", "Video", "Web Log"]},
];
var gates=['or','and','not'];
var mode=true;
var years=[2016,2017,2018,2019,2020];
// word_count
// {tn:'word count',t:'number',n:'word_count',o:['<500']}



function startUp(){
  buildControl();
  addFacet(facets[0]);
  rotateThing();
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
      var name=last+','+first
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
      launch();
      break;
    }
  })
});

function launch(){
  comp=[];
  years.forEach((item, i) => {
    urlGenerator(item)
    // setTimeout(urlGenerator(item),600);
  });
}

function urlGenerator(yr){
  settings.sort(function compareFunction(a,b){
    if(a.n=='query'){
      return -1;
    }else if(b.n=='query'){
      return 1;
    }else{
      return -1;
    }
  });
  var custom='';
  settings.forEach((item, i) => {
    var addition='';
    var sep='"';
    var up=' '+gates[item.g].toUpperCase()+' ';
    if((up==' OR ')||(i==0&&up==' AND ')){
      up='';
    }
    if(item.n=='query'){
      sep=''
    }
    var match=param[param.findIndex(el=>el.n==item.n)];
    item.a.forEach((choice, c) => {
      var up2=' '+gates[choice.g].toUpperCase()+' ';
      if((c==0&&up2==' OR ')||(c==0&&up2==' AND ')){
        up2='';
      }
      addition=addition+up2+sep+choice.v+sep;
    });
    if(item.n=='query'){
      var extra='';
      if(settings.length>1){
        extra='&fq='
      }
      custom='q='+addition.replace(/&/g,'and')+extra+custom;
    }else{
      custom=custom+up+item.n+'.contains:('+addition+')';
    }
  });
  if(settings.findIndex(el=>el.n=='query')==-1){
    custom='fq='+custom;
  }
  var pubY='pub_year:'+yr;
  custom=custom+' AND '+pubY+'&facet_fields='+facets[0].n
  console.log(custom)
  var vase='https://api.nytimes.com/svc/search/v2/articlesearch.json?';
  var key='&api-key=8JjFROX7FQ09VP3hu6R7QsoYYaHUxiqz';
  var presets='&facet=true&facet_filter=true';

  var url = vase+custom+presets+key;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
      comp.push({y:yr,h:data.response.meta.hits,f:data.response.facets});
      if(comp.length>4){
        comp.sort(function compareFunction(a,b){
          return a.y-b.y
        });
        console.log(comp);
        paintGraph(comp);
        window.scrollTo({
          top:0,
          left:0,
          behavior:'smooth'
        });
      }
      //we'll do something here
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
function paintGraph(data){
  d3.select('.datawrap').selectAll('div').remove();
  d3.select('.wip-banner').style('opacity',0)
  data.forEach((item, i) => {
    d3.select('.datawrap')
    .append('div')
    .attr('class','yearsec y'+item.y)
    .append('h4').html(item.y);
    var f=item.f[facets[0].n].terms;
    f.forEach((baby, x) => {
      d3.select('.y'+item.y).append('h3').html(baby.term+': '+baby.count)
    });
  });

  // d3.select('.datawrap')
  // .selectAll('div')
  // .data(data,d => d)
  // .join('div')
  // .attr('class','yearsec')
  // .each(function(d,i,nodes){
  //
  // })
}//end of paintgraph



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

startUp();

function rotateThing(){
  var h=window.innerHeight;
  var w=window.innerWidth;
  var turnt=h/w*-45+'deg';
  document.querySelector('.wip-banner').style.setProperty('--degrees',turnt)
}



window.addEventListener('resize',function(){
  rotateThing();
})


// fq=subject.contains%3A%28%22politics%22%29NOTnews_desk%3A%22U.S.%22


// fq=section_name.contains:("New York") AND news_desk.contains:("Automobiles")
// fq=ingredients.contains:("apple"AND"cinnamon")

//order of if/and/or does not matter-this returns recipes with apple and egg in them but not cinnamon
// fq=ingredients.contains:("apple"NOT"cinnamon"AND"egg")
// however you can group queries using parentheses
// (("cinnamon"AND"apple")("tomato"AND"chicken")
// works on global scope
// fq=NOTingredients.contains:(NOT "garlic")&facet_fields=ingredients'

//you can query for wordcount with comparision operators
// fq=word_count:<500
