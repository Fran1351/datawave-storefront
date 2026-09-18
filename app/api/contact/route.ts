import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // tu dirección de Gmail
        pass: process.env.GMAIL_APP_PASSWORD, // contraseña de aplicación (NO tu contraseña normal)
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.GMAIL_USER}>`, // Gmail exige que el "from" sea tu propia cuenta
      replyTo: email, // así al responder el mail le contestás directo al cliente
      to: process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER,
      subject: `Nuevo mensaje de contacto — ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Nuevo mensaje desde el formulario de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al enviar el email de contacto:", error);
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Intentá de nuevo más tarde." },
      { status: 500 }
    );
  }
}