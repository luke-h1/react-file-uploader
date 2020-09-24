import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Message from './Message';
import Progress from './Progress';
const FileUpload = () => {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      e.preventDefault();
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (ProgressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            )
          );
          // clear percentage
          setTimeout(() => {
            setUploadPercentage(0);
          }, 5000);
        },
      });
      const { fileName, filePath } = res.data;
      setMessage('File Uploaded');
      setUploadedFile({ fileName, filePath });
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('Problem with backend');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}

      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {fileName}
          </label>
        </div>
        <Progress percentage={uploadPercentage} />
        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>

      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md 6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img src={uploadedFile.filePath} alt='' style={{ width: '50%' }} />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};
export default FileUpload;
