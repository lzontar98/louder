<?php
$DEBUG = true;							// Priprava podrobnejših opisov napak (med testiranjem)

include("orodja.php"); 					// Vključitev 'orodij'

$zbirka = dbConnect();					// Pridobitev povezave s podatkovno zbirko

header('Content-Type: application/json');	// Nastavimo MIME tip vsebine odgovora
header('Access-Control-Allow-Origin: *');	// Dovolimo dostop izven trenutne domene (CORS)
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');		//v preflight poizvedbi za CORS sta dovoljeni le metodi GET in POST

switch($_SERVER["REQUEST_METHOD"])		// Glede na HTTP metodo v zahtevi izberemo ustrezno dejanje nad virom
{
	case 'GET':
		if(!empty($_GET["user"]))
		{
			get_user($_GET["user"]);		// Če odjemalec posreduje vzdevek, mu vrnemo podatke izbranega igralca
		}
		else
		{
			get_all_users();					// Če odjemalec ne posreduje vzdevka, mu vrnemo podatke vseh igralcev
		}
		break;
		
	// Dopolnite še z dodajanjem, posodabljanjem in brisanjem igralca
	case 'POST':
		add_user();
		break;
		
	case 'PUT':
		if(!empty($_GET["user"]))
		{
			update_user($_GET["user"]);
		}
		else
		{
			http_response_code(400);	// Če ne posredujemo vzdevka je to 'Bad Request'
		}
		break;
		
	case 'DELETE':
		if(!empty($_GET["user"]))
		{
			delete_user_profiles($_GET["user"]);
			delete_user($_GET["user"]);
		}
		else
		{
			http_response_code(400);	// Bad Request
		}
		break;
		
	case 'OPTIONS':						//Options dodan zaradi pre-fight poizvedbe za CORS (pri uporabi metod PUT in DELETE)
		http_response_code(204);
		break;
		
	default:
		http_response_code(405);		//Če naredimo zahtevo s katero koli drugo metodo je to 'Method Not Allowed'
		break;
}

mysqli_close($zbirka);					// Sprostimo povezavo z zbirko


// ----------- konec skripte, sledijo funkcije -----------

function get_all_users()
{
	global $zbirka;
	$odgovor=array();
	
	$poizvedba="SELECT user FROM user";	
	
	$rezultat=mysqli_query($zbirka, $poizvedba);
	
	while($vrstica=mysqli_fetch_assoc($rezultat))
	{
		$odgovor[]=$vrstica;
	}
	
	http_response_code(200);		//OK
	echo json_encode($odgovor);
}

function get_user($user)
{
	global $zbirka;
	$vuser=mysqli_escape_string($zbirka, $user);
	
	$poizvedba="SELECT user FROM user WHERE user='$user'";
	
	$rezultat=mysqli_query($zbirka, $poizvedba);

	if(mysqli_num_rows($rezultat)>0)	//user obstaja
	{
		$odgovor=mysqli_fetch_assoc($rezultat);
		
		http_response_code(200);		//OK
		echo json_encode($odgovor);
	}
	else							// user not found
	{
		http_response_code(404);		//Not found
	}
}

function add_user()
{
    global $zbirka, $DEBUG;

    $podatki = json_decode(file_get_contents('php://input'), true);

    $user = mysqli_escape_string($zbirka, $podatki["user"]);
    $password = mysqli_escape_string($zbirka, $podatki["password"]);


    if (isset($user, $password)) {
        if (!user_obstaja($user)) {
            $poizvedba = "INSERT INTO user (user, password) VALUES ('$user', '$password')";

            if (mysqli_query($zbirka, $poizvedba)) {
                // After successfully adding the user, create four default profiles
                $profiles = ["Profile1", "Profile2", "Profile3", "Profile4"];
                foreach ($profiles as $profile) {
                    $poizvedba_profile = "INSERT INTO profiles (user, profile, CH1, CH2, CH3, CH4, Bass1, Mid1, Treble1, Bass2, Mid2, Treble2, Bass3, Mid3, Treble3, Bass4, Mid4, Treble4) 
                                          VALUES ('$user', '$profile', '0.5', '0.5', '0.5', '0.5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0','0')";
                    mysqli_query($zbirka, $poizvedba_profile);
                }

                http_response_code(201); // Created
                echo json_encode(array('status' => 'User and profiles created successfully'));
            } else {
                http_response_code(500); // Internal Server Error

                if ($DEBUG) { // Note: Returning server error details is a security risk!
                    pripravi_odgovor_napaka(mysqli_error($zbirka));
                }
            }
        } else {
            http_response_code(409); // Conflict
            pripravi_odgovor_napaka("User že obstaja!"); // "User already exists!"
        }
    } else {
        http_response_code(400); // Bad Request
        pripravi_odgovor_napaka("Missing required fields."); // Descriptive error for missing fields
    }
}


function update_user($user)
{
	global $zbirka, $DEBUG;
	
	$user = mysqli_escape_string($zbirka, $user);
	
	$podatki = json_decode(file_get_contents("php://input"),true);
	
	$password = mysqli_escape_string($zbirka, $podatki["password"]);

	if(user_obstaja($user))
	{
		
		
		if(isset($password, $ime, $priimek))
		{
			$poizvedba = "UPDATE user SET password='$password' WHERE user='$user'";
			
			if(mysqli_query($zbirka, $poizvedba))
			{
				http_response_code(204);	//OK with no content
			}
			else
			{
				http_response_code(500);	// Internal Server Error (ni nujno vedno streznik kriv!)
				
				if($DEBUG)	//Pozor: vračanje podatkov o napaki na strežniku je varnostno tveganje!
				{
					pripravi_odgovor_napaka(mysqli_error($zbirka));
				}
			}
		}
		else
		{
			http_response_code(400);	// Bad Request
		}
	}
	else
	{
		http_response_code(404);	// Not Found
	}
}	
	
function delete_user($user)
{	
	global $zbirka, $DEBUG;
	$user=mysqli_escape_string($zbirka, $user);

	if(user_obstaja($user))
	{
		$poizvedba="DELETE FROM user WHERE user='$user'";
		
		
		if(mysqli_query($zbirka, $poizvedba))
		{
			http_response_code(204);	//OK with no content
		}
		else
		{
			http_response_code(500);	// Internal Server Error (ni nujno vedno streznik kriv!)
			
			if($DEBUG)	//Pozor: vračanje podatkov o napaki na strežniku je varnostno tveganje!
			{
				pripravi_odgovor_napaka(mysqli_error($zbirka));
			}
		}
	}
	else
	{
		http_response_code(404);	// Not Found
	}
}

function delete_user_profiles($user)
{	
	global $zbirka, $DEBUG;
	$user=mysqli_escape_string($zbirka, $user);

	if(user_obstaja($user))
	{
		$poizvedba="DELETE FROM profiles WHERE user='$user'";
		
		
		if(mysqli_query($zbirka, $poizvedba))
		{
			http_response_code(204);	//OK with no content
		}
		else
		{
			http_response_code(500);	// Internal Server Error (ni nujno vedno streznik kriv!)
			
			if($DEBUG)	//Pozor: vračanje podatkov o napaki na strežniku je varnostno tveganje!
			{
				pripravi_odgovor_napaka(mysqli_error($zbirka));
			}
		}
	}
	else
	{
		http_response_code(404);	// Not Found
	}
}


?>