import './App.css';
import "@aws-amplify/ui-react/styles.css";
import React, { useState } from 'react';
import { Storage } from 'aws-amplify';
import {
  withAuthenticator,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  Card,
} from "@aws-amplify/ui-react";
// ... other imports

function App({ signOut }) {
  const [filesData, setFilesData] = useState([]);
  const [uploadStatuses, setUploadStatuses] = useState({});

  const getCurrentUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (err) {
      console.error('Error getting current user', err);
      return null;
    }
  };
  
  const uploadFiles = async () => {
    if (!filesData.length) {
      alert('Please select files before uploading');
      return;
    }

    for (let file of filesData) {
      if (file.type !== 'text/csv') {
        alert(`Only CSV files are allowed. ${file.name} is not a CSV file.`);
        return;
      }

      try {
        var user = getCurrentUser();
        var s3Key = '${user.username}/${file.name}';
        
        await Storage.put(s3Key, file, {
          contentType: file.type,
        });
        setUploadStatuses(prevState => ({
          ...prevState,
          [file.name]: 'Successfully uploaded'
        }));
      } catch (error) {
        console.error('File upload error for', file.name, error);
        setUploadStatuses(prevState => ({
          ...prevState,
          [file.name]: 'Failed to upload'
        }));
      }
    }
  }

  const handleFileChange = (e) => {
    setFilesData([...e.target.files]);
    setUploadStatuses({});
  }

  return (
    <View className="App">
      <header>
        <h1>Welcome to Nakatomi Corporation!</h1>
      </header>
      <div>
        <Button id="signOut" onClick={signOut}>Sign Out</Button>
      </div>
      <main>
        <h2>Upload CSV files here</h2>
        <input
          type="file"
          id="myFile"
          name="filename"
          multiple
          accept=".csv"
          onChange={handleFileChange}
        />
        <ul>
          {filesData.map((file, index) => (
            <li key={index}>
              {file.name} - {uploadStatuses[file.name] || 'Pending'}
            </li>
          ))}
        </ul>
        <button onClick={uploadFiles}>Upload files</button>
      </main>
    </View>
  );
}

export default withAuthenticator(App);