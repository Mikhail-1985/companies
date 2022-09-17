import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './companySlice';

export default configureStore({
  reducer: {
    companies: companyReducer,
  },
});