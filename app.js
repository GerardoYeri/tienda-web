

const url = "https://opensheet.elk.sh/18Q5dm_v6XIbUk4ea6qqNpXZ33Y7oj8re1mZ4kee7Jv8/PRODUCTOS_WEB";

let carrito = [];

fetch(url)
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById("productos");
    const buscador = document.getElementById("buscador");
    const contador = document.getElementById("contadorCarrito");
    const carritoDiv = document.getElementById("carrito");
    const toggleCarrito = document.getElementById("toggleCarrito");
    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");
    const finalizarCompra = document.getElementById("finalizarCompra");

    const menuLateral = document.getElementById("menuLateral");
    const abrirMenu = document.getElementById("abrirMenu");
    const cerrarMenu = document.getElementById("cerrarMenu");
    const listaSecciones = document.getElementById("listaSecciones");

abrirMenu.onclick = () => {
  menuLateral.classList.remove("-translate-x-full");
  abrirMenu.classList.add("hidden");
};

cerrarMenu.onclick = () => {
  menuLateral.classList.add("-translate-x-full");
  abrirMenu.classList.remove("hidden");
};
    // Agrupar productos por sección
    function agruparPorSeccion(lista) {
      const agrupados = {};
      lista.forEach(prod => {
        const sec = prod.Seccion || "Sin sección";
        if (!agrupados[sec]) agrupados[sec] = [];
        agrupados[sec].push(prod);
      });
      return agrupados;
    }

    // Calcular precio con descuento
    function calcularPrecio(precio, oferta) {
      if (!precio) return null;
      const p = parseFloat(precio.toString().replace(/\./g, "").replace(",", "."));
      const desc = parseFloat(oferta) || 0;
      if (isNaN(p)) return null;
      return desc > 0 ? p - (p * (desc / 100)) : p;
    }

    // 🛒 Actualizar carrito visualmente
    function actualizarCarrito() {
      listaCarrito.innerHTML = "";
      let total = 0;

      carrito.forEach((prod, i) => {
        const precio = prod.precioFinal || 0;
        const subtotal = precio * prod.cantidad;
        total += subtotal;

        const item = document.createElement("div");
        item.className = "flex justify-between items-center bg-gray-100 rounded p-2";

        item.innerHTML = `
          <div class="text-sm w-1/2">
            <p class="font-semibold">${prod.Descripcion}</p>
            <p class="text-xs text-gray-500">$${precio.toLocaleString("es-AR")}</p>
          </div>
          <div class="flex items-center gap-1">
            <button class="px-2 bg-gray-300 rounded" data-accion="restar" data-index="${i}">-</button>
            <span>${prod.cantidad}</span>
            <button class="px-2 bg-gray-300 rounded" data-accion="sumar" data-index="${i}">+</button>
          </div>
          <button class="text-red-600 font-bold" data-accion="eliminar" data-index="${i}">✕</button>
        `;
        listaCarrito.appendChild(item);
      });

      totalCarrito.textContent = `$${total.toLocaleString("es-AR")}`;
      contador.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);

      // Control de botones (sumar/restar/eliminar)
      listaCarrito.querySelectorAll("button").forEach(btn => {
        const i = btn.dataset.index;
        const accion = btn.dataset.accion;
        btn.onclick = () => {
          if (accion === "sumar") carrito[i].cantidad++;
          if (accion === "restar" && carrito[i].cantidad > 1) carrito[i].cantidad--;
          if (accion === "eliminar") carrito.splice(i, 1);
          actualizarCarrito();
        };
      });
    }

    // Mostrar productos dentro de una sección
    function mostrarProductos(lista, contenedorDestino) {
      lista.forEach(prod => {
        const precioFinal = calcularPrecio(prod.Precio, prod.Oferta);
        const precioNumerico = parseFloat(prod.Precio?.toString().replace(/\./g, "").replace(",", "."));
        const numeroWhatsApp = "5493535649674";
        const mensaje = encodeURIComponent(`Hola! Quisiera consultar por el producto: ${prod.Descripcion}`);
        const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

        const item = document.createElement("div");
        item.className = `
  bg-white p-4 rounded-xl shadow hover:shadow-lg transition w-full max-w-xs flex flex-col justify-between
`;

        item.innerHTML = `
          <div>
            <h3 class="text-lg font-bold mb-2 text-blue-700">${prod.Descripcion}</h3>
            <p class="text-sm text-gray-500"><strong>Sección:</strong> ${prod.Seccion}</p>
            ${prod.Subseccion ? `<p class="text-sm text-gray-500 mb-2"><strong>Subsección:</strong> ${prod.Subseccion}</p>` : ""}
          </div>

          <div class="mt-2">
            ${prod.Precio
            ? prod.Oferta
              ? `
                    <p class="text-gray-500 line-through">$${precioNumerico.toLocaleString("es-AR")}</p>
                    <p class="text-green-600 font-semibold text-lg">$${precioFinal.toLocaleString("es-AR")}</p>
                    <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">🔥 ${prod.Oferta}% OFF</span>
                  `
              : `<p class="text-blue-700 font-semibold text-lg">$${prod.Precio}</p>`
            : `<p class="text-gray-400 italic">Consultar precio</p>`
          }

            <div class="mt-3 flex gap-2">
              ${prod.Precio
            ? `<button
              class="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition w-full"
              data-descripcion="${prod.Descripcion}"
              data-precio="${precioFinal || 0}">
              🛒 <span>Agregar</span>
            </button>`
            : ""
          }
          <a href="${enlaceWhatsApp}" target="_blank"
              class="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#1DA851] transition w-full text-center font-medium text-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              class="w-6 h-6">
            <span>Consultar</span>
          </a>  

            </div>
          </div>
        `;

        const btnAgregar = item.querySelector("button");
        if (btnAgregar) {
          btnAgregar.onclick = () => {
            const existente = carrito.find(p => p.Descripcion === prod.Descripcion);
            if (existente) existente.cantidad++;
            else carrito.push({ ...prod, cantidad: 1, precioFinal });
            actualizarCarrito();
          };
        }

        contenedorDestino.appendChild(item);
      });
    }

    // Mostrar secciones con fondos locales
    function mostrarSecciones(agrupados) {
      contenedor.innerHTML = "";

      Object.keys(agrupados)
      .sort((a,b)=>{
  const aIndex = data.findIndex(p=>p.Seccion===a);
  const bIndex = data.findIndex(p=>p.Seccion===b);
  return aIndex - bIndex;
})
.forEach(seccion => {
        let fondo;
        const s = seccion.toLowerCase();
        if (s.includes("chocolate")) fondo = "imagenes/chocolate.jpg";
        else if (s.includes("cacao")) fondo = "imagenes/cacao.jpg";
        else if (s.includes("balde")) fondo = "imagenes/baldes.jpg";
        else if (s.includes("almendra")) fondo = "imagenes/almendra.jpg";
        else if (s.includes("azucar")) fondo = "imagenes/azucar.jpg";
        else if (s.includes("aro")) fondo = "imagenes/aro.jpg";
        else if (s.includes("bandeja")) fondo = "imagenes/bandeja.jpg";
        else if (s.includes("banderin")) fondo = "imagenes/banderin.jpg";
        else if (s.includes("nuez")) fondo = "imagenes/nuez.jpg";
        else fondo = "imagenes/bg_default.jpg";

        const bloque = document.createElement("section");
        bloque.className = "w-full mb-10 rounded-2xl overflow-hidden relative";
        bloque.style.backgroundImage = `url('${fondo}')`;
        bloque.style.backgroundSize = "cover";
        bloque.style.backgroundPosition = "center";
        bloque.style.backgroundRepeat = "no-repeat";

        const overlay = document.createElement("div");
        overlay.className = "absolute inset-0 bg-black opacity-40";
        bloque.appendChild(overlay);

        const titulo = document.createElement("h2");
        titulo.textContent = seccion;
        titulo.className = "relative z-10 text-3xl font-bold text-center text-white py-6";
        bloque.appendChild(titulo);

        const contProd = document.createElement("div");
        contProd.className =
"relative z-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6";
        mostrarProductos(agrupados[seccion], contProd);

        bloque.appendChild(contProd);
        contenedor.appendChild(bloque);
      });
    }

    // 🔍 Buscador
   buscador.addEventListener("input", () => {

  const texto = buscador.value.toLowerCase();

  const productosFiltrados = data.filter(prod =>
    prod.Descripcion.toLowerCase().includes(texto) ||
    (prod.Seccion && prod.Seccion.toLowerCase().includes(texto)) ||
    (prod.Subseccion && prod.Subseccion.toLowerCase().includes(texto)) ||
    (texto.includes("oferta") && prod.Oferta)
  );

  const agrupados = agruparPorSeccion(productosFiltrados);

  mostrarSecciones(agrupados);

});

    // 🟢 Carga inicial
    const agrupados = agruparPorSeccion(data);
    mostrarSecciones(agrupados);

    // 📂 Crear menú de secciones
Object.keys(agrupados).forEach(sec => {
  const btn = document.createElement("button");

  btn.textContent = `${sec} (${agrupados[sec].length})`;
  btn.className = "text-left p-2 rounded hover:bg-gray-200";

  btn.onclick = () => {
    const seccion = [...document.querySelectorAll("section")]
      .find(s => s.querySelector("h2").textContent === sec);

    if (seccion) {
      seccion.scrollIntoView({ behavior: "smooth" });
      menuLateral.classList.add("-translate-x-full");
      abrirMenu.classList.remove("hidden");
    }
  };

  listaSecciones.appendChild(btn);
});

    // 🛒 Mostrar / ocultar carrito
    toggleCarrito.onclick = () => carritoDiv.classList.toggle("hidden");

    // 💬 Finalizar compra
    finalizarCompra.onclick = () => {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
      }
      const resumen = carrito.map(p => `${p.Descripcion} x${p.cantidad}`).join("\n");
      const total = totalCarrito.textContent;
      const mensaje = encodeURIComponent(`Hola! Quiero finalizar mi compra:\n${resumen}\nTotal: ${total}`);
      window.open(`https://wa.me/5493535649674?text=${mensaje}`, "_blank");
      
    };
    // ⬆ Botón subir arriba
const btnSubir = document.getElementById("subirArriba");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    btnSubir.classList.remove("hidden");
  } else {
    btnSubir.classList.add("hidden");
  }
});

btnSubir.onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};
  })

  
  
  .catch(err => console.error("Error al cargar productos:", err));
