import { uid } from "uid/secure";

function generateId(length = 8) {
  return uid(length);
}

export { generateId };
