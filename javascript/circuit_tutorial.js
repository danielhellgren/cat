var ANDtutorial;
var NOTtutorial;
var ORtutorial;

function initTutorial() {
    var MAKE = go.GraphObject.make;
    tutorialAND =
        MAKE(go.Diagram, "ANDtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                initialAutoScale: go.Diagram.Uniform,
                isReadOnly: true,
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });

    tutorialOR =
        MAKE(go.Diagram, "ORtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                initialAutoScale: go.Diagram.Uniform,
                isReadOnly: true,
                allowHorizontalScroll: false,
                allowVerticalScroll: false
            });

    tutorialNOT =
        MAKE(go.Diagram, "NOTtutorial", // Specify the diagram by using the HTML div's ID
            {
                "undoManager.isEnabled": true, // Used for allowing undo/redo
                initialAutoScale: go.Diagram.Uniform,
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

    load();
}

function load() {
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
        {"category":"andgate", "key":"and", "loc": "130 75"},
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
        {"category":"orgate", "key":"or", "loc": "130 75"},
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
        {"category":"input", "key":"in", "loc":"0 0"},
        {"category":"notgate", "key":"not", "loc": "130 75"},
        {"category":"output", "key":"out", "loc":"300 75"}
    ],
    "linkDataArray": [
        {"from": "in", "fromPort":"Input", "to": "not", "toPort":"Input"},
        {"from": "not", "fromPort":"Output", "to": "out", "toPort":"Output"}
    ]
};