# Kozmos Design System - Contract Tests

This directory contains the provider contracts for the `@kozmos/react` package using [Pact](https://docs.pact.io/).

## Purpose
As the SDK consumer base grows (e.g., Dashboard team, Pointr clients), we use contract testing to ensure that structural modifications to our UI components or design tokens do not break consuming applications. 

## Structure
- `provider.ts`: The configured provider instance to verify contracts against consumer expectations.
- `consumers/`: Expected schemas and interactions defined by our downstream apps.

## Running Tests
Ensure the Storybook development server is running (`pnpm --filter @kozmos/docs dev` on port 6006), then run:
```bash
pnpm test:contracts
```
