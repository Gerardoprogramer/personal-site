import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { socials } from "@/content/portfolio";

export const SocialLinks = () => {
    return (
        <>
            <a
                href={socials.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub de Gerardo Martínez"
                className="text-muted-foreground transition-colors hover:text-primary"
            >
                <FaGithub className="size-4" aria-hidden="true" />
            </a>
            <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn de Gerardo Martínez"
                className="text-muted-foreground transition-colors hover:text-primary"
            >
                <FaLinkedin className="size-4" aria-hidden="true" />
            </a>
            <a
                href={socials.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp de Gerardo Martínez"
                className="text-muted-foreground transition-colors hover:text-primary"
            >
                <FaWhatsapp className="size-4" aria-hidden="true" />
            </a>
        </>
    )
}
