/**
 * Graphology Symmetric difference Operator
 * ==========================
 */
var isGraph = require('graphology-utils/is-graph');
var Graph = require('graphology');

/**
 * Function returning the symmetric difference of two given graphs.
 *
 * @param  {Graph} G - The first graph.
 * @param  {Graph} H - The second graph.
 * @return {Graph}
 */
module.exports = function symmetricDifference(G, H) {
  if (!isGraph(G) || !isGraph(H))
    throw new Error('graphology-operators/symmetric-difference: invalid graph.');

  if (G.multi !== H.multi)
    throw new Error('graphology-operators/symmetric-difference: both graph should be simple or multi.');

  var R = G.emptyCopy(),
      nodes = G.nodes().concat(H.nodes()),
      gEdges = G.edges(),
      edges = gEdges.concat(H.edges()),
      threshold = gEdges.length,
      graph = G,
      opposite = H,
      method = {true: 'addDirectedEdgeWithKey', false: 'addUndirectedEdgeWithKey'},
      node,
      edge,
      extremities,
      directed,
      gFlag,
      hFlag,
      i, l;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    gFlag = G.hasNode(node);
    hFlag = H.hasNode(node);

    if (gFlag && !hFlag)
      R.addNode(node, G.getAttributes(node))
    else if (!gFlag && hFlag)
      R.addNode(node, H.getAttributes(node))
  }

  for (i = 0, l = edges.length; i < l; i++) {
    if (i === threshold)
      [graph, opposite] = [opposite, graph];
    edge = edges[i];
    directed = graph.directed(edge);
    extremities = graph.extremities(edge);

    if (!opposite.hasNode(extremities[0]) && !opposite.hasNode(extremities[1]))
      R[method[directed]](edge, extremities[0], extremities[1]);
  }

  return R;
};



