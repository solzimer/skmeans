# skmeans

Super fast simple k-means implementation for unidimiensional data.

## Installation
```
npm install skmeans
```

## Usage
```javascript
const skmeans = require("skmeans");

var data = [1,12,13,4,25,21,22,3,14,5,11,2,23,24,15];
var res = skmeans(data,3);
```

## Results
```javascript
{
	it: 2,
	k: 3,
	idxs: [ 2, 0, 0, 2, 1, 1, 1, 2, 0, 2, 0, 2, 1, 1, 0 ],
	centroids: [ 13, 23, 3 ]
}
```

## API
### skmeans(data,k,[centroids],[iterations])
Calculates unidimiensional k-means clustering on *data*. Parameters are:
* **data** Unidimiensional array of values to be clustered.
* **k** Number of clusters
* **centroids** Optional. Initial centroid values. If not provided, the algorith will try to choose an apropiate ones.
* **iterations** Optional. Maximum number of iterations. If not provided, it will be set to 10000.

The function will return an object with the following data:
* **it** The number of iterations performed until the algorithm has converged
* **k** The cluster size
* **centroids** The value for each centroid of the cluster
* **idxs** The index to the centroid corresponding to each value of the data array
