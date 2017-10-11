import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.CREATE_PROGRAMTYPE:
        return action.payload.createProgramTypeStatus;
        break;
    }
    return state;
}

