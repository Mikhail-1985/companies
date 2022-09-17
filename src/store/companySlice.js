import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCompanies = createAsyncThunk(
    'companies/fetchCompanies',
    async function(_, {rejectWithValue}) {
        try {
            const response = await fetch('http://localhost:4200/companies')
            if (!response.ok) {
                throw new Error('Server Error!');
            }
    
            const data = await response.json();
    
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const companySlice = createSlice({
    name: 'company',
    initialState: {
        companies: [],
        selectedCompanies: [],
        selectedEmployees: [],
        error: null,
        status: null,
        showModalAddCompany: false,
        showModalAddEmployee: false,
    },
    reducers: {
        addCompany(state, action) {
            state.companies.push(action.payload);
        },
        addSelectedCompanies(state, action) {
            state.selectedCompanies.push(action.payload);
        },
        addEmployee(state, action) {
            const [keyComplany, newEmployee] = action.payload
            for(let i = 0; i < state.companies.length; i++){
                if(state.companies[i].key === keyComplany){
                    state.companies[i].employees.push(newEmployee)
                    state.companies[i].employeesCount += 1
                }
            }
            for(let i = 0; i < state.selectedCompanies.length; i++){
                if(state.selectedCompanies[i].key === keyComplany){
                    state.selectedCompanies[i].employees.push(newEmployee)
                    state.selectedCompanies[i].employeesCount += 1
                }
            }
        },
        removeCompany(state, action) {
            state.companies = state.companies.filter(company => company.key !== action.payload);
        },
        changeCompanies(state, action) {
            state.companies = action.payload;
        },
        changeSelectedCompanies(state, action) {
            state.selectedCompanies = action.payload;
        },
        changeSelectedEmployees(state, action) {
            state.selectedEmployees = action.payload;
        },
        changeShowModalAddCompany(state, action) {
            state.showModalAddCompany = action.payload;
        },
        changeShowModalAddEmployee(state, action) {
            state.showModalAddEmployee = action.payload;
        },
    },
    extraReducers: {
        [fetchCompanies.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.companies = action.payload.sort((a, b) => a.name > b.name ? 1 : -1);
        },
        [fetchCompanies.rejected]: setError,
    },
});

export const {addCompany, addEmployee, addSelectedCompanies, removeCompany, changeSelectedCompanies, changeCompanies, changeShowModalAddCompany, changeSelectedEmployees, changeShowModalAddEmployee} = companySlice.actions;

export default companySlice.reducer;