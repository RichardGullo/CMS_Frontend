<?php

$dbHost = "localhost";
$dbUser = "root";
$dbPass = "";
$dbName = "test";

$conn = mysqli_connect($dbHost,$dbUser,$dbPass,$dbName);

if($conn){

     // echo("Database connected");

}
else{
    die("Database connection failed!");
}