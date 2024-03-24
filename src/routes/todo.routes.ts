import express, { Router, Request, Response } from 'express';

const router = Router();

interface ToDoItem {
    id: number;
    task: string;
    completed: boolean;
}

let todoList: ToDoItem[] = [
    { id: 1, task: "Send email to Dad", completed: false },
    { id: 2, task: "Buy some presents for Brother", completed: true },
    { id: 3, task: "Clean Home", completed: false }
];

router.get("/todos", (req: Request, res: Response): void => {
    res.status(200).send(todoList); // Assuming todoList is defined somewhere
});

// POST route for deleting a todo
router.post("/delete/:id", (req: Request, res: Response): void => {
    const idToDelete: number = parseInt(req.params.id);
    const todoIndex = todoList.findIndex(todo => todo.id === idToDelete);
    if (todoIndex !== -1) {
        todoList = todoList.filter(todo => todo.id !== idToDelete);
        res.status(200).send("Todo deleted successfully");
    } else {
        res.status(404).send("Todo not found");
    }
});

// POST route for marking a todo as completed
router.post("/complete/:id", (req: Request, res: Response): void => {
    const idToComplete: number = parseInt(req.params.id);
    const todoIndex = todoList.findIndex(todo => todo.id === idToComplete);
    if (todoIndex !== -1) {
        todoList[todoIndex].completed = true;
        res.status(200).send("Todo marked as completed");
    } else {
        res.status(404).send("Todo not found");
    }
});

export { router };
