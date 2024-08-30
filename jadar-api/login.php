<?php

$connection = mysqli_connect('localhost','root','','jadar');

$payload = array("error" => "", "success" => "");

if(!$connection){
    $payload['error'] = 'Could not connect to database';
    echo json_encode($payload);
    exit();
}

$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE email = '".$username."'AND pass ='".$password."'";

$result = mysqli_query($connection,$query);

if(!$result){
    $payload['error'] = 'Query to database failed';
    echo json_encode($payload);
    exit();
}
else
{
    $result = getRows($result);

    if(count($result) < 1){
        $payload['error'] = 'Invalid Username/Password';
        echo json_encode($payload);
        exit();
    }

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