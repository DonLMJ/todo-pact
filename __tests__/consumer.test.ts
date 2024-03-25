import { Pact, Matchers } from '@pact-foundation/pact';
import supertest from 'supertest';
import express, { Router } from 'express';
//import app from '../app'; // Import Express app
import { router } from '../src/routes/todo.routes';
const path = require('path');

//mock service to represent the provider in our contract test
const provider = new Pact({
    consumer: 'TodoConsumer',
    provider: 'TodoProvider',
    port: 8000, // Choose a suitable port
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
});


const app = express();
app.use('/', router);
beforeAll(() => provider.setup());
//afterEach(() => provider.verify());
afterAll(() => provider.finalize());


// Use pactWith to define the consumer and provider for Pact tests
describe('Todo Consumer', () => {

    // Test for getting todos with valid response
    test('should get todos successfully', async () => {
        await provider.addInteraction({
            state: 'todo items exist',
            uponReceiving: 'a request to get all todos',
            withRequest: {
                method: 'GET',
                path: '/todos',
            },
            willRespondWith: {
                status: 200,
                body: [
                    {
                        id: Matchers.term({
                            matcher: '^[0-3]+$',
                            generate: '1'
                        }),
                        task: Matchers.term({
                            matcher: '.*', // Match any string
                            generate: 'Send email to Dad' // Example string
                        }),
                        completed: Matchers.boolean(false),
                    },
                ],
            },
        });

        const response = await supertest(app).get('/todos');

        expect(response.status).toBe(200);
        expect(typeof response.body[0].id).toBe('number'); // Check if id is numeric
        expect(typeof response.body[0].task).toBe('string'); // Check if task is a string
        expect(response.body[0].completed).toBe(false);
    });

    // Test for handling invalid input when deleting a todo
    test('should handle invalid input when deleting todo', async () => {
        // Define interaction for deleting todo with invalid input
        await provider.addInteraction({
            state: 'a todo item exists with id 1',
            uponReceiving: 'a request to delete todo with invalid input',
            withRequest: {
                method: 'POST',
                path: '/delete/' + Matchers.term({ generate: 'abc', matcher: '\\D+' }), // Using term matcher for non-numeric id
            },
            willRespondWith: {
                status: 404, // Bad request
            },
        });

        // Send request to delete todo with invalid input
        const response = await supertest(app).post('/delete/abc');
        // Validate response
        expect(response.status).toBe(404);
    });

    // Test for handling error when marking a todo as completed
    test('should handle error when marking todo as completed', async () => {
        await provider.addInteraction({
            state: 'a todo item exists with id 1',
            uponReceiving: 'a request to mark todo as completed with invalid input',
            withRequest: {
                method: 'POST',
                path: '/complete/' + Matchers.term({ generate: 'abc', matcher: '\\D+' }), // Using term matcher for non-numeric id
            },
            willRespondWith: {
                status: 404, // Not found
                body: 'Todo not found',
            },
        });

        const response = await supertest(app).post('/complete/abc');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Todo not found');
    });

    // Add other tests similarly


    describe('Todo Provider', () => {

        it('should validate the expectations of the consumer', async () => {
            const opts = {
                provider: 'TodoProvider',
                providerBaseUrl: `http://localhost:8000`,
                providerStatesSetupUrl: `http://localhost:8000/setup`,
                pactUrls: [
                    path.resolve(
                        process.cwd(),
                        './pacts/pact.json'
                    ),
                ],
            };

            //const output = await new Pact.Verifier(opts).verifyProvider();
            //console.log('Pact Verification Complete!')
            //console.log(output)
        });
    });
});
