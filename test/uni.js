const skmeans = require("../main.js");

var data = [];
for(let i=0;i<20;i++) {
	var r = Math.random();
	if(r>=0 && r<0.33) data.push(r);
	else if(r>=0.33 && r<0.66) data.push(r+4);
	else data.push(r+9);
}

var res = skmeans(data,3);
console.log(data);
console.log(res);
