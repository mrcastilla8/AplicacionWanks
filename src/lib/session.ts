import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Secret para firmar los JWT (debe estar en .env en producción)
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambialo-en-produccion'
);

const TOKEN_NAME = 'auth-token';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export interface SessionPayload {
    userId: number;
    email: string;
    name: string;
    role: string;
}

/**
 * Genera un token JWT con los datos del usuario
 */
export async function createToken(payload: SessionPayload): Promise<string> {
    const token = await new SignJWT({
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // 7 días
        .sign(JWT_SECRET);

    return token;
}

/**
 * Verifica y decodifica un token JWT
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return verified.payload as unknown as SessionPayload;
    } catch (error) {
        console.error('Error verificando token:', error);
        return null;
    }
}

/**
 * Guarda el token en una cookie HTTP-only
 */
export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: TOKEN_MAX_AGE,
        path: '/',
    });
}

/**
 * Obtiene el token desde las cookies
 */
export async function getSessionToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(TOKEN_NAME);
    return cookie?.value || null;
}

/**
 * Obtiene la sesión actual del usuario desde las cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
    const token = await getSessionToken();
    if (!token) return null;

    return await verifyToken(token);
}

/**
 * Elimina la cookie de sesión (logout)
 */
export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_NAME);
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export async function hasRole(role: string): Promise<boolean> {
    const session = await getSession();
    return session?.role === role;
}
