import { TransformWithObservablePipe } from './transform-with-observable.pipe';

describe('TransformWithObservablePipe', () => {
  it('create an instance', () => {
    const pipe = new TransformWithObservablePipe();
    expect(pipe).toBeTruthy();
  });
});
