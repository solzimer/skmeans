const skmeans = require("../main.js");
const data = require("./data/well-separated.js");

var res = skmeans(data,3,"kmpp");

console.log(data);
console.log(res.centroids);
console.log(res.it);

data.forEach(function(d,i){
	d.push("cluster_"+res.idxs[i]);
	console.log(d.join("\t"));
});
