/* Maho's Tours La Paz · datos del negocio.
   Todo lo que cambia seguido (precios, horarios, tours, teléfono) vive aquí.
   POR CONFIRMAR = dato que la dueña tiene que validar antes de publicar la versión final. */
window.NEGOCIO = {
  nombre: "Maho's Tours La Paz",
  giro: "TravelAgency",
  demo: true,
  telefono: "+526120000000",          // POR CONFIRMAR: número de muestra
  whatsapp: "526120000000",           // POR CONFIRMAR: número de muestra (solo dígitos, con 52)
  instagram: "https://www.instagram.com/mahostours/",
  facebook: "https://www.facebook.com/Mahostours",
  zona_horaria: "America/Mazatlan",
  // Horario en que contestan WhatsApp. POR CONFIRMAR (muestra: diario de 8:00 a 20:00)
  horario: { 0: [["08:00","20:00"]], 1: [["08:00","20:00"]], 2: [["08:00","20:00"]], 3: [["08:00","20:00"]], 4: [["08:00","20:00"]], 5: [["08:00","20:00"]], 6: [["08:00","20:00"]] },
  cierres_especiales: {},
  moneda: "MXN",

  // Puntos de salida (coordenadas aproximadas para el mapa y "cómo llegar")
  salidas: {
    muelle: { nombre: { es: "Muelle Fiscal", en: "Muelle Fiscal pier" }, zona: { es: "Malecón de La Paz", en: "La Paz boardwalk" }, query: "Muelle Fiscal, Malecón, La Paz, Baja California Sur", lat: 24.1607, lon: -110.3146 },
    marina: { nombre: { es: "Marina La Costa", en: "Marina La Costa" }, zona: { es: "Malecón de La Paz", en: "La Paz boardwalk" }, query: "Marina La Costa, La Paz, Baja California Sur", lat: 24.1566, lon: -110.3217 },
    ventana: { nombre: { es: "La Ventana / Punta Arena", en: "La Ventana / Punta Arena" }, zona: { es: "Por confirmar", en: "To be confirmed" }, query: "La Ventana, Baja California Sur", lat: 24.05, lon: -109.99 }
  },

  // Paradas de la carta (coordenadas aproximadas; la carta es ilustrativa)
  paradas: {
    muelle:    { es: "Muelle Fiscal", en: "Muelle Fiscal", lat: 24.1607, lon: -110.3146 },
    marina:    { es: "Marina La Costa", en: "Marina La Costa", lat: 24.1566, lon: -110.3217 },
    balandra:  { es: "Balandra", en: "Balandra", lat: 24.322, lon: -110.325 },
    loberita:  { es: "La Loberita · Faro de San Lorenzo", en: "La Loberita · San Lorenzo lighthouse", lat: 24.38, lon: -110.325 },
    lupona:    { es: "Punta Lupona", en: "Punta Lupona", lat: 24.405, lon: -110.33 },
    gabriel:   { es: "Bahía San Gabriel", en: "San Gabriel Bay", lat: 24.43, lon: -110.36 },
    bonanza:   { es: "La Bonanza", en: "La Bonanza", lat: 24.44, lon: -110.30 },
    ensenada:  { es: "Ensenada Grande", en: "Ensenada Grande", lat: 24.565, lon: -110.405 },
    islotes:   { es: "Los Islotes · lobos marinos", en: "Los Islotes · sea lions", lat: 24.603, lon: -110.398 },
    pesca:     { es: "Zona de pesca", en: "Fishing grounds", lat: 24.43, lon: -110.20 },
    ballena:   { es: "Zona del tiburón ballena", en: "Whale shark area", lat: 24.205, lon: -110.385 },
    ventana:   { es: "La Ventana", en: "La Ventana", lat: 24.07, lon: -109.965 },
    cerralvo:  { es: "Isla Cerralvo", en: "Cerralvo Island", lat: 24.27, lon: -109.92 }
  },

  tours: [
    {
      id: "es-balandra",
      tipo: "compartido",
      nombre: { es: "Espíritu Santo + Balandra", en: "Espíritu Santo + Balandra" },
      linea: { es: "El día completo: lobos marinos, arrecife, lunch en Ensenada Grande y la tarde en Balandra.", en: "The full day: sea lions, reef snorkeling, lunch on Ensenada Grande and the afternoon at Balandra." },
      duracion: 6, horario: "11:00 – 17:00", salida: "muelle",
      ruta: ["muelle", "balandra", "islotes", "ensenada", "gabriel", "muelle"],
      actividades: {
        es: ["Balandra, con tiempo de playa", "Nado con lobos marinos", "Snorkel en arrecife de coral", "Lunch en la playa de Ensenada Grande", "Bahía San Gabriel y sus aves", "Formaciones rocosas de la isla"],
        en: ["Balandra, with beach time", "Swim with sea lions", "Snorkeling over coral reef", "Lunch on the beach at Ensenada Grande", "San Gabriel Bay and its seabirds", "The island's rock formations"]
      },
      incluye: {
        es: ["Embarcación techada con baño", "Guía certificado y equipo de snorkel", "Comida en la playa y bebidas", "Permisos del parque y seguro"],
        en: ["Covered boat with a restroom", "Certified guide and snorkel gear", "Beach lunch and drinks", "Park permits and insurance"]
      },
      noincluye: null,
      precios: [ { etiqueta: { es: "Adulto", en: "Adult" }, monto: 1300, por: "persona" }, { etiqueta: { es: "Menor", en: "Child" }, monto: 1200, por: "persona" } ],
      cobro: "persona"
    },
    {
      id: "es-privado",
      tipo: "privado",
      nombre: { es: "Espíritu Santo privado", en: "Private Espíritu Santo" },
      linea: { es: "La isla a tu ritmo, en una lancha solo para tu grupo, con la playa que tú elijas.", en: "The island at your pace, on a boat just for your group, at the beach you pick." },
      duracion: 6, horario: "10:00 – 16:00", salida: "marina",
      ruta: ["marina", "islotes", "ensenada", "gabriel", "lupona", "marina"],
      actividades: {
        es: ["Visita a la colonia de lobos marinos", "Snorkel en arrecife de coral", "Bahía San Gabriel y sus aves", "Formaciones rocosas", "Playa de tu elección"],
        en: ["Visit the sea lion colony", "Snorkeling over coral reef", "San Gabriel Bay and its seabirds", "Rock formations", "A beach of your choice"]
      },
      incluye: {
        es: ["Embarcación techada", "Guía certificado y equipo de snorkel", "Comida en la playa: ceviche, fruta y sándwiches", "Agua y refrescos", "Permisos del parque y seguro"],
        en: ["Covered boat", "Certified guide and snorkel gear", "Beach lunch: ceviche, fruit and sandwiches", "Water and sodas", "Park permits and insurance"]
      },
      noincluye: null,
      precios: [ { etiqueta: { es: "Por embarcación", en: "Per boat" }, monto: 12000, por: "grupo" } ],
      cobro: "grupo"
    },
    {
      id: "balandra-privado",
      tipo: "privado",
      nombre: { es: "Balandra privado", en: "Private Balandra" },
      linea: { es: "Cuatro horas en la bahía más clara de La Paz, con ceviche y cerveza fría a bordo.", en: "Four hours in La Paz's clearest bay, with ceviche and cold beer on board." },
      duracion: 4, horario: null, salida: "marina", capacidad: 6,
      ruta: ["marina", "balandra", "marina"],
      actividades: {
        es: ["Snorkel en arrecife de coral", "Tiempo de playa en Balandra"],
        en: ["Snorkeling over coral reef", "Beach time at Balandra"]
      },
      incluye: {
        es: ["4 horas de servicio", "Ceviche de pescado y sándwich de jamón y queso con vegetales", "Agua, refrescos y 2 cervezas por persona", "Equipo de snorkel"],
        en: ["4 hours on the water", "Fish ceviche and ham-and-cheese sandwiches with veggies", "Water, sodas and 2 beers per person", "Snorkel gear"]
      },
      noincluye: null,
      precios: [ { etiqueta: { es: "Hasta 6 personas", en: "Up to 6 guests" }, monto: 12000, por: "grupo" } ],
      cobro: "grupo"
    },
    {
      id: "pesca",
      tipo: "privado",
      nombre: { es: "Pesca deportiva", en: "Sportfishing" },
      linea: { es: "Salida con la primera luz. Siete horas para pelear un dorado en el Mar de Cortés.", en: "Out at first light. Seven hours to fight a dorado in the Sea of Cortez." },
      duracion: 7, horario: "6:30 – 15:00", salida: "marina", capacidad: 4,
      ruta: ["marina", "pesca", "marina"],
      actividades: {
        es: ["Pesca deportiva en lancha privada", "Salida de 6:30 a 7:00 a.m.", "Regreso alrededor de las 3:00 p.m."],
        en: ["Private sportfishing boat", "Departure 6:30 to 7:00 a.m.", "Back around 3:00 p.m."]
      },
      incluye: {
        es: ["Equipo de pesca", "Agua, hielo y refrescos"],
        en: ["Fishing tackle", "Water, ice and sodas"]
      },
      noincluye: {
        es: ["Carnada", "Licencia de pesca", "Lunch"],
        en: ["Bait", "Fishing license", "Lunch"]
      },
      precios: [ { etiqueta: { es: "2 personas", en: "2 anglers" }, monto: 6500, por: "grupo" }, { etiqueta: { es: "Persona adicional (máx. 4)", en: "Each extra angler (max 4)" }, monto: 500, por: "persona" } ],
      cobro: "pesca"
    },
    {
      id: "cerralvo",
      tipo: "compartido",
      nombre: { es: "Isla Cerralvo", en: "Cerralvo Island" },
      linea: { es: "La isla del otro lado: lobos marinos, arrecifes y, si el mar quiere, delfines y mobulas.", en: "The island on the far side: sea lions, reefs and, if the sea allows, dolphins and mobula rays." },
      duracion: 5, horario: null, salida: "ventana",
      ruta: ["ventana", "cerralvo", "ventana"],
      actividades: {
        es: ["Snorkel con lobos marinos y en arrecifes", "Exploración de la vida marina", "Posible avistamiento de delfines, mobulas y orcas", "Comida en Isla Cerralvo o en una playa de Punta Arena"],
        en: ["Snorkel with sea lions and over reefs", "Marine life exploring", "Chance to spot dolphins, mobula rays and orcas", "Lunch on Cerralvo or at a Punta Arena beach"]
      },
      incluye: {
        es: ["Equipo de snorkel y chalecos salvavidas", "Fruta, agua y bebidas", "Hielera a bordo"],
        en: ["Snorkel gear and life vests", "Fruit, water and drinks", "Cooler on board"]
      },
      nota: { es: "Los avistamientos y las actividades dependen de las condiciones del día.", en: "Wildlife sightings and activities depend on the day's conditions." },
      noincluye: null,
      precios: [ { etiqueta: { es: "Compartido", en: "Shared" }, monto: 1600, por: "persona" }, { etiqueta: { es: "Privado, hasta 6", en: "Private, up to 6" }, monto: 10000, por: "grupo" } ],
      cobro: "persona"
    },
    {
      id: "tiburon",
      tipo: "compartido",
      nombre: { es: "Tiburón ballena", en: "Whale shark" },
      linea: { es: "Dos horas para nadar junto al pez más grande del mar, aquí mismo en la Bahía de La Paz.", en: "Two hours to swim beside the biggest fish in the sea, right here in the Bay of La Paz." },
      duracion: 2, horario: null, salida: "muelle",
      ruta: ["muelle", "ballena", "muelle"],
      actividades: {
        es: ["Avistamiento de tiburón ballena", "Nado y snorkel junto a él"],
        en: ["Whale shark spotting", "Swim and snorkel alongside it"]
      },
      incluye: {
        es: ["Visor, snorkel y aletas", "Chaleco salvavidas y traje de neopreno", "Agua, refrescos y snacks"],
        en: ["Mask, snorkel and fins", "Life vest and wetsuit", "Water, sodas and snacks"]
      },
      nota: { es: "El horario cambia cada día: aparta la fecha y te confirmamos la hora.", en: "Times change daily: hold your date and we'll confirm the hour." },
      noincluye: null,
      precios: [ { etiqueta: { es: "Por persona", en: "Per person" }, monto: 1600, por: "persona" } ],
      cobro: "persona"
    }
  ],

  // Yates: mismo recorrido de 8 horas
  yates: [
    { id: "sea-ray-40", nombre: "Sea Ray 40", personas: 12, precio: 32000, camarote: true, pesca: true,
      a_bordo: { es: ["Baño y camarote", "Capitán, chef y marinero", "Pesca en el trayecto", "Tapete flotante, dinghy, equipo de playa, snorkel y pesca"], en: ["Restroom and cabin", "Captain, chef and deckhand", "Fishing along the way", "Floating mat, dinghy, beach, snorkel and fishing gear"] } },
    { id: "chris-craft-45", nombre: "Chris Craft 45", personas: 15, precio: 30000, camarote: true, pesca: true,
      a_bordo: { es: ["Baño y camarote", "Capitán, chef y marinero", "Pesca en el trayecto", "Tapete flotante, dinghy, equipo de playa, snorkel y pesca"], en: ["Restroom and cabin", "Captain, chef and deckhand", "Fishing along the way", "Floating mat, dinghy, beach, snorkel and fishing gear"] } },
    { id: "yate-8", nombre: { es: "Yate privado", en: "Private yacht" }, personas: 8, precio: 26500, camarote: false, pesca: false,
      a_bordo: { es: ["Baño", "Capitán, chef y marinero"], en: ["Restroom", "Captain, chef and deckhand"] } }
  ],
  yate_ruta: ["marina", "gabriel", "balandra", "loberita", "marina"],
  yate_menu: {
    es: ["Café y pan dulce", "Platón de frutas", "3 litros de ceviche", "Sashimi y totopos", "Sándwich o quesadilla", "24 cervezas · 24 sodas · 24 aguas", "6 bolsas de hielo"],
    en: ["Coffee and Mexican sweet bread", "Fruit platter", "3 liters of ceviche", "Sashimi and tortilla chips", "Sandwich or quesadilla", "24 beers · 24 sodas · 24 waters", "6 bags of ice"]
  },

  wa_mensaje: {
    es: "Hola Maho's Tours, vi su página y quiero reservar.",
    en: "Hi Maho's Tours! I found your website and I'd like to book."
  }
};
