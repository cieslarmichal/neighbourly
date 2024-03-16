import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../store';

export const useStoreDispatch: () => AppDispatch = useDispatch;
