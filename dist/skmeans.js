"use strict";

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
			}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, l, l.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
		"use strict";

		(function ($) {
			var skmeans = require("./main.js");
			$.skmeans = skmeans;
		})(window);
	}, { "./main.js": 2 }], 2: [function (require, module, exports) {
		/*jshint esversion: 6 */

		var MAX = 10000;

		/**
   * Euclidean distance
   */
		function eudist(v1, v2) {
			var len = v1.length;
			var sum = 0;

			for (var i = 0; i < len; i++) {
				var d = (v1[i] || 0) - (v2[i] || 0);
				sum += d * d;
			}
			// Square root not really needed
			return sum; //Math.sqrt(sum);
		}

		/**
   * Manhattan distance
   */
		function mandist(v1, v2) {
			var len = v1.length;
			var sum = 0;

			for (var i = 0; i < len; i++) {
				sum += Math.abs((v1[i] || 0) - (v2[i] || 0));
			}
			return sum;
		}

		function equals(v1, v2, multi) {
			var l = v1.length;
			for (var i = 0; i < l; i++) {
				if (v1[i] != v2[i]) return false;
			}return true;
		}

		/**
   * Inits an array with values
   */
		function init(len, val, v) {
			v = v || [];
			for (var i = 0; i < len; i++) {
				v[i] = val;
			}return v;
		}

		function skmeans(data, k, initial, maxit) {
			var ks = [],
			    old = [],
			    idxs = [],
			    dist = [];
			var conv = false,
			    it = maxit || MAX;
			var len = data.length,
			    vlen = data[0].length,
			    multi = vlen > 0;

			if (!initial) {
				for (var i = 0; i < k; i++) {
					ks.push(data[Math.floor(Math.random() * len)]);
				}
			} else {
				ks = initial;
			}

			do {
				// For each value in data, find the nearest centroid
				for (var _i = 0; _i < len; _i++) {
					var min = Infinity,
					    idx = 0;
					for (var j = 0; j < k; j++) {
						// Multidimensional or unidimensional
						var dist = multi ? eudist(data[_i], ks[j]) : Math.abs(data[_i] - ks[j]);
						if (dist < min) {
							min = dist;
							idx = j;
						}
					}
					idxs[_i] = idx;
				}

				// Recalculate centroids
				var count = [],
				    sum = [],
				    old = [],
				    dif = 0;
				for (var _j = 0; _j < k; _j++) {
					// Multidimensional or unidimensional
					count[_j] = 0;
					sum[_j] = multi ? init(vlen, 0, sum[_j]) : 0;
					old[_j] = ks[_j];
				}

				// If multidimensional
				if (multi) {
					for (var _j2 = 0; _j2 < k; _j2++) {
						ks[_j2] = [];
					} // Sum values and count for each centroid
					for (var _i2 = 0; _i2 < len; _i2++) {
						var _idx = idxs[_i2],
						    // Centroid for that item
						vsum = sum[_idx],
						    // Sum values for this centroid
						vect = data[_i2]; // Current vector

						// Accumulate value on the centroid for current vector
						for (var h = 0; h < vlen; h++) {
							vsum[h] += vect[h];
						}
						count[_idx]++; // Number of values for this centroid
					}
					// Calculate the average for each centroid
					conv = true;
					for (var _j3 = 0; _j3 < k; _j3++) {
						var ksj = ks[_j3],
						    // Current centroid
						sumj = sum[_j3],
						    // Accumulated centroid values
						oldj = old[_j3],
						    // Old centroid value
						cj = count[_j3]; // Number of elements for this centrois

						// New average
						for (var _h = 0; _h < vlen; _h++) {
							ksj[_h] = sumj[_h] / cj || 0; // New centroid
						}
						// Find if centroids have moved
						if (conv) {
							for (var _h2 = 0; _h2 < vlen; _h2++) {
								if (oldj[_h2] != ksj[_h2]) {
									conv = false;
									break;
								}
							}
						}
					}
				}
				// If unidimensional
				else {
						// Sum values and count for each centroid
						for (var _i3 = 0; _i3 < len; _i3++) {
							var _idx2 = idxs[_i3];
							sum[_idx2] += data[_i3];
							count[_idx2]++;
						}
						// Calculate the average for each centroid
						for (var _j4 = 0; _j4 < k; _j4++) {
							ks[_j4] = sum[_j4] / count[_j4] || 0; // New centroid
						}
						// Find if centroids have moved
						conv = true;
						for (var _j5 = 0; _j5 < k; _j5++) {
							if (old[_j5] != ks[_j5]) {
								conv = false;
								break;
							}
						}
					}

				conv = conv || --it <= 0;
			} while (!conv);

			return {
				it: MAX - it,
				k: k,
				idxs: idxs,
				centroids: ks
			};
		}

		module.exports = skmeans;
	}, {}] }, {}, [1]);
//# sourceMappingURL=skmeans.js.map
