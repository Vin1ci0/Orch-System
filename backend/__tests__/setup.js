const request = require('supertest');
const app = require('../src/index');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  // Limpa o banco de teste e executa as migrações
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Fecha a conexão com o banco
  await sequelize.close();
});

// Helper para criar usuário de teste
async function createTestUser() {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
  
  return response.body;
}

// Helper para autenticação
async function getAuthToken() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  
  return response.body.token;
}

module.exports = {
  createTestUser,
  getAuthToken
};