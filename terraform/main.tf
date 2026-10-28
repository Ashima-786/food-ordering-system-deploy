# ─────────────────────────────────────────────────────────────────────────────
#  Zestora – Pure Single-Instance EC2 Deployment
#  • Deploys in your AWS Default VPC
#  • Auto-assigns public IP (NO paid Elastic IPs!)
#  • NO extra S3 buckets, NO custom VPCs
#  • When you Terminate this EC2 instance, 100% of your project is gone!
# ─────────────────────────────────────────────────────────────────────────────

# ─── Lookup Default AWS VPC ──────────────────────────────────────────────────
data "aws_vpc" "default" {
  default = true
}

# ─── Lookup Latest Ubuntu 24.04 LTS AMI ──────────────────────────────────────
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ─── Security Group (In Default VPC) ─────────────────────────────────────────
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-single-ec2-sg"
  description = "Security group for Zestora web application on EC2"
  vpc_id      = data.aws_vpc.default.id

  # HTTP - Web traffic to Frontend / Nginx
  ingress {
    description = "Allow inbound HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH - Remote access
  ingress {
    description = "Allow inbound SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_ip_cidr]
  }

  # Egress - Outbound traffic
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

# ─── Single EC2 Instance (Everything runs here) ──────────────────────────────
resource "aws_instance" "web" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  key_name                    = var.ssh_key_name != "" ? var.ssh_key_name : null
  associate_public_ip_address = true

  root_block_device {
    volume_size           = var.root_volume_size
    volume_type           = "gp3"
    delete_on_termination = true # Automatically deletes EBS disk when terminated!
    encrypted             = true

    tags = {
      Name = "${var.project_name}-root-ebs"
    }
  }

  # Bootstraps Docker, clones the repo, and runs docker compose automatically
  user_data = file("${path.module}/../ec2-user-data.sh")

  tags = {
    Name = "${var.project_name}-server"
  }
}
