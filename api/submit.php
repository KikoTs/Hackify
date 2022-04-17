<?php
header('Content-type: application/json');
$json = file_get_contents('php://input');
$json_decode = json_decode($json, true); 
$bearerToken = $json_decode['bearerToken'];
$data = $json_decode['quiz'];
$url = $json_decode['url'];
$quizId = $json_decode['quizId'];

function deleteQuiz(){
    $curl = curl_init($GLOBALS['url'] . $GLOBALS['quizId']);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".$GLOBALS['bearerToken']));
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
    
    // execute!
    $response = curl_exec($curl);
    // echo($response);
    // close the connection, release resources used
    curl_close($curl);
    
    // do anything you want with your response
    // return json_decode($response, true);
}
function createQuiz(){
    $curl = curl_init($GLOBALS['url']);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json', "Authorization: Bearer ".$GLOBALS['bearerToken']));
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($GLOBALS['data']));
    
    // execute!
    $response = curl_exec($curl);
    // echo($response);
    // close the connection, release resources used
    curl_close($curl);
    
    // do anything you want with your response
    // return json_decode($response, true);
}
deleteQuiz();
createQuiz();
// use key 'http' even if you send the request to https://...
// $options = array(
//     'http' => array(
//         'header'=>"Content-Type: application/json en\r\n" .
//         "Authorization: Bearer ".$bearerToken."\r\n",
//         'method'  => 'PATCH',
//         'content' => ($data)
//     )
// );
// $context  = stream_context_create($options);
// $result = file_get_contents($url, false, $context);
// if ($result === FALSE) { /* Handle error */ }

// echo($url);
// print_r($data);
// echo($bearerToken);
// echo($result);
?>