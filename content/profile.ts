import type { Translations } from "@/lib/i18n/context";

interface propsProfile {
    name: string,
    role: string,
    location: string,
    status: string,
    email: string
}

export const profileStatic = {
    name: "Gerardo Martínez Monge",
    location: "Liberia, Costa Rica",
    email: "gerardoalonso.martinezmonge@gmail.com",
};

export function getProfile(t: Translations): propsProfile {
    return {
        ...profileStatic,
        role: t.profile.role,
        status: t.profile.status,
    };
}