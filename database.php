<?php
$mysqli = new mysqli("localhost", "root", "", "USNeuroNav");
if (mysqli_connect_errno()) {
    printf("Can't connect to SQL server. Error code %s\n", mysqli_connect_error($mysqli));
    exit;
}
$mysqli->query("SET NAMES 'utf8'");
$categories = array();
$$subCategories = array();
$cases = array();
$belongsTo = array();
$mediaFiles = array();

if ($result = $mysqli->query("SELECT * FROM category")) {
    while ($row = $result->fetch_assoc()){
        $categories[] = array(
            'id'=>$row['id'],
            'name'=>$row['name']);
    }
    $result->close();
}

if($result = $mysqli->query("SELECT * FROM subCategory")) {
    while ($row = $result->fetch_assoc()) {
        $subCategories[] = array(
            'superCategory'=>$row['superCategory'],
            'subCategory'=>$row['subCategory']);
    }
    $result->close();
}

if($result = $mysqli->query("SELECT * FROM caseT")) {
    while ($row = $result->fetch_assoc()) {
        $cases[] = array(
            'id'=>$row['id'],
            'name'=>$row['name']);
    }
    $result->close();
}

if($result = $mysqli->query("SELECT * FROM belongsTo")) {
    while ($row = $result->fetch_assoc()) {
        $belongsTo[] = array(
            'id'=>$row['id'],
            'caseT'=>$row['caseT'],
            'category'=>$row['category']);
    }
    $result->close();
}

if($result = $mysqli->query("SELECT * FROM mediaFiles")) {
    while ($row = $result->fetch_assoc()) {
        $mediaFiles[] = array(
            'url'=>$row['url'],
            'belongsTo'=>$row['belongsTo']);
    }
    $result->close();
}

header("Content-Type: text/json");
echo json_encode(array(
    'categories' => $categories,
    'subCategories' => $subCategories,
    'cases' => $cases,
    'belongsTo' => $belongsTo,
    'mediaFiles' => $mediaFiles));

$mysqli->close();
?>
