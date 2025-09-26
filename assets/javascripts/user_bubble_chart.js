// Builds a groovy bubble chart illustrating users sized
// by # of likes received in a discourse community.

function user_bubble_chart(userData, d3, tippy) {
  console.log(['tippy is', tippy])
  let [xmin, xmax, ymin, ymax] = [-30, 30, -10, 10];
  userData.forEach(function (u) {
    const x0 = 4 * d3.randomUniform(xmin, xmax)();
    const y0 = 1 * d3.randomUniform(ymin, ymax)();
    u.x0 = x0;
    u.y0 = y0;
  });

  const simulation = d3
    .forceSimulation(userData)
    .force(
      "charge",
      d3.forceManyBody().strength((d) => 0.5 * d.likes_received)
    )
    .force("centerx", d3.forceX().strength(0.1))
    .force("centery", d3.forceY().strength(1))
    .force(
      "collision",
      d3
        .forceCollide()
        .radius(function (d) {
          return 1.1 * Math.sqrt(d.likes_received);
        })
        .strength(0.5)
    );

  let svg = d3.create("svg");
  let defs = svg.append("defs");

  userData.forEach(function (u, i) {
    defs
      .append("pattern")
      .attr("id", `image${i}`)
      .attr("patternUnits", "objectBoundingBox")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1)
      .append("image")
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 1)
      .attr("height", 1)
      .attr("href", u.avatar_url);
  });

  let g = svg.append("g");

  let circs = g
    .selectAll("circle")
    .data(userData)
    .join("circle")
    .attr("cx", (c) => c.x)
    .attr("cy", (c) => c.y)
    .attr("r", (c) => Math.sqrt(c.likes_received))
    .attr("stroke-width", 0.1)
    .style("stroke", "currentColor")
    .attr("fill", (_, i) => `url(#image${i})`)
  circs.each(function(d) {
    try{
      tippy(this, {
        content: `${d.username} - ${d.likes_received} likes`
      });
      console.log(['should be good with ', d])
    }
    catch(e) {
      console.log(['Uh-oh with ', d, e])
    }
  })

  simulation.on("tick", function () {
    circs.attr("cx", (c) => c.x).attr("cy", (c) => c.y);
  });
  simulation.tick(800);
// [xmin, xmax] = d3.extent(userData, (d) => d.x);
// [ymin, ymax] = d3.extent(userData, (d) => d.y);
// xmin = xmin - 20;
// xmax = xmax + 25;
// ymin = ymin - 3;
// ymax = ymax + 3;

[xmin,xmax, ymin,ymax] = [-40,40,-12,12]; 
  svg
    .attr("viewBox", [xmin, ymin, xmax - xmin, ymax - ymin])
    .style("max-width", "100%");

  userData.forEach(function (o) {
    o.x = o.x0;
    o.y = o.y0;
  });

  simulation.alpha(1).alphaMin(0.000000001).alphaDecay(0.1);
  simulation.restart();

  return svg.node();
}