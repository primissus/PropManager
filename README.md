# PropManager
PropManager is a javascript library that allows you to **set** an **get** complex paths in an object.

# Install
PropManager can be installed from npm

```
npm i @hyperblob/propmanager
```

# Syntax

PropManager supports two types of complex paths, **map** & **array** each of them has its own syntax operator, and they can be chained (see the examples below).

 - **map(*)**: Allows you to set or get the values of a map.
```
    PropManager.get(obj, 'path.to.the.map*');
```
 - **array([])**: Allows you to set or get the values of a map.
 ```
    PropManager.get(obj, 'path.to.the.array[]');
```

**When any of the complex operators are used, they return the values as an array**

# Methods
## get(obj, path): any
The get method as its name tells, **gets** the value of the specified path.
Returns the get value if founded.
```
	const obj = {
		a: {
			b: 'This is the value'
		}
	};
    PropManager.get(obj, 'a.b');// returns 'This is the value'
```
When using a complex operator:
```
	const obj = {
		a: {
			b: 'This is the value 1',
			c: 'This is the value 2'
		}
	};
    PropManager.get(obj, 'a*');// returns ['This is the value 1', 'This is the value 2']
```

## set(obj, path, value, [iteratee](https://lodash.com/docs/4.17.5#iteratee)=[identity](https://lodash.com/docs/4.17.5#identity)): boolean
The get method as its name tells, **sets** the value of the specified path.
The [**iteratee**](https://lodash.com/docs/4.17.5#iteratee) parameter is a function that can modify the set value with the current value, its default value is an  [*identity function*](https://lodash.com/docs/4.17.5#identity).
Returns whether or not was possible to set the values.
```
	const obj = {
		a: {
			b: 'This is the value 1',
			c: 'This is the value 2'
		}
	};
    PropManager.get(obj, 'a.b', 'The new value');// returns true, obj.a.b === 'The new value'
```
When using complex operator:
```
	const obj = {
		a: {
			b: 'This is the value 1',
			c: 'This is the value 2'
		}
	};
    PropManager.set(obj, 'a*', 'The new value');// returns true, obj.a.b === 'The new value' && obj.a.c === 'The new value'
```
When using complex operator with an iteratee:
```
	const obj = {
		a: {
			b: 'This is the value 1',
			c: 'This is the value 2'
		}
	};
    PropManager.set(obj, 'a*', 'The new value', function (setVal, currentVal) {
	    return currentVal + ', ' + setVal + ', Added text';
    });// returns true, obj.a.b === 'This is the value 1, The new value, Added text' && obj.a.c === 'This is the value 1, The new value, Added text'
```

## copy(value): any
Returns a copy of the value.

# Additional
The complex operator can be chained like:
```
'path.to.the.map*.path.to.the.array[].path.to.other.map*.path.to.other.array[]'
```
# Licence
Copyright 2018 Hyper Blob

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
