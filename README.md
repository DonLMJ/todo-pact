Scenario

There are two components in scope for this project:
- Todo website. It provides an interface to query the todos service for todos information.
- Todo Service (Provider). Provides useful things about todos, such as listing all todos, adding,c ompleting and deleting todos.

You can see the client interface we created in ./src/todo.routes.ts using express without database.

In __tests__, you can see api.spec.ts where you can find api integrations tests which could be added in components integratition tests.

In consumer.test.ts you can find consumer driven pact tests where a mock server is started on a random port which acts as our provider service and check the contract is respected from the consumer side.

Running this tests creates a pact file which we can use to validate our assumptions on the provider side. A pact file should have been generated in consumer/pacts/.

Because the version of the client we have may not always be in sync with the deployed API - this is why it is important to specify the state of the consumer and provider when running the contract tests.

Further steps in this type of projects:
- Use pact broker to publish the contract with docker and use pact-cli/can-i-deploy to verify whether the application can be deployed safely, client and provider.