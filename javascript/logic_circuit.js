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
    // Create empty diagram
    var MAKE = go.GraphObject.make;
    var circuit =
        MAKE(go.Diagram, "logicDiagram", // Specify the diagram by using the div's ID
            {
                initialContentAlignment: go.Spot.Center, // center content in diagram
                "undoManager.isEnabled": true, // Used for undo/redo
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
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 3,
                relinkableFrom: true, relinkableTo: true,
                selectionAdorned: false, // Links are not adorned when selected so that their color remains visible.
                shadowOffset: new go.Point(0, 0), shadowBlur: 5, shadowColor: "blue"
            },
            MAKE(go.Shape,
                { name: "SHAPE", strokeWidth: 2, stroke: "red" }));

    // Provide custom Node appearance
    // Used for specifying logical gates

    var andGate =
        MAKE(go.Node, "Spot",
            {shadowBlur: 10, shadowColor: "black"},
            MAKE(go.Shape, "AndGate",
                {fill: "lightgray", stroke: "black", strokeWidth: 3}
            ),
            MAKE(go.Shape, "Rectangle",
                {fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    fromLinkable: false,
                    toSpot: go.Spot.Left,
                    toLinkable: true,
                    portId: "Input",
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
                    portId: "Input",
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
                    cursor: "pointer"
                }
            )
        );

    var notGate =
        MAKE(go.Node, "Spot",
            {shadowBlur: 10, shadowColor: "black"},
            MAKE(go.Shape, "Inverter",
                {fill: "lightgray", stroke: "black", strokeWidth: 3}
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

    var input =
        MAKE(go.Node, "Spot",
            {shadowBlur: 10, shadowColor: "black"},
            MAKE(go.Shape, "Rectangle",
                {fill: "green", stroke: "black", strokeWidth: 3}
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
            )
        );

    var output =
        MAKE(go.Node, "Spot",
            {shadowBlur: 10, shadowColor: "black"},
            MAKE(go.Shape, "Circle",
                {fill: "red", stroke: "black", strokeWidth: 3}
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
        {category: "notgate"}
    ];
    // Adding the input/output templates to the IO menu
    ioMenu.model.nodeDataArray = [
        {category: "input"},
        {category: "output"}
    ];


}