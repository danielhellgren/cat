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
    /*
    circuit.nodeTemplate =
        MAKE(go.Node, "Auto",
            MAKE(go.Shape,
                {figure: "Rectangle",
                 fill: "white"},
                new go.Binding("fill", "color")),
            MAKE(go.TextBlock,
                {margin: 3},
                new go.Binding("text", "key"))
            );
    */

    var circuitModel = MAKE(go.Model); // The Model hold all data, that is, an array of JavaScript objects
    // In th Model, each node is represented by a JavaScript object

    /*
    circuitModel.nodeDataArray = [
        { key: "and", category: "andgate"},
        { key: "not", category: "notgate"}
    ];
    */

    circuit.model = circuitModel;

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
                 toSpot: go.Spot.Left,
                 portId: "Input",
                 alignment: new go.Spot(0, 0.25)
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    toSpot: go.Spot.Left,
                    portId: "Input",
                    alignment: new go.Spot(0, 0.75)
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    toSpot: go.Spot.Left,
                    portId: "Input",
                    alignment: new go.Spot(1, 0.5)
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
                    toSpot: go.Spot.Left,
                    portId: "Input",
                    alignment: new go.Spot(0, 0.25)
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    toSpot: go.Spot.Left,
                    portId: "Input",
                    alignment: new go.Spot(0, 0.75)
                }
            ),
            MAKE(go.Shape, "Rectangle",
                {   fill: "black",
                    desiredSize: new go.Size(8,8),
                    fromSpot: go.Spot.Right,
                    toSpot: go.Spot.Left,
                    portId: "Input",
                    alignment: new go.Spot(1, 0.5)
                }
            )
        );

    var logicMap = new go.Map("string", go.Node);

    logicMap.add("andgate", andGate);
    logicMap.add("notgate", notGate);
    logicMap.add("", circuit.nodeTemplate);

    circuit.nodeTemplateMap = logicMap;

    var menu = new go.Palette("menu"); // "Side menu" for displaying all circuit/logic objects

    menu.nodeTemplateMap = logicMap;

    menu.model.nodeDataArray = [
        {category: "andgate"},
        {category: "notgate"}
    ];

}