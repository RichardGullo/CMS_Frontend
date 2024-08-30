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
$id = $_POST['id'];

$query = "UPDATE contacts SET first_name="."'".$firstName."',"."last_name="."'".$lastName."',"."contactEmail="."'".$contactEmail."',"."address="."'".$address."',"."phone="."'".$phone."'"."WHERE id="."'".$id."'";


$result = mysqli_query($connection,$query);

if(!$result){
    $payload['error'] = 'Query to update database failed';
    echo json_encode($payload);
    exit();
}

echo json_encode($payload);

?>