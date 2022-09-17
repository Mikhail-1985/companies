import { Button, Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSelectedCompanies, changeSelectedEmployees, changeCompanies,
  changeShowModalAddEmployee, addSelectedCompanies } from './../store/companySlice.js'
import AddEmployeeModal from './addEmployeeModal.jsx'

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EmployeesTable = () => {
  const dispatch = useDispatch();

  const companies = useSelector(state => state.companies.companies)
  const selectedEmployees = useSelector(state => state.companies.selectedEmployees)
  const selectedCompanies = useSelector(state => state.companies.selectedCompanies)
  const showModalAddEmployee = useSelector(state => state.companies.showModalAddEmployee)
  const [allEmployees, setAllemployees] = useState([])

  useEffect(() => {
    let empls = []
    selectedCompanies.forEach(element => {
      element.employees.forEach(el => {
        empls.push(el)
      })
    });
    setAllemployees(empls.sort((a, b) => a.secondName > b.secondName ? 1 : -1))
  }, [selectedCompanies])

  const handleDelete = (e, selectedEmployees) => {
    
    let arrKeys = [];
    selectedEmployees.forEach(em => arrKeys.push(em.key))
    let companiesClone = JSON.parse(JSON.stringify(companies))
    let selectedCompaniesClone = JSON.parse(JSON.stringify(selectedCompanies))
    for(let i = 0; i < companies.length; i++){
      for(let j = 0; j < companies[i].employees.length; j++){
        if(arrKeys.includes(companies[i].employees[j].key)){
          companiesClone[i].employees.splice(j, 1)
          companiesClone[i].employeesCount -= 1
        }
      }
    }

    for(let i = 0; i < selectedCompanies.length; i++){
      for(let j = 0; j < selectedCompanies[i].employees.length; j++){
        if(arrKeys.includes(selectedCompanies[i].employees[j].key)){
          selectedCompaniesClone[i].employees.splice(j, 1)
          selectedCompaniesClone[i].employeesCount -= 1
        }
      }
    }
    dispatch(changeSelectedCompanies(selectedCompaniesClone))
    dispatch(changeCompanies(companiesClone))
    dispatch(changeSelectedEmployees([]))
  };

  const defaultColumns = [
    {
      title: 'Фамилия',
      dataIndex: 'secondName',
      width: 150,
      editable: true,
    },
    {
      title: 'Имя',
      dataIndex: 'firstName',
      width: 150,
      editable: true,
    },
    {
      title: 'Должность',
      dataIndex: 'jobTitle',
      width: 150,
      editable: true,
    },
  ];

  const handleAdd = () => {
    dispatch(changeShowModalAddEmployee(true));
  };

  const handleSave = (row) => {
    const newCompanies = JSON.parse(JSON.stringify(companies));
    const newSelectedCompanies = JSON.parse(JSON.stringify(selectedCompanies));
    for(let i = 0; i < companies.length; i++){
      for(let j = 0; j < companies[i].employees.length; j++){
        if(row.key === companies[i].employees[j].key)
        newCompanies[i].employees[j] = row;
      }
    }
    for(let i = 0; i < newSelectedCompanies.length; i++){
      for(let j = 0; j < newSelectedCompanies[i].employees.length; j++){
        if(row.key === newSelectedCompanies[i].employees[j].key)
        newSelectedCompanies[i].employees[j] = row;
      }
    }
    dispatch(changeSelectedCompanies(newSelectedCompanies));
    dispatch(changeCompanies(newCompanies));
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      if (selectedRows.length > 0) {
        dispatch(changeSelectedEmployees(selectedRows))
      } else {
        dispatch(changeSelectedEmployees([]))
      }
    }
  };

  return (
    <div>
      <Button
        onClick={() => handleAdd()}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Добавить сотрудника
      </Button>

      {selectedEmployees.length > 0 && selectedEmployees.length < 2 && <Button
        onClick={(e) => handleDelete(e, selectedEmployees)}
        type="primary"
        danger
        style={{
          margin: '0 0 16px 20px'
        }}
      >
        Удалить
      </Button>}
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={allEmployees}
        columns={columns}
        pagination={{
          pageSize: 50,
        }}
        scroll={{
          y: 240,
        }}
      />
      {showModalAddEmployee && <AddEmployeeModal />}
    </div>
  );
};

export default EmployeesTable;