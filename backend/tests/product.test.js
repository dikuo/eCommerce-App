import request from 'supertest';
import app from '../app.js';
import productModel from '../models/productModel.js';
import { jest } from '@jest/globals';

describe('Product Controller Integration Tests', () => {

  it('should return a list of products', async () => {
    // 🟢 Mocking the database response
    const mockProducts = [
      { name: "Product 1", price: 100, category: "Topwear" },
      { name: "Product 2", price: 200, category: "Bottomwear" }
    ];

    // Intercept productModel.find and return our mock data
    const spy = jest.spyOn(productModel, 'find').mockResolvedValue(mockProducts);

    const res = await request(app).get('/api/product/list');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toHaveLength(2);
    expect(res.body.products[0].name).toBe("Product 1");

    spy.mockRestore(); // Clean up the spy
  });

  it('should handle database errors gracefully', async () => {
    // 🔴 Simulate a database crash
    const spy = jest.spyOn(productModel, 'find').mockRejectedValue(new Error("DB Error"));

    const res = await request(app).get('/api/product/list');

    expect(res.statusCode).toBe(200); // Or 500, depending on your error middleware
    expect(res.body.success).toBe(false);
    
    spy.mockRestore();
  });
});