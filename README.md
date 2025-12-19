#  Shopify Data Ingestion & Insights Platform

This project is a full-stack solution that enables Shopify store owners to connect their stores, ingest business data, and view meaningful insights in a single dashboard. It supports multiple tenants, secure authentication, and automated + real-time data sync from Shopify.

---

##  Key Capabilities

- Email-based authentication (JWT-secured)
- Multi-tenant data isolation (each store has separate data)
- Ingestion of Customers, Orders, Products from Shopify Admin APIs
- Webhooks & Scheduler ensure data stays fresh automatically

### Dashboard Shows:

- Total Customers, Total Orders, Total Revenue
- Average Order Value
- Repeat Customer Rate
- Orders & Revenue trends (with date filter)
- Top customers by spend
- Redis caching for fast analytics

---

##  Tech Stack

**Frontend:** React (Vite), Axios, Recharts  
**Backend:** Node.js (Express), Prisma ORM  
**Database:** MySQL  
**Caching:** Redis  
**Sync:** Shopify Webhooks + Cron-job  

---

## 🔄 Data Sync Flow

1️⃣ Tenant connects Shopify store in **Settings**  
2️⃣ Backend fetches Shopify data (Orders / Customers / Products)  
3️⃣ Data stored with `tenantId` → Ensures strict isolation  
4️⃣ Insights generated & cached → Dashboard loads fast  
5️⃣ Webhooks + scheduler keep everything continuously updated  

---

##  Screenshots

![Login](<img width="1469" height="833" alt="Screenshot 2025-12-05 at 11 10 10 PM" src="https://github.com/user-attachments/assets/a6fb50bd-ee72-49b2-a467-c7de660265aa" />
g)
![Dashboard](<img width="1462" height="832" alt="Screenshot 2025-12-05 at 11 10 30 PM" src="https://github.com/user-attachments/assets/a5dc0270-c818-433d-a38f-12bd1e2f21eb" />g
)
![Settings](<img width="1469" height="834" alt="Screenshot 2025-12-05 at 11 10 39 PM" src="https://github.com/user-attachments/assets/35758026-192c-47d4-b7cb-bd8328530187" />g
)

---


##  Deployment

You can access the deployed version of the application here:  
🔗 Live App: **((https://shopify-theta-sepia.vercel.app/))**  
🔗 API Service: **[https://your-deployed-backend-url.com](https://your-deployed-backend-url.com)**  

---


##  Multi-Tenant Design

Every database entry references a `tenantId`, ensuring data privacy and secure isolation — crucial for scalable SaaS platforms.

---

##  Future Enhancements

- More webhook events (fulfillment, checkout started)
- Messaging system (RabbitMQ / Kafka) for high-volume ingestion
- Advanced analytics & segmentation capabilities
- Deployment auto-scaling and monitoring tools

---

##  Summary

This platform demonstrates how Shopify retailers can onboard data efficiently and instantly turn it into actionable business insights — aligned with the value Xeno delivers for enterprise brands.

---
