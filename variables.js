var delay = 1000;

function pulse(selector , o){
  var oo = {};
  oo.f = o&&o.f ? false:true;
  d3.select(selector)
  .attr("transform-origin", "50% 50%" )
  d3.select(selector)
  .transition()
  .duration( delay/2 )
  .delay( o&&o.delay?o.delay:0 )
  .ease( d3.easeCircle )
  .attr('transform', o&&o.f ? 'scale(.9 .9)' : 'scale(1.1 1.1)' )
  .on("end", function(){ pulse(selector, oo) })
}
