const request = require('supertest');
const express = require('express');
const emailRoutes = require('../routes/email');
const User = require('../models/User');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer-mock');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('nodemailer');

const mongoServer = new MongoMemoryServer({
    binary: {
      arch: 'arm64',
      platform: 'darwin',
    },
  });

beforeAll(async () => {

  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


const app = express();
app.use(express.json());
app.use(emailRoutes);

describe('Email Routes', () => {
    it('should schedule email process', async () => {
        const testUser = new User({
          bookID: new mongoose.Types.ObjectId(), // Assuming Book with this ID exists or is not required to exist
          username: 'testUser',
          hash: 'testHash',
          salt: 'testSalt',
          name: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          shippingAddress: '123 Test St, Test City, TS 12345',
          giftOwnerEmail: 'dan@givebundl.com',
          refreshToken: 'testRefreshToken',
          lastEmailed: new Date(),
          prompts: ['Prompt 1', 'Prompt 2'],
          introNote: 'Welcome to the test!',
          recipinet: 'Test Recipient', // Note: There seems to be a typo in the schema ('recipinet' instead of 'recipient')
          recipientFirst: 'RecipientFirst',
        });
        await testUser.save();
      
        const response = await request(app)
          .post('/start-email-process')
          .send({
            userId: testUser._id,
            processStartDate: new Date(),
            physicalBook: false,
            recipients: ['danny.c.gleason@gmail.com', 'dannycgleason@gmail.com', 'dan@givebundl.com'],
          });
      
        expect(response.status).toBe(200);
        expect(response.text).toBe('Email process scheduled');
      });
      

  it('should return 404 if user not found', async () => {
    const response = await request(app)
      .post('/start-email-process')
      .send({
        userId: 'nonexistent-user-id',
        processStartDate: new Date(),
        physicalBook: false,
        recipients: ['test@example.com'],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });



  // You can continue to add more tests for the other routes as needed
});
