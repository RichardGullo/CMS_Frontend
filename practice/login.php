<?php


// $friends = array("Florida" => "Lake", "NewYork" => "Queens");
// $friends2 = array("Florida" => "Lake", "NewYork" => "Queens");

$friends = array(
    array("Florida" => "Lake", "NewYork" => "Queens"),
    array("Florida" => "Lake", "NewYork" => "Queens")
);

$string = JSONParse($friends);

echo $string;

function JSONParse($data)
{
    $i = 0;
    $string = "";

    while($i < count($data))
    {
        if($i == 0)
            $string = JSONParseStatement($data[$i]);
        else
            $string = $string.','.JSONParseStatement($data[$i]);

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