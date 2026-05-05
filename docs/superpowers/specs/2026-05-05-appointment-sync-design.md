# Appointment System Data Sync - Design Spec

**Date:** 2026-05-05
**Status:** Approved

## Problem

The appointment system had inconsistent data sources across components:

- `AppointmentsManage.tsx` (admin) used local React state - isolated from other components
- `PatientDashboard.tsx` read from `appointmentStore` - correct
- `BookAppointment.tsx` wrote to `appointmentStore` - correct
- `AppointmentConfirmation.tsx` read from `location.state` - isolated, no persistence

This meant admin actions (doctor assignment, status changes) were invisible to patients, and patient bookings didn't appear in the admin panel.

## Solution

Standardize all components to use `appointmentStore` (Zustand) as the single source of truth for appointment data.

## Changes Made

### 1. appointmentStore.ts - Enhanced Store

Added `getAppointmentByRef()` method to find appointments by reference number.

```typescript
getAppointmentByRef: (refNumber: string) => Appointment | undefined;
```

### 2. AppointmentsManage.tsx - Admin Panel

- Replaced local `useState` with `useAppointmentStore()`
- Added doctor assignment UI:
  - "Assign Doctor" button appears for pending appointments without a doctor
  - Modal with doctor dropdown for selection
  - Calls `confirmAppointment()` which sets doctor and marks as confirmed
- Shows patient phone number in table
- Status updates now persist to store via `updateAppointment()`

### 3. AppointmentConfirmation.tsx - Confirmation Page

- Now reads from `appointmentStore.getAppointmentByRef()` instead of just `location.state`
- Falls back to `location.state` for backwards compatibility
- Shows doctor assignment status (assigned name vs "To be assigned")
- Updates messaging based on whether doctor is assigned

### 4. BookAppointment.tsx - Already Correct

No changes needed - was already writing to `appointmentStore`.

### 5. PatientDashboard.tsx - Already Correct

No changes needed - was already reading from `appointmentStore.getPatientAppointments()`.

## Data Flow

```
Patient books appointment
  → BookAppointment.tsx writes to appointmentStore
  → Appears in AppointmentsManage (admin can see)
  → Admin assigns doctor via AppointmentsManage
  → appointmentStore updated
  → PatientDashboard reflects new doctor assignment
  → AppointmentConfirmation can read updated data
```

## Architecture

```
appointmentStore (Zustand)
├── appointments: Appointment[]
├── addAppointment()
├── updateAppointment()
├── confirmAppointment()  // Assigns doctor + sets status
├── getPatientAppointments(discordId)
├── getAppointment(id)
└── getAppointmentByRef(refNumber)
```

## Future Considerations

- Backend API integration (currently mock data in store)
- Real-time notifications when doctor is assigned
- Email/SMS notifications to patients
- Appointment rescheduling and cancellation
