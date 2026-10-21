/**
 * Equipo de NETSOLCA (página /nosotros).
 * PLACEHOLDER: reemplaza nombre, cargo, descripción y foto de cada persona.
 * Las fotos van en public/assets/img/equipo/, verticales 3:4, en cuatro archivos:
 * nombre-600.webp, nombre-600.jpg, nombre-900.webp y nombre-900.jpg.
 * En `photo` va la ruta sin tamaño ni extensión: /assets/img/equipo/nombre
 * Sin foto, se muestra la "N" de la marca.
 */
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Ruta de la foto sin tamaño ni extensión, ej. /assets/img/equipo/nombre */
  photo?: string;
  /** Perfil de LinkedIn o Instagram (opcional) */
  link?: string;
  /** Perfil de GitHub (opcional) */
  github?: string;
  /** Perfil de LinkedIn (opcional) */
  linkedin?: string;
}

export const team: TeamMember[] = [
  {
    name: 'Christopher Medina',
    role: 'CEO',
    github: 'https://github.com/ImChriis',
    linkedin: 'https://www.linkedin.com/in/imchriis/',
    photo: '/assets/img/equipo/christopher-medina',
    bio: 'Coordina cada proyecto y es el contacto principal de nuestros clientes.',
  },
  {
    name: 'Juan Matute',
    role: 'Frontend y QA',
    github: 'https://github.com/Matute3110',
    linkedin: 'https://www.linkedin.com/in/juan-matute-9a7370371/',
    photo: '/assets/img/equipo/juan-matute',
    bio: 'Diseña y programa los sistemas, páginas y tiendas en línea.',
  },
  {
    name: 'Jose Hernandez',
    role: 'Backend y DevOps',
    github: 'https://github.com/iFlam3',
    linkedin: 'https://www.linkedin.com/in/jose-hernandez-524002368/',
    photo: '/assets/img/equipo/jose-hernandez',
    bio: 'Instala y mantiene redes, equipos y servidores de nuestros clientes.',
  },
  {
    name: 'Manuel Diaz',
    role: 'Backend Lead',
    github: 'https://github.com/ManuDev01',
    linkedin: 'https://www.linkedin.com/in/manuel-diaz-a73ab7266/',
    photo: '/assets/img/equipo/manuel-diaz',
    bio: 'Atiende tus consultas y resuelve incidencias a cualquier hora.',
  },
];
