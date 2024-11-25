function sumarNumeros() {
    const numero1 = parseFloat(document.getElementById('numero1').value);
    const numero2 = parseFloat(document.getElementById('numero2').value);

    if (isNaN(numero1) || isNaN(numero2)) {
        document.getElementById('resultado').textContent = 'Por favor, ingresa números válidos';
        return;
    }

    const suma = numero1 + numero2;
    document.getElementById('resultado').textContent = 'Resultado: ' + suma;
}