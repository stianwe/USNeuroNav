<?php
$mysqli = new mysqli("localhost", "root", "", "USNeuroNav");
if (mysqli_connect_errno()) {
    printf("Can't connect to SQL server. Error code %s\n", mysqli_connect_error($mysqli));
    exit;
}
$mysqli->query("SET NAMES 'utf8'");

$username = $_GET['username'];
$password = $_GET['password'];

$result = $mysqli->query("SELECT * FROM user");

$loginOK = 0;

while ($row = $result->fetch_assoc()) {
    if (strcasecmp($username, $row['username']) == 0) {
        if (strcmp($password, $row['password']) == 0) {
            $loginOK = 1;
        }
        break;
    }
}
$result->close();

header("Content-Type: text/json");
echo json_encode(array(
    'response' => $loginOK));

$mysqli->close();

?>
