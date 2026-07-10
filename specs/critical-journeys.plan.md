# Critical Journeys Test Plan

## Application Overview

PatchPigeon lets an owner create an account, configure a public namespace,
manage products and releases, publish changelogs, and expose those releases as
web pages plus JSON and RSS feeds. These scenarios protect the paths whose
partial failure would leave an owner unable to publish or a reader unable to
consume a release.

## Test Scenarios

### 1. Public Demo

**Seed:** `tests/e2e/seed.spec.ts`

#### 1.1. browse-public-demo

**File:** `tests/e2e/browse-public-demo.spec.ts`

**Steps:**
  1. Open the Acme App demo changelog.
    - expect: the request succeeds
    - expect: the product and January 2026 release group are visible
  2. Open the Bug Fixes & Stability release.
    - expect: the release detail URL is loaded
    - expect: bug fix, known issue, and note sections are visible

### 2. Authentication

**Seed:** `tests/e2e/seed.spec.ts`

#### 2.1. sign-up-login

**File:** `tests/e2e/sign-up-login.spec.ts`

**Steps:**
  1. Create a unique account and complete owner onboarding.
    - expect: the admin dashboard is visible
  2. Sign out.
    - expect: the public home page is loaded
  3. Sign in with the new account.
    - expect: the admin dashboard is visible again

### 3. Publishing

**Seed:** `tests/e2e/seed.spec.ts`

#### 3.1. publish-release-and-feeds

**File:** `tests/e2e/publish-release-and-feeds.spec.ts`

**Steps:**
  1. Create a unique owner account.
    - expect: the admin dashboard is visible
  2. Create a product.
    - expect: its product administration page is loaded
  3. Create and publish a release with one feature.
    - expect: the release appears as published in product administration
  4. Open the public product and release pages.
    - expect: the release title and feature are visible
  5. Request the public JSON feed.
    - expect: it contains the product, release, and feature
  6. Request the public RSS feed.
    - expect: it contains the release title and canonical release URL
