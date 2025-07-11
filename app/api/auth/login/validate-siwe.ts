import { SiweMessage } from "siwe";

export async function validateWorldIDToken(token: string) {
  try {
    // Parse the SIWE message from the token (assume token is a JSON string with siweMessage & signature)
    const { siweMessage, signature } = JSON.parse(token);
    if (!siweMessage || !signature) return null;
    const message = new SiweMessage(siweMessage);
    const result = await message.verify({ signature });
    if (result.success) {
      return result.data;
    }
    return null;
  } catch (e) {
    return null;
  }
}
