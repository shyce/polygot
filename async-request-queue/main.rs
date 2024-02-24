use std::sync::mpsc::{sync_channel, SyncSender, Receiver};
use std::sync::Arc;
use tokio::task::JoinHandle;
use tokio::sync::Semaphore;

type TaskFunc = Arc<dyn Fn() -> JoinHandle<Result<i32, ()>> + Send + Sync>;

struct Task {
    task_func: TaskFunc,
}

struct AsyncQueue {
    max_concurrent_tasks: usize,
    tasks_sender: SyncSender<Task>,
    tasks_receiver: Receiver<Task>,
    semaphore: Arc<Semaphore>,
}

impl AsyncQueue {
    fn new(max_concurrent_tasks: usize) -> Self {
        let (tasks_sender, tasks_receiver) = sync_channel(max_concurrent_tasks);
        let semaphore = Arc::new(Semaphore::new(max_concurrent_tasks));

        AsyncQueue {
            max_concurrent_tasks,
            tasks_sender,
            tasks_receiver,
            semaphore,
        }
    }

    async fn add(&self, task_func: TaskFunc) {
        let task = Task { task_func };
        self.tasks_sender.send(task).unwrap();
        let semaphore = self.semaphore.clone();
        tokio::spawn(async move {
            let _permit = semaphore.acquire().await.unwrap();
            let join_handle = (task.task_func)();
            let _ = join_handle.await;
        });
    }

    async fn process(&self) {
        while let Ok(task) = self.tasks_receiver.recv() {
            self.add(task.task_func).await;
        }
    }
}

async fn example_task(task_number: i32) -> Result<i32, ()> {
    println!("Task {} started", task_number);
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    println!("Task {} completed", task_number);
    Ok(task_number)
}

#[tokio::main]
async fn main() {
    let async_queue = AsyncQueue::new(3);

    for i in 1..=10 {
        let task_number = i;
        let task_func = Arc::new(move || {
            let task_number = task_number;
            tokio::spawn(async move { example_task(task_number).await })
        }) as TaskFunc;
        async_queue.add(task_func).await;
    }

    async_queue.process().await;
}
