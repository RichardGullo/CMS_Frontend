<?php

$connection = mysqli_connect('localhost','root','','jadar');

if(!$connection){
    $payload['error'] = 'Could not connect to database';
    echo json_encode($payload);
    exit();
}

$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$pass = $_POST['pass'];

$query = "SELECT * FROM users WHERE email = '".$email."'";

$result = mysqli_query($connection,$query);

if(!$result){
    $payload['error'] = 'Query failed';
    echo json_encode($payload);
    exit();
}

// Check if email has been used before.
if(mysqli_num_rows($result) == 0)
{
    $query = "INSERT INTO users(first_name,last_name,email,pass)VALUES("."'".$firstName."',"."'".$lastName."',"."'".$email."',"."'".$pass."'".")";

    $result = mysqli_query($connection,$query);

    if(!$result){
        $payload['error'] = 'Query failed';
        echo json_encode($payload);
        exit();
    }

    $payload['success'] = 'User has been added.';
    echo json_encode($payload);
    exit();

}
else{
    $payload['error'] = 'Email has already been used';
    echo json_encode($payload);
    exit();
}





function JSONParse($data)
{
    $i = 0;
    $string = "";

    while($row = mysqli_fetch_assoc($data))
    {
        if($i == 0)
            $string = JSONParseStatement($row);
        else
            $string = $string.','.JSONParseStatement($row);

        $i++;
    }

    return "[".$string."]";

}

function JSONParseStatement($data)
{
    $i = 0;
    $string = "";
    
    foreach($data as $datum => $datum_value){

        if($i++ != count($data)-1)
            $string = $string.
                '"'.$datum. '"'.":"."\"".$datum_value."\"".",";
        else
            $string = $string.
                '"'.$datum. '"'.":"."\"".$datum_value."\"";   
    }

    return '{'.$string.'}';
}


?>