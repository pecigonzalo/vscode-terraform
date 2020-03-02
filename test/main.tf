# Locals
locals {
  a = "a"
  b = true
  c = 123

  ternary = "${local.a ? local.b : local.c}"
}

# Variables
variable "string" {
  default = "default-string"
}

variable "list" {
  type    = "list"
  default = ["item1", "item2"]
}

variable "map" {
  type = "map"

  default = {
    key1 = "value1"
    key2 = "value2"
  }
}

# Provider
provider "aws" {
  version = "~> 1.0"
}

# Resource
resource "aws_s3_bucket" "simple" {
  bucket = "${max(asdas)}"

  group {
    sub = "subvalue"
  }
}

# Template
resource "aws_s3_bucket" "agent_bucket" {
  bucket = "${var.stage}-${var.region}-mybucket"
  acl    = "private"

  logging {
    target_bucket = "${var.stage}-${var.region}-mymonitoringbucket"
    target_prefix = "aprefix/"
  }

  policy = <<EOF
  {
    sdfds
    sdfds,
    "Fsdfsd"
    ${var.this}
  }
EOF
}

# Output
output "iam_user_agent" {
  value = "smurf"
}
