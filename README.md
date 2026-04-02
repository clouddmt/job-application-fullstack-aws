# AWS-Based Job Application System | Linux Server Administration & Automated Resume Storage

A production-ready full-stack job application platform built using **React, Node.js, Express, MySQL, and AWS**.

This application allows candidates to submit job applications with resume uploads, stores applicant details in MySQL, automatically uploads resumes to AWS S3, and maintains automated S3 backups using cron jobs.

---

## Project Overview

This project is a real-world full-stack deployment built on an AWS EC2 Ubuntu server.

### Features
- Online job application form
- Resume upload (PDF)
- Form validation (client + server side)
- MySQL database integration
- Resume storage on server
- Automatic AWS S3 upload
- Automated S3 backup bucket sync
- PM2 process management
- Nginx reverse proxy deployment
- Cron-based automation

---

## Tech Stack

### Frontend
- React.js
- Axios
- CSS

### Backend
- Node.js
- Express.js
- Multer
- Express Validator

### Database
- MySQL

### Deployment / DevOps
- AWS EC2 (Ubuntu 22.04)
- AWS S3
- Cron Jobs
- PM2
- Nginx
- Git & GitHub

---

## Architecture

```text
User Browser
     ↓
React Frontend (Nginx)
     ↓
Node.js + Express Backend (PM2)
     ↓
MySQL Database
     ↓
Local Resume Uploads
     ↓
AWS S3 Bucket (Automated cron)
     ↓
S3 Backup Bucket (Automated Cron Sync)
```

---

## Deployment Steps

### Backend
- Node.js server deployed on AWS EC2
- Managed using PM2
- Runs on port 3000

```bash
pm2 start server.js --name jobapp-backend
pm2 save
pm2 startup
```

### Frontend
- React app built using:

```bash
npm run build
```

- Served via Nginx from:

```text
/var/www/html/
```

---

## AWS Services Used

- **EC2** → application hosting
- **S3** → automated resume storage
- **S3 Backup Bucket** → automated bucket backup
- **CLI Access Keys** → secure AWS CLI access

---

## S3 Automation

Uploaded resumes are automatically synced to S3 using AWS CLI.

```bash
aws s3 sync /home/ubuntu/jobapp/uploads/ s3://jobapp-resumes-2026/
```

---

## Cron Job Automation

Automated cron jobs used for:
- uploading resumes to S3
- syncing backup bucket

Example:

```bash
*/5 * * * * /home/ubuntu/jobapp/upload-resumes-to-s3.sh
```

Backup bucket sync:

```bash
*/10 * * * * /home/ubuntu/jobapp/backup-s3-bucket.sh
```

---

## PM2 Process Management

Backend service runs continuously using PM2.

Commands used:

```bash
pm2 list
pm2 logs
pm2 restart all
```

---

## Nginx Configuration

Nginx used for:
- serving React frontend
- reverse proxy for Node backend
- route handling for `/api`

Example:

```nginx
location /api/ {
    proxy_pass http://localhost:3000;
}
```

---

## Screenshots

Screenshots added for:
- successful application form submission
- AWS S3 bucket upload
- backup bucket sync
- PM2 process status
- cron logs
- MySQL data stored status

---

## Learning Outcomes

This project demonstrates practical experience in:

- full-stack application development
- cloud deployment on AWS
- Linux server management
- automation with cron
- S3 storage and backup automation
- AWS CLI demonstration
- MYSQL database integration
- log and maintenance analysis
- Github repo initialization for the project
