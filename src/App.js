import './App.css';
import "@aws-amplify/ui-react/styles.css";
import { Storage } from "aws-amplify";
import { useState } from "react";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

function App({ signOut }) {
  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus] = useState(false);

  const uploadFile = async () => {
    const file = fileData;

    if (!file) {
      alert('Please select a file before uploading');
      return;
    }

    if (file.type !== 'text/csv') {
      alert('Only CSV files are allowed');
      return;
    }

    try {
      const result = await Storage.put(fileData.name, fileData, {
        contentType: fileData.type,
      });
      setFileStatus(true);
      console.log(21, result);
    } catch (error) {
      console.error('File upload error', error);
    }
    
    // console.log(21, result);
  }
  
  return (
    <View className="App">
      <header>
        <h1>Welcome to Nakatomi Corporation!</h1>
      </header>
      <Card>
        {/* <Image src={logo} className="App-logo" alt="logo" /> */}
        {/* <Heading level={1}>We now have Auth!</Heading> */}
      </Card>
      <div>
        <Button id="signOut" onClick={signOut}>Sign Out</Button>
      </div>

      <main>
        <h2>Upload CSV files here</h2>
        {/* <form action="/action_page.php"> */}
          <input type="file" id="myFile" name="filename" onChange={(e) => setFileData(e.target.files[0])} />
          {/* <input type="submit" /> */}
          <button onClick={uploadFile}>Upload file</button>
        {/* </form> */}
        {fileStatus ? "File uploaded successfully" : ""}
      </main>
    </View>
  );
}

export default withAuthenticator(App);