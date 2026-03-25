import { v4 as uuidv4 } from 'uuid';

export const getDeviceId = (): string => {
  let id = localStorage.getItem('orbita_device_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('orbita_device_id', id);
  }
  return id;
};