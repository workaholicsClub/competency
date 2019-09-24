function drawGridCell(draw, x, y, w, h, color) {
    return draw
        .rect(w, h)
        .stroke({ color: color, width: 1})
        .fill('transparent')
        .attr({'shape-rendering': 'crispEdges'})
        .move(x, y);
}

function getOptionValue(name, options) {
    let defaults = {
        graphHeight: 44,
        graphWidth: 200,
        binValues: [],
        labelsText: [],
        labelsHeight: 9,
        labelsGutter: 3,
        gridHeightCount: 2,
        gridColor: 'rgb(229, 229, 229)',
        binColor: 'rgb(99, 84, 210)',
        labelColor: 'rgb(200, 200, 200)',
        binGutter: 2,
        fromHandle: false,
        toHandle: false
    };

    return options[name] || defaults[name];
}

function drawGraph(elementId, options) {
    let draw = SVG(elementId);

    options = options || {};

    let graphHeight = getOptionValue('graphHeight', options);
    let graphWidth = getOptionValue('graphWidth', options);

    draw.size(graphWidth, graphHeight);

    let binValues = getOptionValue('binValues', options);
    let labelsText = getOptionValue('labelsText', options);

    let labelsHeight = getOptionValue('labelsHeight', options);
    let labelsGutter = getOptionValue('labelsGutter', options);
    let gridHeight = graphHeight - labelsHeight - labelsGutter;
    let gridWidth = graphWidth;
    let gridHeightCount = getOptionValue('gridHeightCount', options);
    let gridWidthCount = options.gridWidthCount || binValues.length;

    let gridColor = getOptionValue('gridColor', options);
    let binColor = getOptionValue('binColor', options);
    let labelColor = getOptionValue('labelColor', options);

    let gridCellWidth = gridWidth / gridWidthCount;
    let gridCellHeight = gridHeight / gridHeightCount;

    let baseBinWidth = gridWidth / binValues.length;
    let binGutter = getOptionValue('binGutter', options);

    let graph = draw.group();
    let grid = draw.group();

    for (let yindex = 0; yindex < gridHeightCount; yindex++) {
        for (let xindex = 0; xindex < gridWidthCount; xindex++) {
            let cell = drawGridCell(draw, xindex * gridCellWidth, yindex * gridCellHeight, gridCellWidth, gridCellHeight, gridColor);
            grid.add(cell);
        }
    }

    let bins = draw.group();
    let binMax = Math.max.apply(null, binValues);
    binValues.forEach(function (value, binIndex) {
        let fraction = value / binMax;
        let binHeight = fraction * gridHeight;
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
        let y = graphHeight - labelsHeight - 1;

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
    let handleHeight = options.handleHeight || 40;

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

function makeSalaryInputHTML(inputId, options) {
    let graphWidth = getOptionValue('graphWidth', options);
    let graphHeight = getOptionValue('graphHeight', options);
    let labelsHeight = getOptionValue('labelsHeight', options);
    let labelsGutter = getOptionValue('labelsGutter', options);
    let curtainHeight = graphHeight - labelsHeight - labelsGutter;

    return `<style>
        #${inputId} {width: ${graphWidth}px!important;}
        #${inputId} .curtain {height: ${curtainHeight}px!important;};
        </style>
        <div id="${inputId}" class="salary-input">
            <div id="${inputId}-histogram" class="salary-input-histogram"></div>
            <div class="curtain left-curtain ${inputId}-left-curtain">
                <div id="${inputId}-left-handle" class="salary-handle salary-input-left-handle"></div>
            </div>
            <div class="curtain right-curtain ${inputId}-right-curtain">
                <div id="${inputId}-right-handle" class="salary-handle  salary-input-right-handle"></div>
            </div>
        </div>`;
}

function generataInputId() {
    let salaryInputsCount = document.querySelectorAll('.salary-input').length;
    let newElementIndex = salaryInputsCount + 1;
    return 'salaryInput_'+newElementIndex;
}

function HistogramInput(wrapper, options) {
    this.wrapper = wrapper;
    this.options = options || {};
    this.inputId = options.inputId || generataInputId();

    this.init = function () {
        wrapper.innerHTML = makeSalaryInputHTML(this.inputId, this.options);
        let histogramElementId = this.inputId + '-histogram';
        let leftHandleElementId = this.inputId + '-left-handle';
        let rightHandleElementId = this.inputId + '-right-handle';
        let instance = this;
        let graphWidth = getOptionValue('graphWidth', this.options);
        let valueRange = getOptionValue('valueRange', this.options);
        let valueFrom = valueRange[0];
        let valueTo = valueRange[1];
        let intervalSize = valueTo-valueFrom;

        drawGraph(histogramElementId, this.options);
        drawHandle(leftHandleElementId, this.options);
        drawHandle(rightHandleElementId, this.options);

        let changeFromCallback = this.options.changeFrom || false;
        let changeToCallback = this.options.changeTo || false;

        let handleFromPosition = getOptionValue('fromHandle', this.options);
        let handleToPosition = getOptionValue('toHandle', this.options);

        if (handleFromPosition && handleToPosition) {
            this.setHandlePositions(handleFromPosition, handleToPosition);
        }

        interact('.'+this.inputId+'-left-curtain')
            .resizable({
                edges: { right: true },
                restrictSize: 'parent'
            })
            .on('resizemove', function (event) {
                let curtain = event.target;
                let width = event.rect.right - event.rect.left;

                curtain.style.width = width + 'px';

                let percent = width/graphWidth * 100;
                let salary = valueFrom + intervalSize * percent / 100;
                instance.triggerEvent('changeFrom', salary);

                if (changeFromCallback) {
                    changeFromCallback(salary);
                }
            });

        interact('.'+this.inputId+'-right-curtain')
            .resizable({
                edges: { left: true },
                restrictSize: 'parent'
            })
            .on('resizemove', function (event) {
                let curtain = event.target;
                let width = event.rect.right - event.rect.left;

                curtain.style.width = width + 'px';
                let percent = (graphWidth - width)/graphWidth * 100;
                let salary = valueFrom + intervalSize * percent / 100;
                instance.triggerEvent('changeTo', salary);

                if (changeToCallback) {
                    changeToCallback(salary);
                }
            });
    };

    this.triggerEvent = function (type, value) {
        let salaryInput = document.querySelector('#' + this.inputId);
        let event = new Event(type);
        event.value = value;

        salaryInput.dispatchEvent(event);
    };

    this.setHandlePositions = function (fromPosition, toPosition) {
        let range = getOptionValue('valueRange', this.options);
        let graphWidth = getOptionValue('graphWidth', this.options);
        let rangeWidth = range[1] - range[0];

        let leftFraction = (fromPosition - range[0])/rangeWidth;
        let rightFraction = (range[1]-toPosition)/rangeWidth;

        let leftWidth = graphWidth * leftFraction;
        let rigthWidth = graphWidth * rightFraction;

        let leftCurtain = document.querySelector('#' + this.inputId + ' .left-curtain');
        let rightCurtain = document.querySelector('#' + this.inputId + ' .right-curtain');

        leftCurtain.style.width = leftWidth + 'px';
        rightCurtain.style.width = rigthWidth + 'px';
    };


    this.init();
    return this;
}

export default HistogramInput;