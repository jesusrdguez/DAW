//  Hacerlo por partes, primero obtener número de subredes y hosts por subred
window.onload = () => {
  document.getElementById("btCalcular_Red").onclick = () => {
    calcularDireccionRed();
  };
};

function calcularDireccionRed () {
  console.log(`Hola`);
  const operacionAND = (IP, mascaraBinaria) => {
    var direccionRed = "";
    for (var i = 0; i < mascaraBinaria.length; i++) {
      var j = i + 1;
      if (IP.substring(i, j) == 1 && mascaraBinaria.substring(i, j) == 1) {
        direccionRed = direccionRed + "1";
      } else {
        direccionRed = direccionRed + "0";
      }
      if (i == 7 || i == 15 || i == 23) {
        direccionRed = direccionRed + ".";
      }
    }
    return direccionRed;
  };

  document.getElementById("red").value = direccionRed;
};

/**
 * Determinar la clase a la que pertenece la IP. Para ello
 * debemos saber a que rango pertenece su primer octeto.
 * 0 - 127: clase A
 * 128 - 191: clase B
 * 192 - 223: clase C
 */

// Determinar la máscara determinada de la IP
// a partir de su clase
var firstOctet = document.getElementById("ip1");
var octeto = parseInt(firstOctet.value, 10);

// Convertir la MÁSCARA de de subred A formato BINARIO

var octeto2 = parseInt(document.getElementById("ip2").value, 10);
var octeto3 = parseInt(document.getElementById("ip3").value, 10);
var octeto4 = parseInt(document.getElementById("ip4").value, 10);
var primerOctetoBin = octeto.toString(2);
var segundoOctetoBin = octeto2.toString(2);
var tercerOctetoBin = octeto3.toString(2);
var cuartoOctetoBin = octeto4.toString(2);

const mascaraPredeterminada = (primerOcteto) => {
  let mascPred;

  if (primerOcteto >= 0 && primerOcteto <= 127) {
    mascPred = 8;
  } else if (primerOcteto >= 128 && primerOcteto <= 191) {
    mascPred = 16;
  } else if (primerOcteto >= 192 && primerOcteto <= 223) {
    mascPred = 24;
  } else {
    mascPred = null;
  }

  return mascPred;
};

let mascaraDefault = mascaraPredeterminada(octeto);

var mascFirst = parseInt(document.getElementById("imasc1").value, 10);
var mascSecond = parseInt(document.getElementById("imasc2").value, 10);
var mascThird = parseInt(document.getElementById("imasc3").value, 10);
var mascFourth = parseInt(document.getElementById("imasc4").value, 10);

var binOcteto1 = mascFirst.toString(2);
var binOcteto2 = mascSecond.toString(2);
var binOcteto3 = mascThird.toString(2);
var binOcteto4 = mascFourth.toString(2);

var firstOctetIp = pasarBinario(primerOctetoBin);
var SecondOctetIp = pasarBinario(segundoOctetoBin);
var ThirdOctetIp = pasarBinario(tercerOctetoBin);
var fourthOctetIp = pasarBinario(cuartoOctetoBin);
var ipBin = firstOctetIp + SecondOctetIp + ThirdOctetIp + fourthOctetIp;
console.log("IP en binario: " + ipBin);
var mascCIDRBin =
  pasarBinario(binOcteto1) +
  pasarBinario(binOcteto2) +
  pasarBinario(binOcteto3) +
  pasarBinario(binOcteto4);
console.log("m1 en binario: " + mascCIDRBin);

/**
 * Función que pasa a binario un octeto
 */
function pasarBinario(octetoBinario) {
  if (octetoBinario.length != 8) {
    var longitudOcteto = octetoBinario.length;
    var octetoAuxiliar = octetoBinario;
    var cerosAnadir = 8 - longitudOcteto;
    var octetoDevolver = "";
    for (var i = 0; i < cerosAnadir; i++) {
      octetoDevolver = octetoDevolver + "0";
    }
    octetoDevolver = octetoDevolver + octetoAuxiliar;
    return octetoDevolver;
  } else {
    return octetoBinario;
  }
}

// Las máscaras tienen un número de 1s predeterminados, es decir,
// una máscara siempre será de la siguiente forma:
// Ej: 11111111.11111111.11111111.11000000
// Ej: 11111111.11111111.11111000.00000000

// Contar los 1s que hay en la máscara

// Hacer un bucle for para contar los unos que hay
// en la máscara utilizando la función: str.substring();

var unosPrimerOcteto = contarMasc(binOcteto1);
var unosSegundoOcteto = contarMasc(binOcteto2);
var unosTercerOcteto = contarMasc(binOcteto3);
var unosCuartoOcteto = contarMasc(binOcteto4);
var mascaraCIDR =
  unosPrimerOcteto + unosSegundoOcteto + unosTercerOcteto + unosCuartoOcteto;

function contarMasc(numeroBinario) {
  var sumaUnos = 0;
  if (numeroBinario > 0) {
    for (var i = 0; i < numeroBinario.length; i++) {
      var finalSubstring = i + 1;
      if (numeroBinario.substring(i, finalSubstring) == 1) {
        sumaUnos++;
      }
    }
    return sumaUnos;
  } else {
    return sumaUnos;
  }
}

// Calcular nº de subredes
/**
 * El número de subredes se hacer elvando
 * a dos los número prestados a máscara.
 * Los números prestados son los añadidos
 * a la máscara de la máscara por defecto.
 */
var bitsPrestados = mascaraCIDR - mascaraDefault;
var numeroSubredes = Math.pow(2, bitsPrestados);

/**
 * Una máscara tiene 32 bits totales, y la máscara ha
 * utilizado en esta ocasión 16 bits, por lo que
 * la resta de 32 - 16, resultaría de los bits
 * dedicados al host.
 */

var bitsHost = 32 - mascaraCIDR;
var numeroHosts = Math.pow(2, bitsHost);

//  Segundo, que te calcule la subred a la que pertenece.

var redBin = operacionAND(ipBin, mascCIDRBin);
console.log(redBin);
var octetosRedBin = redBin.split(".");
var octetoRedBin1 = parseInt(octetosRedBin[0], 2);
var octetoRedBin2 = parseInt(octetosRedBin[1], 2);
var octetoRedBin3 = parseInt(octetosRedBin[2], 2);
var octetoRedBin4 = parseInt(octetosRedBin[3], 2);

var direccionRed =
  octetoRedBin1 +
  "." +
  octetoRedBin2 +
  "." +
  octetoRedBin3 +
  "." +
  octetoRedBin4;
console.log("Dirección de red: " + direccionRed);
var direccionRedBinario =
  octetosRedBin[0] + octetosRedBin[1] + octetosRedBin[2] + octetosRedBin[3];
console.log(
  "Dirección de red en binario sin separación: " + direccionRedBinario
);

// Completar la primera tabla con los datos correspondientes

/**
 * Para la dirección de broadcast hay que añadir
 * los bits del hosts a la dirección de red (el
 * resultado de la operación AND).
 */

var direccionBroadcastBin = calcularBroadcast(direccionRedBinario).split(".");
var direccionBroadcast =
  parseInt(direccionBroadcastBin[0], 2) +
  "." +
  parseInt(direccionBroadcastBin[1], 2) +
  "." +
  parseInt(direccionBroadcastBin[2], 2) +
  "." +
  parseInt(direccionBroadcastBin[3], 2);
console.log(direccionBroadcast);

function calcularBroadcast(direccionRedBinario) {
  var unosSumar = bitsHost;
  var direccionRedBinarioAux = direccionRedBinario;
  var tamanioDireccionRed = direccionRedBinario.length;
  var acortar = tamanioDireccionRed - unosSumar;
  var direccionBorrador = direccionRedBinario.substring(0, acortar);
  console.log("Dirección con los 0s quitados: " + direccionBorrador);
  console.log(direccionBorrador.length);
  for (var i = 0; i < unosSumar; i++) {
    direccionBorrador = direccionBorrador + "1";
  }
  console.log(direccionBorrador);
  var direccionDefinitiva = dividirOctetosPunto(direccionBorrador);
  return direccionDefinitiva;
}

function dividirOctetosPunto(numeroBinario) {
  var uno = numeroBinario.substring(0, 8);
  var dos = numeroBinario.substring(8, 16);
  var tres = numeroBinario.substring(16, 24);
  var cuatro = numeroBinario.substring(24, 32);
  var direccion = uno + "." + dos + "." + tres + "." + cuatro;
  return direccion;
}

document.getElementById("difusion").value = direccionBroadcast;
document.getElementById("nsubredes").value = numeroSubredes;
document.getElementById("nhost").value = numeroHosts;

//	Y por último que te calcule la tabla de todas las subredes.
