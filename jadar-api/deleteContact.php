<?php

$connection = mysqli_connect('localhost','root','','jadar');

$payload = array("error" => "", "success" => "");

if(!$connection){
    $payload['error'] = 'Could not connect to database';
    echo json_encode($payload);
    exit();
}

$id = $_POST['id'];

$query = "DELETE FROM contacts WHERE id="."'".$id."'";

$result = mysqli_query($connection,$query);

if(!$result){
    $payload['error'] = 'Query to delete failed';
    echo json_encode($payload);
    exit();
}

echo json_encode($payload);



?>