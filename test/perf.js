const
	skmeans = require("../main.js"),
	nkmeans = require("node-kmeans"),
	mlkmeans = require('ml-kmeans'),
	clkmeans = require('cluster-kmeans'),
	clusters = require('clusters'),
	Benchmark = require('benchmark');

var suite = new Benchmark.Suite;
var data = [];
for(let i=0;i<1000;i++) {
	var r = Math.random();
	if(r>=0 && r<0.33) data.push([r,r*2]);
	else if(r>=0.33 && r<0.66) data.push([r+4,2*(r+4)]);
	else data.push([r+9,2*(r+9)]);
}

// add tests
suite.add('skmeans', function() {
  skmeans(data,3);
})
.add('node-kmeans', function() {
	nkmeans.clusterize(data, {k: 3}, (err,res) => {
	  if (err) console.error(err);
	});
})
.add('ml-kmeans', function() {
	mlkmeans(data, 2);
})
.add('cluster-kmeans', function() {
	let kmeans = new clkmeans();
	kmeans.cluster(data,3);
})
.add('clusters', function() {
	clusters.k(3);
	clusters.data(data);
	clusters.clusters();
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({
	'async': true
});
