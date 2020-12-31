import React, { useState, useEffect } from 'react';
import Employee from './Employee';
import axios from 'axios';

export default function EmployeeList() {
  const [employeeList,setEmployeeList] = useState([])
  const [recordForEdit, setRecordForEdit] = useState(null)

  useEffect(()=>{
    refreshEmployeeList();

  },[])


  const imagaeupload2 = (url = 'https://localhost:44306/api/employeemodels') => {
    return {
      fetchAll: () => axios.get(url),
      create: newRecord => axios.post(url, newRecord),
      update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
      delete: id => axios.delete(url + id)
    }
  }
  function refreshEmployeeList() {
    imagaeupload2().fetchAll()
    .then(res => setEmployeeList(res.data))
    .catch(err => console.log(err))
  }

  const addOrEdit = (formData, onSuccess) => {
    if(formData.get('employeeID') === "0")
    imagaeupload2().create(formData)
    .then(res => {
      onSuccess();
      refreshEmployeeList();
    })
    .catch(err => console.log(err))
    else
    imagaeupload2().update(formData.get('employeeID'),formData)
    .then(res => {
      onSuccess();
      refreshEmployeeList();
    })
    .catch(err => console.log(err))


  }
  const showRecordDetails = data => {
    setRecordForEdit(data)

  }
  const onDelete = (e,id)=> {
    e.stopPropagation()
    if(window.confirm('Are you sure you want to delete this profile?'))
    imagaeupload2().delete(id)
    .then(res => refreshEmployeeList())
    .catch(err => console.log(err))
  }

  const imageCard = data =>(
    <div className="card" onCLick={() => {showRecordDetails(data)}}>
    <img src={data.imageSrc} className="card-img-top rounded-circle" alt="" />
      <div className="card-body">
        <h5>{data.employeeName}</h5>
        <span>{data.occupation}</span> <br/>
        <button className="btn btn-light delete-button" onClick={e => onDelete(e, parseInt(data.employeeID))}>
          <i className="far fa-trash-alt"></i>
        </button>

      </div>
    </div>
  )
  return (
    <div className="row">
    <div className="col-md-12">
      <div className="jumbotron jumbotron-fluid py-4">
        <div className="container text-center">
          <h1 className="display-4">Employee Register</h1>
        </div>
      </div>
    </div>
      <div className="col-md-4">
        <Employee 
          addOrEdit = {addOrEdit}
          recordForEdit={recordForEdit}
        />
      </div>
      <div className="col-md-8">
        <table>
          <tbody>
            {
              [...Array(Math.ceil(employeeList.length/3))].map((e,i) =>
              <tr key={i}>
                <td>{imageCard(employeeList[3*i])}</td>
                <td>{employeeList[3*i+1]?imageCard(employeeList[3*i+1]): null}</td>
                <td>{employeeList[3*i+2]?imageCard(employeeList[3*i+2]): null}</td>
              </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

