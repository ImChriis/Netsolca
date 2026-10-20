/**
 * Equipo de NETSOLCA (página /nosotros).
 * PLACEHOLDER: reemplaza nombre, cargo, descripción y foto de cada persona.
 * Las fotos van en public/assets/img/equipo/ (cuadradas, 600×600 recomendado).
 * Sin foto, se muestra la "N" de la marca.
 */
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Ruta de la foto, ej. /assets/img/equipo/nombre.jpg */
  photo?: string;
  /** Perfil de LinkedIn o Instagram (opcional) */
  link?: string;
  /** Perfil de GitHub (opcional) */
  github?: string;
}

export const team: TeamMember[] = [
  {
    name: 'Christopher Medina',
    role: 'CEO',
    github: 'https://github.com/ImChriis',
    bio: 'Coordina cada proyecto y es el contacto principal de nuestros clientes.',
  },
  {
    name: 'Juan Matute',
    role: 'Frontend y QA',
    github: 'https://github.com/Matute3110',
    bio: 'Diseña y programa los sistemas, páginas y tiendas en línea.',
  },
  {
    name: 'Jose Hernandez',
    role: 'Backend y DevOps',
    github: 'https://github.com/iFlam3',
    bio: 'Instala y mantiene redes, equipos y servidores de nuestros clientes.',
  },
  {
    name: 'Manuel Diaz',
    role: 'Backend Lead',
    github: 'https://github.com/ManuDev01',
    bio: 'Atiende tus consultas y resuelve incidencias a cualquier hora.',
  },
];
