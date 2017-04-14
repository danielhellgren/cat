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

    var circuitModel = MAKE(go.Model); // The Model hold all data, that is, an array of JavaScript objects
    // In th Model, each node is represented by a JavaScript object
    circuitModel.nodeDataArray = [
        { key: "AND", color: "red" },
        { key: "OR", color: "yellow" },
        { key: "NOT", color: "green" }
    ];
    circuit.model = circuitModel;

    // Provide custom Node appearance
    // Used for specifying logical gates
    /*
    var ANDgate =
        MAKE(go.Node, "Spot");
    */
}
