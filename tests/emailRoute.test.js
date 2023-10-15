const request = require('supertest');
const express = require('express');
const emailRoutes = require('../routes/email');
const User = require('../models/User');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer-mock');

jest.mock('nodemailer');


const app = express();
app.use(express.json());
app.use(emailRoutes);

describe('Email Routes', () => {
    it('should schedule email process', async () => {
     
      
        const response = await request(app)
          .post('/start-email-process')
          .send({
            userId: '649355476ccb398a015c97dc',
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
