# 🚀 Simple 1-Click AWS EC2 Deployment Guide

> **Goal:** Deploy everything (Frontend + Backend + MongoDB) **strictly on ONE single EC2 instance**.
> When you terminate the EC2 instance, **100% of your project is gone**. Zero lingering resources, zero leftover costs.

---

## ⚡ Method 1: Deploy Directly via AWS Console (No Tools Needed!)

You don't need to install Terraform or any CLI. You can launch it directly from the AWS Web Console:

1. Open **[AWS EC2 Console](https://console.aws.amazon.com/ec2)** $\longrightarrow$ Click **Launch Instance**.
2. **Name**: `Zestora-Server`
3. **OS Image**: Select **Ubuntu 24.04 LTS** (Free Tier eligible).
4. **Instance Type**: Select **`t2.micro`** (Free Tier eligible).
5. **Key Pair**: Select your existing key pair (or create one) if you want SSH access.
6. **Network Settings**:
   * Auto-assign Public IP: **Enable**
   * Check **Allow HTTP traffic from the internet** (Port 80)
   * Check **Allow SSH traffic from anywhere** (Port 22)
7. **Configure Storage**: 20 GiB (gp3)
8. **Advanced Details (User Data)**:
   * Scroll all the way down to **User Data** (expand *Advanced details*).
   * Copy and paste the entire contents of [ec2-user-data.sh](file:///d:/Projects/AWS_Project/ec2-user-data.sh).
9. Click **Launch Instance**!

That's it! In ~2-3 minutes:
* Docker, MongoDB, Flask backend, and React frontend will automatically build and start on Port 80.
* Go to your EC2 instance in the AWS Console, copy the **Public IPv4 address**, and paste it into your browser:
  ```
  http://<YOUR_EC2_PUBLIC_IP>
  ```

---

## 💻 Method 2: Deploy Using Terraform (1 Command)

If you have Terraform installed:

1. Open your terminal in the `terraform/` directory:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   ```
2. Put your AWS Key Pair name in `terraform.tfvars`:
   ```hcl
   ssh_key_name = "your-keypair-name"
   ```
3. Run:
   ```bash
   terraform init
   terraform apply -auto-approve
   ```
4. Terraform will output your live URL:
   ```
   application_url = "http://54.210.12.34"
   ```

---

## ⏰ Safety Auto-Shutdown (10 Days)

Inside [ec2-user-data.sh](file:///d:/Projects/AWS_Project/ec2-user-data.sh), there is a built-in safety timer:
```bash
shutdown -h +14400 &
```
If you forget about your server, the instance **automatically powers down after 10 days** (14,400 minutes) to prevent accidental charges.

---

## 🗑️ How to Delete Everything (Zero Cost Guarantee)

When your AWS class demo or assignment is over:

### Option A: From AWS Console
1. Go to **EC2 Console** $\longrightarrow$ **Instances**.
2. Right-click your instance $\longrightarrow$ **Instance State** $\longrightarrow$ **Terminate Instance**.
3. **Done!** Because we didn't create any separate Elastic IPs, custom VPCs, or S3 buckets, the EBS storage and network delete immediately with the instance.

### Option B: From Terraform
```bash
cd terraform
terraform destroy -auto-approve
```
