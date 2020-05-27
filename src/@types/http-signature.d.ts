declare module 'http-signature' {
  import { IncomingMessage } from 'http';

  type ParsedSignature = {
    scheme: string;
    params: SignatureParameters;
    signingString: string;
  };

  type SignatureParameters = {
    headers: string[];
    keyId: string;
    algorithm: string;
    signature: string;
  };

  export function parseRequest(request: IncomingMessage): ParsedSignature;
  export function verifySignature(parsedSignature: ParsedSignature, pubkey: string): boolean;
}
