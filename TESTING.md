# Testing Guide

This document provides an overview of the testing strategy for InvygoShop.

## Test Types

### 1. Unit Tests

Unit tests are located in `src/**/__tests__/` directories and test individual functions, components, and utilities in isolation.

**Run unit tests:**

```bash
npm test
```

**Run in watch mode:**

```bash
npm run test:watch
```

### 2. Integration Tests

Integration tests verify that multiple components work together correctly. They test critical user flows like search, filtering, and checkout.

**Location:** `src/screens/__tests__/*.integration.test.tsx`

**Run integration tests:**

```bash
npm run test:integration
```

**Coverage:**

- Search flow: User can search for cars by brand or name
- Filter flow: User can filter cars by color and price range
- Checkout flow: Complete purchase flow from car selection to payment confirmation

### 3. Snapshot Tests

Snapshot tests ensure UI components render consistently and catch unintended visual changes.

**Location:** `src/components/__tests__/components.snapshot.test.tsx`

**Run snapshot tests:**

```bash
npm run test:snapshot
```

**Update snapshots:**

```bash
npm test -- -u
```

**Components covered:**

- Button (all presets and states)
- Card (all presets and alignments)
- Text (all presets)
- TextField (all states)
- CarListItemShimmer (phone and tablet layouts)
- EmptyState

### 4. End-to-End (E2E) Tests

E2E tests use Maestro to test complete user journeys on real devices/simulators.

**Location:** `.maestro/flows/`

**Run all E2E tests:**

```bash
npm run test:maestro
```

**Run specific E2E tests:**

```bash
# Search flow
npm run test:maestro:search

# Filter flow
npm run test:maestro:filter

# Checkout flow
npm run test:maestro:checkout

# Complete user journey
npm run test:maestro:journey
```

**Available E2E Tests:**

- `search-flow.yaml`: Tests search functionality
- `filter-flow.yaml`: Tests filtering by color and price
- `checkout-flow.yaml`: Tests complete checkout process
- `complete-user-journey.yaml`: Tests full user flow from search to purchase
- `pull-to-refresh.yaml`: Tests pull-to-refresh functionality

## Test Coverage

Current test coverage targets:

- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

View coverage report:

```bash
npm test -- --coverage
```

## Writing Tests

### Integration Test Example

```typescript
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { Provider } from "react-redux"

describe("Feature Integration Test", () => {
  it("should perform user action", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <Component />
      </Provider>
    )

    fireEvent.press(getByText("Button"))

    await waitFor(() => {
      expect(getByText("Result")).toBeTruthy()
    })
  })
})
```

### Snapshot Test Example

```typescript
import renderer from "react-test-renderer"

it("should match snapshot", () => {
  const tree = renderer.create(<Component />).toJSON()
  expect(tree).toMatchSnapshot()
})
```

### Maestro E2E Test Example

```yaml
appId: ${MAESTRO_APP_ID}
onFlowStart:
  - runFlow: ../shared/_OnFlowStart.yaml
---
- launchApp
- assertVisible: "Expected Text"
- tapOn: "Button Text"
- waitForAnimationToEnd
```

## Best Practices

1. **Test Critical Paths**: Focus on user-facing features and critical business logic
2. **Keep Tests Fast**: Unit tests should run quickly; use mocks for slow operations
3. **Test Behavior, Not Implementation**: Test what the user sees and experiences
4. **Use Descriptive Names**: Test names should clearly describe what they're testing
5. **Keep Tests Independent**: Tests should not depend on each other
6. **Mock External Dependencies**: Mock API calls, navigation, and other external services
7. **Update Snapshots Carefully**: Review snapshot changes before accepting them

## CI/CD Integration

Tests run automatically on:

- Pull requests to `main`, `master`, or `develop` branches
- Pushes to `main`, `master`, or `develop` branches

See `.github/workflows/ci.yml` for CI configuration.

## Troubleshooting

### Tests failing locally but passing in CI

- Ensure you're using the same Node version (>= 20.0.0)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`

### Snapshot tests failing

- Review the diff carefully
- If the change is intentional, update snapshots: `npm test -- -u`

### Maestro tests failing

- Ensure the app is built and installed on the device/simulator
- Check that the app ID matches: `com.invygoshop`
- Verify the app is running in development mode

### Integration tests timing out

- Increase timeout in test: `jest.setTimeout(10000)`
- Check for missing `waitFor` or `act` wrappers
- Verify mocks are set up correctly

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Maestro Documentation](https://maestro.mobile.dev/)
