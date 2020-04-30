
// read the JSON file (or, get the live data from NYT)
var xmlhttp = new XMLHttpRequest();
var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=climate+change&facet_fields=section_name&facet=true&api-key=8JjFROX7FQ09VP3hu6R7QsoYYaHUxiqz"; //your file name (or, the structured URL for API call)
var data = [];
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    data = JSON.parse(this.responseText);
    facets(data);
    //we'll do something here
  }
};

//https://inpho.cogs.indiana.edu?idea=646
//nrel.gov key: 2bvtTVihvtES7qL7HKokoVn4xcvlVQobudXSy0Ym
//https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=CA&type=commercial&api_key=2bvtTVihvtES7qL7HKokoVn4xcvlVQobudXSy0Ym
//https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=CA&type=total&api_key=2bvtTVihvtES7qL7HKokoVn4xcvlVQobudXSy0Ym
//NASA API KEY: 2CkTJiJOcgHBDbLD5WIdbboYHEwUJ05a7oOdPE4Z
var today=new Date();
var dd=today.getDate();
var mm=today.getMonth();
var yyyy=today.getFullYear();
console.log(today);
xmlhttp.open("GET", url, true);
xmlhttp.send();
// https://inpho.cogs.indiana.edu/
function printArticles(data){
  //do something
  var docs=data.response.docs;
  for (var i=0;i<docs.length;i++){
    var image=document.createElement('img');
    var item = document.createElement("li");
    var imageUrl;
    item.classList.add('articles');
    var anchor = document.createElement("a");
    anchor.innerText = docs[i].headline.main;
    anchor.href = docs[i].web_url;
    anchor.target = "_blank";
    item.appendChild(anchor);
    document.querySelector('.result').appendChild(item);
    for(var j=0;j<docs[i].multimedia.length;j++){
      if(docs[i].multimedia[j].type=='image'){
        imageUrl=docs[i].multimedia[j].url;
        break;
      }
    }
    image.src = "http://www.nytimes.com/" + imageUrl;
    item.appendChild(image);
    console.log(imageUrl);
  }
}
function use(data){
  var years=data.result[0].data;
  var yearkeys=Object.keys(years);
  var yearObj=[];
  yearkeys.forEach((item, i) => {
    yearObj.push({y:parseInt(item),v:years[item]});
  });
  var max=Math.max.apply(Math, yearObj.map(function(o) { return o.v; }))
  console.log(max);
  yearObj.forEach((item, i) => {
    var width=item.v/max*100;
    d3.select('body')
    .append('div')
    .classed('bar',true)
    .html(item.y)
    .style('width',width+'%');
  });

  console.log(yearObj)
}
function facets(data){
  console.log(data);
}
