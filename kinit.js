const
	Distance = require("./distance.js"),
	eudist = Distance.eudist,
	dist = Distance.dist;

module.exports = {
	kmrand(data,k) {
		var map = {}, list = [];
		var ks = [], len = data.length

		for(let i=0;i<len;i++) {
			let d = data[i];
			var key = JSON.stringify(d);
			if(!map[key]) {
				map[key] = true;
				list.push(d);
			}
		};

		if(k>list.length) {
			throw new Error("Cluster size greater than distinct data points");
		}
		else {
			let l = list.length, m = {};
			while(ks.length<k) {
				let idx = Math.floor(Math.random()*l);
				if(!m[idx]) {
					m[idx] = true;
					ks.push(list[idx]);
				}
			}
		}

		return ks;
	},

	/**
	 * K-means++ initial centroid selection
	 */
	kmpp(data,k) {
		var distance = data[0].length? eudist : dist;
		var ks = [], len = data.length;

		// First random centroid
		var c = data[Math.floor(Math.random()*len)];
		ks.push(c);

		// Retrieve next centroids
		while(ks.length<k) {
			// Min Distances between current centroids and data points
			let dists = [], lk = ks.length;
			let dsum = 0, prs = [];

			for(let i=0;i<len;i++) {
				let min = Infinity;
				for(let j=0;j<lk;j++) {
					let dist = distance(data[i],ks[j]);
					if(dist<=min) min = dist;
				}
				dists[i] = min;
			}

			// Sum all min distances
			for(let i=0;i<len;i++) {
				dsum += dists[i]
			}

			// Probabilities and cummulative prob (cumsum)
			for(let i=0;i<len;i++) {
				prs[i] = {i:i, v:data[i],	pr:dists[i]/dsum, cs:0}
			}

			// Sort Probabilities
			prs.sort((a,b)=>a.pr-b.pr);

			// Cummulative Probabilities
			prs[0].cs = prs[0].pr;
			for(let i=1;i<len;i++) {
				prs[i].cs = prs[i-1].cs + prs[i].pr;
			}

			// Randomize
			let rnd = Math.random();

			// Gets only the items whose cumsum >= rnd
			let idx = 0;
			while(idx<len-1 && prs[idx++].cs>=rnd);

			// this is our new centroid
			ks.push(prs[idx-1].v);
		}

		return ks;
	}

}
