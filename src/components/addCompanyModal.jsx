import { Modal, Button, Input, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeShowModalAddCompany, addCompany } from './../store/companySlice.js'

const AddCompanyModal = () => {

    const dispatch = useDispatch();
    const [nameNewCompany, setNameNewCompany] = useState('');
    const [addressNewCompany, setAddressNewCompany] = useState('');
    const [disableOk, setDisableOk] = useState(true);

    const changeNameNewCompany = (e) => {
        setNameNewCompany(prev => e.target.value)
    }

    const changeAddressNewCompany = (e) => {
        setAddressNewCompany(e.target.value)
    }

    useEffect(() => {
        if (addressNewCompany.length > 2 && nameNewCompany.length > 2) {
            setDisableOk(false)
        } else {
            setDisableOk(true)
        }
    }, [nameNewCompany, addressNewCompany])

    const addNewCompany = () => {
        let generatorKey = new Date()
        generatorKey = generatorKey.getTime()
        dispatch(addCompany({ key: generatorKey, name: nameNewCompany, address: addressNewCompany, employeesCount: 0, employees: [] }))
        dispatch(changeShowModalAddCompany(false))
    }

    const showModalAddCompany = useSelector(state => state.companies.showModalAddCompany)
    return (
        <>
            <Modal
                maskTransitionName=""
                title="Добавить компанию"
                width={490}
                onOk={() => { dispatch(changeShowModalAddCompany(false)) }}
                onCancel={() => { dispatch(changeShowModalAddCompany(false)) }}
                open={showModalAddCompany}
                footer={[
                    <Button style={{marginRight: '5px'}} key="back" onClick={() => { dispatch(changeShowModalAddCompany(false)) }}>
                        Отмена
                    </Button>,
                    disableOk
                    ? <Tooltip title="Название компании и адреса должно содержать не менее 3-х символов"><Button disabled={true} type="primary" key="addtooltip" onClick={() => addNewCompany()} id="ok_add-button">
                        Добавить
                    </Button></Tooltip>
                    : <Button disabled={false} type="primary" key="add" onClick={() => addNewCompany()} id="ok_add-button">
                    Добавить
                </Button>
                ]}
            >
                <label>
                    Название компании
                    <Input key='nameCompany' onChange={(e) => changeNameNewCompany(e)} />
                </label>
                <label>
                    Адрес
                    <Input key='addressCompany' onChange={(e) => changeAddressNewCompany(e)} />
                </label>
            </Modal>
        </>
    );
}

export default AddCompanyModal;
