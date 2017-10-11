import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.CREATE_HORSE:
        return action.payload.createHorseStatus;
        break;
    }
    return state;
}

