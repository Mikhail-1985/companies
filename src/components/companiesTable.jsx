import { Button, Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchCompanies, changeSelectedCompanies, removeCompany, changeCompanies, changeShowModalAddCompany, changeSelectedEmployees} from './../store/companySlice.js'
import AddCompanyModal from './addCompanyModal.jsx'

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

const CompaniesTable = () => {
    const dispatch = useDispatch();

    const companies = useSelector(state => state.companies.companies)
    const selectedCompanies = useSelector(state => state.companies.selectedCompanies)
    const showModalAddCompany = useSelector(state => state.companies.showModalAddCompany)
    useEffect(() => {
        dispatch(fetchCompanies())
    }, [])

  const handleDelete = (e, selectedCompanies) => {
    for(let i = 0; i < selectedCompanies.length; i++)
    dispatch(removeCompany(selectedCompanies[i].key))
    dispatch(changeSelectedCompanies([]))
    dispatch(changeSelectedEmployees([]))
  };

  const defaultColumns = [
    {
        title: 'Компания',
        dataIndex: 'name',
        width: 150,
        editable: true,
    },
    {
        title: 'Количество сотрудников',
        dataIndex: 'employeesCount',
        width: 150,
    },
    {
        title: 'Адрес',
        dataIndex: 'address',
        editable: true,
    },
  ];

  const handleAdd = () => {
    dispatch(changeShowModalAddCompany(true));
  };

  const handleSave = (row) => {
    const newCompanies = JSON.parse(JSON.stringify(companies));
    const index = newCompanies.findIndex((item) => row.key === item.key);
    const item = newCompanies[index];
    newCompanies.splice(index, 1, { ...item, ...row });
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
      if(selectedRows.length > 0){
        dispatch(changeSelectedCompanies(selectedRows))
      }else{
        dispatch(changeSelectedCompanies([]))
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
        Добавить компанию
      </Button>
      
      {selectedCompanies.length > 0 && <Button
        onClick={(e) => handleDelete(e, selectedCompanies)}
        type="primary"
        danger
        style={{
          margin: '0 0 16px 20px'
        }}
      >
        Удалить выбранное
      </Button>}
      <Table
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={companies}
        columns={columns}
        pagination={{
            pageSize: 50,
        }}
        scroll={{
            y: 240,
        }}
      />
      {showModalAddCompany && <AddCompanyModal key='addCompanyModal'/>}
    </div>
  );
};

export default CompaniesTable;