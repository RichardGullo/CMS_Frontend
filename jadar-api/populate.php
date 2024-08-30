<?php

$connection = mysqli_connect('localhost','root','','jadar');

$payload = array("error" => "", "success" => "");

if(!$connection){
    $payload['error'] = 'Could not connect to database';
    echo json_encode($payload);
    exit();
}

$userEmail = $_POST['userEmail'];

$query = "SELECT * FROM users WHERE email = '".$userEmail."'";

$result = mysqli_query($connection,$query);

if(!$result){
    $payload['error'] = 'Query to database failed';
    echo json_encode($payload);
    exit();
}
else
{
    $row = mysqli_fetch_assoc($result);

    $id = $row["id"];

    $query = "SELECT * FROM contacts WHERE username_id = '".$id."'";
    $result = mysqli_query($connection,$query);

    if(!$result){
        $payload['error'] = 'Query to database failed';
        echo json_encode($payload);
        exit();
    }

    $result = getRows($result);
    
    $payload['data'] = $result;
    echo json_encode($payload);

}


function getRows($result){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }

    return $rows;
}


?>