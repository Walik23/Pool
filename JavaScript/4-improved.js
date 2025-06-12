'use strict';

class ObjectPool {
  constructor (factory, { size, max }) {
    this.factory = factory;
    this.max = max;
    this.instances = new Array(size).fill(null).map(() => this.factory());
    this.queue = [];
    this.available = this.instances.length;
  };

  _processQueue() {
    while (this.queue.length > 0 && this.available > 0){
      const { callback } = this.queue.shift();
      callback(this.instances.pop());
      this.available--;
    }
  };

  acquire (callback) {
    if(this.available > 0){
      const instance = this.instances.pop();
      this.available--;
      callback(instance);
    }
    else{
      this.queue.push({ callback });
    }
  };

  release (instance) {
    if (this.instances.length < this.max) {
      this.instances.push(instance);
      this.available++;
      this._processQueue();
    }
  };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);

const FILE_BUFFER_SIZE = 4096;
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);

const pool = new ObjectPool(createFileBuffer, { size: 2, max: 4 });

pool.acquire((instance1) => {
  console.log('Acquired instance 1', instance1);
  setTimeout(() => {
    console.log('Releasing instance 1');
    pool.release(instance1);
  }, 1000);
});

pool.acquire((instance2) => {
  console.log('Acquired instance 2', instance2);
  setTimeout(() => {
    console.log('Releasing instance 2');
    pool.release(instance2);
  }, 1500);
});

pool.acquire((instance3) => {
  console.log('Acquired instance 3', instance3);
  setTimeout(() => {
    console.log('Releasing instance 3');
    pool.release(instance3);
  }, 1000);
});

pool.acquire((instance4) => {
  console.log('Acquired instance 4', instance4);
  setTimeout(() => {
    console.log('Releasing instance 4');
    pool.release(instance4);
  }, 1500);
});
