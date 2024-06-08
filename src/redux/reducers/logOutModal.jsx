import { OPEN_LOG_OUT_MODAL, CLOSE_LOG_OUT_MODAL } from "../actions/type";

const initialState = {
    isLogOutOpen: false,
};

export const logOutModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_LOG_OUT_MODAL:
            return {
                ...state,
                isLogOutOpen: true,
            };
        case CLOSE_LOG_OUT_MODAL:
            return {
                ...state,
                isLogOutOpen: false,
            };
        default:
            return state;
    }
};