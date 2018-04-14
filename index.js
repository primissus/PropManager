'use strict';
const _ = require('lodash');

function PropManager() {
}

PropManager.prototype.get = function (obj, path) {

  if (/\*|\[]/.test(path)) {
    return this.getDeep(obj, path);
  }

  return _.get(obj, path);

};

PropManager.prototype.getDeep = function (obj, path) {

  if (!path || !path.length) {
    return true;
  }

  const matchingOpsRegexp = /\*|\[]|^\./;
  const beginningOpsRegexp = /^(\*|\[]|\.)/;
  let matched = path.match(matchingOpsRegexp);
  let data = [];

  if (matched) {

    const matchedIsAtEnd = matched.index + matched[0].length >= path.length;
    let propPath = path.slice(0, matched.index);

    path = path.slice(matched.index + matched[0].length);

    let propVal = (propPath === '' ? obj : _.get(obj, propPath));

    if (propVal) {
      if (matched[0] === '*' || matched[0] === '[]') {

        if (matchedIsAtEnd) {

          _.forEach(propVal, (itemVal, itemName) => {
            data.push(itemVal);
          });

        } else {

          _.forEach(propVal, (itemVal, itemPath) => {
            data = data.concat(this.getDeep(itemVal, path, data));
          });

        }

      } else {

        data = this.getDeep(propVal, path);

      }

    }

  } else {

    data = _.get(obj, path);

  }

  return data;

};

PropManager.prototype.set = function (obj, path, val, iteratee) {
  iteratee = iteratee || _.identity;

  if (/\*|\[]/.test(path)) {
    return this.setDeep(obj, path, val, iteratee);
  }

  return _.set(obj, path, iteratee(val, _.get(obj, path)));

};

PropManager.prototype.setDeep = function (obj, path, val, iteratee) {
  if (!path || !path.length) {
    return true;
  }
  iteratee = iteratee || _.identity;

  const matchingOpsRegexp = /\*|\[]|^\./;
  const beginningOpsRegexp = /^(\*|\[]|\.)/;
  let matched = path.match(matchingOpsRegexp);
  let success = true;

  if (matched) {

    const matchedIsAtEnd = matched.index + matched[0].length >= path.length;
    let propPath = path.slice(0, matched.index);

    path = path.slice(matched.index + matched[0].length);

    let propVal = (propPath === '' ? obj : _.get(obj, propPath));

    if (propVal) {
      if (matched[0] === '*' || matched[0] === '[]') {

        if (matchedIsAtEnd) {

          _.forEach(propVal, (itemVal, itemName) => {
            success = !!_.set(propVal, itemName, iteratee(val, itemVal));
          });

        } else {

          _.forEach(propVal, (itemVal, itemPath) => {
            success = this.setDeep(itemVal, path, val, iteratee) && success;
          });

        }

      } else {

        success = this.setDeep(propVal, path, val, iteratee);

      }

      while(matched = path.match(beginningOpsRegexp)) {
        path = path.slice(matched.index + matched[1].length);
      }
    }

    if (path.search(matchingOpsRegexp) > -1) {
      success = this.setDeep(propVal || obj, path, val, iteratee);
    }

  } else {

    success = !!_.set(obj, path, iteratee(val, _.get(obj, path)));

  }

  return success;

};

module.exports = new PropManager();
