
$(document).ready(function() {
//capture key presses
  $(document).on("keypress", function(e) {
    //translate unicode to characters
    var char = String.fromCharCode(e.which);
    console.log(char);
    createElement(char);
  });

});


function createElement(k) {
  $('#cursor').remove()
  elem=$("#container")
  if (k == "a" || k == "A") {elem.append('<span class="inner">A</span>');}
  if (k == "b" || k == "B") { elem.append('<span class="inner">B</span>'); }
  if (k == "c" || k == "C") { elem.append('<span class="inner">C</span>'); }
  if (k == "d" || k == "D") { elem.append('<span class="inner">D</span>'); }
  if (k == "e" || k == "E") { elem.append('<span class="inner">E</span>'); }
  if (k == "f" || k == "F") { elem.append('<span class="inner">F</span>'); }
  if (k == "g" || k == "G") { elem.append('<span class="inner">G</span>'); }
  if (k == "h" || k == "H") { elem.append('<span class="inner">H</span>'); }
  if (k == "i" || k == "I") { elem.append('<span class="inner">I</span>'); }
  if (k == "j" || k == "J") { elem.append('<span class="inner">J</span>'); }
  if (k == "k" || k == "K") { elem.append('<span class="inner">K</span>'); }
  if (k == "l" || k == "L") { elem.append('<span class="inner">L</span>'); }
  if (k == "m" || k == "M") { elem.append('<span class="inner">M</span>'); }
  if (k == "n" || k == "N") { elem.append('<span class="inner">N</span>'); }
  if (k == "o" || k == "O") { elem.append('<span class="inner">O</span>'); }
  if (k == "p" || k == "P") { elem.append('<span class="inner">P</span>'); }
  if (k == "q" || k == "Q") { elem.append('<span class="inner">Q</span>'); }
  if (k == "r" || k == "R") { elem.append('<span class="inner">R</span>'); }
  if (k == "s" || k == "S") { elem.append('<span class="inner">S</span>'); }
  if (k == "t" || k == "T") { elem.append('<span class="inner">T</span>'); }
  if (k == "u" || k == "U") { elem.append('<span class="inner">U</span>'); }
  if (k == "v" || k == "V") { elem.append('<span class="inner">V</span>'); }
  if (k == "w" || k == "W") { elem.append('<span class="inner">W</span>'); }
  if (k == "x" || k == "X") { elem.append('<span class="inner">X</span>'); }
  if (k == "y" || k == "Y") { elem.append('<span class="inner">Y</span>'); }
  if (k == "z" || k == "Z") { elem.append('<span class="inner">Z</span>'); }
  if (k == " ") { elem.append('<span class="inner"> </span>'); }
  elem.append('<span id="cursor">|</span>')
}
