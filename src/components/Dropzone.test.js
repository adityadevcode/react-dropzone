import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropzone from './Dropzone';

// Helper function to create a blob that represents a file
const createFile = (name, size, type) => {
  const file = new File([], name, { type });
  Object.defineProperty(file, 'size', { get: () => size });
  return file;
};

describe('Dropzone Component', () => {
  it('renders correctly', () => {
    render(<Dropzone />);
    expect(screen.getByText('Drag \'n\' drop some files here, or click to select files')).toBeInTheDocument();
  });

  it('handles file drop', () => {
    render(<Dropzone />);
    const dropzone = screen.getByText('Drag \'n\' drop some files here, or click to select files');
    const file = createFile('test-file.jpg', 500, 'image/jpeg');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    // Check if the file drop is handled correctly
    expect(screen.getByPlaceholderText('Custodian name')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    render(<Dropzone />);
    const dropzone = screen.getByText('Drag \'n\' drop some files here, or click to select files');
    const file = createFile('test-file.jpg', 500, 'image/jpeg');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });
    userEvent.type(screen.getByPlaceholderText('Custodian name'), 'Test');
    userEvent.click(screen.getByText('Upload'));

    await waitFor(() => {
      expect(screen.getByText('Batch 1: Test - 1 files')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  it('displays progress while uploading', async () => {
    jest.useFakeTimers();
    render(<Dropzone />);
    const dropzone = screen.getByText('Drag \'n\' drop some files here, or click to select files');
    const file = createFile('test-file.jpg', 500, 'image/jpeg');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });
    userEvent.type(screen.getByPlaceholderText('Custodian name'), 'Test');
    userEvent.click(screen.getByText('Upload'));

    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
