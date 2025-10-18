import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

const sampleTickets = [
  {
    title: {
      en: "Paris: 1-Hour Seine Cruise departing from the Eiffel Tower.",
      es: "París: Crucero de 1 hora por el Sena desde la Torre Eiffel.",
      fr: "Paris : Croisière d'1 heure sur la Seine au départ de la Tour Eiffel.",
      it: "Parigi: Crociera di 1 ora sulla Senna con partenza dalla Torre Eiffel.",
      pt: "Paris: Cruzeiro de 1 hora pelo Sena partindo da Torre Eiffel.",
    },
    subTitle: {
      en: "1 hour audio guided tour.",
      es: "Tour guiado en audio de 1 hora.",
      fr: "Visite guidée audio d'1 heure.",
      it: "Tour guidato audio di 1 ora.",
      pt: "Passeio guiado por áudio de 1 hora.",
    },
    secondPageTitle: {
      en: "1 hour audio commented cruise",
      es: "Crucero comentado de 1 hora con audio",
      fr: "Croisière commentée d'une heure",
      it: "Crociera commentata di 1 ora con audio",
      pt: "Cruzeiro comentado de 1 hora com áudio",
    },
    secondPageDescription: {
      en: "The summer enjoy Guided tour with family or friends in Paris",
      es: "En verano disfruta de un tour guiado con familiares o amigos en París",
      fr: "En été, profitez d'une visite guidée avec votre famille ou vos amis à Paris",
      it: "In estate goditi un tour guidato con la famiglia o gli amici a Parigi",
      pt: "No verão aproveite um tour guiado com família ou amigos em Paris",
    },
    adultPrice: 17,
    fullPrice: 19,
    duration: {
      en: "7 days",
      es: "7 días",
      fr: "7 jours",
      it: "7 giorni",
      pt: "7 dias",
    },

    category: {
      en: "Beach",
      es: "Playa",
      fr: "Plage",
      it: "Spiaggia",
      pt: "Praia",
    },
    rating: 4.9,
    reviews: 342,
    imageUrl: "https://iili.io/KHVlpPp.jpg",
    gallery: [
      "https://iili.io/KHVM3rl.jpg",
      "https://images.pexels.com/photos/16470214/pexels-photo-16470214.jpeg?_gl=1*1gcv573*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDg5OTMkajgkbDAkaDA.",
      "https://images.pexels.com/photos/62645/pexels-photo-62645.jpeg?_gl=1*1w8ahwv*_ga*OTgwNjI3ODcwLjE3NDYyMDQ4NDI.*_ga_8JE65Q40S6*czE3NTQwNDcxMzgkbzkkZzEkdDE3NTQwNDkwMjUkajUyJGwwJGgw",
    ],
    availableSlots: 12,
    itinerary: [
      {
        day: 1,
        title: {
          en: "Starting Location:",
          es: "Lugar de inicio:",
          fr: "Lieu de départ :",
          it: "Punto di partenza:",
          pt: "Local de partida:",
        },
        description: {
          en: "7 Port de la Bourdonnais",
          es: "7 Port de la Bourdonnais",
          fr: "7 Port de la Bourdonnais",
          it: "7 Port de la Bourdonnais",
          pt: "7 Port de la Bourdonnais",
        },
      },
      {
        day: 2,
        title: {
          en: "Les Invalides",
          es: "Los Inválidos",
          fr: "Les Invalides",
          it: "Gli Invalidi",
          pt: "Os Inválidos",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: 3,
        title: {
          en: "Musée d'Orsay",
          es: "Museo de Orsay",
          fr: "Musée d'Orsay",
          it: "Museo d'Orsay",
          pt: "Museu d'Orsay",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: 4,
        title: {
          en: "Île de la Cité",
          es: "Isla de la Cité",
          fr: "Île de la Cité",
          it: "Île de la Cité",
          pt: "Île de la Cité",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: 5,
        title: {
          en: "Notre-Dame Cathedral",
          es: "Catedral de Notre-Dame",
          fr: "Cathédrale Notre-Dame",
          it: "Cattedrale di Notre-Dame",
          pt: "Catedral de Notre-Dame",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: 6,
        title: {
          en: "Hôtel de Ville",
          es: "Ayuntamiento",
          fr: "Hôtel de Ville",
          it: "Municipio",
          pt: "Prefeitura",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: 7,
        title: {
          en: "Louvre Museum",
          es: "Museo del Louvre",
          fr: "Musée du Louvre",
          it: "Museo del Louvre",
          pt: "Museu do Louvre",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: 8,
        title: {
          en: "Place de la Concorde",
          es: "Plaza de la Concordia",
          fr: "Place de la Concorde",
          it: "Piazza della Concordia",
          pt: "Praça da Concórdia",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: 9,
        title: {
          en: "Grand Palais",
          es: "Gran Palacio",
          fr: "Grand Palais",
          it: "Grand Palais",
          pt: "Grand Palais",
        },
        description: { en: "", es: "", fr: "", it: "", pt: "" },
      },
      {
        day: "",
        title: {
          en: "Arrive Back at:",
          es: "Llegada de regreso a:",
          fr: "Retour à :",
          it: "Ritorno a:",
          pt: "Chegada de volta a:",
        },
        description: {
          en: "7 Port de la Bourdonnais",
          es: "7 Port de la Bourdonnais",
          fr: "7 Port de la Bourdonnais",
          it: "7 Port de la Bourdonnais",
          pt: "7 Port de la Bourdonnais",
        },
      },
    ],
    included: {
      en: [
        "Free one photo (if want more, then need to pay for additional photos)",
        // "Airport transfers",
        // "Accommodation",
        // "All meals",
        // "Activities",
        // "Professional guide",
      ],
      es: [
        "Una foto gratis (si quieres más, necesitas pagar fotos adicionales)",
        // "Traslados al aeropuerto",
        // "Alojamiento",
        // "Todas las comidas",
        // "Actividades",
        // "Guía profesional",
      ],
      fr: [
        "Une photo gratuite (si vous en voulez plus, vous devez payer des photos supplémentaires)",
        // "Transferts aéroport",
        // "Hébergement",
        // "Tous les repas",
        // "Activités",
        // "Guide professionnel",
      ],
      it: [
        "Una foto gratuita (se ne vuoi di più, devi pagare foto aggiuntive)",
        // "Trasferimenti aeroportuali",
        // "Alloggio",
        // "Tutti i pasti",
        // "Attività",
        // "Guida professionale",
      ],
      pt: [
        "Uma foto gratuita (se quiser mais, precisa pagar fotos adicionais)",
        // "Traslados do aeroporto",
        // "Acomodação",
        // "Todas as refeições",
        // "Atividades",
        // "Guia profissional",
      ],
    },
  },
  {
    title: {
      en: "Paris Bus Tours",
      es: "Tours en autobús por París",
      fr: "Circuits en bus à Paris",
      it: "Tour in autobus di Parigi",
      pt: "Passeios de ônibus por Paris",
    },
    subTitle: {
      en: "Discover the City of Light's iconic landmarks on our Hop-on, Hop-off Paris Big Bus Tour!",
      es: "¡Descubre los monumentos más emblemáticos de la Ciudad de la Luz en nuestro tour en autobús Hop-on Hop-off por París!",
      fr: "Découvrez les monuments emblématiques de la Ville Lumière lors de notre circuit en bus à arrêts multiples Big Bus Paris !",
      it: "Scopri i monumenti più iconici della Città delle Luci con il nostro tour Hop-on Hop-off in autobus Big Bus Paris!",
      pt: "Descubra os marcos icónicos da Cidade das Luzes no nosso passeio Hop-on Hop-off Big Bus Paris!",
    },
    // adultPrice: 17,
    // fullPrice: 19,
    adultPrice: 0,
    fullPrice: 0,
    duration: {
      en: "10 days",
      es: "10 días",
      fr: "10 jours",
      it: "10 giorni",
      pt: "10 dias",
    },

    category: {
      en: "Adventure",
      es: "Aventura",
      fr: "Aventure",
      it: "Avventura",
      pt: "Aventura",
    },
    rating: 4.8,
    reviews: 287,
    imageUrl: "https://i.ibb.co.com/S49FF08V/hero1.jpg",
    gallery: [
      "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg",
      "https://images.pexels.com/photos/776469/pexels-photo-776469.jpeg",
      "https://images.pexels.com/photos/31552871/pexels-photo-31552871.jpeg",
    ],
    features: {
      en: [
        "Mountain Trekking",
        "Tent Accommodation",
        "Local Cuisine",
        "Campfires",
        "Glacier Walk",
      ],
      es: [
        "Senderismo en la montaña",
        "Alojamiento en tienda",
        "Cocina local",
        "Hogueras",
        "Caminata por el glaciar",
      ],
      fr: [
        "Randonnée en montagne",
        "Hébergement en tente",
        "Cuisine locale",
        "Feux de camp",
        "Marche sur glacier",
      ],
      it: [
        "Trekking in montagna",
        "Sistemazione in tenda",
        "Cucina locale",
        "Falò",
        "Camminata sul ghiacciaio",
      ],
      pt: [
        "Trekking nas montanhas",
        "Acomodação em tendas",
        "Culinária local",
        "Fogueiras",
        "Caminhada no glaciar",
      ],
    },
    availableSlots: 8,
    dates: ["2024-09-05", "2024-10-03", "2024-11-07", "2025-03-13"],
    variations: [
      {
        discountBadge: "15%",
        durationBadge: "24 HOURS",
        title: {
          en: "Essential Ticket",
          es: "Billete Essential",
          fr: "Billet Essentiel",
          it: "Biglietto Essenziale",
          pt: "Bilhete Essencial",
        },
        adultPrice: 50.15,
        fullPrice: 65.0,
        childPrice: 8.0,
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        specialOffer: {
          en: "INCLUDES 1-HR STUNNING RIVER CRUISE ON THE SEINE!",
          es: "INCLUYE 1-HR CRUCERO IMPRESIONANTE POR EL SENA!",
          fr: "INCLUS CROISIÈRE DE 1H SUR LA SEINE!",
          it: "INCLUDE CROCIERA DI 1H SULLA SENNA!",
          pt: "INCLUI CRUZEIRO DE 1H PELO SENNA!",
        },
        features: {
          en: [
            "24h Hop-on, Hop-off",
            "River Cruise",
            "Fully Flexible Bus Ticket (free date change)",
            "Free Vox Self-Guided Walking Tour app download",
          ],
          es: [
            "24h Hop-on, Hop-off",
            "Crucero por el río",
            "Billete de autobús totalmente flexible (cambio de fecha gratuito)",
            "Descarga gratuita de la aplicación Vox Self-Guided Walking Tour",
          ],
          fr: [
            "24h Hop-on, Hop-off",
            "Croisière fluviale",
            "Billet de bus entièrement flexible (changement de date gratuit)",
            "Téléchargement gratuit de l'application Vox Self-Guided Walking Tour",
          ],
          it: [
            "24h Hop-on, Hop-off",
            "Crociera sul fiume",
            "Biglietto flessibile (cambio data gratuito)",
            "Download gratuito dell'app Vox Self-Guided Walking Tour",
          ],
          pt: [
            "24h Hop-on, Hop-off",
            "Cruzeiro pelo rio",
            "Bilhete totalmente flexível (mudança de data gratuita)",
            "Download gratuito do app Vox Self-Guided Walking Tour",
          ],
        },
        routes: ["Red"],
      },
      {
        discountBadge: "15%",
        durationBadge: "24 HOURS",
        title: {
          en: "Discover Ticket",
          es: "Boleto Descubrir",
          fr: "Billet Découverte",
          it: "Biglietto Scoperta",
          pt: "Bilhete Descobrir",
        },
        adultPrice: 38.25,
        fullPrice: 49.0,
        childPrice: 8.0,
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        features: {
          en: [
            "24h Hop-on, Hop-off",
            "Fully Flexible Bus Ticket (free date change)",
          ],
          es: [
            "24h Hop-on, Hop-off",
            "Boleto flexible (cambio de fecha gratuito)",
          ],
          fr: [
            "24h Hop-on, Hop-off",
            "Billet flexible (changement de date gratuit)",
          ],
          it: [
            "24h Hop-on, Hop-off",
            "Biglietto flessibile (cambio data gratuito)",
          ],
          pt: [
            "24h Hop-on, Hop-off",
            "Bilhete totalmente flexível (mudança de data gratuita)",
          ],
        },
        routes: ["Red"],
      },
      {
        discountBadge: "15%",
        durationBadge: "48 HOURS",
        title: {
          en: "Explore Ticket",
          es: "Boleto Explorar",
          fr: "Billet Explorer",
          it: "Biglietto Esplora",
          pt: "Bilhete Explorar",
        },
        adultPrice: 62.05,
        fullPrice: 79.0,
        childPrice: 8.0,
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        features: {
          en: [
            "48h Hop-on, Hop-off",
            "River Cruise",
            "Fully Flexible Bus Ticket (free date change)",
            "Free Vox Self-Guided Walking Tour app download",
          ],
          es: [
            "48h Hop-on, Hop-off",
            "Crucero por el río",
            "Boleto flexible (cambio de fecha gratuito)",
            "Descarga gratuita de la app de tour autoguiado Vox",
          ],
          fr: [
            "48h Hop-on, Hop-off",
            "Croisière sur la rivière",
            "Billet flexible (changement de date gratuit)",
            "Téléchargement gratuit de l'application de visite autonome Vox",
          ],
          it: [
            "48h Hop-on, Hop-off",
            "Crociera sul fiume",
            "Biglietto flessibile (cambio data gratuito)",
            "Download gratuito dell'app Vox Self-Guided Walking Tour",
          ],
          pt: [
            "48h Hop-on, Hop-off",
            "Cruzeiro pelo rio",
            "Bilhete totalmente flexível (mudança de data gratuita)",
            "Download gratuito do app Vox Self-Guided Walking Tour",
          ],
        },
        routes: ["Red"],
      },
      {
        discountBadge: "15%",
        durationBadge: "NIGHT TOUR",
        title: {
          en: "Night Tour",
          es: "Tour Nocturno",
          fr: "Visite Nocturne",
          it: "Tour Notturno",
          pt: "Passeio Noturno",
        },
        adultPrice: 27.2,
        fullPrice: 35.0,
        childPrice: 8.0,
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        specialOffer: {
          en: "UNFORGETTABLE VIEWS OF THE CITY OF LIGHTS BY NIGHT",
          es: "VISTAS INOLVIDABLES DE LA CIUDAD DE LAS LUCES POR LA NOCHE",
          fr: "VUES INOUBLIABLES DE LA VILLE LUMIÈRE LA NUIT",
          it: "VISUALI INDIMENTICABILI DELLA CITTÀ DELLE LUCI DI NOTTE",
          pt: "VISTAS INESQUECÍVEIS DA CIDADE DAS LUZES À NOITE",
        },
        features: {
          en: ["2hr Panoramic Night Tour"],
          es: ["Tour panorámico nocturno de 2h"],
          fr: ["Visite panoramique nocturne de 2h"],
          it: ["Tour panoramico notturno di 2h"],
          pt: ["Tour Noturno Panorâmico de 2h"],
        },
        routes: [],
      },
      {
        discountBadge: "15%",
        durationBadge: "48 HOURS",
        title: {
          en: "48-Hour Ticket + River Cruise",
          es: "Boleto 48h + Crucero",
          fr: "Billet 48h + Croisière",
          it: "Biglietto 48h + Crociera",
          pt: "Bilhete 48h + Cruzeiro",
        },
        adultPrice: 79.05,
        fullPrice: 84.0,
        childPrice: 8.0,
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        specialOffer: {
          en: "INCLUDES HOP-ON HOP-OFF SEINE RIVER CRUISE!",
          es: "INCLUYE CRUCERO POR EL SENA HOP-ON HOP-OFF!",
          fr: "INCLUS CROISIÈRE HOP-ON HOP-OFF SUR LA SEINE!",
          it: "INCLUDE CROCIERA HOP-ON HOP-OFF SULLA SENNA!",
          pt: "INCLUI CRUZEIRO HOP-ON HOP-OFF PELO SENNA!",
        },
        features: {
          en: [
            "48h bus Hop-on, Hop-off (10 stops)",
            "48h River Cruise Hop-on, Hop-off (9 stops) with Batobus",
            "5 Common Stops to Interchange",
            "Fully Flexible Bus Ticket (free date change)",
          ],
          es: [
            "Bus 48h Hop-on, Hop-off (10 paradas)",
            "Crucero 48h Hop-on, Hop-off (9 paradas) con Batobus",
            "5 paradas comunes para intercambiar",
            "Boleto flexible (cambio de fecha gratuito)",
          ],
          fr: [
            "Bus 48h Hop-on, Hop-off (10 arrêts)",
            "Croisière 48h Hop-on, Hop-off (9 arrêts) avec Batobus",
            "5 arrêts communs pour interchanger",
            "Billet flexible (changement de date gratuit)",
          ],
          it: [
            "Bus 48h Hop-on, Hop-off (10 fermate)",
            "Crociera 48h Hop-on, Hop-off (9 fermate) con Batobus",
            "5 fermate comuni per scambio",
            "Biglietto flessibile (cambio data gratuito)",
          ],
          pt: [
            "Ônibus 48h Hop-on, Hop-off (10 paradas)",
            "Cruzeiro 48h Hop-on, Hop-off (9 paradas) com Batobus",
            "5 paradas comuns para troca",
            "Bilhete totalmente flexível (mudança de data gratuita)",
          ],
        },
        routes: ["Red"],
      },
      {
        discountBadge: "15%",
        durationBadge: "48 HOURS",
        title: {
          en: "48-Hour Ticket",
          es: "Boleto 48h",
          fr: "Billet 48h",
          it: "Biglietto 48h",
          pt: "Bilhete 48h",
        },
        adultPrice: 49.3,
        fullPrice: 62.0,
        childPrice: 8.0,
        image: "https://i.ibb.co.com/vJByx51/slider4.jpg",
        features: {
          en: [
            "48h Hop-on, Hop-off",
            "Fully Flexible Bus Ticket (free date change)",
          ],
          es: [
            "48h Hop-on, Hop-off",
            "Boleto flexible (cambio de fecha gratuito)",
          ],
          fr: [
            "48h Hop-on, Hop-off",
            "Billet flexible (changement de date gratuit)",
          ],
          it: [
            "48h Hop-on, Hop-off",
            "Biglietto flessibile (cambio data gratuito)",
          ],
          pt: [
            "48h Hop-on, Hop-off",
            "Bilhete totalmente flexível (mudança de data gratuita)",
          ],
        },
        routes: ["Red"],
      },
    ],
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing tickets
    await Ticket.deleteMany({});

    // Insert sample tickets
    await Ticket.insertMany(sampleTickets);

    return NextResponse.json({
      message: "Sample tickets created successfully",
      count: sampleTickets.length,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
