import Constants   from   "../constants";

const defaultState = [];

export default function (state = defaultState, action) {
    switch (action.type) {
      case Constants.GET_DAYOFWEEKS:
        return action.payload.dayOfWeeks;
        break;
    }
    return state;
}
