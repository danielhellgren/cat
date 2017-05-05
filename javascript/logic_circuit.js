function docLoaded(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function indexPageLoaded() {
    initCircuit();
    initTutorial();
}

var myContextMenu;
var andGate;
var orGate;
var notGate;
var input;
var output;

function initCircuit() {
    /*
     console.log(document.getElementById("undoButton"));
     document.getElementById("undoButton").addEventListener("click", function(e,obj) {undoState(e,obj)});
     document.getElementById("redoButton").addEventListener("click", function() {});

     function undoState(e,obj,o) {
     e.diagram.commandHandler.undo();
     return o.diagram.commandHandler.canUndo();
     }
     */

    // Event listeners for triggering the context menu functions
    document.getElementById("copy").addEventListener("click", function() {menuHandle("copy")});
    document.getElementById("cut").addEventListener("click", function() {menuHandle("cut")});
    document.getElementById("paste").addEventListener("click", function() {menuHandle("paste")});
    document.getElementById("delete").addEventListener("click", function() {menuHandle("delete")});
    document.getElementById("undo").addEventListener("click", function() {menuHandle("undo")});
    document.getElementById("redo").addEventListener("click", function() {menuHandle("redo")});

    // Create empty diagram (this is the base)
    var MAKE = go.GraphObject.make;
    circuit =
        MAKE(go.Diagram, "logicDiagram", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                allowDrop: true, // Allowing nodes to be dropped on the diagram from menu
                initialAutoScale: go.Diagram.Uniform
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
                shadowOffset: new go.Point(0, 0),
                shadowBlur: 5,
                shadowColor: "blue"
            },
            MAKE(go.Shape,
                { name: "linkShape", strokeWidth: 4, stroke: "green", contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)}));

    // Code for implementing the context menu
    // Defining a context menu to the diagram
    circuit.contextMenu = MAKE(go.Adornment, go.Panel.Horizontal);

    // Responsible for managing the context menu functionality through contextMenuTool, automatically disables the browser's default context menu
    cxMenu = circuit.toolManager.contextMenuTool;

    var context = document.getElementById("contextMenu");
    context.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; }, false);
    context.addEventListener("blur", function() { cxMenu.stopTool(); }, false);

    var cutButton = document.getElementById("cut");
    var copyButton = document.getElementById("copy");
    var pasteButton = document.getElementById("paste");
    var deleteButton = document.getElementById("delete");
    var undoButton = document.getElementById("undo");
    var redoButton = document.getElementById("redo");

    // Function for displaying the context menu in the correct location (based on the cursor position)
    showContext = function(contextmenu, node) {
        // Get the last mouse click that occurred and its coordinate
        var mousePosition = this.diagram.lastInput.viewPoint;
        // Hide any other context menu (if existing)
        if (contextmenu !== this.currentContextMenu) {
            this.hideContextMenu();
        }
        // Check if clicking on an actual node or the background, and if there exist a section that can be pasted on the diagram
        // This allows for only displaying relevant buttons (or the context menu itself)
        if (node !== null || this.diagram.commandHandler.canPasteSelection() || this.diagram.commandHandler.canUndo() || this.diagram.commandHandler.canRedo()) {
            console.log(node);
            // If clicking on an existing node, the paste/undo/redo option should not be available
            if (node !== null) {
                cutButton.style.display = "block";
                copyButton.style.display = "block";
                pasteButton.style.display = "none";
                deleteButton.style.display = "block";
                undoButton.style.display = "none";
                redoButton.style.display = "none";
                // If clicking on the background, the paste/undo/redo option should be to only available option
            } else {
                cutButton.style.display = "none";
                copyButton.style.display = "none";
                deleteButton.style.display = "none";
                pasteButton.style.display = "block";
                undoButton.style.display = (this.diagram.commandHandler.canUndo()) ? "block" : "none";
                redoButton.style.display = (this.diagram.commandHandler.canRedo()) ? "block" : "none";
            }
            // Specifies where the context menu should be shown in the diagram
            context.style.display = "block";
            context.style.left = mousePosition.x + "px";
            context.style.top = mousePosition.y + "px";
        }
        this.currentContextMenu = contextmenu;
        // Save for displaying the context menu until user has made choice
        myContextMenu = this;
    };

    // Function for hiding the context menu
    hideContext = function() {
        if (this.currentContextMenu == null) return;
        context.style.display = "none";
        this.currentContextMenu = null;
        // Save for button interaction
        myContextMenu = null;
    };

    // Specifying the show/hide functions to the context menu class
    cxMenu.showContextMenu = showContext;
    cxMenu.hideContextMenu = hideContext;

    // Function for actually performing the context menu options when clicked
    function menuHandle(choice) {
        if (myContextMenu === null) return;
        var diagram = myContextMenu.diagram;
        switch(choice) {
            case "cut":
                diagram.commandHandler.cutSelection();
                break;
            case "copy":
                diagram.commandHandler.copySelection();
                break;
            case "paste":
                diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint);
                break;
            case "delete":
                diagram.commandHandler.deleteSelection();
                break;
            case "undo":
                diagram.commandHandler.undo();
                break;
            case "redo":
                diagram.commandHandler.redo();
                break;
        }
        myContextMenu.stopTool();
    }

    // Provide custom node appearances for all needed diagram objects
    // Used for specifying logical gates shape and IO

    andGate =
        MAKE(go.Node, "Spot",
            {   shadowBlur: 20,
                shadowColor: "black",
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                contextMenu: MAKE(go.Adornment, go.Panel.Horizontal),
            },
            new go.Binding("isShadowed", "isSelected").ofObject(),
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            MAKE(go.Shape, "AndGate",
                {   fill: "lightgray",
                    stroke: "black",
                    strokeWidth: 3,
                    name: "nodeShape"
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
                    alignment: new go.Spot(0, 0.25),
                    toMaxLinks: 1,
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
                    toMaxLinks: 1,
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
                    name: "nodeShape"
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
                    name: "nodeShape"
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
                    strokeWidth: 3
                }
            ),
            MAKE(go.Shape, "Circle",
                {   fill: "green",
                    desiredSize: new go.Size(75,75),
                    name: "nodeShape"
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
                    strokeWidth: 3
                }
            ),
            MAKE(go.Shape, "Circle",
                {   fill: "green",
                    desiredSize: new go.Size(75,75),
                    name: "nodeShape"
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

    var menuMap = new go.Map("string", go.Node);

    menuMap.add("andgate", andGate);
    menuMap.add("notgate", notGate);
    menuMap.add("orgate", orGate);
    menuMap.add("input", input);
    menuMap.add("output", output);

    circuit.nodeTemplateMap = menuMap;

    // "Side menus" for displaying all circuit objects (logic gates and IO)

    gateMenu =
        MAKE(go.Palette, "gateMenu",
            { // share the templates with the main Diagram
                nodeTemplateMap: menuMap,
                layout: MAKE(go.GridLayout)
            });

    ioMenu =
        MAKE(go.Palette, "ioMenu",
            { // share the templates with the main Diagram
                nodeTemplateMap: menuMap,
                layout: MAKE(go.GridLayout)
            });

    //gateMenu.nodeTemplateMap = menuMap;
    //ioMenu.nodeTemplateMap = menuMap;

    // Adding the logic gate templates to the logic gate menu
    gateMenu.model = new go.GraphLinksModel([
        {category: "andgate"},
        {category: "notgate"},
        {category: "orgate"}
    ]);

    // Adding the input/output templates to the IO menu
    ioMenu.model = new go.GraphLinksModel([
        {category: "input"},
        {category: "output"}
    ]);

    // jQuery accordion for the side menus
    jQuery("#accordion").accordion({
        activate: function(event, ui) {
            gateMenu.requestUpdate();
            ioMenu.requestUpdate();
        },
        heightStyle: "content"
    });

    function inputState(e, node) {
        // Wrapping the state change in a transaction for undo/redo
        e.diagram.startTransaction("setInputState");
        // Search for input object with name property "nodeShape" and returns that object, making it possible to update its fill color
        console.log(node.findObject("nodeShape").fill);
        node.findObject("nodeShape").fill = (node.findObject("nodeShape").fill == "#00ff00") ? "green" : "#00ff00";
        // Since an input's state may have changed (indicated by a color change) it's necessary to update all nodes/links
        update();
        console.log("Input state updated!");
        console.log(node.findObject("nodeShape").fill);
        // Closing transaction
        e.diagram.commitTransaction("setInputState");
    }

    // Updating circuit state
    continueUpdate();
}

// Making sure the diagram is updated constantly (right now every 100 millisecond)
function continueUpdate() {
    setTimeout(function() { update(); continueUpdate(); }, 100);
    console.log("Updating");
}

// These are just auxiliary functions to update all gates and IO based on the color of the links
// "green" indicates a low signal (0) and "#00ff00" (light green) indicates a high signal (1)

function inputUpdate(node) {
    setOutputLinks(node, node.findObject("nodeShape").fill);
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
    node.linksConnected.each(function(link) { node.findObject("nodeShape").fill = link.findObject("linkShape").stroke; });
}

function linkIsTrue(link) {  // assume the given Link has a Shape named "linkShape"
    return link.findObject("linkShape").stroke === "#00ff00";
}

function setOutputLinks(node, color) {
    node.findLinksOutOf().each(function(link) {link.findObject("linkShape").stroke = color; });
}

// Updates all nodes and links in the circuit diagram (update dependent on node type and input values)
function update() {
    // Start with updating all inputs (as these are the ones setting the state in the circuit)
    var allDiagrams = [circuit, ANDtutorial, ORtutorial, NOTtutorial];
    allDiagrams.forEach(function (index) {
    index.nodes.each(function(node) {
        if (node.category == "input") {
            inputUpdate(node);
        }
    });
    // Continue with updating all other nodes (gates and outputs)
    index.nodes.each(function(node) {
        switch (node.category) {
            case "andgate":
                andUpdate(node);
                break;
            case "orgate":
                orUpdate(node);
                break;
            case "notgate":
                notUpdate(node);
                break;
            case "output":
                outputUpdate(node);
                break;
            case "input":
                break;  // doInput already called, above
        }
    });})
}