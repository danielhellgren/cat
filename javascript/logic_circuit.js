// This file defines the logic circuit simulator

// Making sure whole DOM is properly initiated
function docLoaded(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// Runs when page is loaded
function indexPageLoaded() {
    // Sets up the main circuit simulator tool
    initCircuit();
    // Sets up the test tutorials for AND, OR and NOT gate. This function is defined in circuit_tutorial.js
    initTutorial();
}

var toolMenu;

// Main function for running and setting up the circuit simulator tool
function initCircuit() {

    // Initiating general event listeners

    // Event listeners for triggering the context menu functions.
    // This context menu is shown when right-clicking in the circuit simulator tool for providing editing functions.
    document.getElementById("copy").addEventListener("click", function() {menuHandle("copy")});
    document.getElementById("cut").addEventListener("click", function() {menuHandle("cut")});
    document.getElementById("paste").addEventListener("click", function() {menuHandle("paste")});
    document.getElementById("delete").addEventListener("click", function() {menuHandle("delete")});
    document.getElementById("undo").addEventListener("click", function() {menuHandle("undo")});
    document.getElementById("redo").addEventListener("click", function() {menuHandle("redo")});

    // Event listener for managing the hamburger icon and the menu it provides when clicking on it.
    // This hamburger icon/menu is only available on the mobile version of the site.
    document.getElementById("mobile-menu").addEventListener("click", function() {
        this.classList.toggle("change"); // Indicates that the hamburger icon has been pressed and should be animated (done with CSS based on the "change" class name)
        var dropdown = document.getElementById("dropdown");
        dropdown.classList.toggle("show"); // Indicates that the menu should be displayed (done with CSS based on the "show" class name)
        // Actually show the mobile menu only when the hamburger menu icon has been pressed
        if (dropdown.classList.contains("show")) {
            console.log(document.getElementsByClassName("content")[0]);
            // Correctly displays the darker shade of the background when the menu is shown
            document.getElementsByClassName("content")[0].style.zIndex = "-1";
            document.getElementById("content-cover").style.display = "inline-block";
            document.getElementById("content-cover").style.zIndex = "-1";
        }
        // Hide the mobile menu when the finished animated hamburger icon (now an icon with a cross/"X" shape) has been pressed
        else {
            document.getElementsByClassName("content")[0].style.zIndex = "";
            document.getElementById("content-cover").style.display = "none";
        }
    });

    // This part sets up the circuit simulator as an interactive diagram
    // created with the GoJS library (http://gojs.net/latest/index.html)
    // by first creating an empty Diagram along with a Model.

    // GoJS has a model-view architecture, meaning that the Model stores
    // the actual node/link data (e.g. shape, color and position) as arrays
    // of JavaScript objects, while the diagram only visualizes the data
    // stored in the Model as actual Node (the logic gates) and
    // Link (connections between the logical gates) objects.

    var MAKE = go.GraphObject.make; // Used for creating GoJS objects

    // This is the "standard" way of creating a GoJS Diagram/Model,
    // and the basic code structure has been taken from the "Get Started" page at https://gojs.net/latest/learn/index.html.

    // Initializes the Diagram, which is used as a view for visualizing data using Node an Link objects
    circuit =
        MAKE(go.Diagram, "logicDiagram", // Specify the diagram to be created by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                allowDrop: true, // Allowing nodes to be dropped on the diagram
                autoScale: go.Diagram.Uniform // Scale nodes to fit the current display size
            });

    // Initializes the Model, which stores the actual data (as arrays of JavaScript objects) of nodes/links
    circuit.model =
        MAKE(go.GraphLinksModel,
            {
                // Specifies where a link comes from and where it is going to
                linkFromPortIdProperty: "fromPort",
                linkToPortIdProperty: "toPort",
                nodeDataArray: [], // Used for storing the initial data of nodes, an empty array indicates no nodes
                linkDataArray: [] // Used for storing the initial links between nodes, an empty array indicates no links
            }
        );

    // Making it possible to draw links between the logic gates.
    // The link template specifies the style of the links between the nodes.
    circuit.linkTemplate =
        MAKE(go.Link,
            {
                routing: go.Link.AvoidsNodes, // Links should not overlap nodes
                curve: go.Link.JumpOver, // New links will "jump over" existing links
                corner: 3, // The "sharpness" of link corners
                relinkableFrom: true, // Allows for user to reconnect an existing link at the "from" end
                relinkableTo: true, // Allows for user to reconnect an existing link at the "to" end
                // Shadow layout/style for the links
                shadowOffset: new go.Point(0, 0),
                shadowBlur: 5,
                shadowColor: "blue"
            },
            // Used for changing the shape of the links, the default link stroke is solid black.
            // Also allows for displaying the context menu when right-clicking on a link.
            MAKE(go.Shape,
                { name: "linkShape", strokeWidth: 4, stroke: "green", contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)}));

    // Code for implementing the context menu when right-clicking in the simulator tool, providing editing functions

    // Defines a context menu to the diagram.
    // The context menu consists of an Adornment object (often used when the object is only shown as a result
    // of a specific event, like a right-click in this case), and a Panel element (which can hold other objects as its elements).
    circuit.contextMenu = MAKE(go.Adornment, go.Panel.Horizontal);

    // Responsible for managing the context menu functionality through contextMenuTool,
    // this automatically disables the browser's default context menu when right-clicking inside the diagram.
    cxMenu = circuit.toolManager.contextMenuTool;

    var context = document.getElementById("contextMenu");
    // Prevents the browser's standard context menu from appearing upon right-click in the circuit simulator
    context.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; }, false);

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
        // Check if clicking on an actual node in the Diagram or just the background,
        // and whether or not there exist a section that can be pasted on the diagram.
        // This allows for only displaying relevant buttons (or the context menu itself)
        if (node !== null || this.diagram.commandHandler.canPasteSelection() || this.diagram.commandHandler.canUndo() || this.diagram.commandHandler.canRedo()) {
            console.log(node);
            // If clicking on an existing node, the paste/undo/redo option should not be available
            if (node !== null) {
                cutButton.style.display = "block";
                copyButton.style.display = "block";
                pasteButton.style.display = "none"; // Not showing
                deleteButton.style.display = "block";
                undoButton.style.display = "none"; // Not showing
                redoButton.style.display = "none"; // Not showing
                // If clicking on the background, the paste/undo/redo option should instead be the only available options
            } else {
                cutButton.style.display = "none"; // Not showing
                copyButton.style.display = "none"; // Not showing
                deleteButton.style.display = "none"; // Not showing
                pasteButton.style.display = "block";
                // Undo should only be displayed if there are actions to undo based on the GoJS commandHandler
                undoButton.style.display = (this.diagram.commandHandler.canUndo()) ? "block" : "none";
                // Redo should only be displayed if there are actions to redo based on the GoJS commandHandler
                redoButton.style.display = (this.diagram.commandHandler.canRedo()) ? "block" : "none";
            }
            // Specifies the coordinates where the context menu should be shown in the diagram.
            // This is based on the last click registered in the diagram.
            context.style.display = "block";
            context.style.left = mousePosition.x + "px";
            context.style.top = mousePosition.y + "px";
        }
        this.currentContextMenu = contextmenu;
        // Save for displaying the context menu until user has made choice
        toolMenu = this;
    };

    // Function for hiding the context menu
    hideContext = function() {
        if (this.currentContextMenu == null) return;
        context.style.display = "none";
        this.currentContextMenu = null;
        // Save for button interaction
        toolMenu = null;
    };

    // Specifying the show/hide functions to the context menu class
    cxMenu.showContextMenu = showContext;
    cxMenu.hideContextMenu = hideContext;

    // Function for actually performing the context menu options when clicked.
    // The functionality is thus dependent on the user's input (i.e. a mouse click).
    // The GoJS's commandHandler implements various commands (as the name implies),
    // which includes keyboard event handling to interpret key presses as commands.
    function menuHandle(choice) {
        if (toolMenu === null) return;
        var diagram = toolMenu.diagram;
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
        toolMenu.stopTool();
    }

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
                contextMenu: MAKE(go.Adornment, go.Panel.Horizontal)
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
                    name: "nodeShape"
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
                    portId: "Input2",
                    alignment: new go.Spot(0, 0.75),  // Specifies the position based on the complete node size
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
                    strokeWidth: 3,
                    name: "nodeShape"
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
                    name: "nodeShape"
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
    circuit.nodeTemplateMap = menuMap;

    // This part creates the "Side menus", called Palettes in GoJS,
    // for displaying all circuit objects (logic gates and IO).
    // Nodes can then be dragged from the Palettes on to the actual Diagram.

    gateMenu =
        MAKE(go.Palette, "gateMenu", // Specify the Palette to be created by using the HTML div's ID
            {
                nodeTemplateMap: menuMap, // share the templates with the main Diagram
                layout: MAKE(go.GridLayout), // Creates a grid-like arrangement (spaced apart, wrapping if needed)
                contentAlignment: go.Spot.Top, // Center content vertically, push to the top
                autoScale: go.Diagram.Uniform // Scale to fit the Diagram
            });

    ioMenu =
        MAKE(go.Palette, "ioMenu", // Specify the Palette to be created by using the HTML div's ID
            {
                nodeTemplateMap: menuMap, // share the templates with the main Diagram
                layout: MAKE(go.GridLayout), // Creates a grid-like arrangement (spaced apart, wrapping if needed)
                contentAlignment: go.Spot.Top, // Center content vertically, push to the top
                autoScale: go.Diagram.Uniform // Scale to fit the Diagram
            });

    //gateMenu.nodeTemplateMap = menuMap;
    //ioMenu.nodeTemplateMap = menuMap;

    // Adding the logic gate templates to the logic gate menu Model.
    // This will display the Nodes in the Diagram
    gateMenu.model = new go.GraphLinksModel([
        {category: "andgate"},
        {category: "notgate"},
        {category: "orgate"}
    ]);

    // Adding the input/output templates to the IO menu Model.
    // This will display the Nodes in the Diagram
    ioMenu.model = new go.GraphLinksModel([
        {category: "input"},
        {category: "output"}
    ]);

    // jQuery accordion for formatting the Palettes
    jQuery("#accordion").accordion({
        activate: function(event, ui) {
            gateMenu.requestUpdate();
            ioMenu.requestUpdate();
        },
        heightStyle: "content"
    });

    // Updating circuit state
    continueUpdate();
}

// Making sure the diagram is updated constantly (right now every 100 millisecond)
function continueUpdate() {
    setTimeout(function() { update(); continueUpdate(); }, 100);
    console.log("Updating");
}

// This function makes it possible to update (toggle) an Input Node from high to low or low to high
function inputState(e, node) {
    // Wrapping the state change in a transaction for undo/redo
    // Everything that is grouped inside of a transaction can be undone/redone with one undo/redo step in the UndoManager.
    e.diagram.startTransaction("setInputState");
    console.log(node.findObject("inputShape").fill);
    // Search for input object with name property "nodeShape" and returns that object, making it possible to update its fill color
    node.findObject("inputShape").fill = (node.findObject("inputShape").fill == "#00ff00") ? "green" : "#00ff00";
    // Since an input's state may have changed (indicated by a color change) it's necessary to update all nodes/links
    update();
    // Debugging prints
    console.log("Input state updated!");
    console.log(node.findObject("inputShape").fill);
    // Closing transaction
    e.diagram.commitTransaction("setInputState");
}

// These are just auxiliary functions to update all gates and IO based on the color of the links
// "green" indicates a low signal (0) and "#00ff00" (light green) indicates a high signal (1)

function inputUpdate(node) {
    setOutputLinks(node, node.findObject("inputShape").fill);
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
    node.linksConnected.each(function(link) { node.findObject("outputShape").fill = link.findObject("linkShape").stroke; });
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