const skmeans = require("../main.js");

var data = [];
for(let i=0;i<2000;i++) {
	var r = Math.random();
	if(r>=0 && r<0.33) data.push(r);
	else if(r>=0.33 && r<0.66) data.push(r+4);
	else data.push(r+9);
}

var res = skmeans(data,2,[1,5]);
console.log(res.it,res.centroids);

var res = skmeans(data,2,[1,5],null,(x,y)=>Math.abs(x-y)<5? 0 : 1);
console.log(res.it,res.centroids);

var res = skmeans(data,2,"kmpp");
console.log(res.it,res.centroids);

var res = skmeans(data,2,"kmpp",null,(x,y)=>Math.abs(x-y)<5? 0 : 1);
console.log(res.it,res.centroids);
