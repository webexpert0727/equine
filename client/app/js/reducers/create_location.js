import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.CREATE_LOCATION:
        return action.payload.createLocationStatus;
        break;
    }
    return state;
}

