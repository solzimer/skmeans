"use strict";

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    "use strict";

    (function () {
      var root = this;
      var previous_skmeans = root.skmeans;

      var skmeans = require('./main.js');

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = skmeans;
        }

        exports.skmeans = skmeans;
      }

      if (typeof window !== 'undefined') {
        window.skmeans = skmeans;
      }
    }).call(this);
  }, {
    "./main.js": 4
  }],
  2: [function (require, module, exports) {
    module.exports = {
      /**
       * Euclidean distance
       */
      eudist: function eudist(v1, v2) {
        var len = v1.length;
        var sum = 0;

        for (var i = 0; i < len; i++) {
          var d = (v1[i] || 0) - (v2[i] || 0);
          sum += d * d;
        } // Square root not really needed


        return sum;
      },
      mandist: function mandist(v1, v2) {
        var len = v1.length;
        var sum = 0,
            d = 0;

        for (var i = 0; i < len; i++) {
          d = (v1[i] || 0) - (v2[i] || 0);
          sum += d >= 0 ? d : -d;
        }

        return sum;
      },

      /**
       * Unidimensional distance
       */
      dist: function dist(v1, v2, sqrt) {
        var d = Math.abs(v1 - v2);
        return sqrt ? d : d * d;
      }
    };
  }, {}],
  3: [function (require, module, exports) {
    var Distance = require("./distance.js"),
        eudist = Distance.eudist,
        dist = Distance.dist;

    module.exports = {
      kmrand: function kmrand(data, k) {
        var map = {},
            ks = [],
            t = k << 2;
        var len = data.length;
        var multi = data[0].length > 0;

        while (ks.length < k && t-- > 0) {
          var d = data[Math.floor(Math.random() * len)];
          var key = multi ? d.join("_") : "".concat(d);

          if (!map[key]) {
            map[key] = true;
            ks.push(d);
          }
        }

        if (ks.length < k) throw new Error("Error initializating clusters");else return ks;
      },

      /**
       * K-means++ initial centroid selection
       */
      kmpp: function kmpp(data, k, fndist) {
        var distance = fndist || (data[0].length ? eudist : dist);
        var ks = [],
            len = data.length;
        var multi = data[0].length > 0;
        var map = {}; // First random centroid

        var c = data[Math.floor(Math.random() * len)];
        var key = multi ? c.join("_") : "".concat(c);
        ks.push(c);
        map[key] = true; // Retrieve next centroids

        while (ks.length < k) {
          // Min Distances between current centroids and data points
          var dists = [],
              lk = ks.length;
          var dsum = 0,
              prs = [];

          for (var i = 0; i < len; i++) {
            var min = Infinity;

            for (var j = 0; j < lk; j++) {
              var _dist = distance(data[i], ks[j]);

              if (_dist <= min) min = _dist;
            }

            dists[i] = min;
          } // Sum all min distances


          for (var _i = 0; _i < len; _i++) {
            dsum += dists[_i];
          } // Probabilities and cummulative prob (cumsum)


          for (var _i2 = 0; _i2 < len; _i2++) {
            prs[_i2] = {
              i: _i2,
              v: data[_i2],
              pr: dists[_i2] / dsum,
              cs: 0
            };
          } // Sort Probabilities


          prs.sort(function (a, b) {
            return a.pr - b.pr;
          }); // Cummulative Probabilities

          prs[0].cs = prs[0].pr;

          for (var _i3 = 1; _i3 < len; _i3++) {
            prs[_i3].cs = prs[_i3 - 1].cs + prs[_i3].pr;
          } // Randomize


          var rnd = Math.random(); // Gets only the items whose cumsum >= rnd

          var idx = 0;

          while (idx < len - 1 && prs[idx++].cs < rnd) {
            ;
          }

          ks.push(prs[idx - 1].v);
          /*
          let done = false;
          while(!done) {
          	// this is our new centroid
          	c = prs[idx-1].v
          	key = multi? c.join("_") : `${c}`;
          	if(!map[key]) {
          		map[key] = true;
          		ks.push(c);
          		done = true;
          	}
          	else {
          		idx++;
          	}
          }
          */
        }

        return ks;
      }
    };
  }, {
    "./distance.js": 2
  }],
  4: [function (require, module, exports) {
    /*jshint esversion: 6 */
    var Distance = require("./distance.js"),
        ClusterInit = require("./kinit.js"),
        eudist = Distance.eudist,
        mandist = Distance.mandist,
        absdist = Distance.dist,
        kmrand = ClusterInit.kmrand,
        kmpp = ClusterInit.kmpp;

    var MAX = 10000;
    /**
     * Inits an array with values
     */

    function init(len, val, v) {
      v = v || [];

      for (var i = 0; i < len; i++) {
        v[i] = val;
      }

      return v;
    }

    function test(point, fndist) {
      var multi = Array.isArray(point),
          ks = this.centroids,
          k = ks.length; // For each value in data, find the nearest centroid

      var min = Infinity,
          idx = 0;

      for (var j = 0; j < k; j++) {
        // Custom, Multidimensional or unidimensional
        var dist = fndist ? fndist(point, ks[j]) : multi ? eudist(point, ks[j]) : Math.abs(point - ks[j]);

        if (dist <= min) {
          min = dist;
          idx = j;
        }
      }

      return {
        idx: idx,
        centroid: ks[idx]
      };
    }

    function skmeans(data, k, initial, maxit, fndist) {
      var ks = [],
          old = [],
          idxs = [],
          dist = [];
      var conv = false,
          it = maxit || MAX;
      var len = data.length,
          vlen = data[0].length,
          multi = vlen > 0;
      var count = [];

      if (!initial) {
        var _idxs = {},
            z = 0;

        while (ks.length < k) {
          var idx = Math.floor(Math.random() * len);

          if (!_idxs[idx]) {
            _idxs[idx] = true;
            ks[z++] = data[idx];
          }
        }
      } else if (initial == "kmrand") {
        ks = kmrand(data, k);
      } else if (initial == "kmpp") {
        ks = kmpp(data, k, fndist);
      } else {
        ks = initial;
      }

      do {
        // Reset k count
        init(k, 0, count); // For each value in data, find the nearest centroid

        for (var i = 0; i < len; i++) {
          var min = Infinity,
              _idx = 0;

          for (var j = 0; j < k; j++) {
            // Custom, Multidimensional or unidimensional
            var dist = fndist ? fndist(data[i], ks[j]) : multi ? eudist(data[i], ks[j]) : Math.abs(data[i] - ks[j]);

            if (dist <= min) {
              min = dist;
              _idx = j;
            }
          }

          idxs[i] = _idx; // Index of the selected centroid for that value

          count[_idx]++; // Number of values for this centroid
        } // Recalculate centroids


        var sum = [],
            old = [],
            dif = 0;

        if (multi) {
          for (var _j = 0; _j < k; _j++) {
            sum[_j] = init(vlen, 0, sum[_j]);
            old[_j] = ks[_j];
          }
        } else {
          for (var _j2 = 0; _j2 < k; _j2++) {
            sum[_j2] = 0;
            old[_j2] = ks[_j2];
          }
        } // If multidimensional


        if (multi) {
          for (var _j3 = 0; _j3 < k; _j3++) {
            ks[_j3] = [];
          } // Sum values and count for each centroid


          for (var _i4 = 0; _i4 < len; _i4++) {
            var _idx2 = idxs[_i4],
                // Centroid for that item
            vsum = sum[_idx2],
                // Sum values for this centroid
            vect = data[_i4]; // Current vector
            // Accumulate value on the centroid for current vector

            for (var h = 0; h < vlen; h++) {
              vsum[h] += vect[h];
            }
          } // Calculate the average for each centroid


          conv = true;

          for (var _j4 = 0; _j4 < k; _j4++) {
            var ksj = ks[_j4],
                // Current centroid
            sumj = sum[_j4],
                // Accumulated centroid values
            oldj = old[_j4],
                // Old centroid value
            cj = count[_j4]; // Number of elements for this centroid
            // New average

            for (var _h = 0; _h < vlen; _h++) {
              ksj[_h] = sumj[_h] / cj || 0; // New centroid
            } // Find if centroids have moved


            if (conv) {
              for (var _h2 = 0; _h2 < vlen; _h2++) {
                if (oldj[_h2] != ksj[_h2]) {
                  conv = false;
                  break;
                }
              }
            }
          }
        } // If unidimensional
        else {
            // Sum values and count for each centroid
            for (var _i5 = 0; _i5 < len; _i5++) {
              var _idx3 = idxs[_i5];
              sum[_idx3] += data[_i5];
            } // Calculate the average for each centroid


            for (var _j5 = 0; _j5 < k; _j5++) {
              ks[_j5] = sum[_j5] / count[_j5] || 0; // New centroid
            } // Find if centroids have moved


            conv = true;

            for (var _j6 = 0; _j6 < k; _j6++) {
              if (old[_j6] != ks[_j6]) {
                conv = false;
                break;
              }
            }
          }

        conv = conv || --it <= 0;
      } while (!conv);

      return {
        it: (maxit || MAX) - it,
        k: k,
        idxs: idxs,
        centroids: ks,
        test: test
      };
    }

    module.exports = skmeans;
  }, {
    "./distance.js": 2,
    "./kinit.js": 3
  }]
}, {}, [1]);
//# sourceMappingURL=skmeans.js.map
