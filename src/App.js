import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { Storage } from "aws-amplify";
import { useState } from "react";
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
  const [fileData, setFileData] = useState([]);
  const [fileStatus, setFileStatus] = useState(false);
  const onChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFileData(selectedFiles);
  };
  const uploadFiles = async () => {
    if (fileData.length === 0) {
      alert("Please select files before uploading");
      return;
    }
    const allowedFileTypes = ["text/csv"];
    const uploadPromises = fileData.map(async (file) => {
      if (!allowedFileTypes.includes(file.type)) {
        alert("Only CSV files are allowed");
        return;
      }
      try {
        const result = await Storage.put(file.name, file, {
          contentType: file.type,
        });
        console.log("File uploaded successfully:", result);
      } catch (error) {
        console.error("File upload error", error);
      }
    });
    try {
      await Promise.all(uploadPromises);
      setFileStatus(true);
    } catch (error) {
      console.error("Error while uploading files:", error);
    }
  };
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
        <Button id="signOut" onClick={signOut}>
          Sign Out
        </Button>
      </div>
      <main>
        <h2>Upload CSV files here</h2>
        <input
          type="file"
          hidden
          multiple
          accept=".csv"
          onChange={onChange}
        />
        <button onClick={uploadFiles}>Upload files</button>
        {fileStatus ? "Files uploaded successfully" : ""}
      </main>
    </View>
  );
}
export default withAuthenticator(App);