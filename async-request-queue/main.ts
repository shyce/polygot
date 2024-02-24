type PromiseFactory<T> = () => Promise<T>;

class AsyncQueue {
  private queue: Array<PromiseFactory<any>> = [];
  private concurrentTasks: number = 0;
  private maxConcurrentTasks: number = 3;

  constructor(maxConcurrentTasks: number = 3) {
    this.maxConcurrentTasks = maxConcurrentTasks;
  }

  async add<T>(promiseFactory: PromiseFactory<T>): Promise<T> {
    // If the number of concurrent tasks is less than the maximum allowed,
    // immediately execute the promise factory
    if (this.concurrentTasks < this.maxConcurrentTasks) {
      this.concurrentTasks++;
      try {
        const result = await promiseFactory();
        this.concurrentTasks--;
        this.processQueue();
        return result;
      } catch (err) {
        this.concurrentTasks--;
        this.processQueue();
        throw err;
      }
    }

    // If the maximum number of concurrent tasks is reached,
    // add the task to the queue and wait for it to be executed later
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await promiseFactory();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length > 0 && this.concurrentTasks < this.maxConcurrentTasks) {
      this.concurrentTasks++;
      const promiseFactory = this.queue.shift();
      if (promiseFactory) {
        try {
          await promiseFactory();
          this.concurrentTasks--;
          this.processQueue();
        } catch {
          this.concurrentTasks--;
          this.processQueue();
        }
      }
    }
  }
}

const asyncQueue = new AsyncQueue();

async function exampleTask(taskNumber: number): Promise<number> {
  console.log(`Task ${taskNumber} started`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Task ${taskNumber} completed`);
  return taskNumber;
}

(async () => {
  for (let i = 1; i <= 10; i++) {
    asyncQueue.add(() => exampleTask(i)).then((taskNumber) => {
      console.log(`Received result for task ${taskNumber}`);
    });
  }
})();
