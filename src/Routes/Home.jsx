import { signOut,getAuth } from "firebase/auth"
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../fbconfig2";
import "../components/ExcelTool.css"

export function Home(){

    const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Flag to check if editing is in progress
  const [editIndex, setEditIndex] = useState(null); // Holds the index of the row being edited

  // Defining the fields of the form, each with a name, type, and options for dropdowns
  const inputFields = [
    { name: "Circle Name", type: "text", required: true },
    { name: "Division Name", type: "text", required: true },
    { name: "Sub- Division Name", type: "text", required: true },
    { name: "Section Name", type: "text", required: true },
    { name: "Request Received (Date)", type: "date", required: true },
    { name: "SAP Notification No.", type: "text", required: true },
    { name: "NEG Tracking No.", type: "text", readOnly: true },
    { name: "JSV Owner Name", type: "text", required: true },
    { name: "Estimate Preparation Owner Name", type: "text", required: true },
    { name: "Estimate Checking Owner Name", type: "text", required: true },
    { name: "Consumer Type (Govt. / Private)", type: "text", required: true },
    { name: "Name of Consumer", type: "text", required: true },
    { name: "Address of Consumer", type: "text", required: true },
    { name: "Case Category", type: "text", required: true },
    { name: "Case Type", type: "dropdown", options: ["New Connection", "Load Enhancement", "Electrification"], required: true },
    { name: "Deposit Scheme (100% / 6% / Both)", type: "text", required: true },
    { name: "Load Demand (in KW)", type: "number", required: true },
    { name: "Load Demand (in kVA)(KW/0.9)", type: "number", readOnly: true },
    { name: "Type of Load (Industrial/ Institute/ Commercial/ Residential/ Temporary Load)", type: "text" , required: true},
    { name: "Voltage Level (kV)", type: "text" , required: true},
    { name: "Scope of work", type: "text" , required: true},
    { name: "Site Visit (Date)", type: "date", required: true },
    { name: "Hold/ Delay (Date)", type: "date" },
    { name: "Clearance of Hold/ Delay (Date)", type: "date" },
    { name: "Estimate released On (Date)", type: "date" },
    { name: "Total Time taken for estimate preparation by NEG", type: "text", readOnly: true },
    { name: "Estimate submitted for checking On (Date)", type: "date" },
    { name: "Estimate checking done On (Date)", type: "date" },
    { name: "Ageing (Estimate Preparation Pending)", type: "text" },
    { name: "Ageing (Estimate checking pending)", type: "text" },
    { name: "Status", type: "text" },
    { name: "DNGP Date", type: "date" },
    { name: "OPTCL Approval Required (Yes / No)", type: "text" },
    { name: "Sent for OPTCL approval (On Date)", type: "date" },
    { name: "OPTCL Approval Received Date", type: "date" },
    { name: "Total Time taken for Receiving of OPTCL Approval", type: "text" },
    { name: "Date for approval sent to Technical Cell (Date)", type: "date" },
    { name: "Date for approval Received from Technical Cell (Date)", type: "date" },
    { name: "Estimated Cost (in Rs.) For 100% deposit work", type: "number" },
    { name: "Estimated Cost (in Rs.) For 6% deposit work", type: "number" },
    { name: "Reason For Hold/ Delay", type: "text" },
    { name: "Detail Remarks For Hold/ Delay", type: "text" },
    { name: "Reason for Revised estimate", type: "text" },
    { name: "Remarks", type: "text" },
    { name: "Grid substation Name", type: "text" },
    { name: "33KV Feeder Name", type: "text", required: true},
    { name: "33/11KV PSS Name", type: "text", required: true },
    { name: "11KV Feeder Name", type: "text" , required: true},
    { name: "Previous Load (in KVA) (For Load Enhancement cases)", type: "number" },
    { name: "Current Load (in KVA) (For Load Enhancement cases)", type: "number" },
    { name: "Enhanced Load (in KVA)", type: "number" },
    { name: "Request Received From", type: "text" },
    { name: "Mode of Receipt (E-Mail/ Phone/ SAP)", type: "text" },
    { name: "Scheme Punch Date", type: "date" },
    { name: "Scheme Appropriation Request No.", type: "text" },
    { name: "Approval Status", type: "text" },
    { name: "Date of Scheme Approval from NEG", type: "date" },
    { name: "1st Site Visit Date", type: "date" },
    { name: "2nd Site Visit Date", type: "date" },
  ];

  // Handling input changes to update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    // If Load Demand (in KW) is changed, automatically calculate Load Demand (in kVA)
    if (name === "Load Demand (in KW)") {
      const loadDemandKW = parseFloat(value);
      const loadDemandKVA = loadDemandKW ? loadDemandKW / 0.9 : "";
      updatedData["Load Demand (in kVA)(KW/0.9)"] = loadDemandKVA;
    }

    // Recalculate the total time whenever certain dates are changed
    if (
      ["Site Visit (Date)", "Hold/ Delay (Date)", "Clearance of Hold/ Delay (Date)", "Estimate released On (Date)"].includes(name)
    ) {
      updatedData["Total Time taken for estimate preparation by NEG"] = calculateTotalTime(updatedData);
    }


  const calculatetTotalTime = (sentDate, receivedDate) => {
    if (!sentDate || !receivedDate) return "";
  
    const sentDateObj = new Date(sentDate);
    const receivedDateObj = new Date(receivedDate);
  
    // Ensure valid dates
    if (isNaN(sentDateObj) || isNaN(receivedDateObj)) return "Invalid Dates";
  
    // Calculate the difference in days
    const timeDifference = (receivedDateObj - sentDateObj) / (1000 * 60 * 60 * 24);
    return timeDifference >= 0 ? `${timeDifference} days` : "Invalid Dates";
  };
  
    // Recalculate the total time whenever date fields change
    if (
      ["Sent for OPTCL approval (On Date)", "OPTCL Approval Received Date"].includes(name)
    ) {
      updatedData["Total Time taken for Receiving of OPTCL Approval"] = calculatetTotalTime(
        updatedData["Sent for OPTCL approval (On Date)"],
        updatedData["OPTCL Approval Received Date"]
      );
    }
  
    setFormData(updatedData); // Update the form data state
  };



  // Function to calculate the total time taken for estimate preparation
  const calculateTotalTime = (data) => {
    const { "Site Visit (Date)": siteVisit, "Hold/ Delay (Date)": holdDate, "Clearance of Hold/ Delay (Date)": clearanceDate, "Estimate released On (Date)": estimateDate } = data;

    if (!siteVisit || !estimateDate) return "";
    
    const siteVisitDate = new Date(siteVisit);
    const estimateReleaseDate = new Date(estimateDate);
    const holdStartDate = holdDate ? new Date(holdDate) : null;
    const holdEndDate = clearanceDate ? new Date(clearanceDate) : null;

    // Calculate the duration of hold period if present
    const holdDuration = holdStartDate && holdEndDate ? (holdEndDate - holdStartDate) / (1000 * 60 * 60 * 24) : 0;
    const totalTime = (estimateReleaseDate - siteVisitDate) / (1000 * 60 * 60 * 24) - holdDuration;

    return totalTime >= 0 ? `${totalTime} days` : "Invalid Dates";
  };

  // Handling form submission to either add new entry or update existing entry
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      "SL. NO.": tableData.length + 1, // Generate a serial number for the new entry
    };

    if (isEditing) {
      // Update the existing entry if in editing mode
      const updatedTableData = [...tableData];
      updatedTableData[editIndex] = newEntry;
      setTableData(updatedTableData);
      setIsEditing(false); // Reset editing flag
      setEditIndex(null); // Reset edit index
    } else {
      // Add new entry to the table data
      setTableData((prev) => [newEntry, ...prev]);
    }
    setFormData({}); // Reset form data
  };

  // Function to handle row editing
  const handleEdit = (index) => {
    const rowToEdit = tableData[index];
    setFormData(rowToEdit); // Set the row data to form for editing
    setIsEditing(true); // Enable editing mode
    setEditIndex(index); // Set the index of the row being edited
  };


  
// Function to handle row update in db
const handleUpdate = async (index) => {
  console.log("Updating entry at index", index); // Check if it's being triggered

  const updatedEntry = {
    ...tableData[index], 
    // Modify or add fields if necessary
  };

  try {
    const firestoreUpdate = db.collection("entries")
      .doc(tableData[index]["SL. NO."].toString())
      .update(updatedEntry);

    await firestoreUpdate;

    // Update local state to reflect the changes
    const updatedTableData = [...tableData];
    updatedTableData[index] = updatedEntry;
    setTableData(updatedTableData);

    console.log("Row updated successfully!");
  } catch (error) {
    console.error("Error updating entry:", error);
  }
};




  // Function to extract table row data dynamically based on input fields
  const getTableRowData = (row) => {
    return inputFields.map((field, idx) => {
      const fieldValue = row[field.name];
      return (
        <td key={idx}>
          {fieldValue !== undefined && fieldValue !== "" ? fieldValue : "NA"}
        </td>
      );
    });
  };

    const auth = getAuth()
    async function handleSignOut(){
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error)
        }
    }
    // <button onClick={() => {handleSignOut()} } className="mt-2 w-full text-white bg-black border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 lg:mb-8">Sign Out</button>
    return <div className=" bg-gray-100 flex align-left">
        <div className="excel-tool">
      <h2>Welcome</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-box">
          {inputFields.map((field, index) => {
            if (field.type === "dropdown") {
              return (
                <div className="form-group" key={index}>
                  <label>{field.name}</label>
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            } else {
              return (
                <div className="form-group" key={index}>
                  <label>{field.name}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    readOnly={field.readOnly}
                    className="form-input"
                  />
                </div>
              );
            }
          })}
          <button type="submit" className="submit-button">
            {isEditing ? "Update Entry" : "Submit Entry"}
          </button>
        </form>
      </div>

      <div className="data-table-wrapper text-xs">
        <table className="data-table flex">
          <thead  className="">
            <tr className="">
              {inputFields.map((field, idx) => (
                <th className="flex flex-col" key={idx}>{field.name}</th>
              ))}
              <th className="flex justify-center">Actions</th>
            </tr>
          </thead>
          <tbody className="flex">
            {tableData.map((row, index) => (
              <tr  className="flex flex-col" key={row["SL. NO."]}>
                {getTableRowData(row)}
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleUpdate(index)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div> 
           {/* <form  className="flex flex-col w-fit" onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
                <div className="ml-2 bg-white justify-center flex-row mt-2 w-fit text-black border-2 border-black font-medium rounded-lg text-sm px-5 py-2.5 me-2 " key={key}>
                <label className="text-black font-medium">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                    className="text-black flex justify-center border-2 border-black"
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    />
                </div>
            ))}
            <button  className="flex justify-center flex-col mt-2 w-full text-white bg-black border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 lg:mb-8" type="submit">Submit</button>
            </form> */}
    
}