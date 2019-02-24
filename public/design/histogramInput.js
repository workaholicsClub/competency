function drawGridCell(draw, x, y, w, h, color) {
    return draw
        .rect(w, h)
        .stroke({ color: color, width: 1})
        .fill('transparent')
        .attr({'shape-rendering': 'crispEdges'})
        .move(x, y);
}

function drawGraph(elementId, options) {
    let draw = SVG(elementId);
    options = options || {};

    let graphHeight = options.graphHeight || 64;
    let graphWidth = options.graphWidth || 200;

    draw.size(graphWidth, graphHeight);

    let binValues = options.binValues || [15, 50, 20, 100, 75, 23];
    let labelsText = options.labelsText || ['0', '30K', '60K', '90K', '120K', '150K', '180K'];

    let labelsHeight = options.labelsHeight || 9;
    let labelsGutter = options.labelsGutter || 3;
    let gridHeight = graphHeight-labelsHeight - labelsGutter;
    let gridWidth = graphWidth;
    let gridHeightCount = options.gridHeightCount || 2;
    let gridWidthCount = options.gridWidthCount || binValues.length;

    let gridColor = options.gridColor || 'rgb(229, 229, 229)';
    let binColor = options.binColor || 'rgb(99, 84, 210)';
    let labelColor = options.labelColor || 'rgb(200, 200, 200)';

    let gridCellWidth = gridWidth / gridWidthCount;
    let gridCellHeight = gridHeight / gridHeightCount;

    let baseBinWidth = gridWidth / binValues.length;
    let binGutter = 2;

    let graph = draw.group();

    let grid = draw.group();
    for (let yindex = 0; yindex < gridHeightCount; yindex++) {
        for (let xindex = 0; xindex < gridWidthCount; xindex++) {
            let cell = drawGridCell(draw, xindex * gridCellWidth, yindex * gridCellHeight, gridCellWidth, gridCellHeight, gridColor);
            grid.add(cell);
        }
    }

    let bins = draw.group();
    binValues.forEach(function (value, binIndex) {
        let binHeight = value / 100 * gridHeight;
        let x = binIndex * baseBinWidth;
        let y = gridHeight - binHeight;
        let isLastBin = binIndex === binValues.length - 1;
        let binWidth = isLastBin ? baseBinWidth : baseBinWidth-binGutter;

        let bin = draw
            .rect(binWidth, binHeight)
            .stroke(binColor)
            .fill(binColor)
            .attr({'shape-rendering': 'crispEdges'})
            .move(x, y);

        bins.add(bin);
    });

    let labels = draw.group();
    labelsText.forEach(function (text, labelIndex) {
        let label = draw
            .plain(text)
            .font('size', labelsHeight)
            .fill(labelColor);

        let isFirst = labelIndex === 0;
        let isLast = labelIndex === labelsText.length - 1;

        let labelWidth = label.length();
        let x = gridCellWidth * labelIndex - labelWidth/2;
        let y = graphHeight - labelsHeight;

        if (isFirst) {
            x = 0;
        }

        if (isLast) {
            x = gridCellWidth * labelIndex - labelWidth;
        }

        label.move(x,y);
        labels.add(label);
    });

    graph.add(grid).add(bins). add(labels);

    return graph;
}

function drawHandle(elementId, options) {
    let draw = SVG(elementId);
    options = options || {};

    let handleRailsColor = options.handleRailsColor || 'black';
    let handleBarColor = options.handleBarColor || 'white';
    let notchColor = options.notchColor || 'rgba(0, 0, 0, 0.6)';

    let handleWidth = options.handleWidth || 6;
    let handleHeight = options.handleHeight || 64;

    draw.size(handleWidth, handleHeight);

    let handleBarWidth = options.handleBarWidth || handleWidth;
    let handleBarHeight = options.handleBarHeight || 20;
    let handleBarRadius = options.handleBarRadius || handleWidth / 4;
    let notchesGutter = options.notchesGutter || 2;
    let notchWidth = options.notchWidth || 2;
    let notchLineWidth = options.notchLineWidth || 1;
    let notchesCount = options.notchesCount || 3;

    let notchesStartY = handleHeight/2 - ((notchesCount - 1) * notchesGutter + notchesCount * notchLineWidth)/2;

    let handle = draw.group();

    let handleRails = draw
        .line(handleWidth/2, 0, handleWidth/2, handleHeight)
        .stroke({color: handleRailsColor, width: 2});

    let handleBarX = 0;
    let handleBarY = handleHeight/2 - handleBarHeight/2;

    let handleBar = draw.group();
    let handleBarDrag = draw
        .rect(handleBarWidth, handleBarHeight)
        .radius(handleBarRadius)
        .stroke(handleRailsColor)
        .fill(handleBarColor)
        .move(handleBarX, handleBarY);

    let notches = draw.group();
    for (let notchIndex = 0; notchIndex < notchesCount; notchIndex++) {
        let x = handleWidth/2 - notchWidth/2;
        let y = notchesStartY + notchIndex * notchesGutter + notchIndex * notchLineWidth;

        let notch = draw
            .line(x, y, x+notchWidth, y)
            .stroke({color: notchColor, width: notchLineWidth});

        notches.add(notch);
    }

    handleBar.add(handleBarDrag).add(notches);
    handle.add(handleRails).add(handleBar);

    return handle;
}

function triggerSalaryChangeEvent(type, value) {
    let salaryInput = document.querySelector('.salary-input');
    let event = new Event(type);
    event.value = value;

    salaryInput.dispatchEvent(event);
}

function makeSalaryInput() {
    let graphWidth = $('section.data').width();

    drawGraph('salary-input-histogram', {
        graphHeight: 44,
        graphWidth: graphWidth
    });
    drawHandle('salary-input-left-handle', {handleHeight: 40});
    drawHandle('salary-input-right-handle', {handleHeight: 40});

    interact('.left-curtain')
        .resizable({
            edges: { right: true },
            restrictSize: 'parent'
        })
        .on('resizemove', function (event) {
            let curtain = event.target;
            let width = event.rect.right - event.rect.left;

            curtain.style.width = width + 'px';

            let percent = width/graphWidth * 100;
            triggerSalaryChangeEvent('changeFrom', percent);
        });

    interact('.right-curtain')
        .resizable({
            edges: { left: true },
            restrictSize: 'parent'
        })
        .on('resizemove', function (event) {
            let curtain = event.target;
            let width = event.rect.right - event.rect.left;

            curtain.style.width = width + 'px';
            let percent = width/graphWidth * 100;
            triggerSalaryChangeEvent('changeFrom', percent);
        });

}
