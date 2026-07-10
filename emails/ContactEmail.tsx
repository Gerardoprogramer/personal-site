import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "react-email";

interface ContactEmailProps {
    name: string;
    email: string;
    intent: string;
    message: string;
}

export default function ContactEmail({
    name,
    email,
    intent,
    message,
}: ContactEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Nuevo mensaje de contacto de {name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Nuevo mensaje de contacto</Heading>
                    <Section style={section}>
                        <Text style={label}>Nombre</Text>
                        <Text style={value}>{name}</Text>

                        <Text style={label}>Email</Text>
                        <Text style={value}>{email}</Text>

                        <Text style={label}>Motivo</Text>
                        <Text style={value}>{intent}</Text>

                        <Hr style={hr} />

                        <Text style={label}>Mensaje</Text>
                        <Text style={{ ...value, whiteSpace: "pre-wrap" }}>{message}</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = { backgroundColor: "#0a0a0a", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "32px 24px", maxWidth: "560px" };
const heading = { color: "#fff", fontSize: "20px", marginBottom: "16px" };
const section = {
    backgroundColor: "#141414",
    borderRadius: "8px",
    padding: "24px",
};
const label = {
    color: "#888",
    fontSize: "11px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "2px",
};
const value = { color: "#eee", fontSize: "14px", marginTop: "0", marginBottom: "16px" };
const hr = { borderColor: "#2a2a2a", margin: "16px 0" };