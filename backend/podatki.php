<?php 

	include("../orodja.php");
	$zbirka = dbConnect();

	//uporabnisko ime in geslo enega izmed registriranih uporabnikov:
	$username = "admin";
	$password = "mojegeslo";

	// uporabimo funkcijo apache_request_headers(), ker spremenljivka $_SERVER ne vsebuje vseh polj zaglavja (headerja)
	$headersBearer = apache_request_headers();
	$headerUsers = $headersBearer;	

	
	if(isset($headerUsers['Identification'])) {
		$headers = trim($headerUsers["Identification"]);
		
		// preverimo, ce je vrsta avtentikacije 'Bearers', in shranimo zeton
		if (preg_match('/user\s(\S+)/', $headers, $userMatches)) {
			
			// preverimo, ce je zeton veljaven
			if($userMatches[1]){
				$user = $userMatches[1];
				$poizvedba="SELECT user, password FROM user WHERE user='$user'";
				$rezultat=mysqli_query($zbirka, $poizvedba);

				if (mysqli_num_rows($rezultat) > 0) {
					$odgovor = mysqli_fetch_assoc($rezultat);
				}
		
				$json_odgovor = json_encode($odgovor);
				$json_decode = json_decode($json_odgovor);
				$password = $json_decode -> password;
				
				
			}
			else{
				echo "napaka 1";
				http_response_code(401);
			}
		}
		else{
			echo "napaka 2";
			http_response_code(401);
		}
	}
	else{
		echo "napaka 3";
		http_response_code(401);
	}

	// preverimo, ce je prisotno polje Authorization
	if(isset($headersBearer['Authorization'])) {
		$headers = trim($headersBearer["Authorization"]);
		
		// preverimo, ce je vrsta avtentikacije 'Bearers', in shranimo zeton
		if (preg_match('/Bearer\s(\S+)/', $headers, $matchesAuth)) {
			
			// preverimo, ce je zeton veljaven
			if($matchesAuth[1] == hash("md5", $user.$password)){
				echo "Zaklad je zakopan pod drevesom na vrtu.";		
			}
			else{
				echo "Ni pravega žetona, ni pravih podatkov!";
				http_response_code(401);
			}
		}
		else{
			echo "Ni žetona, ni podatkov!1";
			http_response_code(401);
		}
	}
	else{
		echo "Ni žetona, ni podatkov!2";
		http_response_code(401);
	}
?>