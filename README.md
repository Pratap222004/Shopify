Shopify Data Ingestion & Insights Platform

This project is a full-stack solution that enables Shopify store owners to connect their stores, ingest business data, and view meaningful insights in a single dashboard. It supports multiple tenants, secure authentication, and automated + real-time data sync from Shopify.

Built as part of the Xeno FDE Internship Assignment.

 Key Capabilities

Email-based authentication (JWT-secured)

Multi-tenant data isolation (each store has separate data)

Ingestion of Customers, Orders, Products from Shopify Admin APIs

Webhooks & Scheduler ensure data stays fresh automatically

Dashboard shows:

Total Customers, Total Orders, Total Revenue

Average Order Value

Repeat Customer Rate

Orders & Revenue trends (with date filter)

Top customers by spend

Redis caching for fast analytics

Tech Stack

Frontend: React (Vite), Axios, Recharts
Backend: Node.js (Express), Prisma ORM
Database: MySQL
Caching: Redis
Sync: Shopify Webhooks + Cron-job

Data Sync Flow

1️⃣ Tenant connects Shopify store in Settings
2️⃣ Backend fetches Shopify data (orders/customers/products)
3️⃣ Data stored with tenantId → Ensures strict isolation
4️⃣ Insights generated & cached → Dashboard loads fast
5️⃣ Webhooks + scheduler keep everything continuously updated

Screenshots (Replace with your paths)
![Login](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)
![Settings](./screenshots/settings.png)

Multi-Tenant Design

Every database entry references a tenantId, ensuring each retailer only sees their own store’s data — crucial for scalable SaaS.

Future Enhancements

More webhook events (fulfillment, checkout started)

Messaging system (RabbitMQ / Kafka) for heavy-scale ingestion

Advanced analytics & segmentation

Deployment auto-scaling and monitoring

Summary

This platform demonstrates how Shopify retailers can onboard data efficiently and instantly turn it into actionable insights — aligned with what Xeno builds for large brands.
