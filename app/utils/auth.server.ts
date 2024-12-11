// app/utils/auth.server.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "./db.server";

// Configuración del almacenamiento de sesiones
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET debe estar configurado en las variables de entorno");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "WriterLab_session", // Nombre de la cookie que almacenará la sesión
    secure: process.env.NODE_ENV === "production", // Solo usar HTTPS en producción
    secrets: [sessionSecret], // Secreto para firmar la cookie
    sameSite: "lax", // Protección contra ataques CSRF
    path: "/", // Cookie disponible en toda la aplicación
    maxAge: 60 * 60 * 24 * 30, // 30 días de duración
    httpOnly: true, // La cookie no es accesible via JavaScript
  },
});

// Función para crear un nuevo usuario con contraseña segura
export async function createUser(email: string, password: string, name?: string) {
  // Verificamos si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  // Creamos el usuario y su contraseña en una transacción
  // Esto asegura que ambas operaciones se completen o ninguna
  return prisma.$transaction(async (tx) => {
    // Primero creamos el usuario
    const user = await tx.user.create({
      data: {
        email,
        name,
      },
    });

    // Luego creamos el registro de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await tx.password.create({
      data: {
        hash: hashedPassword,
        userId: user.id,
      },
    });

    return user;
  });
}

// Función para verificar las credenciales del usuario
export async function verifyLogin(email: string, password: string) {
  // Buscamos el usuario y su contraseña en una sola consulta
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  // Verificamos si la contraseña coincide
  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  // Si todo está bien, retornamos el usuario (sin la contraseña)
  const { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}

// Función para crear una sesión de usuario
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Función para obtener la sesión actual
export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Función para obtener el ID del usuario actual
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

// Función para requerir un usuario autenticado
export async function requireUserId(
  request: Request,
  redirectTo: string = "/login"
) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect(redirectTo);
  }
  return userId;
}

// Función para cerrar sesión
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

// Función para obtener el usuario actual
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
  } catch {
    throw logout(request);
  }
}

export async function validateUserSession(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId) {
    // Si no hay userId en la sesión, destruimos la sesión
    throw await logout(request);
  }

  try {
    // Intentamos obtener el usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      // Si el usuario no existe en la DB, destruimos la sesión
      throw await logout(request);
    }

    return userId;
  } catch (error) {
    // Si hay algún error de DB u otro, destruimos la sesión
    throw await logout(request);
  }
}