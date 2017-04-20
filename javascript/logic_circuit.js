function docLoaded(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function indexPageLoaded() {
    init();
}

function init() {

    // Event listeners for side menu buttons
    //console.log(document.getElementById("undoButton"));
    //document.getElementById("undoButton").addEventListener("click", function(e,obj) {undoState(e,obj)});
    //document.getElementById("redoButton").addEventListener("click", function() {});

    /*
    function undoState(e,obj,o) {
        e.diagram.commandHandler.undo();
        return o.diagram.commandHandler.canUndo();
    }
    */

    // Create empty diagram
    var MAKE = go.GraphObject.make;
    circuit =
        MAKE(go.Diagram, "logicDiagram", // Specify the diagram by using the div's ID
            {
                initialContentAlignment: go.Spot.Center, // center content in diagram
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                allowDrop: true // Allowing nodes to be dropped on the diagram from menu
            });

    //circuit.model = MAKE(go.Model);
    //circuit.nodeDataArray = [];

    circuit.model =
        MAKE(go.GraphLinksModel,
            {
                linkFromPortIdProperty: "fromPort",
                linkToPortIdProperty: "toPort",
                nodeDataArray: [], // no preset for nodes
                linkDataArray: [] // no preset for links between nodes
            }
        );

    // Making it possible to draw links between the logic gates and IO
    circuit.linkTemplate =
        MAKE(go.Link,
            {
                routing: go.Link.AvoidsNodes, // Links should not overlap nodes
                curve: go.Link.JumpOver, // New links will "jump over" existing links
                corner: 3, // The "sharpness" of link corners
                relinkableFrom: true, relinkableTo: true,
                shadowOffset: new go.Point(0, 0), shadowBlur: 5, shadowColor: "blue"
            },
            MAKE(go.Shape,
                { name: "linkShape", strokeWidth: 4, stroke: "green" }));

    // Provide custom node appearances for all needed diagram objects
    // Used for specifying logical gates shape and IO

    var andGate =
        MAKE(go.Node, "Spot",
            {shadowBlur: 20, shadowColor: "black",  selectionAdorned: false, shadowOffset: new go.Point(0, 0)},
            new go.Binding("isShadowed", "isSelected").ofObject(),
            MAKE(go.Shape, "AndGate",
                {fill: "lightgray", stroke: "black", strokeWidth: 3, name: "NODESHAPE"}
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: false,
                    toSpot: go.Spot.Left,
                    toLinkable: true,
                    portId: "Input1",
                    alignment: new go.Spot(0, 0.25),
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
                    alignment: new go.Spot(0, 0.75),
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
                    toMaxLinks: 1,
                    cursor: "pointer"
                }
            )
        );

    var notGate =
        MAKE(go.Node, "Spot",
            {shadowBlur: 20, shadowColor: "black",  selectionAdorned: false, shadowOffset: new go.Point(0, 0)},
            new go.Binding("isShadowed", "isSelected").ofObject(),
            MAKE(go.Shape, "Inverter",
                {fill: "lightgray", stroke: "black", strokeWidth: 3, name: "NODESHAPE"}
            ),
            MAKE(go.Shape, "Rectangle",
                {fill: "black",
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

    var orGate =
        MAKE(go.Node, "Spot",
            {shadowBlur: 20, shadowColor: "black",  selectionAdorned: false, shadowOffset: new go.Point(0, 0)},
            new go.Binding("isShadowed", "isSelected").ofObject(),
            MAKE(go.Shape, "OrGate",
                {fill: "lightgray", stroke: "black", strokeWidth: 3, name: "NODESHAPE"}
            ),
            MAKE(go.Shape, "Rectangle",
                {fill: "black",
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
                {fill: "black",
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

    var input =
        MAKE(go.Node, "Spot",
            {shadowBlur: 20, shadowColor: "black",  selectionAdorned: false, shadowOffset: new go.Point(0, 0)},
            new go.Binding("isShadowed", "isSelected").ofObject(),
            MAKE(go.Shape, "Rectangle",
                {fill: "lightgray", stroke: "black", strokeWidth: 3}
            ),
            MAKE(go.Shape, "Circle",
                {fill: "green", desiredSize: new go.Size(75,75), name: "NODESHAPE"}
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
            {doubleClick: function (e, obj) {inputState(e, obj)}}
        );

    var output =
        MAKE(go.Node, "Spot",
            {shadowBlur: 20, shadowColor: "black",  selectionAdorned: false, shadowOffset: new go.Point(0, 0)},
            new go.Binding("isShadowed", "isSelected").ofObject(),
            MAKE(go.Shape, "Circle",
                {fill: "lightgray", stroke: "black", strokeWidth: 3}
            ),
            MAKE(go.Shape, "Circle",
                {fill: "green", desiredSize: new go.Size(75,75), name: "NODESHAPE"}
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


    function inputState(e, node) {
        // Wrapping the state change in a transaction for undo/redo
        e.diagram.startTransaction("setInputState");
        // Search for input object with name property "NODESHAPE" and returns that object, making it possible to update its fill color
        console.log(node.findObject("NODESHAPE").fill);
        node.findObject("NODESHAPE").fill = (node.findObject("NODESHAPE").fill == "#00ff00") ? "green" : "#00ff00";
        // Since an input's state may have changed (indicated by a color change) it's necessary to update all nodes/links
        update();
        console.log("Input state updated!");
        console.log(node.findObject("NODESHAPE").fill);
        // Closing transaction
        e.diagram.commitTransaction("setInputState");
    }

    var menuMap = new go.Map("string", go.Node);

    menuMap.add("andgate", andGate);
    menuMap.add("notgate", notGate);
    menuMap.add("orgate", orGate);
    menuMap.add("input", input);
    menuMap.add("output", output);

    circuit.nodeTemplateMap = menuMap;

    // "Side menu" for displaying all circuit objects (logic gates and IO)
    var gateMenu = new go.Palette("gateMenu");
    var ioMenu = new go.Palette("ioMenu");

    gateMenu.nodeTemplateMap = menuMap;
    ioMenu.nodeTemplateMap = menuMap;

    // Adding the logic gate templates to the logic gate menu
    gateMenu.model.nodeDataArray = [
        {category: "andgate"},
        {category: "notgate"},
        {category: "orgate"}
    ];
    // Adding the input/output templates to the IO menu
    ioMenu.model.nodeDataArray = [
        {category: "input"},
        {category: "output"}
    ];

    loop();
}

// Making sure the diagram is updated (right now every 100 millisecond)
function loop() {
    setTimeout(function() { update(); loop(); }, 100);
    console.log("Updating");
}

// These functions just update all gates and IO based on the color of the links
// "Green" indicates a low signal (0) and "#00ff00" indicates a high signal (1)

function inputUpdate(node) {
    setOutputLinks(node, node.findObject("NODESHAPE").fill);
}

function andUpdate(node) {
    var color = node.findLinksInto().all(linkIsTrue) ? "#00ff00" : "green";
    setOutputLinks(node, color);
}

function notUpdate(node) {
    var color = !node.findLinksInto().all(linkIsTrue) ? "#00ff00": "green";
    setOutputLinks(node, color);
}

function orUpdate(node) {
    var color = node.findLinksInto().any(linkIsTrue) ? "#00ff00" : "green";
    setOutputLinks(node, color);
}

function outputUpdate(node) {
    node.linksConnected.each(function(link) { node.findObject("NODESHAPE").fill = link.findObject("linkShape").stroke; });
}

function linkIsTrue(link) {  // assume the given Link has a Shape named "linkShape"
    return link.findObject("linkShape").stroke === "#00ff00";
}

function setOutputLinks(node, color) {
    node.findLinksOutOf().each(function(link) {link.findObject("linkShape").stroke = color; });
}

// Updates all nodes and links in the circuit diagram (update dependent on node type and input values)
function update() {
    // For remembering the UndoManager value
    var currentUndoManager = circuit.skipsUndoManager;
    // Temporarily turn off UndoManager recording of changed events
    circuit.skipsUndoManager = true;
    // Updating all input nodes in the diagram
    circuit.nodes.each(function(node) {
        if (node.category == "input") {
            inputUpdate(node);
        }
    });
    // now we can do all other kinds of nodes
    circuit.nodes.each(function(node) {
        switch (node.category) {
            case "andgate":       andUpdate(node); break;
            case "orgate":         orUpdate(node); break;
            case "notgate":       notUpdate(node); break;
            case "output": outputUpdate(node); break;
            case "input": break;  // doInput already called, above
        }
    });
    // Setting UndoManager back to initial value
    circuit.skipsUndoManager = currentUndoManager;
}
