# MajdurHub – Har Kaam Ka Worker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Three user roles: Customer, Worker, Admin
- Work categories: Tile Fitting, Tile Cutting, Marble Fitting, Marble Cutting, Marble Polishing, Granite Fitting, Granite Cutting, Granite Polishing, Labour
- Worker registration: name, mobile, city, experience, work type, rate (per sq ft / running ft / per day)
- Customer job posting: work type, area (sq ft), address, start date, description
- Price calculation: rate × area
- Booking system with statuses: Pending, Accepted, In Progress, Completed
- Rating system: 1-5 stars + review text
- Worker dashboard: today's jobs, total jobs, total earnings
- Admin panel: manage workers, customers, bookings, payments, commission
- Payment method selection: Cash, UPI, Wallet

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: Users, Workers, Jobs, Bookings, Ratings stable data models in Motoko
2. Backend: CRUD APIs for all entities with role-based access
3. Frontend: Auth screens (login/signup with role selection)
4. Frontend: Home screen with category grid
5. Frontend: Worker list & profile screens
6. Frontend: Job post screen with price calculator
7. Frontend: Booking screen with status tracking
8. Frontend: Rating screen
9. Frontend: Worker dashboard
10. Frontend: Admin panel
