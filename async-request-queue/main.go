package main

import (
	"fmt"
	"sync"
	"time"
)

type TaskFunc func() (interface{}, error)

type Task struct {
	taskFunc TaskFunc
	result   chan *Result
}

type Result struct {
	value interface{}
	err   error
}

type AsyncQueue struct {
	maxConcurrentTasks int
	tasks              chan Task
	wg                 sync.WaitGroup
}

func NewAsyncQueue(maxConcurrentTasks int) *AsyncQueue {
	q := &AsyncQueue{
		maxConcurrentTasks: maxConcurrentTasks,
		tasks:              make(chan Task, maxConcurrentTasks),
	}

	q.start()
	return q
}

func (q *AsyncQueue) start() {
	for i := 0; i < q.maxConcurrentTasks; i++ {
		go func() {
			for task := range q.tasks {
				result, err := task.taskFunc()
				task.result <- &Result{value: result, err: err}
				q.wg.Done()
			}
		}()
	}
}

func (q *AsyncQueue) Add(taskFunc TaskFunc) <-chan *Result {
	result := make(chan *Result, 1)
	task := Task{taskFunc: taskFunc, result: result}
	q.wg.Add(1)
	q.tasks <- task
	return result
}

func (q *AsyncQueue) Wait() {
	q.wg.Wait()
	close(q.tasks)
}

func exampleTask(taskNumber int) (interface{}, error) {
	fmt.Printf("Task %d started\n", taskNumber)
	time.Sleep(1 * time.Second)
	fmt.Printf("Task %d completed\n", taskNumber)
	return taskNumber, nil
}

func main() {
	asyncQueue := NewAsyncQueue(3)

	for i := 1; i <= 10; i++ {
		taskNumber := i
		resultCh := asyncQueue.Add(func() (interface{}, error) {
			return exampleTask(taskNumber)
		})
		go func() {
			result := <-resultCh
			if result.err != nil {
				fmt.Printf("Error in task %d: %v\n", taskNumber, result.err)
			} else {
				fmt.Printf("Received result for task %d\n", result.value)
			}
		}()
	}

	asyncQueue.Wait()
}