import supertest from 'supertest';
import express, { Router } from 'express';

import { router } from '../src/routes/todo.routes'; 

const app = express();
app.use('/', router);

interface ToDoItem {
    id: number;
    task: string;
    completed: boolean;
}

describe('TodoList Controller', () => {
    let todoIdToDelete: number;
    let todoIdToComplete: number;

    beforeAll(() => {
        // Assuming todoList has some initial todos
        // Choose an existing todo for deletion and completion
        todoIdToDelete = 1;
        todoIdToComplete = 3;
    });

    it("should fetch all todos", async () => {
        const response = await supertest(app).get(`/todos`);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([
            { id: 1, task: "Send email to Dad", completed: false },
            { id: 2, task: "Buy some presents for Brother", completed: true },
            { id: 3, task: "Clean Home", completed: false }
        ]);
    });

    it('should delete a todo', async () => {
        const response = await supertest(app).post(`/delete/${todoIdToDelete}`);

        expect(response.status).toBe(200);
        expect(response.text).toBe("Todo deleted successfully");

        // Check if the todo is actually deleted
        // Validate if the todo is deleted
        const todoListAfterDeletion = await supertest(app).get('/todos');
        const deletedTodo = todoListAfterDeletion.body.find((todo: any) => todo.id === todoIdToDelete);
        expect(deletedTodo).toBeUndefined();
    });

    it('should mark a todo as completed', async () => {
        const response = await supertest(app).post(`/complete/${todoIdToComplete}`);

        expect(response.status).toBe(200);
        expect(response.text).toBe("Todo marked as completed");

        // Check if the todo is actually marked as completed
        const todoToComplete = await supertest(app).get(`/todos`);
        const completedTodo = todoToComplete.body.find((todo: ToDoItem) => todo.id === todoIdToComplete);
        expect(completedTodo?.completed).toBe(true);
    });

    // Add more tests for error cases, validation, etc.
});
