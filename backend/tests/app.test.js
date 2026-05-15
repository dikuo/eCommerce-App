import request from 'supertest';
import app from '../app.js';

describe('Initial Backend Test', () => {
  
  // Test 1: Check if the API is actually "Working"
  it('should return "API Working." from the root route', async () => {
    const res = await request(app).get('/');
    
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('API Working.');
  });

  // Test 2: Check if a fake route returns 404
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unexisting-route');
    expect(res.statusCode).toEqual(404);
  });
});