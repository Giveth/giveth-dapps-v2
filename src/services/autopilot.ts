/* eslint-disable prettier/prettier */
import axios from 'axios';

export const autopilotClient = axios.create({
  baseURL: 'https://api2.autopilothq.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    'autopilotapikey': process.env.NEXT_PUBLIC_AUTOPILOT_ID as string,
  },
});
