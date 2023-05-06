// create a Raphael paper object
var paper = Raphael("canvas", 400, 400);

// create a rectangle
var rect = paper.rect(100, 100, 200, 100);

// set rectangle attributes
rect.attr({
    fill: "#f00",
    stroke: "#000",
    "stroke-width": 2
});

// create text box
var text = paper.text(0, 0, "test");
text.hide();

// add hover effect
rect.hover(
    // function to execute when the mouse enters the rectangle
    function(event) {
        // set rectangle attributes when mouse enters
        this.attr({
            fill: "#0f0",
            cursor: "pointer"
        });
        
        // set position of text box
        text.attr({
            x: event.pageX,
            y: event.pageY
        }).show();
    },
    // function to execute when the mouse leaves the rectangle
    function() {
        // set rectangle attributes when mouse leaves
        this.attr({
            fill: "#f00"
        });
        
        // hide text box
        text.hide();
    }
);

// update position of text box as mouse moves
paper.mousemove(function(event) {
    if (text.visible) {
        text.attr({
            x: event.pageX,
            y: event.pageY
        });
    }
});
