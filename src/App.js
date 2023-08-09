import './App.css';
import "@aws-amplify/ui-react/styles.css";
import React, { useState } from 'react';
import { Storage, Auth } from 'aws-amplify';
// import './house.jpeg';
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
        const user = await getCurrentUser();
        console.log('User:', user);
        const s3Key = `${user.username}/${file.name}`;
        
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
      {/* Header */}
      <header>
        <nav className="nav">
          <a href="/" className="site-title">Nakatomi Corporation</a>
          {/* <img src="./house.jpeg" alt="home img" /> */}
          <Button id="signOut" onClick={signOut}>Sign Out</Button>
        </nav>
        <h1>Nakatomi Upload Center</h1>
        <p>Upload any CSV file(s) to the S3 bucket.</p>
      </header>

      {/* Body */}
      <body>
        <br></br>
        <br></br>
        <section>
          <div>
            <input
              type="file"
              id="myFile"
              name="filename"
              multiple
              accept=".csv"
              onChange={handleFileChange}
            />
            <br></br>
            <br></br>
            <table>
              <thead>
                <th>File Name</th>
                <th>Upload Status</th>
              </thead>
              <tbody>
                {filesData.map((file, index) => (
                  <tr>
                    <td>{file.name}</td>
                    <td>{uploadStatuses[file.name] || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <br></br>
        <button id="upload-btn" onClick={uploadFiles}>Upload files</button>
      </body>
    </View>
  );
}

export default withAuthenticator(App);
// export default App;