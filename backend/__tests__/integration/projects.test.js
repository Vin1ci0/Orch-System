const request = require('supertest');
const app = require('../../src/index');
const { getAuthToken, createTestUser } = require('../setup');

describe('Projects', () => {
  let token;
  let projectId;

  beforeAll(async () => {
    await createTestUser();
    token = await getAuthToken();
  });

  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'Project description',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    projectId = response.body.id;
  });

  it('should list projects', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get project details', async () => {
    const response = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Project');
  });

  it('should update project', async () => {
    const response = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Project'
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Project');
  });

  it('should delete project', async () => {
    const response = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});