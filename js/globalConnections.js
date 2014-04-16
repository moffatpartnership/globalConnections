// startup vars
var gcappHeight = 1025,
    gcappWidth = 1106,
    plotName = "Worldwide 1",
    customerItems;

// wrapper
window.GCViewer = {};

// plot selector
var select = document.createElement('select');
select.setAttribute('id','plotSelect');

var plotNames = ["Worldwide 1","Worldwide 2","European","African","Sub-Saharan","West Asian","South and Central Asian","East and North Asian","Hispanic and Afro-Caribbean 1","Hispanic and Afro-Caribbean 2","Native American mixture","Jewish mixture"];

for (var i = 0; i < plotNames.length; i++) {

    var opt = document.createElement('option');
    opt.value = plotNames[i];
    opt.innerHTML = plotNames[i];
    select.appendChild(opt);

}

document.getElementById("GCSelect").appendChild(select);

select.addEventListener('change', function() {

    if (document.getElementById("drawCanvas")) {
        var element = document.getElementById("drawCanvas");
        element.parentNode.removeChild(element);
    }
    plotName = select.value;
    GCViewer.loadInit()

});

//loader
(function(){

    var plotItems = [], dataload;

    function Loader() {

    }

    Loader.prototype.loadData = function() {

        // mapItems stuff
        dataload = false;

        $.getJSON('https://api.moffpart.com/api/1/databases/sdnacontent/collections/globalConnectionsReference?q={"title":"'+ plotName + '","batch": '+ customerItems.batch +'}&apiKey=50e55b5fe4b00738efa04da0&callback=?', function(ret) {

            plotItems = ret[0];
            console.log(plotItems)
            parseData();
        });

        // preloader graphics
        var prossElement = document.createElement('div'),
            dialogElement = document.createElement('div'),
            spinElement = document.createElement('div'),
            paraElement = document.createElement('p'),
            textItem = document.createTextNode("Loading plotItems…");

        prossElement.setAttribute('id', "Processing");
        prossElement.setAttribute('Style', "height:" + gcappHeight + "px; width:" + gcappWidth + "px;");
        dialogElement.setAttribute('class','dialog');
        spinElement.setAttribute('class','spinner-container');

        paraElement.appendChild(textItem);
        dialogElement.appendChild(paraElement);
        dialogElement.appendChild(spinElement);
        prossElement.appendChild(dialogElement);
        document.getElementById("canvasGlobalConnections").appendChild(prossElement);
        $('#Processing').show();
    };

    function parseData() {

        //plotItems = sortByKey(plotItems,"index");

        dataload = true;
    }

    Loader.prototype.loadStatus = function() {

        return dataload
    };

    Loader.prototype.returnData = function() {

        allData = {
            plotItems:plotItems,
            customerItems:customerItems
        };
        return allData
    };

    GCViewer.Loader = Loader;

})();

// artboard
(function(){

    // zoom params
    var zoomRatio, xoffset, yoffset, rot, xtrans, ytrans, keyy, xfactor, yfactor;

    // data
    var drawItemsData, plotContainer,resultDisplay;

    // interaction
    var interactionObject, feedback;

    //plot num
    var currentPlot = 0;

    function Artboard(){

        interactionObject = {
            state:"inactive",
            data:"Nil"
        };

        feedback = {


        }
    }


    Artboard.prototype.dataLoad = function (data){

        drawItemsData  = data.plotItems;
        zoomRatio = drawItemsData.initzoom;
        xoffset = drawItemsData.xoffset;
        yoffset = drawItemsData.yoffset;
        xtrans = drawItemsData.xtrans;
        ytrans = drawItemsData.ytrans;
        rot = drawItemsData.rot;
        keyy = drawItemsData.keyy;
        xfactor = drawItemsData.xfactor;
        yfactor = drawItemsData.yfactor;

        plotContainer = new createjs.Container();
        resultDisplay = new createjs.Container();
    };

    Artboard.prototype.zoom = function (user){

        zoomRatio = user.zoomRatio;
        plotContainer.x = user.xoffset;
        plotContainer.y = user.yoffset;
        resultDisplay.x = user.xoffset - xoffset;
        resultDisplay.y = user.yoffset - yoffset;

    };

    Artboard.prototype.background = function (displayObject){

        // area to add stuff ----->

        plotContainer.x = xoffset;
        plotContainer.y = yoffset;
        plotContainer.rotation = drawItemsData.rot;
        //plotContainer.rotation = -110;
        displayObject.addChild(plotContainer);

        // plotItems
        var plotItems = [];
        plotItems =  drawItemsData.traceArray;
        var pINum = plotItems.length;

        for (var i = 0; i < pINum; i++) {

            var referenceIndividual = plotItems[i];

            var xpos = Math.round(referenceIndividual.xcoordinate*xfactor*zoomRatio*xtrans),
                ypos = Math.round(referenceIndividual.ycoordinate*yfactor*zoomRatio*ytrans),
                color = referenceIndividual.color;

            var strokeColor = "#FFF";
            if (color === "#FFF") {strokeColor = "#333"}

            var plotItem = new createjs.Shape();
            plotItem.graphics.beginFill(color).beginStroke(strokeColor).setStrokeStyle(0.5).drawCircle(xpos,ypos,3);
            plotContainer.addChild(plotItem);

            plotItem.shadow = new createjs.Shadow("#ccc", 1, 1, 2);

        }


        // Customer display


        resultDisplay.x = 0.5;
        resultDisplay.y = 0.5;
        displayObject.addChild(resultDisplay);

        var resBackground = new createjs.Shape();
        resBackground.graphics.setStrokeStyle(1).beginStroke("#bbb").drawRect(26,24,410,308);
        resBackground.graphics.beginStroke("#666").beginFill("#FFF").drawRect(20,18,422,320);
        resBackground.alpha = 0.75;


        var isResult = customerItems[plotName];

        if (isResult) {

            var currentResult = customerItems[plotName].split(",");

            var custxpos = Math.round(currentResult[0]*xfactor*zoomRatio*xtrans),
                custypos = Math.round(currentResult[1]*yfactor*zoomRatio*ytrans);

            var custItem = new createjs.Shape();
            custItem.graphics.beginFill("#E6007E").beginStroke("#000").setStrokeStyle(0.5).drawCircle(0,0,8);
            custItem.x = custxpos;
            custItem.y = custypos;

            var pt = plotContainer.localToGlobal(custItem.x, custItem.y);

            var textBack = new createjs.Shape();
            textBack.graphics.beginFill("#FFF").beginStroke("#000").setStrokeStyle(0.5).drawRect(0,0,80,28);
            textBack.x = pt.x + 50;
            textBack.y = pt.y - 14;
            resultDisplay.addChild(textBack);

            textBack.shadow = new createjs.Shadow("#ccc", 2, 2, 4);

            var linesnshit = new createjs.Shape();
            linesnshit.graphics.beginStroke("#000");
            linesnshit.graphics.setStrokeStyle(0.5,"round");
            linesnshit.graphics.moveTo(pt.x + 50, pt.y);
            linesnshit.graphics.lineTo(pt.x + 8, pt.y);
            resultDisplay.addChild(linesnshit);

            linesnshit.shadow = new createjs.Shadow("#aaa", 2, 2, 4);

            var custText = new createjs.Text(customerItems.reference,"15px Petrona","#333");
            var centrePos = 90 - Math.round(custText.getMeasuredWidth()/2);
            custText.x = pt.x + centrePos;
            custText.y = pt.y - 8;
            resultDisplay.addChild(custText);

            plotContainer.addChild(custItem);

            custItem.shadow = new createjs.Shadow("#aaa", 2, 2, 4);


        } else {

            var normShape = new createjs.Shape();
            normShape.graphics.setStrokeStyle(1).beginStroke("#bbb").drawRect(26,24,240,50);
            normShape.graphics.beginStroke("#666").beginFill("#FFF").drawRect(20,18,252,62);
            normShape.alpha = 0.75;
            displayObject.addChild(normShape);

            normShape.shadow = new createjs.Shadow("#ccc", 2, 2, 4);

            var notOnPlot = new createjs.Text("You do not fit within the genetic\nvariability shown in this plot.","16px Petrona","#333");
            notOnPlot.x = 34;
            notOnPlot.y = 32;
            displayObject.addChild(notOnPlot);
        }

        // <------ area to add stuff

        displayObject.updateCache();
    };

    Artboard.prototype.redraw = function (displayObject){

        // area to add stuff ----->


        // <------ area to add stuff
    };

    Artboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        var keyBackground = new createjs.Container();
        keyBackground.x = 0.5;
        keyBackground.y = 0.5;
        displayObject.addChild(keyBackground);
        var keyLen = drawItemsData.colorArray.length;

        var dataShape = new createjs.Shape();
        dataShape.graphics.setStrokeStyle(1).beginStroke("#bbb").drawRect(gcappWidth - 224,keyy,210,(keyLen*28)+3);
        dataShape.graphics.beginStroke("#666").beginFill("#FFF").drawRect(gcappWidth - 230,keyy-6,222,(keyLen*28)+15);
        dataShape.alpha = 0.75;
        keyBackground.addChild(dataShape);

        dataShape.shadow = new createjs.Shadow("#ccc", 2, 2, 4);

        for (var i = 0; i < keyLen; i++) {

            var keypos = keyy + 6 + i*28;

            var KeyName = new createjs.Text(drawItemsData.titleArray[i],"15px Petrona","#333");
            KeyName.x = gcappWidth - 220;
            KeyName.y = keypos;
            keyBackground.addChild(KeyName);

            KeyName.shadow = new createjs.Shadow("#ddd", 1, 1, 2);

            var strokeColor = "#FFF";
            if (drawItemsData.colorArray[i] === "#FFF") {strokeColor = "#333"}

            var keyShape = new createjs.Shape();
            keyShape.graphics.beginFill(drawItemsData.colorArray[i]).beginStroke(strokeColor).setStrokeStyle(1).drawRect(gcappWidth - 40,keypos - 3,22,22);
            keyBackground.addChild(keyShape);

            keyShape.shadow = new createjs.Shadow("#ccc", 2, 2, 4);
        }

        var textItems = drawItemsData.textArray,
            numText = drawItemsData.textArray.length;

        var wrapperElement = document.createElement('div');
        wrapperElement.setAttribute('id','plotDescription');
        wrapperElement.setAttribute('class','result-block-description');

        for (var k = 0; k < numText; k++) {

            if (k % 2 === 0) {

                var titleElement = document.createElement('h3'),
                    titleItem = document.createTextNode(textItems[k].title);

                titleElement.appendChild(titleItem);
                wrapperElement.appendChild(titleElement);

            } else {

                var paraElement = document.createElement('p'),
                    bodyItem = document.createTextNode(textItems[k].body);

                paraElement.appendChild(bodyItem);
                wrapperElement.appendChild(paraElement);
            }
        }

        if (document.getElementById("plotDescription")) {
            var element = document.getElementById("plotDescription");
            element.parentNode.removeChild(element);
        }

        var newElement = document.getElementById("canvasGlobalConnections");
        newElement.appendChild(wrapperElement);

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.interaction = function(){

        return interactionObject
    };

    Artboard.prototype.resetInteraction = function(){

        interactionObject.state = 0;
        interactionObject.data = "Nil";
    };

    GCViewer.Artboard = Artboard;

})();

// dashboard
(function(){

    var user, zoomSliderY = 140, zoomInit;

    function Dashboard() {

        user = {
            zoomRatio:1,
            xoffset:0,
            yoffset:0,
            xReg:0,
            yReg:0,
            render:false,
            rerender:false
        };
    }

    Dashboard.prototype.controlData = function(data) {

        var plotdata = data.plotItems;
        user.zoomRatio = plotdata.initzoom;
        user.xoffset = plotdata.xoffset;
        user.yoffset = plotdata.yoffset;

    };

    Dashboard.prototype.background = function(displayObject) {

        // area to add stuff ----->



        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Dashboard.prototype.redraw = function(displayObject) {

        // area to add stuff ----->


        // <------ area to add stuff
    };

    Dashboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        // pan base
        var panSliderbase = new createjs.Shape();
        panSliderbase.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#F00").drawRect(-750,-750,1500,1500));
        panSliderbase.alpha = 0.5;
        panSliderbase.x = user.xoffset;
        panSliderbase.y = user.yoffset;
        displayObject.addChild(panSliderbase);

        var xdif, ydif, o;

        panSliderbase.on("mousedown", function(evt) {

            o = evt.target;
            o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};
            user.render = true;

        });

        panSliderbase.on("pressmove", function(evt) {

            user.xoffset = evt.stageX + o.offset.x;
            user.yoffset = evt.stageY + o.offset.y;
            panSliderbase.x = evt.stageX + o.offset.x;
            panSliderbase.y = evt.stageY + o.offset.y;
            //user.xReg = evt.stageX + o.offset.x;
            //user.yReg = evt.stageY+ o.offset.y;

        });

        panSliderbase.on("pressup", function(evt) {

            user.render = false;
        });


        // <------ area to add stuff

        displayObject.updateCache("source-overlay");

    };

    Dashboard.prototype.userFeedback = function() {

        return user;
    };

    GCViewer.Dashboard = Dashboard;

})();

// highlight
(function(){

    var interactionObject, viewInteraction;

    function Highlight() {

        interactionObject = {
            state:"inactive",
            data:"Nil"
        };
    }

    Highlight.prototype.dataLoad = function(viewData) {

        viewInteraction = viewData;
    };

    Highlight.prototype.background = function(displayObject) {


    };

    Highlight.prototype.redraw = function(displayObject) {


    };

    Highlight.prototype.eventlayer = function(displayObject) {


    };

    Highlight.prototype.currentState = function() {

        return interactionObject
    };

    Highlight.prototype.resetInteraction = function(){

        interactionObject.state = "inactive";
        interactionObject.data = "Nil";
    };

    GCViewer.Highlight = Highlight;

})();

// renderer
(function(){

    var stats, canvas, stage, view, control, highlight,
        artboard, artboardBackground, artboardRedraw, artboardEventArea,
        dashboardRedraw, dashboardBackground, dashboardEventArea,
        highlightContainer, highlightBackground, highlightRedraw, highlightEventArea,
        loader, loadStatus;

    GCViewer.loadInit = function(){

        /*stats = new Stats();
         $('.block').prepend(stats.domElement);*/

        // prepare the view
        view = new GCViewer.Artboard(gcappWidth,gcappHeight);

        // prepare the highlight
        highlight = new GCViewer.Highlight();

        // prepare the dashboard
        control = new GCViewer.Dashboard();

        // wdloader init
        loader = new GCViewer.Loader();
        loadStatus = false;
        loader.loadData();

        TweenMax.ticker.addEventListener("tick", loadRequest);
    };

    function init() {

        // prepare our canvas
        canvas = document.createElement( 'canvas' );
        canvas.setAttribute('id','drawCanvas');
        canvas.width = gcappWidth;
        canvas.height = gcappHeight;
        document.getElementById("canvasGlobalConnections").appendChild(canvas);

        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        // artboard
        artboard = new createjs.Container();
        //artboard.y = 20;
        stage.addChild(artboard);

        artboardBackground = new createjs.Container();
        artboardBackground.cache(0, 0, gcappWidth, gcappHeight);
        artboard.addChild(artboardBackground);
        view.background(artboardBackground);

        artboardRedraw = new createjs.Container();
        artboard.addChild(artboardRedraw);
        view.redraw(artboardRedraw);

        artboardEventArea = new createjs.Container();
        artboardEventArea.cache(0, 0, gcappWidth, gcappHeight);
        artboard.addChild(artboardEventArea);
        view.eventlayer(artboardEventArea);

        // dashboard
        dashboardBackground = new createjs.Container();
        dashboardBackground.cache(0, 0, gcappWidth, gcappHeight);
        stage.addChild(dashboardBackground);
        control.background(dashboardBackground);

        dashboardEventArea = new createjs.Container();
        dashboardEventArea.cache(0, 0, gcappWidth, gcappHeight);
        stage.addChild(dashboardEventArea);
        control.eventlayer(dashboardEventArea);

        dashboardRedraw  = new createjs.Container();
        stage.addChild(dashboardRedraw);

        // highlight
        highlightContainer = new createjs.Container();
        highlightContainer.y = 20;
        stage.addChild(highlightContainer);

        highlightBackground = new createjs.Container();
        highlightBackground.cache(0, 0, gcappWidth, gcappHeight);
        highlightContainer.addChild(highlightBackground);

        highlightRedraw  = new createjs.Container();
        stage.addChild(highlightRedraw);

        highlightEventArea = new createjs.Container();
        highlightEventArea.cache(0, 0, gcappWidth, gcappHeight);
        highlightContainer.addChild(highlightEventArea);

        TweenMax.ticker.addEventListener("tick", frameRender);

    }

    function loadRequest(event) {

        var loadFinished = loader.loadStatus();
        if (loadFinished) {
            loadStatus = true;
            var data = loader.returnData();
            view.dataLoad(data);
            control.controlData(data);
            removeLoader()
        }
    }

    function removeLoader() {

        $('#Processing').remove();
        TweenMax.ticker.removeEventListener("tick", loadRequest);
        init();
    }

    function frameRender(event) {

        //stats.begin();


        highlightRedraw.removeAllChildren();
        dashboardRedraw.removeAllChildren();


        highlight.redraw(highlightRedraw);
        control.redraw(dashboardRedraw);

        var viewData = view.interaction();

        if (viewData.state === "openhighlight") {
            highlight.dataLoad(viewData);
            highlight.eventlayer(highlightEventArea);
            highlight.background(highlightBackground);
            view.resetInteraction()
        }

        var user = control.userFeedback();

        if (user.render) {
            artboardBackground.updateCache()
        }
        if (user.rerender) {
            //artboardBackground.updateCache();
            //view.background(artboardBackground);
            user.rerender = false;
        }

        view.zoom(user);

        var highlightData = highlight.currentState();

        if (highlightData.state === "closehighlight") {
            highlightBackground.removeAllChildren();
            highlightBackground.updateCache();

            highlightEventArea.removeAllChildren();
            highlightEventArea.updateCache();

            highlight.resetInteraction()
        }

        // update stage
        stage.update();

        //stats.end();
    }

})();

// firstSet
var resultid = document.getElementById("canvasGlobalConnections").getAttribute("data-global-connections-id");

$.getJSON('https://api.moffpart.com/api/1/databases/sdnacontent/collections/amaGlobalConnections/'+ resultid +'?apiKey=50e55b5fe4b00738efa04da0&callback=?', function(ret) {

    customerItems = ret;
    console.log(customerItems)
    //Init
    GCViewer.loadInit();
});



// utils
