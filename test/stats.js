const skmeans = require("../main.js");
const data1 = require("./data/well-separated.js");
const data2 = require("./data/random_pts.js");
const MAX = 1000;

console.log("Simple data (k=3)");
var its = 0;
for(var i=0;i<MAX;i++) {
	var res = skmeans(data1,3);
	its += res.it;
}
console.log("skmeans default\t\t=>",its/MAX);

var its = 0;
for(var i=0;i<MAX;i++) {
	var res = skmeans(data1,3,"kmrand");
	its += res.it;
}
console.log("skmeans kmrand\t\t=>",its/MAX);

var its = 0;
for(var i=0;i<MAX;i++) {
	var res = skmeans(data1,3,"kmpp");
	its += res.it;
}
console.log("skmeans kmpp\t\t=>",its/MAX);

console.log("Complex data (k=16)");
var its = 0;
for(var i=0;i<MAX;i++) {
	var res = skmeans(data2,16);
	its += res.it;
}
console.log("skmeans default\t\t=>",its/MAX);

var its = 0;
for(var i=0;i<MAX;i++) {
	var res = skmeans(data2,16,"kmrand");
	its += res.it;
}
console.log("skmeans kmrand\t\t=>",its/MAX);

var its = 0;
for(var i=0;i<MAX;i++) {
	var res = skmeans(data2,16,"kmpp");
	its += res.it;
}
console.log("skmeans kmpp\t\t=>",its/MAX);
