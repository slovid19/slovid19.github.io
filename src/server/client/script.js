let caseCharts = {};
let createLogOpts = function(maxCases, includeZero = false, label = 'Case Numbers')
{
    const tickPower = Math.ceil(Math.log10(maxCases));
    const maxTick = Math.pow(10, tickPower);
    let opts =  
        {
            scaleLabel: {
                display: true,
                labelString: label
            },
            type: 'logarithmic',
            position: 'left',
            ticks: {
                min: (includeZero) ? 0 : 1, //minimum tick
                max: maxTick, //maximum tick
                callback: function (value, index, values) {
                    return Number(value.toString());
                }
            },
            afterBuildTicks: function (chartObj) { 
                chartObj.ticks = [];
                if(includeZero)
                    chartObj.ticks.push(0);
                for(let i = 0; i < tickPower + 1; ++i)
                {
                    chartObj.ticks.push(Math.pow(10,i));
                }

            }
        };
    return opts;
}
let createLinearOpts = function(maxCases, label = 'Case Numbers')
{
    let opts = 
        {
            scaleLabel: {
                display: true,
                labelString: label,
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
            },

            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let num = tooltipItem.yLabel;
                        let wholeNum = Math.floor(num);
                        let decimalPlace = 
                            Math.round((num - Math.floor(num))*100) / 100;
                        num = wholeNum + decimalPlace;
                        if(num == 0)
                            num = "0";
                        return (num); 
                    }
                }
            }
        },
    });
    return chart;

}
let addButtonListeners = function(linearIds, logarithmicIds, linearOpts, logarithmicOpts, chart)
{
    for(let i in linearIds)
    {
        let linearId = linearIds[i];
        document.getElementById(linearId).addEventListener("click", function()
            {
                for(let j in linearIds)
                {
                    let linearId = linearIds[j];
                    document.getElementById(linearId).style.display = "block";
                    document.getElementById(linearId).className = "tablinks active";
                }
                for(let j in logarithmicIds)
                {
                    let logarithmicId = logarithmicIds[j];
                    document.getElementById(logarithmicId).className = "tablinks";
                }

                chart.options.scales.yAxes = [linearOpts] ;
                if(window.getComputedStyle(chart.canvas).visibility == "visible")
                {
                    console.log(window.getComputedStyle(chart.canvas).visibility);
                    chart.update();
                }
            
            }
        );
    }
    for(let i in logarithmicIds)
    {
        let logarithmicId = logarithmicIds[i];
        document.getElementById(logarithmicId).addEventListener("click", 
            function () 
            {
                for(let j in logarithmicIds)
                {
                    let logarithmicId = logarithmicIds[j];
                    console.log(logarithmicId);
                    document.getElementById(logarithmicId).style.display = "block";
                    document.getElementById(logarithmicId).className = 
                        "tablinks active";
                }
                for(let i in linearIds)
                {
                    let linearId = linearIds[i];
                    document.getElementById(linearId).className = "tablinks";
                }
                chart.options.scales.yAxes = [logarithmicOpts] ;

                if(window.getComputedStyle(chart.canvas).visibility == "visible")
                {
                    console.log(window.getComputedStyle(chart.canvas).visibility == "visible");
                    chart.update();
                }
            }
        );
    }
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
    caseCharts["ageCaseGraph"] = caseLineChart;
    createLegend(caseLineChart, document.getElementById("ageCaseLegend"));
    addTouchListeners(chartEl);
    addButtonListeners(["linearAgeTab"], ["logarithmicAgeTab"], linearOptions, logarithmicOptions, caseLineChart);
}
let initTownCapitaCases = function(townCapitaData)
{
    let datasets = townCapitaData.datasets;
    let labels = townCapitaData.labels;
    let updateTime = townCapitaData.lastUpdated;
    document.getElementById("updateTownCapitaTime").innerText = 
        "Last updated: "+updateTime;
    let maxCases = datasets[6].maxCases;
    let logarithmicOptions = createLogOpts(maxCases, true, 'Cases Per 1000 Residents');
    let linearOptions = createLinearOpts(maxCases, 'Cases Per 1000 Residents');
    var chartEl = document.getElementById("townCapitaGraph");
    var ctx = chartEl.getContext('2d');
    var caseLineChart = createLogChart(ctx, labels, datasets, logarithmicOptions);
    caseCharts["townCapitaGraph"] = caseLineChart;
    createLegend(caseLineChart, document.getElementById("townCapitaLegend"), townCapitaData);
    citeSources(document.getElementById("townCapitaSources"), townCapitaData);
    addTouchListeners(chartEl);
    addButtonListeners(["linearTownCapitaTab", "linearTownTab"], ["logarithmicTownCapitaTab", "logarithmicTownTab"], linearOptions, logarithmicOptions, caseLineChart);
    //    addButtonListeners(["linearTownTab"], ["logarithmicTownTab"], linearOptions, logarithmicOptions, caseLineChart);
}
let createSource = function(num, date, URL)
{
    let el = document.createElement("span");
    el.className = "sourceText";
    el.innerHTML = "["+(Number(num)+1)+"]: Based on population estimate for "
        + date + " from: ";

    let a = document.createElement("a");
    a.href = URL;
    a.innerText = URL
    el.appendChild(a);
    el.appendChild(document.createElement("br"));
    return el;
}
let citeSources = function(el, data)
{
    for(let i in data.sources)
    {
        let text = "["+(Number(i)+1)+"]: Based on population estimate for "
            + data.sources[i]["Estimation Date"] + " from: " 
            + data.sources[i]["URL"];
        let sourceEl = createSource(i, data.sources[i]["Estimation Date"],
            data.sources[i]["URL"]);
        el.appendChild(sourceEl);
    }
}
let createLegendColor = function(color)
{
    let el = document.createElement("div");
    el.className = "legendColor";
    el.style.backgroundColor = color;
    return el;
}
let createLegendText = function(text, data)
{
    let source = undefined;
    if(data.townSources)
        source = data.townSources[text];
    let el = document.createElement("span");
    el.className = "legendText";
    el.innerText = text;
    if(source)
    {
        let sourceEl = document.createElement("span");
        sourceEl.className = "legendSource";
        sourceEl.innerHTML = "<sup>["+source+"]</sup>";
        el.appendChild(sourceEl);
    }
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
let createLegendItem = function(item, chart, data)
{
    let el = document.createElement("div");
    el.className = "legendItem";
    if(item.hidden)
        el.className += " hidden";
    else
        el.className += " shown";
    el.appendChild(createLegendColor(item.fillStyle));
    el.appendChild(createLegendText(item.text, data));
    let itemClick = () => {legendItemClicked(el, item, chart)};
    el.addEventListener("click", itemClick);
    return el;
}
let createLegend = function(chart, legendContainer, data={})
{
    for(i in chart.legend.legendItems)
    {
        let item = chart.legend.legendItems[i];
        legendContainer.appendChild(createLegendItem(item, chart, data));
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
    caseCharts["townCaseGraph"] = caseLineChart;
    createLegend(caseLineChart, document.getElementById("townCaseLegend"));


    addButtonListeners(["linearTownTab", "linearTownCapitaTab"], ["logarithmicTownTab", "logarithmicTownCapitaTab"], linearOptions, logarithmicOptions, caseLineChart);

}
let initTownDataTabs = function()
{
    let totalTownTab = document.getElementById("totalTownTab");
    let capitaTownTab = document.getElementById("capitaTownTab");
    let totalTownContent = document.getElementById("totalTownContent");
    let capitaTownContent = document.getElementById("capitaTownContent");
    capitaTownTab.addEventListener("click", function()
        {
            let capitaTownChart = caseCharts["townCapitaGraph"];

            capitaTownTab.className = "tablinks active";
            totalTownTab.className = "tablinks";
            capitaTownContent.className = "graphContent show";
            totalTownContent.className = "graphContent hidden";
            capitaTownChart.update();
        });
    totalTownTab.addEventListener("click", function()
        {
            let totalTownChart = caseCharts["townCaseGraph"];
            totalTownTab.className = "tablinks active";
            capitaTownTab.className = "tablinks";
            totalTownContent.className = "graphContent show";
            capitaTownContent.className = "graphContent hidden";
            totalTownChart.update();
        });

}
/*   document.getElementById(totalTownTab).addEventListener("click", function()
        {
            document.getElementById(total).style.display = "block";
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
*/

window.onload = function()
{
    Chart.defaults.global.maintainAspectRatio = false;
    fetch("https://raw.githubusercontent.com/slovid19/slovid_data_gathering/master/export/ageTimeData.json")
        .then(response => response.json())
        .then(json => initAgeCases(json));
    fetch("https://raw.githubusercontent.com/slovid19/slovid_data_gathering/master/export/townTimeData.json")
        .then(response => response.json())
        .then(json => initTownCases(json));
    fetch("https://raw.githubusercontent.com/slovid19/slovid_data_gathering/master/export/townTimePer1000.json")
        .then(response => response.json())
        .then(json => initTownCapitaCases(json));
    initTownDataTabs();
}
