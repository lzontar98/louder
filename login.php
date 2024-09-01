<?php
$DEBUG = true;

include("orodja.php");

$zbirka = dbConnect(); 

if(isset($_POST["upime"], $_POST["geslo"])) {
    $user = mysqli_escape_string($zbirka, $_POST["upime"]);
    $password = mysqli_escape_string($zbirka, $_POST["geslo"]);

    $poizvedba = "SELECT user, password FROM user WHERE user='$user'";
    $rezultat = mysqli_query($zbirka, $poizvedba);

    if (mysqli_num_rows($rezultat) > 0) {
        $odgovor = mysqli_fetch_assoc($rezultat);
        $storedPassword = $odgovor['password'];

        if ($password === $storedPassword) {
            $token = hash("md5", $user . $password);
            echo json_encode(array('token' => $token, 'user' => $user));
            http_response_code(200); // Success
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(array('error' => 'Invalid credentials'));
        }
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(array('error' => 'User not found'));
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(array('error' => 'Missing credentials'));
}
?>