# Architecture 
--- 

![image info](./image.png)


---


# Omrenetes — Mini Kubernetes-Orchestrator

A lightweight event-driven container orchestration system built with Node.js, TypeScript, Docker, BullMQ, Kafka, and PostgreSQL.  

Supports transactional configs, container scaling, queue-based processing, and event-driven orchestration.

---
## 📂 Repo Structure

### Apps
- **`apps/api-service`** – Accepts config, writes to DB + `outbox_service` atomically  
- **`apps/watcher-service`** – Polls `outbox_service` table and pushes tasks to BullMQ  
- **`apps/processor`** – Processes queue, scales containers, pushes Kafka events  
- **`apps/worker`** – Kafka consumer, updates `outbox_service` status  

### Packages
- **`packages/common`** – YAML parser & Zod validation  
- **`packages/db`** – Prisma & DB utilities  
- **`packages/kafka-service`** – Kafka client & reusable logic  
- **`packages/queue`** – BullMQ queue creation and export  

## ⚙️ Workflow

1. User sends POST `/config` → **api-service** inserts into `services` and `outbox_service` tables transactionally.  
2. **watcher-service** polls `outbox_service` for `PENDING` entries → pushes to BullMQ queue.  
3. **processor** consumes queue → reconciles containers based on `desired_state` → emits Kafka events when done.  
4. **worker** listens to Kafka → updates `outbox_service` status to `DONE`.  

> Fully event-driven and transactional orchestration system.

---

## 🛠 Setup & Run

### 1. Start Dependencies
- Redis for BullMQ:
```bash
docker run -p 6379:6379 --name redis redis
````

* Kafka + Zookeeper (Docker):

```bash
docker run -d --name zookeeper -p 2181:2181 zookeeper
docker run -d --name kafka -p 9092:9092 --link zookeeper wurstmeister/kafka
```

### 2. Environment Variables

Create `.env` in root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_URL=redis://localhost:6379
KAFKA_BROKER=localhost:9092
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start All Services

With Turborepo, running from the root automatically starts all apps:

```bash
npm run dev
```

> Each service builds TypeScript and runs automatically.

---

## 📌 Key Features

* Transactional outbox pattern for reliability.
* BullMQ queues with retries for async task processing.
* Kafka events for acknowledgment and decoupling.
* Container orchestration with Docker (scaling, dynamic ports, volume bindings).
* Monorepo utilities (`common`, `db`, `queue`, `kafka-service`).

---

## 🛠 Tech Stack

Node.js, TypeScript, Prisma, PostgreSQL, Docker, BullMQ, Redis, Kafka, Zod, YAML.



