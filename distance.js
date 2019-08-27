module.exports = {
	/**
	 * Euclidean distance
	 */
	eudist(v1,v2) {
		var len = v1.length;
		var sum = 0;

		for(let i=0;i<len;i++) {
			var d = (v1[i]||0) - (v2[i]||0);
			sum += d*d;
		}
		// Square root not really needed
		return sum;
	},

	mandist(v1,v2) {
		var len = v1.length;
		var sum = 0, d = 0;

		for(let i=0;i<len;i++) {
			d = (v1[i]||0) - (v2[i]||0);
			sum += (d>=0)? d : -d;
		}

		return sum;
	},

	/**
	 * Unidimensional distance
	 */
	dist(v1,v2,sqrt) {
		var d = Math.abs(v1-v2);
		return sqrt? d : d*d;
	}

}
