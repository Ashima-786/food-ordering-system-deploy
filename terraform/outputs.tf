output "ec2_public_ip" {
  description = "Auto-assigned public IP address of the EC2 instance"
  value       = aws_instance.web.public_ip
}

output "application_url" {
  description = "Web URL for accessing the application"
  value       = "http://${aws_instance.web.public_ip}"
}

output "health_check_url" {
  description = "Backend Health check URL"
  value       = "http://${aws_instance.web.public_ip}/api/health"
}

output "ssh_command" {
  description = "Command to SSH into the instance"
  value       = var.ssh_key_name != "" ? "ssh -i path/to/${var.ssh_key_name}.pem ubuntu@${aws_instance.web.public_ip}" : "Add an SSH key to connect via terminal"
}
