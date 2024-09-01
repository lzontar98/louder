<?php
$DEBUG = true;

include_once("orodja.php"); 			// Vključitev 'orodij'

$zbirka = dbConnect();			//Pridobitev povezave s podatkovno zbirko

header('Content-Type: application/json');	// Nastavimo MIME tip vsebine odgovora
header('Access-Control-Allow-Origin: *');	// Dovolimo dostop izven trenutne domene (CORS)
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');		//v preflight poizvedbi za CORS sta dovoljeni le metodi GET in POST


switch($_SERVER["REQUEST_METHOD"])			//glede na HTTP metodo izvedemo ustrezno dejanje nad virom
{
	case 'GET':
		if(!empty($_GET["user"] && $_GET["profile"])) //dobimo specifičen profil
		{
			profile_parameters($_GET["user"], $_GET["profile"]);
		}
		elseif(!empty($_GET["user"])) {
			
			user_profiles($_GET["user"]); //seznam profilov userja
		}
		else
		{
			http_response_code(400);	// Bad Request
		}
		break;
		
	case 'POST':
			add_profile();
		break;
		
	case 'PUT':
		if(!empty($_GET["profile"]))
		{
			update_parameters($_GET["profile"]);
		}
		else
		{
			http_response_code(400);	// Če ne posredujemo profila je to 'Bad Request'
		}
		break;	
		
	case 'DELETE': 
		if(!empty($_GET["profile"]))
		{
			delete_profile($_GET["profile"]);
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
		http_response_code(405);	//Method Not Allowed
		break;
}

//mysqli_close($zbirka);					// Sprostimo povezavo z zbirko


// ----------- konec skripte, sledijo funkcije -----------
function user_profiles($user)
{
	global $zbirka;
	$user=mysqli_escape_string($zbirka, $user);
	$odgovor=array();
	
	if(user_obstaja($user))
	{
		
		$poizvedba="SELECT profile FROM profiles WHERE user='$user'";
		
		$result=mysqli_query($zbirka, $poizvedba);

		while($vrstica=mysqli_fetch_assoc($result))
		{
			$odgovor[]=$vrstica;
		}
		
		http_response_code(200);		//OK
		echo json_encode($odgovor);
	}
	else
	{
		http_response_code(404);	// Not Found
	}
}

function profile_parameters($user, $profile, $parameter = null) {
    global $zbirka;
    $user = mysqli_escape_string($zbirka, $user);
    $profile = mysqli_escape_string($zbirka, $profile);
    
    $odgovor = array();
    if (profile_obstaja($profile)) {
        // If a specific parameter is requested, query only that parameter
        if ($parameter) {
            $parameter = mysqli_escape_string($zbirka, $parameter);
            $poizvedba = "SELECT $parameter FROM profiles WHERE user='$user' AND profile='$profile'";
        } else {
            // Query all parameters if no specific parameter is specified
            $poizvedba = "SELECT CH1, CH2, CH3, CH4, Bass1, Mid1, Treble1, Bass2, Mid2, Treble2, Bass3, Mid3, Treble3, Bass4, Mid4, Treble4 FROM profiles WHERE user='$user' AND profile='$profile'";
        }

        $result = mysqli_query($zbirka, $poizvedba);

        if ($parameter) {
            // Fetch the single specified parameter
            $vrstica = mysqli_fetch_assoc($result);
            if ($vrstica) {
                $odgovor = $vrstica[$parameter];
            }
        } else {
            // Fetch all parameters
            while ($vrstica = mysqli_fetch_assoc($result)) {
                $odgovor[] = $vrstica;
            }
        }

        header('Content-Type: application/json');
        http_response_code(200); // OK
        echo json_encode($odgovor);
    } else {
        http_response_code(404); // Not Found
    }
}


function add_profile()//redundantna, ni v uporabi, profili sedaj narjeni v dunkciji add user
{
	global $zbirka, $DEBUG;
	
	$podatki = json_decode(file_get_contents('php://input'), true);
	
	if(isset($podatki["user"], $podatki["profile"],$podatki["CH1"], $podatki["CH2"], $podatki["CH3"], $podatki["CH4"]))
	{
		$user = mysqli_escape_string($zbirka, $podatki["user"]);
		$profile = mysqli_escape_string($zbirka, $podatki["profile"]);
			
		if(profile_obstaja($profile))
		{
			http_response_code(409);	// Conflict
			pripravi_odgovor_napaka("Profile already exists!");
			
		}
		else 
		{
			if(user_obstaja($user))	//preprecimo napako zaradi krsitve FK 
			{
				#$user = mysqli_escape_string($zbirka, $podatki["user"]);
				#$profile = mysqli_escape_string($zbirka, $podatki["profile"]);
				$CH1 = mysqli_escape_string($zbirka, $podatki["CH1"]);
				$CH2 = mysqli_escape_string($zbirka, $podatki["CH2"]);
				$CH3 = mysqli_escape_string($zbirka, $podatki["CH3"]);
				$CH4 = mysqli_escape_string($zbirka, $podatki["CH4"]);

				$poizvedba="INSERT INTO profiles (user, profile, CH1, CH2, CH3, CH4) VALUES ('$user', '$profile', '$CH1', '$CH2', '$CH3', '$CH4')";
				
				if(mysqli_query($zbirka, $poizvedba))
				{
					http_response_code(201);	// Created
					// ne pošljemo URL-ja do vpisane igre, ker ne omogočamo vpogleda v posamezno igro
				}
				else
				{
					http_response_code(500);	// Internal Server Error

					if($DEBUG)	//Pozor: vračanje podatkov o napaki na strežniku je varnostno tveganje!
					{
						pripravi_odgovor_napaka(mysqli_error($zbirka));
					}
				}
			}
			else
			{
				http_response_code(409);	// Conflict (in ne 404 - vir na katerega se tu sklicujemo je igra in ne igralec!)
				pripravi_odgovor_napaka("User does not exist!");
			}
		}
	}
	else
	{
		http_response_code(400);	// Bad Request
	}
}

function delete_profile($profile) { //trenutno ni v uporabi
	
	global $zbirka, $DEBUG;
	#$user=mysqli_escape_string($zbirka, $user);
	$profile=mysqli_escape_string($zbirka, $profile);

	if(profile_obstaja($profile))
	{
		$poizvedba="DELETE FROM profiles WHERE  profile = '$profile'";
		
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

function update_parameters($profile) {
    global $zbirka;
    
    $podatki = json_decode(file_get_contents("php://input"), true);
    $profile = mysqli_escape_string($zbirka, $profile);
    $odgovor = array();
    
    if (profile_obstaja($profile)) {
        // Escape and assign all parameters
        $CH1 = mysqli_escape_string($zbirka, $podatki["CH1"]);
        $CH2 = mysqli_escape_string($zbirka, $podatki["CH2"]);
        $CH3 = mysqli_escape_string($zbirka, $podatki["CH3"]);
        $CH4 = mysqli_escape_string($zbirka, $podatki["CH4"]);
        $Bass1 = mysqli_escape_string($zbirka, $podatki["Bass1"]);
        $Mid1 = mysqli_escape_string($zbirka, $podatki["Mid1"]);
        $Treble1 = mysqli_escape_string($zbirka, $podatki["Treble1"]);
        $Bass2 = mysqli_escape_string($zbirka, $podatki["Bass2"]);
        $Mid2 = mysqli_escape_string($zbirka, $podatki["Mid2"]);
        $Treble2 = mysqli_escape_string($zbirka, $podatki["Treble2"]);
        $Bass3 = mysqli_escape_string($zbirka, $podatki["Bass3"]);
        $Mid3 = mysqli_escape_string($zbirka, $podatki["Mid3"]);
        $Treble3 = mysqli_escape_string($zbirka, $podatki["Treble3"]);
        $Bass4 = mysqli_escape_string($zbirka, $podatki["Bass4"]);
        $Mid4 = mysqli_escape_string($zbirka, $podatki["Mid4"]);
        $Treble4 = mysqli_escape_string($zbirka, $podatki["Treble4"]);

        // Check if all parameters are set
        if (isset($CH1, $CH2, $CH3, $CH4, $Bass1, $Mid1, $Treble1, $Bass2, $Mid2, $Treble2, $Bass3, $Mid3, $Treble3, $Bass4, $Mid4, $Treble4)) {
            $poizvedba = "UPDATE profiles SET 
                CH1 = '$CH1', 
                CH2 = '$CH2', 
                CH3 = '$CH3', 
                CH4 = '$CH4',
                Bass1 = '$Bass1',
                Mid1 = '$Mid1',
                Treble1 = '$Treble1',
                Bass2 = '$Bass2',
                Mid2 = '$Mid2',
                Treble2 = '$Treble2',
                Bass3 = '$Bass3',
                Mid3 = '$Mid3',
                Treble3 = '$Treble3',
                Bass4 = '$Bass4',
                Mid4 = '$Mid4',
                Treble4 = '$Treble4'
                WHERE profile = '$profile'";

            if (mysqli_query($zbirka, $poizvedba)) {
                http_response_code(204);    // OK with no content
            } else {
                http_response_code(500);    // Internal Server Error
                if ($DEBUG) {
                    pripravi_odgovor_napaka(mysqli_error($zbirka));
                }
            }
        } else {
            http_response_code(400);    // Bad Request
        }
    } else {
        http_response_code(404);    // Not Found
    }
}




?>