// This file defines the logic circuit tutorials on the page
// Most of the code is very similar to logic_circuit.js

var ANDtutorial;
var NOTtutorial;
var ORtutorial;

// Main function for running and setting up the circuit tutorials, initiated when whole DOM has been loaded.
// The set up functions are similar to the set up in logic_curcuit.js
function initTutorial() {

    // This part sets up the circuit simulator as an interactive diagram
    // created with the GoJS library (http://gojs.net/latest/index.html)
    // by first creating an empty Diagram along with a Model.

    // GoJS has a model-view architecture, meaning that the Model stores
    // the actual node/link data (e.g. shape, color and position) as arrays
    // of JavaScript objects, while the diagram only visualizes the data
    // stored in the Model as actual Node (the logic gates) and
    // Link (connections between the logical gates) objects.

    var MAKE = go.GraphObject.make;  // Used for creating GoJS objects

    // This is the "standard" way of creating a GoJS Diagram/Model,
    // and the basic code structure has been taken from the "Get Started" page at https://gojs.net/latest/learn/index.html.

    // Initializes the Diagram, which is used as a view for visualizing data using Node an Link objects
    tutorialAND =
        MAKE(go.Diagram, "ANDtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                autoScale: go.Diagram.Uniform, // Scales the nodes automatically to fit the diagram size
                contentAlignment: go.Spot.Center, // Center content
                isReadOnly: true, // Not possible for user to change the nodes position
                // No scrolling allowed (since it is not needed)
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });
    // Initializes the Diagram, which is used as a view for visualizing data using Node an Link objects
    tutorialOR =
        MAKE(go.Diagram, "ORtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                autoScale: go.Diagram.Uniform, // Scales the nodes automatically to fit the diagram size
                contentAlignment: go.Spot.Center, // Center content
                isReadOnly: true, // Not possible for user to change the nodes position
                // No scrolling allowed (since it is not needed)
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });
    // Initializes the Diagram, which is used as a view for visualizing data using Node an Link objects
    tutorialNOT =
        MAKE(go.Diagram, "NOTtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                autoScale: go.Diagram.Uniform, // Scales the nodes automatically to fit the diagram size
                contentAlignment: go.Spot.Center, // Center content
                isReadOnly: true, // Not possible for user to change the nodes position
                // No scrolling allowed (since it is not needed)
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });

    // Making it possible to draw links between the logic gates.
    // The link template specifies the style of the links between the nodes.
    tutorialAND.linkTemplate = tutorialNOT.linkTemplate = tutorialOR.linkTemplate =
        MAKE(go.Link,
            {
                routing: go.Link.AvoidsNodes, // Links should not overlap nodes
                curve: go.Link.JumpOver, // New links will "jump over" existing links
                corner: 3, // The "sharpness" of link corners
                relinkableFrom: true, // Allows for user to reconnect an existing link at the "from" end
                relinkableTo: true, // Allows for user to reconnect an existing link at the "to" end
                shadowOffset: new go.Point(0, 0),
                shadowBlur: 5,
                shadowColor: "blue"
            },
            // Used for changing the shape of the links, the default link stroke is solid black.
            // Also allows for displaying the context menu when right-clicking on a link.
            MAKE(go.Shape,
                { name: "linkShape", strokeWidth: 4, stroke: "green", contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)}));

    // This part provides custom node appearances for all needed Diagram objects.
    // Used for specifying logical gates shape and IO.
    // The basic code structure for creating these custom nodes are based on the Node introduction page
    // (http://gojs.net/latest/intro/nodes.html)

    // All of the nodes have more or less the same information (but with different values), so documentation is only
    // given to the first node (the AND gate) to avoid redundant documentation.

    andGate =
        // This specifies the base info about the node, namely its shadow layout including color and offset values.
        // These values are the same for all the nodes in the circuit simulator.
        MAKE(go.Node, "Spot",
            {   shadowBlur: 20,
                shadowColor: "black",
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                contextMenu: MAKE(go.Adornment, go.Panel.Horizontal),
            },
            // The GoJS Binding class extracts a value from a source object and sets that value on a property on a target object.
            // Here the isShadowed property is set to the value of isSelected (which is either true or false),
            // meaning that the node is only displaying the shadow effect when it is also selected.
            new go.Binding("isShadowed", "isSelected").ofObject(),
            // This specifies a specific location of where in the diagram the node should be placed.
            // This is only used in the gate tutorials found in the circuit_tutorial.js file.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // This specifies the specific gate shape and stroke styles, an AND gate in this case
            MAKE(go.Shape, "AndGate",
                {   fill: "lightgray",
                    stroke: "black",
                    strokeWidth: 3,
                    name: "nodeShape",
                    mouseEnter: showInfo, // Show help info DIV when hovering over a node
                    mouseLeave: hideInfo // Hide help info DIV when no longer hovering over a node
                }
            ),
            // Input 1
            // This specifies the layout and style of one of the gate's input link points
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8), // Sets the size of the input link point
                    fromLinkable: false, // This is an input, so should not be possible to link FROM this link point
                    toSpot: go.Spot.Left, // All links coming to this input connects at the left side of the link point
                    toLinkable: true, // This is an input, so should only be possible to link TO this link point
                    portId: "Input1",
                    alignment: new go.Spot(0, 0.25), // Specifies the position based on the complete node size
                    toMaxLinks: 1,
                    cursor: "pointer"
                }
            ),
            // Input 2
            // This specifies the layout and style of one of the gate's input link points
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8), // Sets the size of the input link point
                    fromLinkable: false, // This is an input, so should not be possible to link FROM this link point
                    toSpot: go.Spot.Left, // All links coming to this input connects at the left side of the link point
                    toLinkable: true, // This is an input, so should only be possible to link TO this link point
                    portId: "Input1",
                    alignment: new go.Spot(0, 0.75), // Specifies the position based on the complete node size
                    toMaxLinks: 1,
                    cursor: "pointer"
                }
            ),
            // Output
            // This specifies the layout and style of the gate's output link point
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8), // Sets the size of the input link point
                    fromSpot: go.Spot.Right, // All links coming from this output connects at the right side of the link point
                    fromLinkable: true, // This is an output, so should only be possible to link FROM this link point
                    toLinkable: false, // This is an output, so should noy be possible to link TO this link point
                    portId: "Output",
                    alignment: new go.Spot(1, 0.5),  // Specifies the position based on the complete node size
                    toMaxLinks: 1,
                    cursor: "pointer"
                }
            )
        );

    notGate =
        MAKE(go.Node, "Spot",
            {   shadowBlur: 20,
                shadowColor: "black",
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)
            },
            new go.Binding("isShadowed", "isSelected").ofObject(),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            MAKE(go.Shape, "Inverter",
                {   fill: "lightgray",
                    stroke: "black",
                    strokeWidth: 3,
                    name: "nodeShape",
                    mouseEnter: showInfo,
                    mouseLeave: hideInfo
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: false,
                    toSpot: go.Spot.Left,
                    toLinkable: true,
                    portId: "Input",
                    alignment: new go.Spot(0, 0.5),
                    cursor: "pointer"
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: true,
                    toSpot: go.Spot.Left,
                    toLinkable: false,
                    portId: "Output",
                    alignment: new go.Spot(1, 0.5),
                    cursor: "pointer"
                }
            )
        );

    orGate =
        MAKE(go.Node, "Spot",
            {   shadowBlur: 20,
                shadowColor: "black",
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)
            },
            new go.Binding("isShadowed", "isSelected").ofObject(),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            MAKE(go.Shape, "OrGate",
                {   fill: "lightgray",
                    stroke: "black",
                    strokeWidth: 3,
                    name: "nodeShape",
                    mouseEnter: showInfo,
                    mouseLeave: hideInfo
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: false,
                    toSpot: go.Spot.Left,
                    toLinkable: true,
                    portId: "Input1",
                    alignment: new go.Spot(0.17, 0.3),
                    cursor: "pointer"
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: false,
                    toSpot: go.Spot.Left,
                    toLinkable: true,
                    portId: "Input2",
                    alignment: new go.Spot(0.17, 0.7),
                    cursor: "pointer"
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: true,
                    toSpot: go.Spot.Left,
                    toLinkable: false,
                    portId: "Output",
                    alignment: new go.Spot(1, 0.5),
                    cursor: "pointer"
                }
            )
        );

    input =
        MAKE(go.Node, "Spot",
            {   shadowBlur: 20,
                shadowColor: "black",
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)
            },
            new go.Binding("isShadowed", "isSelected").ofObject(),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            MAKE(go.Shape, "Rectangle",
                {   fill: "lightgray",
                    stroke: "black",
                    strokeWidth: 3,
                    name: "nodeShape",
                    mouseEnter: showInfo,
                    mouseLeave: hideInfo
                }
            ),
            MAKE(go.Shape, "Circle",
                {   fill: "green",
                    desiredSize: new go.Size(75,75),
                    name: "inputShape"
                }
            ),
            MAKE(go.TextBlock,
                {textAlign: "center"}
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: true,
                    toSpot: go.Spot.Left,
                    toLinkable: false,
                    portId: "Input",
                    alignment: new go.Spot(1, 0.5),
                    cursor: "pointer"
                }
            ),
            // The input state can be toggled by the user, which is done with a double click
            {doubleClick: function (e, obj) {inputState(e, obj)}}
        );

    output =
        MAKE(go.Node, "Spot",
            {   shadowBlur: 20,
                shadowColor: "black",
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)
            },
            new go.Binding("isShadowed", "isSelected").ofObject(),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            MAKE(go.Shape, "Circle",
                {   fill: "lightgray",
                    stroke: "black",
                    strokeWidth: 3,
                    name: "nodeShape",
                    mouseEnter: showInfo,
                    mouseLeave: hideInfo
                }
            ),
            MAKE(go.Shape, "Circle",
                {   fill: "green",
                    desiredSize: new go.Size(75,75),
                    name: "outputShape"
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: false,
                    toSpot: go.Spot.Left,
                    toLinkable: true,
                    portId: "Output",
                    alignment: new go.Spot(0, 0.5),
                    cursor: "pointer"
                }
            )
        );


    ANDtutorial = tutorialAND;
    NOTtutorial = tutorialNOT;
    ORtutorial = tutorialOR;

    // Creates an empty collection, called a Map in GoJS, of key/value pairs.
    // The keys are strings and the values are Node objects.
    var menuMap = new go.Map("string", go.Node);

    // Adds key/value pairs to the map consisting of all the Node objects and a string name
    menuMap.add("andgate", andGate);
    menuMap.add("notgate", notGate);
    menuMap.add("orgate", orGate);
    menuMap.add("input", input);
    menuMap.add("output", output);

    // Creates a node template from the Map with all the Node objects.
    // This makes it possible to add the Node objects to the Model.
    ANDtutorial.nodeTemplateMap = menuMap;
    NOTtutorial.nodeTemplateMap = menuMap;
    ORtutorial.nodeTemplateMap = menuMap;

    loadTutorials();
}

// Used for displaying the help text when hovering over nodes in the diagram
// Specifies which diagram that is used
function showInfo (inputEvent, graphObject) {
    var i; // Used for specifying the active Diagram
    // Find the active diagram (where the cursor currently is positioned)
    var activeDiagram = inputEvent.diagram.div.id;
    // The i variable is set to a specific value depending on the active diagram, in order to save this info
    switch (activeDiagram) {
        case "ANDtutorial":
            i = 0;
            break;
        case "ORtutorial":
            i = 1;
            break;
        case "NOTtutorial":
            i = 2;
            break;
    }
    // Check if user is hovering over an actual node in the diagram
    if (graphObject !== null) {
        var node = graphObject.part; // Get the current node data
        var e = inputEvent.diagram.lastInput; // Determines where the mouse pointer was most recently located
        // Debugging prints
        console.log(inputEvent.diagram.div.id);
        console.log(inputEvent.diagram);
        console.log(e);
        var shape = node.findObject("nodeShape"); // Find the object with name "nodeShape" in the node data
        // Change the object's appearance to indicate that it is hovered over
        shape.stroke = "gray";
        node.isShadowed = true;
        node.shadowOffset = new go.Point(0, 0);
        // Call the function that updates the info text based on the pointers location, the node info, and the active diagram.
        updateInfoBox(e.viewPoint, node.data, i);
        // Show the info text
        document.getElementsByClassName("infoContainer")[i].style.display = "block";
    }
    else {
        document.getElementsByClassName("infoContainer")[i].innerHTML = "";
    }
}

// Hides the node info when no longer hovering over it
function hideInfo (inputEvent, graphObject) {
    graphObject.part.findObject("nodeShape").stroke = "black";
    graphObject.part.isShadowed = false;
    // Hide all possible info containers
    document.getElementsByClassName("infoContainer")[0].style.display = "none";
    document.getElementsByClassName("infoContainer")[1].style.display = "none";
    document.getElementsByClassName("infoContainer")[2].style.display = "none";
}

// Sets the info text based on the node that is selected
// Also specifies the position of where the text info div is placed in regards of the mouse position
function updateInfoBox(mousePt, data, i) {
    // Get the correct DIV based on the active diagram indicated by the number i
    var boxContainer = document.getElementsByClassName("infoContainer")[i];
    boxContainer.innerHTML = "";
    // Create new div to display the text in
    var infoBox = document.createElement("div");
    infoBox.id = "infoBox";
    boxContainer.appendChild(infoBox);
    var content = document.createElement("div");
    // Based on the hovered node, the correct text will be appended
    switch(data.category) {
        case "andgate":
            content.textContent = "AND gate";
            break;
        case "orgate":
            content.textContent = "OR gate";
            break;
        case "notgate":
            content.textContent = "NOT gate";
            break;
        case "input":
            content.textContent = "Input";
            break;
        case "output":
            content.textContent = "Output";
            break;
    }
    // Append the final text to the info box
    infoBox.appendChild(content);
    // The info box will be displayed with a small offset in regards of the current mouse position
    boxContainer.style.left = mousePt.x + 30 + "px";
    boxContainer.style.top = mousePt.y + 30 + "px";
}

// Sets up the tutorial circuits by loading the pre-defined JSON models to each diagram
function loadTutorials() {
    // Use the JSON template as the Diagram's Model
    ANDtutorial.model = go.Model.fromJson(ANDtemplate);
    // Specifies where a link comes from and where it is going to
    ANDtutorial.model.linkFromPortIdProperty = "fromPort";
    ANDtutorial.model.linkToPortIdProperty = "toPort";
    ANDtutorial.zoomToFit();

    // Use the JSON template as the Diagram's Model
    NOTtutorial.model = go.Model.fromJson(NOTtemplate);
    // Specifies where a link comes from and where it is going to
    NOTtutorial.model.linkFromPortIdProperty = "fromPort";
    NOTtutorial.model.linkToPortIdProperty = "toPort";
    NOTtutorial.zoomToFit();

    // Use the JSON template as the Diagram's Model
    ORtutorial.model = go.Model.fromJson(ORtemplate);
    // Specifies where a link comes from and where it is going to
    ORtutorial.model.linkFromPortIdProperty = "fromPort";
    ORtutorial.model.linkToPortIdProperty = "toPort";
    ORtutorial.zoomToFit();
}

// Here are the JSON models used for each tutorial

var ANDtemplate = {
    "nodeDataArray": [
        {"category":"input", "key":"in1", "loc":"0 0"},
        {"category":"input", "key":"in2", "loc":"0 150"},
        {"category":"andgate", "key":"and", "loc": "150 75"},
        {"category":"output", "key":"out", "loc":"300 75"}
    ],
    "linkDataArray": [
        {"from": "in1", "fromPort":"Input", "to": "and", "toPort":"Input1"},
        {"from": "in2", "fromPort":"Input", "to": "and", "toPort":"Input2"},
        {"from": "and", "fromPort":"Output", "to": "out", "toPort":"Output"}
    ]
};

var ORtemplate = {
    "nodeDataArray": [
        {"category":"input", "key":"in1", "loc":"0 0"},
        {"category":"input", "key":"in2", "loc":"0 150"},
        {"category":"orgate", "key":"or", "loc": "150 75"},
        {"category":"output", "key":"out", "loc":"300 75"}
    ],
    "linkDataArray": [
        {"from": "in1", "fromPort":"Input", "to": "or", "toPort":"Input1"},
        {"from": "in2", "fromPort":"Input", "to": "or", "toPort":"Input2"},
        {"from": "or", "fromPort":"Output", "to": "out", "toPort":"Output"}
    ]
};

var NOTtemplate = {
    "nodeDataArray": [
        {"category":"input", "key":"in", "loc":"0 75"},
        {"category":"notgate", "key":"not", "loc": "150 75"},
        {"category":"output", "key":"out", "loc":"300 75"}
    ],
    "linkDataArray": [
        {"from": "in", "fromPort":"Input", "to": "not", "toPort":"Input"},
        {"from": "not", "fromPort":"Output", "to": "out", "toPort":"Output"}
    ]
};