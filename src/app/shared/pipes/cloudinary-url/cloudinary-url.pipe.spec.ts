import { CloudinaryUrlPipe } from './cloudinary-url.pipe';

describe('CloudinaryUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new CloudinaryUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
