const pad_top = () => {
  d3.select("body").append('svg')
    .attr('class', 'top-pad')
    .attr('width', window.screen.width)
    .attr('height', 100)
};

const std_svg = () => {
  d3.select("body").append('svg')
    .attr('class', 'std_svg')
    .attr('width', width)
    .attr('height', 250)
}

export { pad_top, std_svg };