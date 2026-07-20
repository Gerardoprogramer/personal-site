import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { socials } from "@/content/portfolio";

const links = [
    { href: socials.github, icon: FaGithub, label: "GitHub de Gerardo Martínez" },
    { href: socials.linkedin, icon: FaLinkedin, label: "LinkedIn de Gerardo Martínez" },
    { href: socials.whatsapp, icon: FaWhatsapp, label: "WhatsApp de Gerardo Martínez" },
];

export const SocialLinks = () => {
    return (
        <>
            {links.map(({ href, icon: Icon, label }) => (
                <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="group flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                >
                    <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                </a>
            ))}
        </>
    )
}