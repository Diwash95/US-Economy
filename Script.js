// This function controls which page content is shown
function showPage(pageId) {
    
    // We hide all the page content sections first
    document.querySelectorAll('.page-content').forEach(div => {
        div.classList.add('hidden');
    });

    // We remove the active class from all navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-link');
    });

    // We show the requested page content
    const pageElement = document.getElementById('page-' + pageId);
    if (pageElement) {
        pageElement.classList.remove('hidden');
    }

    // We set the active class on the corresponding navigation link
    const linkElement = document.getElementById('link-' + pageId);
    if (linkElement) {
        linkElement.classList.add('active-link');
    }

    // If the page contains a D3 chart we call the function to draw it
    if (pageId === 'data1') {
        drawBarChart();
    } else if (pageId === 'data2') {
        drawCirclePlot();
    }
    // You can add more pages here like else if (pageId === 'page4') { drawNewChart(); }
}

// This function handles the page loading and navigation when the hash changes
function handleRouting() {
    // We get the hash from the URL and remove the starting hash symbol
    let pageId = window.location.hash.substring(1);
    
    // If there is no hash we default to the home page
    if (!pageId) {
        pageId = 'home';
    }
    
    // We call the function to show the page
    showPage(pageId);
}

// We listen for changes in the URL hash like when the user clicks a link
window.addEventListener('hashchange', handleRouting);

// We call the routing function when the page first loads
window.addEventListener('load', handleRouting);


// --- D3 JS Functions Start Here ---

// This function draws a simple bar chart
function drawBarChart() {
    
    // We define the data for the bar chart
    const data = [
        { product: "A", sales: 80 },
        { product: "B", sales: 120 },
        { product: "C", sales: 40 },
        { product: "D", sales: 150 },
        { product: "E", sales: 95 }
    ];

    // We define the size of the visualization
    const container = d3.select("#chart-bar");
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // We clear any existing chart before drawing
    container.html(""); 

    // We create the main drawing area which is a SVG element
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // We create the X scale for the product names
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.product))
        .range([0, innerWidth])
        .padding(0.1);

    // We create the Y scale for the sales numbers
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([innerHeight, 0]);

    // We draw the actual bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.product))
        .attr("y", d => yScale(d.sales))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.sales))
        .attr("fill", "#4f46e5"); // The color of the bars

    // We add the X axis which shows the product names
    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

    // We add the Y axis which shows the sales numbers
    svg.append("g")
        .call(d3.axisLeft(yScale));
}

// This function draws a simple circle plot
function drawCirclePlot() {
    
    // We define the data for the circle plot
    const data = [
        { x: 10, y: 25, value: 5 },
        { x: 20, y: 80, value: 15 },
        { x: 45, y: 40, value: 10 },
        { x: 60, y: 95, value: 20 },
        { x: 85, y: 15, value: 8 }
    ];

    // We define the size of the visualization
    const container = d3.select("#chart-circles");
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // We clear any existing chart before drawing
    container.html(""); 

    // We create the main drawing area which is a SVG element
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // We create the X scale to map data X to screen position
    const xScale = d3.scaleLinear()
        .domain([0, 100]) // Data range from 0 to 100
        .range([0, innerWidth]);

    // We create the Y scale to map data Y to screen position
    const yScale = d3.scaleLinear()
        .domain([0, 100]) // Data range from 0 to 100
        .range([innerHeight, 0]); // Note Y starts at bottom for D3

    // We create the scale for the circle radius
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.value)])
        .range([0, 25]); // Radius will be between 0 and 25 pixels

    // We draw the circles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x)) // Center X position
        .attr("cy", d => yScale(d.y)) // Center Y position
        .attr("r", d => radiusScale(d.value)) // Radius based on value
        .attr("fill", "#10b981") // The color of the circles
        .attr("opacity", 0.7); // Make them slightly transparent

    // We add the X axis
    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

    // We add the Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale));
}

// We also want to redraw the charts if the window size changes
// This makes sure the visualizations are always shown correctly
window.addEventListener('resize', () => {
     // We only redraw if the user is on the chart pages
     if (window.location.hash === '#data1') {
         drawBarChart();
     } else if (window.location.hash === '#data2') {
         drawCirclePlot();
     }
});
