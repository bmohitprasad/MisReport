import { signOut,getAuth } from "firebase/auth"
import { useState } from "react";

export function Home(){

    const [formData, setFormData] = useState({
        slNo: "",
        circleName: "",
        divisionName: "",
        subDivisionName: "",
        sectionName: "",
        requestDate: "",
        sapNotificationNo: "",
        negTrackingNo: "",
        jsvOwnerName: "",
        estimatePreparationOwner: "",
        estimateCheckingOwner: "",
        consumerType: "",
        consumerName: "",
        consumerAddress: "",
        caseCategory: "",
        caseType: "",
        depositScheme: "",
        loadDemandKW: "",
        loadDemandKVA: "",
        loadType: "",
        voltageLevel: "",
        scopeOfWork: "",
        siteVisitDate: "",
        holdDate: "",
        clearanceDate: "",
        estimateReleasedDate: "",
        totalTimeEstimate: "",
        estimateSubmittedDate: "",
        estimateCheckedDate: "",
        ageingPreparation: "",
        ageingChecking: "",
        status: "",
        dngpDate: "",
        optclApprovalRequired: "",
        optclSentDate: "",
        optclReceivedDate: "",
        optclTime: "",
        techCellSentDate: "",
        techCellReceivedDate: "",
        cost100Percent: "",
        cost6Percent: "",
        reasonHold: "",
        detailRemarksHold: "",
        reasonRevisedEstimate: "",
        remarks: "",
        gridSubstationName: "",
        feederName33KV: "",
        pssName33KV: "",
        feederName11KV: "",
        previousLoadKVA: "",
        currentLoadKVA: "",
        enhancedLoadKVA: "",
        requestReceivedFrom: "",
        modeOfReceipt: "",
        schemePunchDate: "",
        schemeAppropriationNo: "",
        approvalStatus: "",
        schemeApprovalDate: "",
        siteVisitDate1: "",
        siteVisitDate2: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await addDoc(collection(db, 'firestoreData'), formData);
          alert('Data submitted successfully!');
          setFormData({}); // Reset form data
        } catch (error) {
          console.error('Error adding document: ', error);
        }
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
    return <div className="bg-gray-300 h-full w-full flex align-left">
        <div>
           <form  className="flex-wrap" onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
                <div className="ml-2 flex-wrap flex justify-center flex-col mt-2 w-full text-black border-2 border-black font-medium rounded-lg text-sm px-5 py-2.5 me-2 " key={key}>
                <label className="text-black font-medium">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                    className="text-black flex justify-center flex-col "
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    />
                </div>
            ))}
            <button  className="flex justify-center flex-col mt-2 w-full text-white bg-black border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 lg:mb-8" type="submit">Submit</button>
            </form>
        </div>
    </div> 
    
}