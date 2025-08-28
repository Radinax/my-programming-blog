---
title: "The Only AWS Services You Need as a Web Developer"
description: "Discover the essential AWS services every web developer should know to deploy common applications—without getting overwhelmed by unnecessary tools."
category: ["aws", "concept"]
pubDate: "2025-01-10"
published: false
---

## Table of contents

# Introduction

In web development, Amazon Web Services (AWS) is often presented as a vast, intimidating ecosystem. With over 200 services available, many developers feel pressured to master them all just to deploy a simple application. But the truth is far simpler: **if you're a web developer building typical apps—frontend, backend, database, and domain—you don’t need to know every AWS service.**

Your goal isn’t to become an AWS-certified solutions architect—it’s to **deploy fast, securely, and with minimal effort**. In this article, I’ll show you the only AWS services you actually need to master to get any common web application into production. Forget the noise. We’re focusing strictly on what matters for real-world development.

# Databases: RDS, DynamoDB, and DocumentDB

Every web app needs data persistence. AWS offers many database options, but only a few are essential for everyday use.

### Amazon RDS

**Amazon Relational Database Service (RDS)** is your go-to for relational databases. It supports popular engines like:

- PostgreSQL
- MySQL
- MariaDB
- SQL Server
- Oracle

With just a few clicks, you can launch a fully managed database instance. AWS handles backups, patching, replication, and even failover—so you don’t have to. This is perfect for applications using ORMs like **Prisma, TypeORM, or Sequelize** in Node.js, Python, or other backends.

RDS scales vertically and supports Multi-AZ deployments for high availability. It’s ideal for traditional web apps where structured data and relationships are key.

### DynamoDB

If you need **high scalability, low latency, and serverless integration**, **DynamoDB** is AWS’s fully managed NoSQL database. It’s best suited for:

- High-traffic APIs
- Serverless backends (e.g., Lambda)
- Applications with predictable access patterns

While powerful, DynamoDB requires careful data modeling. Unlike SQL, it doesn’t support joins or complex queries out of the box. But when used correctly, it scales infinitely and delivers single-digit millisecond responses.

Use it when you prioritize speed and scale over relational complexity.

### Amazon DocumentDB

For developers already using **MongoDB**, AWS offers **DocumentDB**, a MongoDB-compatible database service. It supports the same APIs and drivers, making migration straightforward.

DocumentDB is fully managed, with automated backups, replication, and monitoring. While not 100% feature-equivalent to MongoDB (e.g., no full-text search or certain aggregation pipelines), it’s more than sufficient for most use cases.

If you're building a MERN/MEAN stack app, DocumentDB lets you keep your existing codebase while benefiting from AWS’s reliability.

> 💡 **Pro Tip**: Use **RDS** for relational data, **DynamoDB** for scale and speed, and **DocumentDB** if you're already on MongoDB.

# Backend/API: EC2, ECS, App Runner, and Lambda

Once your database is ready, you’ll need to deploy your backend API. AWS offers multiple paths—here are the most practical.

### Amazon EC2

**Elastic Compute Cloud (EC2)** gives you full control over virtual servers in the cloud. You can install any OS, runtime, or framework—Node.js, Python, Go, etc.

You SSH into your instance, deploy your app, and manage everything manually. This is the “classic” way to host a backend and offers maximum flexibility.

However, **you’re responsible for security, scaling, updates, and monitoring**. Best for learning or when you need deep customization.

### ECS + ECR + Fargate (Containerized Backends)

If your API runs in a **Docker container**, the modern approach is **Elastic Container Service (ECS)** with **Fargate**.

Here’s how it works:

1. **ECR (Elastic Container Registry)**: Store your Docker images securely in AWS.
2. **ECS**: Define how your containers run.
3. **Fargate**: Run containers without managing servers. AWS scales them automatically.

This setup is ideal for microservices or APIs that need to scale dynamically. You pay only for the resources you use, and AWS handles the infrastructure.

Perfect for teams using Docker and CI/CD pipelines.

### AWS App Runner & Elastic Beanstalk

Want something even simpler? Try **AWS App Runner** or **Elastic Beanstalk**.

Both let you:

- Connect to a GitHub/GitLab repo
- Automatically build and deploy on every `git push`
- Get HTTPS and a custom domain out of the box

They’re similar to **Heroku, Vercel, or Railway**, but within AWS. App Runner is newer and more opinionated; Elastic Beanstalk is more flexible but slightly more complex.

Great for rapid prototyping or full-stack apps where you want zero DevOps overhead.

### AWS Lambda + API Gateway (Serverless)

For truly scalable, event-driven backends, consider **Lambda**.

With **AWS Lambda**, you deploy functions (not servers) that run in response to events—like HTTP requests via **API Gateway**.

Benefits:

- Zero server management
- Scales to zero when idle (cost-effective)
- Pay per execution, not per hour

Downsides:

- Cold starts
- Harder to debug and monitor
- Requires rethinking application architecture

Use it for lightweight APIs, background jobs, or integrating with other AWS services.

> 💡 **Recommendation**: Use **ECS + Fargate** for containerized apps, **App Runner** for simplicity, or **Lambda** for event-driven logic.

# Frontend: Amplify and S3 + CloudFront

Frontend deployment depends on whether your app is static or dynamic.

### AWS Amplify

If you're using modern frameworks like **Next.js, Nuxt, SvelteKit, or Remix**, **Amplify** is your best choice.

It offers:

- Git-based deployments (GitHub, GitLab, Bitbucket)
- Automatic builds and previews
- Built-in CI/CD
- Custom domains and HTTPS
- Server-side rendering (SSR) support

Amplify feels like **Vercel or Netlify**, but deeply integrated with AWS. It’s perfect for full-stack apps where frontend and backend live in the same ecosystem.

### S3 + CloudFront (Static Sites)

For static sites (HTML, CSS, JS, images), use **Amazon S3** (Simple Storage Service).

Steps:

1. Upload your built assets (e.g., `dist/`, `build/`) to an S3 bucket.
2. Enable static website hosting.
3. Connect **CloudFront** (AWS’s CDN) for faster global delivery and HTTPS.

This combo is rock-solid, cheap, and highly performant. Ideal for:

- Blogs built with Astro, Hugo, or Jekyll
- Marketing sites
- SPAs (React, Vue, Angular)

> 💡 Bonus: Use **S3 pre-signed URLs** or **Cognito** for private content.

# Domains and DNS with Route 53

You can buy a domain from any registrar (Namecheap, GoDaddy, Hostinger), but if you want to manage it within AWS, use **Route 53**.

**Route 53** is AWS’s DNS service. With it, you can:

- Link your domain to EC2, S3, Load Balancers, or Lambda
- Create subdomains (e.g., `api.yoursite.com`, `app.yoursite.com`)
- Set up health checks and failover routing
- Use latency-based or geolocation routing for global apps

Even if you bought your domain elsewhere, you can **import its DNS management into Route 53** and centralize everything in AWS.

It’s not free (you pay per hosted zone and queries), but the integration with other AWS services is seamless.

# Access Management with IAM

None of the above works securely without **IAM (Identity and Access Management)**.

IAM lets you:

- Create users, groups, and roles
- Assign granular permissions (e.g., “read-only S3 access”)
- Use temporary credentials via roles
- Integrate with external identity providers (e.g., Google, Facebook)

Every service you use—S3, EC2, Lambda—requires IAM policies to define who or what can access it.

For example:

- A Lambda function needs an IAM role to read from DynamoDB.
- A CI/CD pipeline needs IAM credentials to push to ECR.

You don’t pay for IAM—it’s free to use—but it’s the backbone of AWS security.

> 🔐 **Best Practice**: Follow the **principle of least privilege**. Never give full admin access unless absolutely necessary.

# Conclusion

You don’t need to master all 200+ AWS services to be effective as a web developer. Focus on the core tools that solve real problems:

- **Databases**: RDS (SQL), DynamoDB (NoSQL), DocumentDB (MongoDB)
- **Backend**: ECS + Fargate (containers), App Runner (simple), Lambda (serverless)
- **Frontend**: Amplify (dynamic), S3 + CloudFront (static)
- **Domains**: Route 53 for DNS and routing
- **Security**: IAM for access control

With just these, you can deploy, scale, and secure any typical web application—fast.

As you grow, explore more advanced services (like Cognito for auth, SNS for notifications, or CodePipeline for CI/CD). But start simple. **Ship first, optimize later.**

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
