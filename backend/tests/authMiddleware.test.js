require('./setup');

const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middleware/authMiddleware');

describe('authMiddleware', () => {
  it('should attach user data from token to req.user', () => {
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 1, email: 'test@example.com' });
  });
});
