# Boundaries and Dependencies

This document captures allowed dependencies and layering rules.

## Allowed dependency direction

- apps/* -> packages/*
- packages/* -> packages/* (only when it makes sense; avoid cycles)
- packages/eslint-config and packages/typescript-config are configuration-only packages

## Disallowed patterns

- packages/* -> apps/*
- Cyclic dependencies between packages
- Direct network calls from UI packages when a domain client exists in packages/api

## Changes to boundaries

If a new dependency direction is needed, record it in an ADR under docs/adr/.
