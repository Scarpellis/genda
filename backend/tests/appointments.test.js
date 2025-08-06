const mockAppointments = [];

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readFile: jest.fn(async (file) => {
      if (file.includes('appointments.json')) {
        return JSON.stringify(mockAppointments);
      }
      return '[]';
    }),
    writeFile: jest.fn(async (file, data) => {
      if (file.includes('appointments.json')) {
        mockAppointments.length = 0;
        mockAppointments.push(...JSON.parse(data));
      }
    }),
  },
}));

process.env.JWT_SECRET = 'testsecret';

const request = require('supertest');
const app = require('../src/config/app');

describe('Appointments API', () => {
  it('should create and list appointments', async () => {
    const resCreate = await request(app)
      .post('/appointments')
      .send({
        date: '2024-01-01',
        time: '10:00',
        service: 'Corte',
        client: 'Fulano',
        status: 'pending',
      });
    expect(resCreate.status).toBe(201);
    expect(resCreate.body).toHaveProperty('id');

    const resList = await request(app).get('/appointments');
    expect(resList.status).toBe(200);
    expect(resList.body).toEqual([resCreate.body]);
  });
});
