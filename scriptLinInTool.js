var data = null;

$.ajax({
    url: "data/Threat_nest_List.json",
    contentType:"application/json; charset=utf-8",
    dataType: 'json',
    async: false,

    success: function(response){
        dataThreatTotal = response
    }
});

$.ajax({
    url: "data/Threat_Title_ALL_IUCN.json",
    contentType:"application/json; charset=utf-8",
    dataType: 'json',
    async: false,

    success: function(response){
        dataThreatType = response
    }
});
  function createData(data, type, word) {
    treeDict = data
    threatType = type
    word = word

    let nestedTypes = {};

  for (let key in threatType) {
    const parts = key.split(".");
    let currLevel = nestedTypes;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!currLevel.hasOwnProperty(part)) {
        currLevel[part] = {"numT": 0, "category": "", "species": [], "value": 0};
      }
      currLevel = currLevel[part];
    }
    currLevel.category = threatType[key];
  }
  let sum = 0
  for (let key in treeDict) {
    if (key.includes(word)){
      sum +=1
        let list = treeDict[key];        
        list.forEach(function(element) {
           if (element.split('.').length>=1) {
            let nest = nestedTypes[element.split('.')[0]]
            if (!nest['species'].includes(key)) {
                nest['species'].push(key);
                nest['value'] += 1
            }
            nest['numT'] +=1
           }
           if (element.split('.').length>=2) {
            let nest = nestedTypes[element.split('.')[0]][element.split('.')[1]]
            if (!nest['species'].includes(key)) {
                nest['species'].push(key);
                nest['value'] += 1
            }
            nest['numT'] +=1
           }
           if (element.split('.').length===3) {
            let nest = nestedTypes[element.split('.')[0]][element.split('.')[1]][element.split('.')[2]]
            if (!nest['species'].includes(key)) {
                nest['species'].push(key);
                nest['value'] += 1
            }
            nest['numT'] +=1
           }
           
        })


    }
  }
  
  let threatDict = {'name': 'All', 'children': nestedTypes, 'value': sum};
  return threatDict
  };



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawCanvas(data){
  canvas.innerHTML = ""
// Sizing - independent
let tw = 1000
let numX = 4
// Sizing - DEPENDENT
let numY = 12/numX
let th = tw/(numX)*numY
var paper = Raphael("canvas", tw+10 , th+10);
let x = 10
let x0 = x
let y = 10
let h = th/numY
let w = tw/numX
//Text and color
let colorList = ['#ff6b6b', '#f06595', '#cc5de8', '#845ef7', '#5c7cfa', '#339af0', '#22b8cf', '#20c997', '#51cf66', '#94d82d', '#fcc419', '#ff922b'];
let headline = [
    '1. Residential & commercial development',
    '2. Agriculture & aquaculture',
    '3. Energy production & mining',
    '4. Transportation & service corridors',
    '5. Biological resource use',
    '6. Human intrusions & disturbance',
    '7. Natural system modifications',
    '8. Invasive & other problematic species, genes & diseases',
    '9. Pollution',
    '10. Geological events',
    '11. Climate change & severe weather',
    '12. Other options'
]
// Find Max Value
let maxVal = 0; // initialize maxVal to negative infinity

for (let i = 0; i < Object.keys(data.children).length - 1; i++) {
  let currVal = data['children'][i+1]['value'];
  if (currVal > maxVal) {
    maxVal = currVal;
  }
}


// Create 
for (let i = 0; i < Object.keys(data.children).length; i++) {
  //console.log(doneData['children'][i+1]['value'])  
  if (i % numX === 0 ) {
        if (i !== 0){
        y = y+h;
        x = x0;};
    } else {
      x = x + w;
    }
    var rect = paper.rect(x, y, w, h);
    rect.attr({
        fill:"#fff"
      });
    let ni = doneData['children'][i+1]['value']
    let N = maxVal
    let Amax = w*h;
    let Amin = 10*10;
    let Ai = 0
    if (ni > 0){
      Ai = Amin + (ni-1)/(N-1)*(Amax-Amin)};
    //console.log(i+1, ni, Ai)
    let AiH = Math.sqrt(Ai)
    if (ni > 0){
      var innerRect = paper.rect(x+(w-AiH)/2,y+(h-AiH)/2,AiH,AiH)
    }else{
      var innerRect = paper.rect(x,y,AiH,AiH)
    }
    innerRect.attr({
        fill: colorList[i]
    });
    var text = paper.text(x + w / 2, y + h / 2,  headline[i]);
    text.attr({
        "font-size": 12,
        "font-family": "Arial",
        "fill": "#000"
    });
    var extraText = paper.text(x+w/2,y+h/2+12+2, "Number of Threats: " + String(data['children'][i+1]['value']));
    extraText.attr({
      "font-size": 12,
      "font-family": "Arial",
      "fill": "#000"
  });
  

  
  rect.hover(function(e){
    // get the position of the mouse relative to the canvas
    var mouseX = e.pageX - $("#canvas").offset().left;
    var mouseY = e.pageY - $("#canvas").offset().top;
    // create a white box to use as hover
    var hoverBox = paper.rect(mouseX, mouseY, 130, 20).attr({fill: "#fff"});
    // create a text element to show the tooltip
    var tooltipText = paper.text(mouseX + 5, mouseY + 10, "Number of Threats: " + String(data['children'][i+1]['value'])).attr({
      "font-size": 12,
      "font-family": "Arial",
      "fill": "#000",
      "text-anchor": "start"
    });
    // show the tooltip
    tooltipText.toFront();
    // remove the tooltip and hover box when mouse is moved away
    hoverBox.mouseout(function(){
      hoverBox.remove();
      tooltipText.remove();
    });
  });

  innerRect.hover(function(e){
    // get the position of the mouse relative to the canvas
    var mouseX = e.pageX - $("#canvas").offset().left;
    var mouseY = e.pageY - $("#canvas").offset().top;
    // create a white box to use as hover
    var hoverBox = paper.rect(mouseX, mouseY, 130, 20).attr({fill: "#fff"});
    // create a text element to show the tooltip
    var tooltipText = paper.text(mouseX + 5, mouseY + 10, "Number of Threats: " + String(data['children'][i+1]['value'])).attr({
      "font-size": 12,
      "font-family": "Arial",
      "fill": "#000",
      "text-anchor": "start"
    });
    // show the tooltip
    tooltipText.toFront();
    // remove the tooltip and hover box when mouse is moved away
    hoverBox.mouseout(function(){
      hoverBox.remove();
      tooltipText.remove();
    });
  });
  
  





  
  
  
  

    
};

};



const searchBar = document.getElementById('search-bar');
  const searchButton = document.getElementById('search-button');

  let searchText = '';

  searchBar.addEventListener('input', (event) => {
    searchText = event.target.value;
  });

  searchButton.addEventListener('click', () => {
    search(searchText);
  });

  searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      search(searchText);
    }
  });

  function search(text) {
    console.log(`Searching for "${text}"...`);
    // Add your search functionality here.
    let selectedWord = text; //Add Search Word
    doneData = createData(dataThreatTotal,dataThreatType,selectedWord);
    console.log(doneData);
    drawCanvas(doneData);
  };