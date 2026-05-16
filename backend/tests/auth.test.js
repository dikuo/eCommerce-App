import request from 'supertest';
import app from '../app.js';

describe('Admin Authentication', () => {

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/user/admin')
            .send({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('token'); // Ensure a JWT is returned
    });

    it('should reject incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/user/admin')
            .send({
                email: "wrong@admin.com",
                password: "wrongpassword"
            });

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid credentials.");
    });

    it('should block unauthorized users from adding a product', async () => {
        const res = await request(app)
            .post('/api/product/add')
            .send({ name: "New Shirt", price: 50 });

        // Now this will pass because we added .status(401) to the middleware
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Not Authorized. Login Again.");
    });
});