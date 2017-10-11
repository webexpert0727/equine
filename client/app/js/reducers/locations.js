import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_LOCATIONS:
        return action.payload.locations;
        break;
    }
    return state;
}
