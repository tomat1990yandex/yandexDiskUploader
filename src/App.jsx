import './App.css';
import Upload from "./components/Upload";
import DiscInfo from "./components/DiscInfo";
import LogInfo from "./components/LogInfo";
import {useState} from "react";

function App() {
  const [log, setLog] = useState([])
  const [quantity, setQuantity] = useState({})
  const [update, setUpdate] = useState(false)
  const token = process.env.REACT_APP_TOKEN;

  const handleChangeQuanity = (obj) => {
    setQuantity(prevState => ({...prevState, ...obj}))
  }

  const handleChangeStatus = (name, res) => {
    setLog(prevState => [...prevState, {name, status: res}])
  }

  const handleGetDiscInfo = (state) => {
    setUpdate(state)
  }

  return (
    <div className="app">
      <DiscInfo
        token={token}
        onResultHandler={handleChangeStatus}
        onUpdate={update}
        onHandleRefresh={handleGetDiscInfo}
      />
      <Upload
        token={token}
        onResultHandler={handleChangeStatus}
        onQuantity={handleChangeQuanity}
        onHandleRefresh={handleGetDiscInfo}/>
      <LogInfo log={log} quantity={quantity}/>
    </div>
  );
}

export default App;
