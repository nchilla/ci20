var pages = [
  {text: "home", url: "index.html" },
  {text: "writings", url: "writings.html" },
  {text: "drawings", url: "drawings.html" },
  {text: "sketchbook", url: "sketchbook.html" },
  {text: "riso prints", url: "prints.html" },
  {text: "travel", url: "travel.html" },
  {text: "organizations", url: "organizations.html" },
  {text: "contact me", url: "contact.html" },
  {text: "links", url: "links.html" }
];


document.body.onload=generate;

function generate(){
  var sidebar=document.createElement('div');
  sidebar.setAttribute("class", "sidebar");
  var content=document.createElement('div');
  content.setAttribute("class", "content");
  document.body.appendChild(sidebar);
  document.body.appendChild(content)

  for(var i=0;i<pages.length;i++){
    linked=pages[i];
    el=document.createElement('a');
    el.innerHTML=linked.text;
    el.setAttribute("href",linked.url);
    el.setAttribute("target",'_blank');
    document.querySelector('.sidebar').appendChild(el);
  }

}
