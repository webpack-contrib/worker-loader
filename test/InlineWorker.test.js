import InlineWorker from './../src/workers/InlineWorker';

describe('Inline Worker', () => {
  const objectUrlCreatedDuringWorkerCreation = () => {
    const createdObjectUrl = 'OBJECT_URL';
    window.URL = {
      createObjectURL: jest.fn().mockReturnValue(createdObjectUrl),
      revokeObjectURL: jest.fn(),
    };
    window.Worker = jest.fn();
    window.Blob = jest.fn();
    window.BlobBuilder = jest.fn();

    return createdObjectUrl;
  };

  test('calls revokeObjectURL after creating worker to prevent memory leaks', () => {
    const createdObjectUrl = objectUrlCreatedDuringWorkerCreation();

    InlineWorker('some_content', 'some_url');

    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(createdObjectUrl);
  });
});
