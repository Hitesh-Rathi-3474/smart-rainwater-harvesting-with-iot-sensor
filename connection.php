<?php
$host = "localhost";
$user = "root";
$pass = "";  // XAMPP में default password blank होता है
$dbname = "rainwater_harvesting";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>