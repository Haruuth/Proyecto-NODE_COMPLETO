const coctelesUrl = "http://localhost:9000/cocteles";
const botones = document.querySelectorAll(".but");
const tarjeta = document.querySelector(".tarjeta");

const fetchCocteles = async (url) => {
  try {
    const callCocteles = await fetch(url);
    const response = await callCocteles.json();

    return response;
  } catch (error) {
    console.log(error.message);
  }
};

const getCocktails = async (url) => {
  try {
    tarjeta.innerHTML = '<div class="cargando">Cargando tus cócteles...</div>';
    const cocteles = await fetchCocteles(url);
    console.log(cocteles);

    if (cocteles.info.prevPage !== null) {
      botones[0].href = `javascript: getCocktails("${cocteles.info.prevPage}")`;
      botones[0].style.visibility = "visible";
    } else {
      botones[0].href = "javascript: void(0)";
      botones[0].style.visibility = "hidden";
    }

    if (cocteles.info.nextPage !== null) {
      botones[1].href = `javascript: getCocktails("${cocteles.info.nextPage}")`;
      botones[1].style.visibility = "visible";
    } else {
      botones[1].href = "javascript: void(0)";
      botones[1].style.visibility = "hidden";
    }
    tarjeta.innerHTML = "";
    for (const cocs of cocteles.results) {
      pintarCocteles(cocs);
    }
  } catch (error) {
    console.log(error.message);
    tarjeta.innerHTML =
      '<div class="error">Ha ocurrido un error al obtener los datos</div>';
  }
};

const pintarCocteles = async (item) => {
  let ingredientes = item.receta.map((ingre) => `<li>${ingre.nombre}</li>`).join("");
  let coc = `
  
    <div class="tarjeta">
      <div class="tarjeta_frontal">
        <h3>${item.nombre}</h3>
        <div class="tarjeta_imagen" style="background-image: url('${item.image}')"></div>
        <p>${item.descripcion}</p>
      </div>
      <div class="tarjeta_trasera">
        <h4>Ingredientes:</h4>
        <ul>${ingredientes}</ul>
        <p>${item.instrucciones}</p>
      </div>
  </div>`;

  tarjeta.innerHTML += coc;
};

const buscarCocteles = async () => {
  const busqueda = document.getElementById(".busqueda").value;

  const cocteles = await fetchCocteles(coctelesUrl);

  const resultados = cocteles.results.filter((coctel) =>
    coctel.nombre.includes(busqueda)
  );

  tarjeta.innerHTML = "";

  if (resultados.length > 0) {
    for (const cocs of resultados) {
      pintarCocteles(cocs);
    }
  } else {
    tarjeta.innerHTML =
      '<div class="error">No se encontraron cócteles que coincidan con la búsqueda</div>';
  }
};

// const buscarBoton = document.getElementById(".buscar");
// buscarBoton.addEventListener("click", buscarCocteles);

const init = async () => {
  await getCocktails(coctelesUrl);
};

init();
