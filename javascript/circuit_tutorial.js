var ANDtutorial;
var NOTtutorial;
var ORtutorial;

function initTutorial() {
    var MAKE = go.GraphObject.make;
    tutorialAND =
        MAKE(go.Diagram, "ANDtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                autoScale: go.Diagram.Uniform,
                contentAlignment: go.Spot.Center,
                isReadOnly: true,
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });

    tutorialOR =
        MAKE(go.Diagram, "ORtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                autoScale: go.Diagram.Uniform,
                contentAlignment: go.Spot.Center,
                isReadOnly: true,
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });

    tutorialNOT =
        MAKE(go.Diagram, "NOTtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                autoScale: go.Diagram.Uniform,
                contentAlignment: go.Spot.Center,
                isReadOnly: true,
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });

    tutorialAND.linkTemplate = tutorialNOT.linkTemplate = tutorialOR.linkTemplate =
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

    var menuMap = new go.Map("string", go.Node);

    menuMap.add("andgate", andGate);
    menuMap.add("notgate", notGate);
    menuMap.add("orgate", orGate);
    menuMap.add("input", input);
    menuMap.add("output", output);

    ANDtutorial.nodeTemplateMap = menuMap;
    NOTtutorial.nodeTemplateMap = menuMap;
    ORtutorial.nodeTemplateMap = menuMap;

    loadTutorials();
}

function showInfo (inputEvent, graphObject) {
    var i;
    var activeDiagram = inputEvent.diagram.div.id;
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
    if (graphObject !== null) {
        var node = graphObject.part;
        var e = inputEvent.diagram.lastInput;
        console.log(inputEvent.diagram.div.id);
        console.log(inputEvent.diagram);
        console.log(e);
        var shape = node.findObject("nodeShape");
        shape.stroke = "gray";
        node.isShadowed = true;
        node.shadowOffset = new go.Point(0, 0);
        updateInfoBox(e.viewPoint, node.data, i);
        document.getElementsByClassName("infoContainer")[i].style.display = "block";
    }
    else {
        document.getElementsByClassName("infoContainer")[i].innerHTML = "";
    }
}

function hideInfo (inputEvent, graphObject) {
    graphObject.part.findObject("nodeShape").stroke = "black";
    graphObject.part.isShadowed = false;
    document.getElementsByClassName("infoContainer")[0].style.display = "none";
    document.getElementsByClassName("infoContainer")[1].style.display = "none";
    document.getElementsByClassName("infoContainer")[2].style.display = "none";
}

function updateInfoBox(mousePt, data, i) {
    console.log(data);
    var boxContainer = document.getElementsByClassName("infoContainer")[i];
    boxContainer.innerHTML = "";
    var infoBox = document.createElement("div");
    infoBox.id = "infoBox";
    boxContainer.appendChild(infoBox);
    var content = document.createElement("div");
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
    infoBox.appendChild(content);
    boxContainer.style.left = mousePt.x + 30 + "px";
    boxContainer.style.top = mousePt.y + 30 + "px";
}

function loadTutorials() {
    ANDtutorial.model = go.Model.fromJson(ANDtemplate);
    ANDtutorial.model.linkFromPortIdProperty = "fromPort";
    ANDtutorial.model.linkToPortIdProperty = "toPort";
    ANDtutorial.zoomToFit();

    NOTtutorial.model = go.Model.fromJson(NOTtemplate);
    NOTtutorial.model.linkFromPortIdProperty = "fromPort";
    NOTtutorial.model.linkToPortIdProperty = "toPort";
    NOTtutorial.zoomToFit();

    ORtutorial.model = go.Model.fromJson(ORtemplate);
    ORtutorial.model.linkFromPortIdProperty = "fromPort";
    ORtutorial.model.linkToPortIdProperty = "toPort";
    ORtutorial.zoomToFit();
}

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