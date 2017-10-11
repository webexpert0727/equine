import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_CLIENTS:
        return action.payload.clients;
        break;
    }
    return state;
}
