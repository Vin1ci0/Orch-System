const request = require('supertest');
const app = require('../../src/index');
const { getAuthToken, createTestUser } = require('../setup');

describe('Files', () => {
  let token;
  let fileId;

  beforeAll(async () => {
    await createTestUser();
    token = await getAuthToken();
  });

  it('should upload a file', async () => {
    const response = await request(app)
      .post('/api/files')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', '__tests__/fixtures/test.txt')
      .field('description', 'Test file');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('url');
    fileId = response.body.id;
  });

  it('should list files', async () => {
    const response = await request(app)
      .get('/api/files')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should download file', async () => {
    const response = await request(app)
      .get(`/api/files/${fileId}/download`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should delete file', async () => {
    const response = await request(app)
      .delete(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});