function buildMetadata(sample){


    d3.json("samples.json").then(function(data){
        var metadata = data.metadata;

        var resultArray = metadata.filter(function(data){
            return data.id == sample;
        })

        var result = resultArray[0];
        var demogPanel = d3.select("#sample-metadata");


        // Clear any previous data
        demogPanel.html("");

        Object.entries(result).forEach(function([key, value]){
            demogPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        })

    })
}

//Charts
function buildChart(sample){
    d3.json("samples.json").then(function(data){
        var samples = data.samples;
        // filter sample to return ID
        var resultArray = samples.filter(function(data){
            return data.id === sample;
        })
        // Assign variable to extracted sample
        var result = resultArray[0];
        // Assign variables to extracted data
        var otu_ids = result.otu_ids;
        var otu_lables = result.otu_lables;
        var sample_values = result.sample_values;

        // Bubble Chart - Layout/Design
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis:{title: "OTU ID"},
            margin: {t:30}
        }
        // Datapoints for BubbleChart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_lables,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
    ];

    // Reference 'bubble' ID from index.html to render plot w/ Plotly
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yticks = otu_ids.slice(0, 10).map(function(otuID)
    {
        return `OTU ${otuID}`;
    }).reverse();


    var bar_samples = sample_values.slice(0, 10);
    // // Error: Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'slice')
    // Just using 'otu_labels' works - no need to slice 
    // var bar_lables = otu_lables.slice(0, 10)
    var bar_lables = otu_lables;

    var barData = [
        {
            y: yticks,
            x: bar_samples.reverse(),
            text: bar_lables,
            type: "bar",
            orientation: "h"
        }
    ];

    var barLayout = {
        title: "Top Bacteria Cultures",
        margin: {t: 30, l: 140}
    };
    
    Plotly.newPlot("bar", barData, barLayout);

    })
}


// Dashboard Init
function init(){
    console.log("Init");
    // grab selector
    var selector = d3.select("#selDataset");
    // use sample names
    d3.json("samples.json").then(function(data){
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach(function(name){
            selector
            .append("option")
            .text(name)
            .property("value", name)
        })

        var firstSample = sampleNames[0];
        buildChart(firstSample);
        buildMetadata(firstSample);

    })
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildChart(newSample);
    buildMetadata(newSample);
}
  


init();