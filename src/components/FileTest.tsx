import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { FaFileExcel } from 'react-icons/fa';
import { FaFile } from 'react-icons/fa';
import axios from 'axios';
import endpoints from '../endpoints';

const FileTest: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file.name);
      setFileType(file.type);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(endpoints.fileupload , formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  const getFileIcon = () => {
    if (fileType === 'application/pdf') {
      return <FaFilePdf className="text-red-600 text-4xl" />;
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.ms-excel'
    ) {
      return <FaFileExcel className="text-green-600 text-4xl" />;
    } else {
      return <FaFile className="text-gray-600 text-4xl" />;
    }
  };

  return (
    <div className="flex items-center space-x-4 relative mb-10">
      <input
        type="file"
        id="file-input"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-input"
        className="cursor-pointer text-2xl text-gray-600"
      >
        +
      </label>
      {fileName && (
        <div className="flex items-center space-x-2 relative group">
          {getFileIcon()}
          <span className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {fileName}
          </span>
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default FileTest;
