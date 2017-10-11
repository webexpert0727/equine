import Constants   from   "../constants";

const defaultState = '';

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.ADD_CLIENT:
        return action.payload.addclientStatus;
        break;
    }
    return state;
}
