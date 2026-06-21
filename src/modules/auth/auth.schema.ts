// ============================================================
//  auth.schema.ts — Validation des données d'entrée
// ============================================================

export interface RegisterBody {
  account_name: string;
  mail: string;
  password: string;
}

export interface LoginBody {
  mail: string;
  password: string;
}

export const registerSchema = {
  body: {
    type: "object",
    required: ["account_name", "mail", "password"],
    additionalProperties: false,
    properties: {
      account_name: {
        type: "string",
        minLength: 3,
        maxLength: 30,
        pattern: "^[a-zA-ZÀ-ÿ0-9_-]+$",
      },
      mail: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 8,
        maxLength: 72,
        pattern: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$",
      },
    },
  },
} as const;

export const loginSchema = {
  body: {
    type: "object",
    required: ["mail", "password"],
    additionalProperties: false,
    properties: {
      mail: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 1,
      },
    },
  },
} as const;