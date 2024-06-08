import { OPEN_LOG_OUT_MODAL, CLOSE_LOG_OUT_MODAL } from "./type";

// export const openLogOutModal = () => async (dispatch) => {
//     dispatch({
//         type: OPEN_LOG_OUT_MODAL,
//     })
// };

// export const closeLogOutModal = () => async (dispatch) => {
//     dispatch({
//         type: CLOSE_LOG_OUT_MODAL,
//     })
// };
export const openLogOutModal = () => ({
    type: OPEN_LOG_OUT_MODAL,
});

export const closeLogOutModal = () => ({
    type: CLOSE_LOG_OUT_MODAL,
});