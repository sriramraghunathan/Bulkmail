import { useState } from "react";
import axios from "axios"
import * as XLSX from "xlsx";

const App=()=>{

  

  const[msg,setmsg]=useState("")
  const [status,setstatus]=useState(false)
  const [emailList,setEmailList]=useState([])

  function handlemsg(event){
    setmsg(event.target.value)
  }
    function handlefile(event) {
      const file = event.target.files[0];
      console.log(file);

      const reader = new FileReader()

      reader.onload = function (e) {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
        const totalemail = emailList.map(function (item) {
          return item.A
        });
        console.log(totalemail);
        setEmailList(totalemail);
      };

      // Binary Format
      reader.readAsArrayBuffer(file);
    }
  function send(){
    setstatus(true)
    axios.post("http://localhost:5000/sendemail",{msg:msg,emailList:emailList})
    .then(function(data){
      if(data.data === true)
      {
        alert("Email Send Successfully")
        setstatus(false)
      }
      else{
        alert("Failed")
      }
    })
  }
  return (
    <>
      <div className="bg-yellow-50 ">
        <div className="p-5 text-center  font-bold text-2xl  shadow-lg">
          <h1 className="border-yellow-400 shadow-lg rounded-full bg-yellow-200 p-6 inline-block">
            BULK MAIL
          </h1>
        </div>
        <div className="p-5 text-center">
          <h1 className=" border-black  shadow-lg rounded-l-full font-bold p-3 inline-block bg-black text-white">
            Drag And Drop
          </h1>
          <h1 className="bg-blue-500 border-blue-500 shadow-lg rounded-r-full font-bold p-3 mb-5 inline-block">
            We Can Help Your Business With Sending Multiple Email At Once.
          </h1>
        </div>
        <div className="text-center ">
          <textarea
          onChange={handlemsg}
          value={msg}
            className="p-1 font-medium w-96 h-20 border rounded-2xl  mb-2"
            
            placeholder="Enter The Email Text....."
          ></textarea>
          <br></br>
          <input
          onChange={handlefile}
            className="p-2 border bg-white rounded-2xl"
            type="file"
          ></input>
          <h2>Total Email in The File:{emailList.length}</h2>
          <button
          onClick={send}
          className="bg-green-500 font-bold   p-4 border-gray-300 rounded-full">
            {status?"Sending...":"Send"}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
