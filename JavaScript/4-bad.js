'use strict';

const poolify = (factory, size, max) => {
  const instances = new Array(size).fill(null).map(factory);

  const acquire = () => instances.pop() || factory();

  const release = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
    }
  };

  return { acquire, release };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);

const bufferSize = 4096;
const createFileBuffer = () => createBuffer(bufferSize);

const size = 10;
const max = 15;
const pool = poolify(createFileBuffer, size, max);
const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
