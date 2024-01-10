<?php
// Recibe los datos del correo desde Node.js
$to = $_POST['to'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$headers = 'From: ' . $_POST['from'];

// Envía el correo
mail($to, $subject, $message, $headers);
?>