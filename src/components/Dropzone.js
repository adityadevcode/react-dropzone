import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './Dropzone.css';

const Dropzone = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [custodianName, setCustodianName] = useState('');
    const [fileBatches, setFileBatches] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [error, setError] = useState(null);
  
    const onFileDrop = useCallback((acceptedFiles) => {
      setError(null);
      setUploadedFiles(acceptedFiles);
    }, []);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop: onFileDrop, 
      onDropRejected: () => {
        setError('Some files could not be uploaded. Please, try again.')
      } 
    });
  
    const handleFileUpload = async () => {
      if (!custodianName) {
        alert('Please enter a Custodian name');
        return;
      }
      const newBatch = { custodian: custodianName, files: uploadedFiles };
      setFileBatches((previousBatches) => [...previousBatches, newBatch]);
      setUploadedFiles([]);
      setCustodianName('');
    };
  
    useEffect(() => {
      fileBatches.forEach((batch, index) => {
        let i = 0;
        const timer = setInterval(() => {
          i++;
          setUploadProgress((previousProgress) => ({
            ...previousProgress,
            [index]: (i / batch.files.length) * 100,
          }));
          if (i === batch.files.length) clearInterval(timer);
        }, 1000);
      });
    }, [fileBatches]);
  
    return (
      <div>
        {error && <div className="error">{error}</div>}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        {uploadedFiles.length > 0 && (
          <>
            <input
              type="text"
              placeholder="Custodian name"
              value={custodianName}
              onChange={(e) => setCustodianName(e.target.value)}
              className="custodian-input"
            />
            <button onClick={handleFileUpload} className="upload-button">
              Upload
            </button>
          </>
        )}
        {fileBatches.map((batch, index) => (
          <div key={index}>
            <div>Batch {index + 1}: {batch.custodian} - {batch.files.length} files</div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${uploadProgress[index] || 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
};

export default Dropzone;
