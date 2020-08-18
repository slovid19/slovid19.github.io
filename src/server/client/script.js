let createLogOpts = function(maxCases)
{
    const tickPower = Math.ceil(Math.log10(maxCases));
    const maxTick = Math.pow(10, tickPower);
    let opts =  
        {
            scaleLabel: {
                display: true,
                labelString: 'Case Numbers'
            },
            type: 'logarithmic',
            position: 'left',
            ticks: {
                min: 1, //minimum tick
                max: maxTick, //maximum tick
                callback: function (value, index, values) {
                    return Number(value.toString());
                }
            },
            afterBuildTicks: function (chartObj) { 
                chartObj.ticks = [];
                for(let i = 0; i < tickPower + 1; ++i)
                {
                    chartObj.ticks.push(Math.pow(10,i));
                }

            }
        };
    return opts;
}
let createLinearOpts = function(maxCases)
{
    let opts = 
        {
            scaleLabel: {
                display: true,
                labelString: 'Case Numbers',
            },
            max_tick: maxCases,
            type: 'linear',
            position: 'left'
        }
    return opts;

}

let createLogChart = function(ctx, labels, datasets, logOptions)
{
    let chart = new Chart(ctx, {
        type: "line",
        data: 
        {
            "labels": labels,
            "datasets": datasets
        },
        options: 
        {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            scales: {
                yAxes:[logOptions],
                xAxes:[{scaleLabel: {display: true, labelString: "Date"}}]
            }
        },
    });
    return chart;

}
let addButtonListeners = function(linearId, logarithmicId, linearOpts, logarithmicOpts, chart)
{
    document.getElementById(linearId).addEventListener("click", function()
        {
            document.getElementById(linearId).style.display = "block";
            document.getElementById(linearId).className = "tablinks active";
            document.getElementById(logarithmicId).className = "tablinks";
            chart.options.scales.yAxes = [linearOpts] ;
            chart.update();
        });
    document.getElementById(logarithmicId).addEventListener("click", 
        function () 
        {
            document.getElementById(logarithmicId).style.display = "block";
            document.getElementById(logarithmicId).className = 
                "tablinks active";
            document.getElementById(linearId).className = "tablinks";
            chart.options.scales.yAxes = [logarithmicOpts] ;
            chart.update();

        });


}
let addTouchListeners = function(chartEl)
{
    chartEl.addEventListener("touchstart", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
            originalTarget: chartEl
        });
        chartEl.dispatchEvent(mouseEvent);
    }, false);
    chartEl.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        chartEl.dispatchEvent(mouseEvent);
    }, false);
    chartEl.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY,
            originalTarget: chartEl
        });
        chartEl.dispatchEvent(mouseEvent);
    }, false);

}
let initAgeCases = function(ageTimeData)
{
    let datasets = ageTimeData.datasets;
    let labels = ageTimeData.labels;
    let updateTime = ageTimeData.lastUpdated;
    document.getElementById("updateAgeTime").innerText = 
        "Last updated: "+updateTime;
    let maxCases = datasets[7].maxCases;
    let logarithmicOptions = createLogOpts(maxCases);
    let linearOptions = createLinearOpts(maxCases);
    var chartEl = document.getElementById("ageCaseGraph");
    var ctx = chartEl.getContext('2d');
    var caseLineChart = createLogChart(ctx, labels, datasets, logarithmicOptions);
    createLegend(caseLineChart, document.getElementById("ageCaseLegend"));
    addTouchListeners(chartEl);
    addButtonListeners("linearAgeTab", "logarithmicAgeTab", linearOptions, logarithmicOptions, caseLineChart);
}
let createLegendColor = function(color)
{
    let el = document.createElement("div");
    el.className = "legendColor";
    el.style.backgroundColor = color;
    return el;
}
let createLegendText = function(text)
{
    let el = document.createElement("span");
    el.className = "legendText";
    el.innerText = text;
    return el;
}
let setLegendItemHidden = function(el, item, chart)
{
    chart.getDatasetMeta(item.datasetIndex).hidden = true;
    item.hidden = true;
    chart.update();
    el.className = "legendItem hidden";
}
let setLegendItemShown = function(el, item, chart)
{
    chart.getDatasetMeta(item.datasetIndex).hidden = false;
    item.hidden = false;
    chart.update();
    el.className = "legendItem shown";
}
let legendItemClicked = function(el, item, chart)
{
    (item.hidden) ? 
        setLegendItemShown(el, item, chart) :
        setLegendItemHidden(el, item, chart);
}
let createLegendItem = function(item, chart)
{
    let el = document.createElement("div");
    el.className = "legendItem";
    if(item.hidden)
        el.className += " hidden";
    else
        el.className += " shown";
    el.appendChild(createLegendColor(item.fillStyle));
    el.appendChild(createLegendText(item.text));
    let itemClick = () => {legendItemClicked(el, item, chart)};
    el.addEventListener("click", itemClick);
    return el;
}
let createLegend = function(chart, legendContainer)
{
    for(i in chart.legend.legendItems)
    {
        let item = chart.legend.legendItems[i];
        legendContainer.appendChild(createLegendItem(item, chart));
    }
}



let initTownCases = function(townTimeData)
{
    let datasets = townTimeData.datasets;
    let labels = townTimeData.labels;
    let updateTime = townTimeData.lastUpdated;
    document.getElementById("updateTownTime").innerText = 
        "Last updated: "+updateTime;
    let maxCases = datasets[8].maxCases;
    let logarithmicOptions = createLogOpts(maxCases);
    let linearOptions = createLinearOpts(maxCases);
    var chartEl = document.getElementById("townCaseGraph");
    var ctx = chartEl.getContext('2d');
    var caseLineChart = createLogChart(ctx, labels, datasets, logarithmicOptions);
    createLegend(caseLineChart, document.getElementById("townCaseLegend"));


    addButtonListeners("linearTownTab", "logarithmicTownTab", linearOptions, logarithmicOptions, caseLineChart);
}

window.onload = function()
{
    Chart.defaults.global.maintainAspectRatio = false;
    fetch("ageTimeData.json")
        .then(response => response.json())
        .then(json => initAgeCases(json))
    fetch("townTimeData.json")
        .then(response => response.json())
        .then(json => initTownCases(json))
}
