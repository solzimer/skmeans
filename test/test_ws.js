const skmeans = require("../main.js");
const data = require("./data/well-separated.js");

var res = skmeans(data,3,"kmrand");
console.error(res);
var out = data.map((d,i)=>{
	return {
		cluster: "CLUSTER_"+res.idxs[i],
		x:d[0],
		y:d[1]
	}
});

res.centroids.forEach((k,i)=>{
	out.push({
		cluster: "K_"+i,
		x:k[0],
		y:k[1]
	})
});

console.log(JSON.stringify(out));
