const MAX = 10000;

function skmeans(data,k,initial,maxit) {
	var ks = [], idxs = [], len = data.length;
	var conv = false, it = maxit || MAX;

	if(!initial) {
		for(let i=0;i<k;i++) {
			ks.push(data[Math.floor(Math.random()*len)]);
		}
	}
	else {
		ks = initial;
	}

	do {
		for(let i=0;i<len;i++) {
			let min = Infinity, idx = 0;
			for(let j=0;j<k;j++) {
				var dist = Math.abs(data[i]-ks[j]);
				if(dist<min) {
					min = dist;
					idx = j;
				}
			}
			idxs[i] = idx;
		}

		var count = [], sum = [], old = [], dif = 0;
		for(let j=0;j<k;j++) {
			count[j] = sum[j] = 0;
			old[j] = ks[j];
		}

		for(let i=0;i<len;i++) {
			sum[idxs[i]] += data[i];
			count[idxs[i]]++;
		}

		for(let j=0;j<k;j++) {
			ks[j] = sum[j]/count[j] || 0;
			dif += old[j] - ks[j];
		}

		conv = (dif==0) || (--it<=0);
	}while(!conv);

	return {
		it : MAX-it,
		k : k,
		idxs : idxs,
		centroids : ks
	}
}

module.exports = skmeans;
