# AliFood API Contract

This document outlines exactly what the frontend expects from each API endpoint. Use this as a guide for rebuilding the backend.

---

## 1. Menu Endpoints

### `GET /api/menu`
**Purpose:** Fetches the full menu to display categories and items.

**Expected Response:**
An array of Category objects.
```json
[
  {
    "id": "tacos",
    "name": "Tacos",
    "items": [
      { 
        "id": "tacos-1", 
        "name": "Dinde", 
        "price": 20, 
        "quantity": 50 
      }
    ]
  }
]
```
*   `price`: Must be a number (frontend handles "DH" formatting).
*   `quantity`: Number (current stock level).

---

## 2. Orders Endpoints

### `POST /api/orders`
**Purpose:** Creates a new order.

**Request Body:**
```json
{
  "items": [
    { "id": "tacos-1", "quantity": 2 }
  ]
}
```

**Expected Response:**
The created Order object.
```json
{
  "id": "ord-7k9p",
  "status": "pending",
  "createdAt": "2024-05-07T12:00:00.000Z",
  "items": [
    { "id": "tacos-1", "name": "Dinde", "price": 20, "quantity": 2 }
  ]
}
```
*   **Crucial:** The `id` must be returned so the frontend can track it.

---

### `GET /api/orders/:id`
**Purpose:** Used for the Live Status Badge (Home) and Order History page.

**Expected Response:**
A single Order object.
```json
{
  "id": "ord-7k9p",
  "status": "ready", 
  "createdAt": "2024-05-07T12:00:00.000Z",
  "readyAt": "2024-05-07T12:15:00.000Z",
  "items": [
    { "name": "Dinde", "price": 20, "quantity": 2 }
  ]
}
```
*   `status`: Must be one of: `pending`, `accepted`, `refused`, `ready`, `picked-up`, `not-picked-up`.
*   `readyAt`: **Must** be provided if status is `ready` (used for the countdown timer).
![alt text](image.png)
---

### `GET /api/orders`
**Purpose:** Fetches all orders for the Admin Dashboard.

**Expected Response:**
An array of all Order objects.
```json
[
  { "id": "ord-1", "status": "pending", "items": [...], "createdAt": "..." },
  { "id": "ord-2", "status": "ready", "items": [...], "createdAt": "..." }
]
```

---

### `PATCH /api/orders/:id`
**Purpose:** Updates the status of an order (used by the Admin Chef).

**Request Body:**
```json
{
  "status": "accepted" 
}
```

**Expected Response:**
The updated Order object.

---

## Technical Constants

### 1. Status Lifecycle
| Status | Meaning | UI Behavior |
| :--- | :--- | :--- |
| `pending` | New order | Shows in Admin as "Accepter/Refuser" |
| `accepted` | Cooking | Shows in Admin as "Marquer comme Prêt" |
| `ready` | Food is ready | Starts 5-min timer for pickup |
| `picked-up` | Completed | Moves to archive/history |
| `refused` | Rejected | Notifies user |

### 2. CORS
The backend **must** allow requests from `http://localhost:5173`.

### 3. Order ID
The frontend uses `order.id.slice(-4)` to show a short ID. Ensure IDs are long enough (like UUIDs or random strings) to avoid collisions.
