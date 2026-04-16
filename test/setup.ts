// Set required environment variables before any module is loaded.
// This file is executed by Vitest via setupFiles before each test suite.
process.env.MY_JWT_SECRET = "test-jwt-secret-for-vitest";
process.env.ENV = "dev";
process.env.CLIENT_ID = "test-google-client-id";
process.env.REDIS_URL = "redis://localhost:6379";
