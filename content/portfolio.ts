
interface propsProfile {
    name: string,
    role: string,
    location: string,
    status: string,
    email: string
}

export const profile: propsProfile = {
    name: "Gerardo Martínez Monge",
    role: "Ingeniero en Sistemas · Full Stack",
    location: "Liberia, Costa Rica",
    status: "Disponible para empleo fijo y proyectos freelance",
    email: "hola@gerardomartinez.dev",
};

interface propsSocials {
    github: string,
    linkedin: string,
    email: string,
    cv: string,
    whatsapp: string
}

export const socials: propsSocials = {
    github: "https://github.com/Gerardoprogramer",
    linkedin: "https://www.linkedin.com/in/gerardo-martinez-dev",
    email: "mailto:hola@gerardomartinez.dev",
    cv: "/gerardo-martinez-cv.pdf",
    whatsapp: "https://wa.me/50689462689",
};