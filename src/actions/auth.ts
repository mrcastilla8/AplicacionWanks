'use server';

import { executeQuery } from '@/lib/oracle';
import { createToken, setSessionCookie } from '@/lib/session';
import type { User } from '@/types';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import oracledb from 'oracledb';

const allowedDomains = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'aol.com',
];

const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z
    .string()
    .email({ message: 'Por favor, introduce una dirección de correo válida.' })
    .refine(email => {
      const domain = email.split('@')[1];
      return allowedDomains.includes(domain);
    }, {
      message: 'Por favor, utiliza un proveedor de correo electrónico válido (ej: Gmail, Outlook).'
    }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Por favor, introduce una dirección de correo válida.' })
    .refine(email => {
      const domain = email.split('@')[1];
      return allowedDomains.includes(domain);
    }, {
      message: 'Por favor, utiliza un proveedor de correo electrónico válido (ej: Gmail, Outlook).'
    }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

interface ActionResult {
  error?: string;
  user?: User;
}

interface OracleProfileRow {
  ID: number;
  NOMBRE: string;
  CORREO: string;
  TELEFONO: string | null;
  CONTRASENA_HASH: string | null;
  ROL: string;
}

/**
 * Registra un nuevo usuario en Oracle
 */
export async function registerUser(values: z.infer<typeof RegisterSchema>): Promise<ActionResult> {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    const firstError = validatedFields.error.issues[0].message;
    return { error: firstError || 'Campos inválidos.' };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Verificar si el email ya existe
    const existingUserResult = await executeQuery<OracleProfileRow>(
      `SELECT ID FROM APP_OWNER.PERFILES WHERE CORREO = :email`,
      { email }
    );

    if (existingUserResult.rows && existingUserResult.rows.length > 0) {
      return { error: 'Ya existe una cuenta con este correo electrónico.' };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario usando la secuencia para generar el ID
    const insertResult = await executeQuery<OracleProfileRow>(
      `INSERT INTO APP_OWNER.PERFILES (
        ID, 
        NOMBRE, 
        CORREO, 
        CONTRASENA_HASH, 
        ROL,
        CREADO_EN,
        ACTUALIZADO_EN
      ) VALUES (
        SEQ_PERFILES_ID.NEXTVAL,
        :name,
        :email,
        :hashedPassword,
        'usuario',
        SYSTIMESTAMP,
        SYSTIMESTAMP
      ) RETURNING ID, NOMBRE, CORREO, TELEFONO, ROL INTO :id, :nombre, :correo, :telefono, :rol`,
      {
        name,
        email,
        hashedPassword,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
        correo: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 320 },
        telefono: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 50 },
        rol: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 50 },
      },
      { autoCommit: true }
    );

    if (!insertResult.outBinds) {
      return { error: 'No se pudo crear la cuenta. Por favor, inténtalo de nuevo.' };
    }

    const userId = (insertResult.outBinds as any).id[0];
    const userName = (insertResult.outBinds as any).nombre[0];
    const userEmail = (insertResult.outBinds as any).correo[0];
    const userPhone = (insertResult.outBinds as any).telefono?.[0] || null;
    const userRole = (insertResult.outBinds as any).rol[0];

    // Crear sesión
    const token = await createToken({
      userId,
      email: userEmail,
      name: userName,
      role: userRole,
    });

    await setSessionCookie(token);

    const newUser: User = {
      id: userId.toString(),
      email: userEmail,
      name: userName,
      phone_number: userPhone,
    };

    console.log('✅ Usuario registrado exitosamente:', userEmail);
    return { user: newUser };

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    return { error: 'No se pudo crear la cuenta. Por favor, inténtalo de nuevo.' };
  }
}

/**
 * Autentica un usuario en Oracle
 */
export async function loginUser(values: z.infer<typeof LoginSchema>): Promise<ActionResult> {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    const firstError = validatedFields.error.issues[0].message;
    return { error: firstError || 'Correo electrónico o contraseña inválidos.' };
  }

  const { email, password } = validatedFields.data;

  try {
    // Buscar usuario por email
    const profileResult = await executeQuery<OracleProfileRow>(
      `SELECT 
        ID, 
        NOMBRE, 
        CORREO, 
        TELEFONO, 
        CONTRASENA_HASH,
        ROL
      FROM APP_OWNER.PERFILES 
      WHERE CORREO = :email`,
      { email }
    );

    if (!profileResult.rows || profileResult.rows.length === 0) {
      return { error: 'Correo electrónico o contraseña inválidos.' };
    }

    const profile = profileResult.rows[0];

    if (!profile.CONTRASENA_HASH) {
      return {
        error: 'Esta cuenta antigua no tiene contraseña. Contacta a soporte o crea una cuenta nueva.'
      };
    }

    // Verificar contraseña
    // Oracle puede devolver el hash como Buffer u objeto, convertir a string
    const hashString = typeof profile.CONTRASENA_HASH === 'string'
      ? profile.CONTRASENA_HASH
      : String(profile.CONTRASENA_HASH);

    const passwordsMatch = await bcrypt.compare(password, hashString);

    if (!passwordsMatch) {
      return { error: 'Correo electrónico o contraseña inválidos.' };
    }

    // Crear sesión
    const token = await createToken({
      userId: profile.ID,
      email: profile.CORREO,
      name: profile.NOMBRE,
      role: profile.ROL,
    });

    await setSessionCookie(token);

    const user: User = {
      id: profile.ID.toString(),
      email: profile.CORREO,
      name: profile.NOMBRE,
      phone_number: profile.TELEFONO,
    };

    console.log('✅ Usuario autenticado exitosamente:', email);
    return { user };

  } catch (error) {
    console.error('❌ Error al autenticar usuario:', error);
    return { error: 'Error al iniciar sesión. Por favor, inténtalo de nuevo.' };
  }
}
