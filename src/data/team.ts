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
}

export const team: TeamMember[] = [
  {
    name: '[Nombre y apellido]',
    role: 'Dirección general',
    bio: 'Coordina cada proyecto y es el contacto principal de nuestros clientes.',
  },
  {
    name: '[Nombre y apellido]',
    role: 'Desarrollo de software',
    bio: 'Diseña y programa los sistemas, páginas y tiendas en línea.',
  },
  {
    name: '[Nombre y apellido]',
    role: 'Redes e infraestructura',
    bio: 'Instala y mantiene redes, equipos y servidores de nuestros clientes.',
  },
  {
    name: '[Nombre y apellido]',
    role: 'Soporte y atención al cliente',
    bio: 'Atiende tus consultas y resuelve incidencias a cualquier hora.',
  },
];
