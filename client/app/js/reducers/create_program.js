import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.CREATE_PROGRAM:
        return action.payload.createProgramStatus;
        break;
    }
    return state;
}

