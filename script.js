// Recuperar datos guardados
let productos = JSON.parse(localStorage.getItem('almacen_prods')) || [];
let historial = JSON.parse(localStorage.getItem('almacen_hist')) || [];

// Módulo 1: Registro
function registrar() {
    const cod = document.getElementById('cod').value;
    const nom = document.getElementById('nom').value;
    const stk = parseFloat(document.getElementById('stk').value);
    const val = parseFloat(document.getElementById('val').value);

    if (productos.find(p => p.codigo === cod)) return alert("El código ya existe"); // [cite: 61]
    if (stk < 0 || val < 0) return alert("No valores negativos"); // [cite: 62-63]

    productos.push({
        codigo: cod, nombre: nom, stock: stk,
        costoPromedio: val, costoTotal: stk * val // [cite: 14-15]
    });
    guardarYActualizar();
}

// Módulos 2 y 3: Recepción y Despacho
function operacion(tipo) {
    const cod = document.getElementById('movCod').value;
    const cant = parseFloat(document.getElementById('movCant').value);
    const p = productos.find(prod => prod.codigo === cod);

    if (!p) return alert("Producto no existe"); // [cite: 67, 70]
    if (cant <= 0) return alert("Cantidad debe ser mayor a 0"); // [cite: 65, 69]

    if (tipo === 'recepcion') {
        const costoU = parseFloat(document.getElementById('movCosto').value);
        if (costoU <= 0) return alert("Costo debe ser mayor a 0"); // [cite: 66]

        // Fórmula Costo Promedio [cite: 25]
        let costoTotalAnterior = p.stock * p.costoPromedio;
        let costoNuevaCompra = cant * costoU;
        p.costoPromedio = (costoTotalAnterior + costoNuevaCompra) / (p.stock + cant);
        p.stock += cant;
        p.costoTotal = p.stock * p.costoPromedio;
        registrarHistorial("Recepción", cod, cant, p.stock);
    } else {
        if (cant > p.stock) return alert("Stock insuficiente"); // [cite: 71]
        
        p.stock -= cant; // [cite: 35]
        p.costoTotal = p.stock * p.costoPromedio; // Al despachar el promedio no cambia [cite: 39]
        registrarHistorial("Despacho", cod, cant, p.stock);
    }
    guardarYActualizar();
}

function registrarHistorial(tipo, cod, cant, final) {
    historial.push({
        tipo, codigo: cod, cantidad: cant,
        fecha: new Date().toLocaleString(), stockFinal: final // [cite: 55-56]
    });
}

function guardarYActualizar() {
    localStorage.setItem('almacen_prods', JSON.stringify(productos));
    localStorage.setItem('almacen_hist', JSON.stringify(historial));
    alert("Operación completada");
    location.reload();
}

// Cargar tablas si existen en la página actual
window.onload = function() {
    const tInv = document.getElementById('listaInv');
    const tHist = document.getElementById('listaHist');

    if (tInv) {
        productos.forEach(p => {
            tInv.innerHTML += `<tr><td>${p.codigo}</td><td>${p.nombre}</td><td>${p.stock}</td><td>${p.costoPromedio.toFixed(2)}</td><td>${p.costoTotal.toFixed(2)}</td></tr>`;
        });
    }
    if (tHist) {
        historial.reverse().forEach(h => {
            tHist.innerHTML += `<tr><td>${h.tipo}</td><td>${h.codigo}</td><td>${h.cantidad}</td><td>${h.fecha}</td><td>${h.stockFinal}</td></tr>`;
        });
    }
};
