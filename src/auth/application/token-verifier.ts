import { AuthenticatedUser } from "../authenticated-user";

export class InvalidTokenError extends Error {
    constructor(message = 'Token inválido', options?: ErrorOptions) {
        super(message, options);
        this.name = 'InvalidTokenError';
    }
}

export abstract class TokenVerifier {
    abstract verify(token: string): Promise<AuthenticatedUser>;
}