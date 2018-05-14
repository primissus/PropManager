'use strict';

const expect = require('chai').expect;
const PropManager = require('./index');

const obj = {
  a: {
    b: {
      c: {
        d: '123',
        e: [
          1,
          2,
          3
        ],
        f: [
          {
            g: 'g1',
            h: {
              '1': '1',
              '2': '2',
              '3': '3'
            }
          },
          {
            g: 'g2',
            h: {
              '4': '4',
              '5': '5',
              '6': '6'
            }
          },
          {
            g: 'g3',
            h: {
              '7': '7',
              '8': '8',
              '9': '9'
            }
          }
        ]
      }
    }
  }
};

const objClone = clone(obj);

describe('PropManager', () => {
  describe('get', () => {

    it('should get 123 from the path a.b.c.d', () => {
      expect(PropManager.get(obj, 'a.b.c.d')).equal('123');
    });

    it('should get 1, 2, 3 from the path a.b.c.e', () => {
      expect(JSON.stringify(PropManager.get(obj, 'a.b.c.e'))).equal(JSON.stringify(obj.a.b.c.e));
    });

    it('should get 1, 2, 3 from the path a.b.c.e[]', () => {
      expect(JSON.stringify(PropManager.get(obj, 'a.b.c.e[]'))).equal(JSON.stringify(obj.a.b.c.e));
    });

    it('should get the correct object from the path a.b', () => {
      expect(JSON.stringify(PropManager.get(obj, 'a.b'))).equal(JSON.stringify(obj.a.b));
    });

    it('should get the correct array of values from the path a.b.c.f[].g', () => {
      expect(JSON.stringify(PropManager.get(obj, 'a.b.c.f[].g'))).equal(JSON.stringify(['g1', 'g2', 'g3']));
    });

    it('should get the correct array of values from the path a.b.c.f[].h*', () => {
      expect(JSON.stringify(PropManager.get(obj, 'a.b.c.f[].h*'))).equal(JSON.stringify(['1', '2', '3', '4', '5', '6', '7', '8', '9']));
    });

    it('should get the correct value at array position from the path a.b.c.f[0].g', () => {
      expect(PropManager.get(obj, 'a.b.c.f[0].g')).equal('g1');
    });

  });

  describe('set', () => {

    it('should set path a.b.c.d to 456', () => {
      PropManager.set(objClone, 'a.b.c.d', '456');
      expect(PropManager.get(objClone, 'a.b.c.d')).equal('456');
    });

    it('should set path a.b.c.e[] to 4,5,6 with iteratee', () => {
      PropManager.set(objClone, 'a.b.c.e[]', null, (setTo, currentVal) => {
        return currentVal + 3;
      });
      expect(JSON.stringify(PropManager.get(objClone, 'a.b.c.e[]'))).equal(JSON.stringify([4,5,6]));
    });

    it('should set path a.b.c.f[].g to "lk"', () => {
      PropManager.set(objClone, 'a.b.c.f[].g', 'lk');
      expect(JSON.stringify(PropManager.get(objClone, 'a.b.c.f[].g'))).equal(JSON.stringify(['lk','lk','lk']));
    });

    it('should set path a.b.c.f[].h* to "ut"', () => {
      PropManager.set(objClone, 'a.b.c.f[].h*', 'ut');
      expect(JSON.stringify(PropManager.get(objClone, 'a.b.c.f[].h*'))).equal(JSON.stringify(['ut', 'ut', 'ut', 'ut', 'ut', 'ut', 'ut', 'ut', 'ut']));
    });

    it('should set path a.b.c.f[0].g to "g2"', () => {
      PropManager.set(objClone, 'a.b.c.f[0].g', 'g2');
      expect(PropManager.get(objClone, 'a.b.c.f[0].g')).equal('g2');
    });

  });

  describe('unset', () => {
    it('should unset path a[]', () => {
      let tmpObj = {a: [{a: 1, b: true}, {a: 2, b: true}], b: true}
      PropManager.unset(tmpObj, 'a[]');
      expect(tmpObj).to.deep.equal({a: [], b: true});
    });

    it('should unset path a[].b', () => {
      let tmpObj = {a: [{a: 1, b: true}, {a: 2, b: true}], b: true}
      PropManager.unset(tmpObj, 'a[].b');
      expect(tmpObj).to.deep.equal({a: [{a: 1}, {a: 2}], b: true});
    });

    it('should unset path a[].b[]', () => {
      let tmpObj = {a: [{a: 1, b: [1,2,3]}, {a: 2}], b: true};
      PropManager.unset(tmpObj, 'a[].b[]');
      expect(tmpObj).to.deep.equal({a: [{a: 1, b: []}, {a: 2}], b: true});
    });

    it('should unset path a[0].a', () => {
      let tmpObj = {a: [{a: 1, b: true}, {a: 2, b: true}], b: true}
      PropManager.unset(tmpObj, 'a[0].a');
      expect(tmpObj).to.deep.equal({a: [{b: true}, {a: 2, b: true}], b: true});
    });

    it('should unset path b*.a', () => {
      let tmpObj = {a: false, b: {a: {a:1, b: true}, b: {a: 1, b: true}}};
      PropManager.unset(tmpObj, 'b*.a');
      expect(tmpObj).to.deep.equal({ a: false, b: { a: { b: true }, b: { b: true } } });
    });

    it('should unset path b*', () => {
      let tmpObj = {a: false, b: {a: {a:1, b: true}, b: {a: 1, b: true}}};
      PropManager.unset(tmpObj, 'b*');
      expect(tmpObj).to.deep.equal({ a: false, b: {} });
    });
  });

});

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
