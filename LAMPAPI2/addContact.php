<?php

$connection = mysqli_connect('localhost','root','','jadar');

$payload = array("error" => "", "success" => "");

if(!$connection){
    $payload['error'] = 'Could not connect to database';
    echo json_encode($payload);
    exit();
}

$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$contactEmail = $_POST['contactEmail'];
$address = $_POST['address'];
$phone = $_POST['phone'];
$userEmail = $_POST['userEmail'];

$query = "SELECT * FROM users WHERE email = '".$userEmail."'";

$result = mysqli_query($connection,$query);

if(!$result){
    $payload['error'] = 'Query to database failed';
    echo json_encode($payload);
    exit();
}

$row = mysqli_fetch_assoc($result);

$id = $row["id"];

$query = "INSERT INTO contacts(address,first_name,last_name,contactEmail,phone,username_id)VALUES("."'".$address."',"."'".$firstName."',"."'".$lastName."',"."'".$contactEmail."',"."'".$phone."',"."'".$id."')";

$result = mysqli_query($connection,$query);

if(!$result){
    $payload['error'] = 'Query to database failed (adding)';
    echo json_encode($payload);
    exit();
}

$payload['success'] = 'Entry has been added to database.';
echo json_encode($payload);


?>