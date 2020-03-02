diff a/<standard input> b/<standard input>
--- /tmp/788018290	2020-02-28 22:04:21.850000000 +0100
+++ /tmp/735802665	2020-02-28 22:04:21.850000000 +0100
@@ -21,7 +21,6 @@
   type = "map"
 
   default = {
-
     key1 = "value1"
     key2 = "value2"
   }
@@ -65,6 +64,7 @@
 output "iam_user_agent" {
   value = "smurf"
 }
+
 # Locals
 locals {
   a = "a"
@@ -88,7 +88,6 @@
   type = "map"
 
   default = {
-
     key1 = "value1"
     key2 = "value2"
   }
