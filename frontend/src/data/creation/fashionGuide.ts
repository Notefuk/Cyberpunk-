// v5.7.0 [Claude Code · 2026-10-30]: para qué sirve la moda y qué dice cada estilo de vos (pedido de Giuliano).
// Reglas: Core pp.84, 102, 105, 153, 327-328, 352, 358, 367. Las palabras de cada estilo son las del libro (Core p.328);
// "cuándo sirve" es una sugerencia de mesa, no una regla.

export const FASHION_WHAT_FOR: readonly string[] = [
  'La ropa no es armadura: no da SP. La armadura se compra aparte (Core pp.96-97).',
  'Sirve para la imagen: en la calle, cada estilo le dice a los demás qué clase de persona sos (Core p.328). El GM puede usarlo para ver cómo te reciben, si te dejan entrar a un lugar o si te toman en serio.',
  'Wardrobe & Style (COOL) es la skill de saber qué ponerte y cuándo, y de verte bien hasta en un traje espacial (Core p.84). Si el GM te pide una tirada para causar buena impresión, la ropa adecuada es lo que la hace creíble.',
  'Con un Agent tenés +2 a Wardrobe & Style, pero solo si usás la ropa que te sugiere (cambia cada temporada, Core p.352). Light Tattoo (3 o más) y el recubrimiento metálico brillante de un cyberlimb también dan +2, una sola vez cada uno (Core pp.358, 367).',
  'La ropa de 2045 es digital: avisa si está rota o sucia, se adapta a la temperatura y puede cambiar de color o mostrar imágenes (Core p.327).',
  'En Complete Package tenés 800 €$ solo para moda o Fashionware; lo que no gastes se pierde (Core p.105). Cada pieza tiene su precio según el estilo (Core p.102).',
];

export interface FashionStyleGuide {
  /** Qué imagen das, en criollo, a partir de las 3 palabras del libro. */
  imageEs: string;
  /** Sugerencia de mesa: dónde encaja. */
  fitsEs: string;
}

export const FASHION_STYLE_GUIDE: Record<string, FashionStyleGuide> = {
  'Bag Lady Chic': {
    imageEs: 'Sin techo, harapiento, vagabundo. Ropa gastada que no llama la atención.',
    fitsEs: 'Pasar desapercibido en la calle o en la Zona de Combate, o hacerte pasar por alguien sin nada que robar.',
  },
  'Gang Colors': {
    imageEs: 'Peligroso, violento, rebelde. Los colores de una pandilla.',
    fitsEs: 'Intimidar, moverte en territorio de boosters o pandillas. Ojo: en el territorio de la pandilla rival te marca.',
  },
  'Generic Chic': {
    imageEs: 'Común, colorido, modular. La ropa barata y estándar que usa casi todo el mundo.',
    fitsEs: 'El día a día en la ciudad sin destacar. Es lo que traen muchos paquetes de rol.',
  },
  Bohemian: {
    imageEs: 'Folk, retro, espíritu libre. Estilo artístico y alternativo.',
    fitsEs: 'Ambientes de artistas, músicos y contracultura.',
  },
  Leisurewear: {
    imageEs: 'Comodidad, agilidad, atletismo. Ropa deportiva y cómoda.',
    fitsEs: 'Moverte, correr y trepar sin que la ropa estorbe; pasar por alguien que va al gimnasio.',
  },
  'Nomad Leathers': {
    imageEs: 'Western, rudo, tribal. Cuero de ruta, marca de los Nomads.',
    fitsEs: 'Las Badlands y los clanes Nomad; en la ciudad te identifica como de afuera.',
  },
  'Asia Pop': {
    imageEs: 'Brillante, de disfraz, juvenil. Moda pop llamativa.',
    fitsEs: 'La noche, los clubes y la escena joven; que te vean y te recuerden.',
  },
  'Urban Flash': {
    imageEs: 'Llamativo, tecnológico, ropa de calle. Luces, pantallas y onda urbana.',
    fitsEs: 'Mostrar que estás a la moda en la calle; encaja con Rockerboys y Fixers.',
  },
  Businesswear: {
    imageEs: 'Liderazgo, presencia, autoridad. El traje corporativo.',
    fitsEs: 'Reuniones con corpos, oficinas y negocios serios. El Exec recibe un traje así de bono en Teamwork 1 (Core p.153).',
  },
  'High Fashion': {
    imageEs: 'Exclusivo, de diseñador, alta costura. Lo más caro.',
    fitsEs: 'Fiestas de la élite, la Executive Zone y la gente con plata de verdad.',
  },
};
