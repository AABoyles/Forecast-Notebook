const md = new TurndownService({ headingStyle: 'atx' });
md.keep(['iframe', 'svg']);
let editor = new MediumEditor('#null-start');

function addButtons(target, before = false){
  let div = target.parentNode.insertBefore(document.createElement('div'), before ? target : target.nextSibling);
  div.className = 'add-buttons';

  let addText = document.createElement('a');
  addText.innerHTML = 'Add Text';
  addText.className = 'add-text btn btn-primary btn-sm';
  addText.addEventListener('click', e => addTextArea(e.target.parentNode));
  div.appendChild(addText);

  let addGraph = document.createElement('a');
  addGraph.innerHTML = 'Add Graph';
  addGraph.className = 'add-graph btn btn-primary btn-sm';
  addGraph.addEventListener('click', e => addGraphArea(e.target.parentNode));
  div.appendChild(addGraph);
}

function addTextArea(target){
  let trapper = document.createElement('div');
  trapper.className = "text-wrapper";
  
  let textarea = document.createElement('div');
  textarea.className = "editor";
  trapper.appendChild(textarea);
  if(editor){
    editor.addElements(textarea);
  } else {
    editor = new MediumEditor(document.querySelectorAll('.editor'));
  }
  
  addRemoveButton(trapper);

  target.parentNode.insertBefore(trapper, target.nextSibling);
  addButtons(target.nextSibling);
}

function addGraphArea(target){
  let questionID = prompt("Enter a question ID:");
  if(questionID == '' || questionID == null) return;

  let grapper = document.createElement('div');
  grapper.className = 'graph-wrapper';
  grapper.appendChild(document.createElement('div'));

  let iframe = document.createElement('iframe');
  iframe.src = `//d3s0w6fek99l5b.cloudfront.net/s/5/questions/embed/${questionID}/`;  
  iframe.width = 930;
  iframe.height = 210;
  grapper.appendChild(iframe);

  addRemoveButton(grapper);

  target.parentNode.insertBefore(grapper, target.nextSibling);
  addButtons(target.nextSibling);
}

function addRemoveButton(wrapper){
  let buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'button-wrapper';
  let removeButton = document.createElement('a');
  removeButton.innerHTML = '❌';
  removeButton.className = 'remove-button btn btn-sm btn-danger';
  removeButton.addEventListener('click', function(){
    wrapper.nextSibling.remove();
    wrapper.remove();
  });
  buttonWrapper.appendChild(removeButton);

  let moveUpButton = document.createElement('a');
  moveUpButton.innerHTML = '↑';
  moveUpButton.className = 'moveUp-button btn btn-sm btn-danger';
  moveUpButton.addEventListener('click', function(){
    wrapper.parentNode.insertBefore(wrapper, wrapper.previousSibling.previousSibling);
    wrapper.parentNode.insertBefore(wrapper.nextSibling, wrapper.nextSibling.nextSibling.nextSibling);
  });
  buttonWrapper.appendChild(moveUpButton);

  let moveDownButton = document.createElement('a');
  moveDownButton.innerHTML = '↓';
  moveDownButton.className = 'moveDown-button btn btn-sm btn-danger';
  moveDownButton.addEventListener('click', function(){
    wrapper.parentNode.insertBefore(wrapper.nextSibling, wrapper.nextSibling.nextSibling.nextSibling);
    wrapper.parentNode.insertBefore(wrapper, wrapper.nextSibling.nextSibling.nextSibling);
  });
  buttonWrapper.appendChild(moveDownButton);

  wrapper.appendChild(buttonWrapper);
}

function getHTML(){
  let output = '';
  document.querySelector('#content').childNodes.forEach(child => {
    if(child.className == 'text-wrapper') return output += `<div>${child.childNodes[0].innerHTML}</div>\n`;
    if(child.className == 'graph-wrapper') return output += child.childNodes[1].outerHTML + '\n';
  });
  return output;
}

document.querySelector('#print').addEventListener('click', () => window.print());
document.querySelector('#export-html').addEventListener('click', () => {
  let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.23.3/css/medium-editor.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/medium-editor/5.23.3/css/themes/beagle.css"><style>html{min-height:100%;height:100%}body{overflow-x:hidden;overflow-y:scroll;justify-content:space-between;align-items:center;font-family:math,museo-sans,sans-serif;font-weight:500;letter-spacing: .05em;background-color:lightgray;min-height:100%;height:100%}nav{width:100%}#content{background-color:white;min-height:100%}a:link,a:visited{color:darkblue}.add-buttons{text-align:center;width:100%;opacity:0;transition:opacity .25s ease-in-out;-moz-transition:opacity .25s ease-in-out;-webkit-transition:opacity .25s ease-in-out}h2,h3{text-align:center}.graph-wrapper{text-align:center}iframe{border:none}#content>*{padding: .5rem 0}@media print{div:empty{display:none}}</style><title>Forecast Notebook</title></head><body><div id="content" class="container">`;
  html += getHTML();
  html += `</div></body></html>`
  var blob = new Blob([html], {type: "text/html;charset=utf-8"});
  saveAs(blob, "notebook.html");
});
document.querySelector('#export-md').addEventListener('click', () => {
  var blob = new Blob([md.turndown(getHTML())], {type: "text/markdown;charset=utf-8"});
  saveAs(blob, "notebook.md");
});

let nullStart = document.querySelector('#null-start');
addTextArea(nullStart);
addButtons(nullStart);
nullStart.remove();
