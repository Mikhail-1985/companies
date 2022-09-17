import { Modal, Button, Input, Tooltip, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeShowModalAddEmployee, addEmployee } from '../store/companySlice.js'

const { Option } = Select;

const AddEmployeeModal = () => {

    const dispatch = useDispatch();
    const selectedCompanies = useSelector(state => state.companies.selectedCompanies)
    const [nameNewEmployee, setNameNewEmployee] = useState('');
    const [secondNameNewEmployee, setSecondNameNewEmployee] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [disableOk, setDisableOk] = useState(true);

    const changeNameNewEmployee = (e) => {
        setNameNewEmployee(prev => e.target.value)
    }
    const changeSecondNameNewEmployee = (e) => {
        setSecondNameNewEmployee(e.target.value)
    }
    const changeJobTitle = (e) => {
        setJobTitle(e.target.value)
    }

    const handleChangeCompany = (e) => {
        setSelectedCompany(e)
    }
    useEffect(() => {
        if (nameNewEmployee.length > 1 && secondNameNewEmployee.length > 1 && jobTitle.length > 1 && selectedCompany !== null) {
            setDisableOk(false)
        } else {
            setDisableOk(true)
        }
    }, [nameNewEmployee, secondNameNewEmployee, jobTitle, selectedCompany])

    const addNewEmployee = () => {
        let generatorKey = new Date()
        generatorKey = generatorKey.getTime()
        dispatch(addEmployee([selectedCompany, { key: generatorKey, firstName: nameNewEmployee, secondName: secondNameNewEmployee, jobTitle: jobTitle }]))
        dispatch(changeShowModalAddEmployee(false))
    }

    const showModalAddEmployee = useSelector(state => state.companies.showModalAddEmployee)
    return (
        <>
            <Modal
                maskTransitionName=""
                title="Добавить Сотрудника"
                width={490}
                onOk={() => { dispatch(changeShowModalAddEmployee(false)) }}
                onCancel={() => { dispatch(changeShowModalAddEmployee(false)) }}
                open={showModalAddEmployee}
                footer={[
                    <Button style={{ marginRight: '5px' }} key="back" onClick={() => { dispatch(changeShowModalAddEmployee(false)) }}>
                        Отмена
                    </Button>,
                    disableOk
                        ? <Tooltip title="Имя и фамилия должны содержать не менее 2-х символов, а так же должна быть выбрана компания"><Button disabled={true} type="primary" key="add" onClick={() => addNewEmployee()} id="ok_add-button">
                            Добавить
                        </Button></Tooltip>
                        : <Button disabled={false} type="primary" key="add" onClick={() => addNewEmployee()} id="ok_add-button">
                            Добавить
                        </Button>
                ]}
            >       <div>
                    <Select
                        placeholder="Выберете компанию"
                        key="selectCompany"
                        style={{
                            width: 200,
                        }}
                      onChange={(e) => handleChangeCompany(e)}
                    >{selectedCompanies.map(c => <Option key={c.key} value={c.key}>{c.name}</Option>)}
                    </Select>
                    </div>
                <label>
                    Имя сотрудника
                    <Input key='nameEmployee' onChange={(e) => changeNameNewEmployee(e)} />
                </label>
                <label>
                    Фамилия
                    <Input key='secondNameEmployee' onChange={(e) => changeSecondNameNewEmployee(e)} />
                </label>
                <label>
                    Должность
                    <Input key='jobTtile' onChange={(e) => changeJobTitle(e)} />
                </label>
            </Modal>
        </>
    );
}

export default AddEmployeeModal;
