let createLogOpts = function(maxCases)
{
    tickPower = Math.ceil(Math.log10(maxCases));
    maxTick = Math.pow(10, tickPower);
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
let resizeChart = function(chart, size)
{
    if(chart.canvas.height < 500)
    {
        chart.canvas.height = 500;
        chart.canvas.style.height = "500px";
    }
    chart.update();
}
let withinHitBox = function(mouseX, mouseY, hitBox)
{
    let padding = 1;
    return (mouseX+padding > hitBox.left 
        && mouseX-padding < hitBox.left + hitBox.width
        && mouseY+padding > hitBox.top 
        && mouseY-padding < hitBox.top + hitBox.height)
}
let setLegendItemHover = function(index, chart)
{
    if(chart.hovering[index] == true)
        return false;
    chart.hovering[index] = true;
    return true;
}
let unsetLegendItemHover = function(index, chart)
{
    if(chart.hovering[index] == false)
        return false;
    chart.hovering[index] = false;
    return true;
}
let chartLegendHover = function(ev, els, chart)
{
    let rect = ev.originalTarget.getBoundingClientRect();
    let mouseX = ev.clientX - rect.left;
    let mouseY = ev.clientY - rect.top;
    let redraw = false;
    let click = ev.type == "click";
    for(let i in chart.legend.legendHitBoxes)
    {
        let legendHitbox = chart.legend.legendHitBoxes[i];
        if(withinHitBox(mouseX, mouseY, legendHitbox))
        {
            redraw = redraw || setLegendItemHover(i, chart);
        }
        else
        {
            redraw = redraw || unsetLegendItemHover(i, chart);
        }
    }
    if(redraw)
        chart.draw(chart);
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
            onResize: resizeChart,
            maintainAspectRatio: false,
            scales: {
                yAxes:[logOptions],
                xAxes:[{scaleLabel: {display: true, labelString: "Date"}}]
            }
        },
    });
    chart.options.onHover = (ev, els) => {chartLegendHover(ev,els,chart)};
    chart.options.onClick = (ev, els) => {chartLegendHover(ev,els,chart)};
    chart.hovering = [];
    for(let i = 0 ; i < chart.legend.legendItems.length; i++)
        chart.hovering[i] = false;
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
let userDraw = function(chart)
{

    console.log("redrawing");
    let marginX = 4;
    let marginY = 3;
    //    chart.ctx.fillStyle = "rgba(0,0,0,0.1)";
    for(let i in chart.legend.legendItems)
    {
        //(boolean * 2 + boolean) is a number between 0-3 in javascript 
        let backgroundType = chart.legend.legendItems[i].hidden * 2
            + chart.hovering[i];
        switch(backgroundType)
        {
                //not hidden and not mousehover
            case 0:
                chart.ctx.fillStyle = "rgba(0,0,0,0.0)";
                break;
                //not hidden and mousehover
            case 1:
                chart.ctx.fillStyle = "rgba(0,0,0,0.1)";
                break;
                //hidden and not mousehover
            case 2:
                chart.ctx.fillStyle = "rgba(0,0,0,0.2)";
                break;
                //hidden and mousehover
            case 3:
                chart.ctx.fillStyle = "rgba(0,0,0,0.1)";
                break;
        }
        chart.ctx.fillRect(
            chart.legend.legendHitBoxes[i].left - marginX,
            chart.legend.legendHitBoxes[i].top - marginY,
            chart.legend.legendHitBoxes[i].width + 2*marginX,
            chart.legend.legendHitBoxes[i].height + 2*marginY
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
    caseLineChart.userDraw = userDraw;
    addTouchListeners(chartEl);
    addButtonListeners("linearAgeTab", "logarithmicAgeTab", linearOptions, logarithmicOptions, caseLineChart);

    resizeChart(caseLineChart);
}


let initTownCases = function(townTimeData)
{
    let datasets = townTimeData.datasets;
    let labels = townTimeData.labels;
    let updateTime = townTimeData.lastUpdated;
    document.getElementById("updateTownTime").innerText = 
        "Last updated: "+updateTime;
    let maxCases = datasets[7].maxCases;
    let logarithmicOptions = createLogOpts(maxCases);
    let linearOptions = createLinearOpts(maxCases);
    var chartEl = document.getElementById("townCaseGraph");
    var ctx = chartEl.getContext('2d');
    var caseLineChart = createLogChart(ctx, labels, datasets, logarithmicOptions);
    caseLineChart.userDraw = userDraw;

    addButtonListeners("linearTownTab", "logarithmicTownTab", linearOptions, logarithmicOptions, caseLineChart);
    resizeChart(caseLineChart);
}

window.onload = function()
{
    //Chart.defaults.global.maintainAspectRatio = false;
    fetch("ageTimeData.json")
        .then(response => response.json())
        .then(json => initAgeCases(json))
    fetch("townTimeData.json")
        .then(response => response.json())
        .then(json => initTownCases(json))
}
