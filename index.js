async function getData() {
  const rawData = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  );
  const data = await rawData.json();

  return data;
}

function setToolTip() {
  const dots = document.querySelectorAll(".dot");

  dots.forEach((dot) => {
    dot.addEventListener("mouseover", (event) => {
      const name = event.target.getAttribute("data-name");
      const doping = event.target.getAttribute("data-doping");
      const nationality = event.target.getAttribute("nationality");
      const seconds = event.target.getAttribute("data-yvalue");
      const year = event.target.getAttribute("data-xvalue");
      const mousePosition = [event.x, event.y];

      const tooltip = document.createElement("div");
      tooltip.id = "tooltip";
      tooltip.innerHTML = `
          Name: ${name} <br>
          Doping: ${doping === "" ? "None" : doping} <br>
          Nationality: ${nationality} <br>
          Seconds: ${seconds} <br>
          Year: ${year} <br>
        `;
      tooltip.style.position = "fixed";
      tooltip.style.zIndex = "9999";
      tooltip.style.background = "#fff";
      tooltip.style.padding = "10px";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.borderRadius = "4px";
      tooltip.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";

      tooltip.setAttribute("data-year", year);

      const tooltipWidth = 200;
      const windowWidth = window.innerWidth;
      const spaceRight = windowWidth - mousePosition[0];

      if (spaceRight >= tooltipWidth) {
        tooltip.style.left = `${mousePosition[0]}px`;
      } else {
        const spaceLeft = mousePosition[0] - tooltipWidth;
        tooltip.style.left = `${spaceLeft}px`;
      }

      tooltip.style.top = `${mousePosition[1]}px`;

      document.body.appendChild(tooltip);
    });

    dot.addEventListener("mouseout", (event) => {
      document.getElementById("tooltip")?.remove();
    });
  });
}

function appendChart(data) {
  const width = 920;
  const height = 630;
  const padding = 50;

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 2), d3.max(data, (d) => d.Year + 2)])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.max(data, (d) => d.Seconds + 15),
      d3.min(data, (d) => d.Seconds - 15),
    ])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select("main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("text")
    .attr("x", padding - 40)
    .attr("y", padding - 20)
    .text("Seconds")
    .attr("class", "chart-title");

  svg
    .append("text")
    .attr("x", width - 40)
    .attr("y", height - 30)
    .text("Year")
    .attr("class", "chart-title");

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Seconds))
    .attr("r", 10)
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Seconds)
    .attr("data-name", (d) => d.Name)
    .attr("data-doping", (d) => d.Doping)
    .attr("nationality", (d) => d.Nationality)
    .style("fill", function (d) {
      return d.Doping !== "" ? "orange" : "lightblue";
    })
    .style("stroke", "black")
    .style("stroke-width", 1);

  svg
    .append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");

  setToolTip();
}

getData().then((data) => appendChart(data));
