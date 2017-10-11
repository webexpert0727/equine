import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.SUBMIT_STATUSBTN:
        return action.payload.submitStatusBtnStatus;
        break;
    }
    return state;
}

