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
			return Math.sqrt(sum);
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

		/**
   * Inits an array with values
   */
		function init(len, val) {
			var v = [];
			for (var i = 0; i < len; i++) {
				v.push(val);
			}return v;
		}

		function skmeans(data, k, initial, maxit) {
			"use strict";

			var ks = [],
			    idxs = [],
			    len = data.length;
			var conv = false,
			    it = maxit || MAX;
			var multi = data[0].length;

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
					sum[_j] = multi ? init(multi, 0) : 0;
					old[_j] = ks[_j];
				}

				// If multidimensional
				if (multi) {
					for (var _j2 = 0; _j2 < k; _j2++) {
						ks[_j2] = [];
					} // Sum values and count for each centroid
					for (var _i2 = 0; _i2 < len; _i2++) {
						for (var h = 0; h < multi; h++) {
							sum[idxs[_i2]][h] += data[_i2][h];
						}
						count[idxs[_i2]]++;
					}
					// Calculate de average for each centroid
					// and de distance between old and new centroids
					for (var _j3 = 0; _j3 < k; _j3++) {
						for (var _h = 0; _h < multi; _h++) {
							ks[_j3][_h] = sum[_j3][_h] / count[_j3] || 0;
							dif += old[_j3][_h] - ks[_j3][_h];
						}
					}
				}
				// If unidimensional
				else {
						// Sum values and count for each centroid
						for (var _i3 = 0; _i3 < len; _i3++) {
							sum[idxs[_i3]] += data[_i3];
							count[idxs[_i3]]++;
						}
						// Calculate de average for each centroid
						// and de distance between old and new centroids
						for (var _j4 = 0; _j4 < k; _j4++) {
							ks[_j4] = sum[_j4] / count[_j4] || 0;
							dif += old[_j4] - ks[_j4];
						}
					}

				conv = dif === 0 || --it <= 0;
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
