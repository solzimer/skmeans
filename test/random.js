const skmeans = require("../main.js");
const data = require("./data/random_pts.js");

for(var i=0;i<1000;i++) {
	var res = skmeans(data,16);
	console.log(res.it,res.centroids,"kmpp");
}
