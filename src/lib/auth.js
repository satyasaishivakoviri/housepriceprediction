import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

/**
 * Validates password complexity:
 * - Minimum 8 characters
 * - Mixed case (upper and lower)
 * - At least one special character
 * @param {string} password 
 * @returns {boolean}
 */
export function validatePasswordStrength(password) {
    if (!password || password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

/**
 * Hashes a plain text password.
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verifies a password against a hash.
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Generates a JWT token for a user.
 * @param {object} user - User object (should contain id, email)
 * @returns {string}
 */
export function signToken(user) {
    return jwt.sign(
        {
            userId: user.id || user.uid, // Support both Firestore doc ID and custom ID
            email: user.email,
            role: user.role || 'user' // Default to 'user'
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}

/**
 * Verifies a JWT token.
 * @param {string} token 
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}
